import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { analyzeResume } from './services/resumeAnalyzer';
import { extractTextFromFile } from './utils/fileProcessor';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    // Accept only PDF and DOC/DOCX files
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
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

        // Extract text from uploaded file
        const resumeText = await extractTextFromFile(req.file.path);
        
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Could not extract text from resume',
                message: 'Please ensure the file contains readable text'
            });
        }

        // Analyze resume using GROQ
        const analysis = await analyzeResume(resumeText, jobDescription);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

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
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

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