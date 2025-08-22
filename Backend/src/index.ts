import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeResume } from './services/resumeAnalyzer';
import { extractTextFromBuffer } from './utils/fileProcessor';

const app = express();
const PORT = process.env.PORT || 3001;

// Admin password (in production, use environment variable)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// In-memory user stats with more detailed tracking
const userStats: {
  users: Map<string, { 
    firstName: string,
    email: string,
    firstSeen: string, 
    lastSeen: string, 
    analysisCount: number 
  }>,
  performances: Array<{ 
    userId: string,
    userName: string,
    userEmail: string,
    analysis: any, 
    analyzedAt: string,
    jobTitle?: string,
    fileName: string,
    fileSize: number
  }>,
  dailyStats: Map<string, { analyses: number, uniqueUsers: Set<string> }>
} = {
  users: new Map(),
  performances: [],
  dailyStats: new Map()
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for memory storage (serverless compatible)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    // Accept only PDF and DOC/DOCX files
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF and DOC/DOCX files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'AI Resume Analyzer API',
        status: 'Running',
        endpoints: {
            analyze: 'POST /api/analyze-resume',
            adminStats: 'GET /admin/stats'
        }
    });
});

app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: 'No resume file uploaded',
                message: 'Please upload a PDF or DOC/DOCX file'
            });
        }

        const { jobDescription, userId, jobTitle, userName, userEmail } = req.body;
        if (!jobDescription) {
            return res.status(400).json({ 
                error: 'Job description is required',
                message: 'Please provide a job description for analysis'
            });
        }
        if (!userId) {
            return res.status(400).json({ 
                error: 'User ID is required',
                message: 'Please provide a userId for tracking'
            });
        }
        if (!userName || !userEmail) {
            return res.status(400).json({ 
                error: 'User information is required',
                message: 'Please provide userName and userEmail for tracking'
            });
        }

        // Extract text from uploaded file buffer
        const resumeText = await extractTextFromBuffer(req.file.buffer, req.file.originalname);
        
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Could not extract text from resume',
                message: 'Please ensure the file contains readable text'
            });
        }

        // Analyze resume using GROQ
        const analysis = await analyzeResume(resumeText, jobDescription);

        const now = new Date().toISOString();
        const today = new Date().toISOString().split('T')[0];

        // Use email as the primary identifier for users
        const userKey = userEmail;

        // Track user with detailed info
        if (!userStats.users.has(userKey)) {
            userStats.users.set(userKey, {
                firstName: userName,
                email: userEmail,
                firstSeen: now,
                lastSeen: now,
                analysisCount: 1
            });
        } else {
            const user = userStats.users.get(userKey)!;
            user.lastSeen = now;
            user.analysisCount += 1;
            // Update user info in case it changed
            user.firstName = userName;
            user.email = userEmail;
        }

        // Track performance with more details
        userStats.performances.push({ 
            userId,
            userName,
            userEmail,
            analysis, 
            analyzedAt: now,
            jobTitle: jobTitle || 'Not specified',
            fileName: req.file.originalname,
            fileSize: req.file.size
        });

        // Track daily stats
        if (!userStats.dailyStats.has(today)) {
            userStats.dailyStats.set(today, { analyses: 0, uniqueUsers: new Set() });
        }
        const dayStats = userStats.dailyStats.get(today)!;
        dayStats.analyses += 1;
        dayStats.uniqueUsers.add(userKey); // Use email instead of userId for unique user tracking

        res.json({
            success: true,
            analysis: analysis,
            metadata: {
                originalName: req.file.originalname,
                fileSize: req.file.size,
                analyzedAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error analyzing resume:', error);

        res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});

// Admin authentication middleware
const authenticateAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const password = authHeader && authHeader.split(' ')[1]; // Bearer <password>
    
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid admin password' });
    }
};

// Admin login endpoint
app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    
    if (password === ADMIN_PASSWORD) {
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: password // In production, use JWT
        });
    } else {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid password' });
    }
});

// Enhanced admin stats endpoint with authentication
app.get('/admin/stats', authenticateAdmin, (req, res) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    const dailyAnalytics = last7Days.map(date => {
        const dayStats = userStats.dailyStats.get(date);
        return {
            date,
            analyses: dayStats?.analyses || 0,
            uniqueUsers: dayStats?.uniqueUsers.size || 0
        };
    });

    // Calculate average scores
    const allScores = userStats.performances.map(p => p.analysis.overallScore);
    const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

    // Most common weaknesses
    const weaknessCount = new Map<string, number>();
    userStats.performances.forEach(p => {
        p.analysis.weaknesses.forEach((weakness: string) => {
            weaknessCount.set(weakness, (weaknessCount.get(weakness) || 0) + 1);
        });
    });

    const topWeaknesses = Array.from(weaknessCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([weakness, count]) => ({ weakness, count }));

    // Category score averages
    const categoryAverages = {
        skills: 0,
        experience: 0,
        education: 0,
        keywords: 0,
        formatting: 0
    };

    if (userStats.performances.length > 0) {
        userStats.performances.forEach(p => {
            Object.keys(categoryAverages).forEach(category => {
                categoryAverages[category as keyof typeof categoryAverages] += p.analysis.categoryScores[category];
            });
        });
        
        Object.keys(categoryAverages).forEach(category => {
            categoryAverages[category as keyof typeof categoryAverages] /= userStats.performances.length;
        });
    }

    res.json({
        summary: {
            totalUsers: userStats.users.size,
            totalAnalyses: userStats.performances.length,
            averageScore: Math.round(avgScore * 100) / 100,
            last7DaysAnalyses: dailyAnalytics.reduce((sum, day) => sum + day.analyses, 0)
        },
        dailyAnalytics,
        categoryAverages,
        topWeaknesses,
        recentAnalyses: userStats.performances
            .slice(-10)
            .reverse()
            .map(p => ({
                userId: p.userId,
                userName: p.userName,
                userEmail: p.userEmail,
                score: p.analysis.overallScore,
                analyzedAt: p.analyzedAt,
                jobTitle: p.jobTitle,
                fileName: p.fileName
            })),
        userDetails: Array.from(userStats.users.entries()).map(([userEmail, userData]) => ({
            userId: userEmail, // Use email as userId for backward compatibility with frontend
            firstName: userData.firstName,
            email: userData.email,
            firstSeen: userData.firstSeen,
            lastSeen: userData.lastSeen,
            analysisCount: userData.analysisCount
        }))
    });
});

// Admin stats endpoint (old version for backward compatibility)
app.get('/admin/stats-simple', (req, res) => {
    res.json({
        userCount: userStats.users.size,
        performances: userStats.performances
    });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'File size should not exceed 5MB'
            });
        }
    }
    
    res.status(500).json({
        error: 'Something went wrong',
        message: error.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API endpoint: http://localhost:${PORT}/api/analyze-resume`);
    console.log(`🔒 Admin stats endpoint: http://localhost:${PORT}/admin/stats`);
});

export default app;