import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import { analyzeResume } from './services/resumeAnalyzer';
import { extractTextFromBuffer } from './utils/fileProcessor';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
            analyze: 'POST /api/analyze-resume'
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

        const { jobDescription } = req.body;
        
        if (!jobDescription) {
            return res.status(400).json({ 
                error: 'Job description is required',
                message: 'Please provide a job description for analysis'
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
});

export default app;