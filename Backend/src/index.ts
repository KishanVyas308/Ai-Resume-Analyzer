import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeResume } from './services/resumeAnalyzer';
import { extractTextFromBuffer } from './utils/fileProcessor';
import { log } from 'console';

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

// Generate fixed static sample data for the last 20 days
const generateSampleData = () => {
  // Fixed static data entries for each user
  const staticDataEntries = [
    // Day 1 (19 days ago)
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 19, hour: 10, minute: 30, jobTitle: "Frontend Developer", fileName: "KishanVyas_Resume.pdf", fileSize: 156000, score: 72.5, skills: 75, experience: 70, education: 76, keywords: 71, formatting: 73 },
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 19, hour: 14, minute: 15, jobTitle: "Backend Developer", fileName: "Hardik_CV.pdf", fileSize: 142000, score: 68.2, skills: 70, experience: 65, education: 72, keywords: 66, formatting: 68 },
    
    // Day 2 (18 days ago)
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 18, hour: 9, minute: 45, jobTitle: "Full Stack Developer", fileName: "Kishan_Resume_2024.pdf", fileSize: 168000, score: 69.7, skills: 72, experience: 67, education: 74, keywords: 68, formatting: 67 },
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 18, hour: 16, minute: 20, jobTitle: "Data Scientist", fileName: "Nit_Professional_CV.docx", fileSize: 134000, score: 76.3, skills: 78, experience: 74, education: 80, keywords: 75, formatting: 74 },
    
    // Day 3 (17 days ago)
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 17, hour: 11, minute: 10, jobTitle: "Machine Learning Engineer", fileName: "Yash_Latest_Resume.pdf", fileSize: 175000, score: 74.9, skills: 77, experience: 72, education: 78, keywords: 73, formatting: 75 },
    
    // Day 4 (16 days ago)
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 16, hour: 13, minute: 30, jobTitle: "React Developer", fileName: "KishanVyas_Updated_CV.pdf", fileSize: 159000, score: 73.1, skills: 76, experience: 71, education: 75, keywords: 72, formatting: 74 },
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 16, hour: 15, minute: 45, jobTitle: "DevOps Engineer", fileName: "Hardik_Resume_Final.pdf", fileSize: 148000, score: 69.6, skills: 72, experience: 68, education: 71, keywords: 67, formatting: 70 },
    
    // Day 5 (15 days ago)
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 15, hour: 10, minute: 15, jobTitle: "Software Engineer", fileName: "Kishan_CV_Latest.pdf", fileSize: 162000, score: 71.3, skills: 74, experience: 69, education: 75, keywords: 70, formatting: 69 },
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 15, hour: 17, minute: 0, jobTitle: "AI Engineer", fileName: "Nit_Resume_2024.pdf", fileSize: 137000, score: 77.7, skills: 80, experience: 75, education: 80, keywords: 77, formatting: 76 },
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 15, hour: 12, minute: 30, jobTitle: "Python Developer", fileName: "Yash_Professional_CV.docx", fileSize: 171000, score: 75.4, skills: 78, experience: 73, education: 77, keywords: 74, formatting: 75 },
    
    // Day 6 (14 days ago)
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 14, hour: 9, minute: 20, jobTitle: "Cloud Architect", fileName: "Hardik_CV_Updated.pdf", fileSize: 145000, score: 70.8, skills: 73, experience: 68, education: 72, keywords: 69, formatting: 71 },
    
    // Day 7 (13 days ago)
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 13, hour: 14, minute: 45, jobTitle: "Node.js Developer", fileName: "KishanVyas_CV_2024.pdf", fileSize: 161000, score: 74.9, skills: 77, experience: 73, education: 76, keywords: 74, formatting: 75 },
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 13, hour: 11, minute: 25, jobTitle: "Mobile App Developer", fileName: "Yash_Resume_Updated.pdf", fileSize: 173000, score: 72.5, skills: 75, experience: 70, education: 74, keywords: 71, formatting: 73 },
    
    // Day 8 (12 days ago)
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 12, hour: 16, minute: 10, jobTitle: "Database Administrator", fileName: "Nit_CV_Final.pdf", fileSize: 139000, score: 78.2, skills: 80, experience: 76, education: 80, keywords: 77, formatting: 78 },
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 12, hour: 10, minute: 50, jobTitle: "Quality Assurance Engineer", fileName: "Kishan_Resume_Latest.pdf", fileSize: 165000, score: 67.7, skills: 70, experience: 65, education: 71, keywords: 66, formatting: 67 },
    
    // Day 9 (11 days ago)
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 11, hour: 13, minute: 15, jobTitle: "Cyber Security Analyst", fileName: "Hardik_Professional_Resume.pdf", fileSize: 150000, score: 72.1, skills: 74, experience: 70, education: 73, keywords: 71, formatting: 72 },
    
    // Day 10 (10 days ago)
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 10, hour: 15, minute: 40, jobTitle: "UI/UX Designer", fileName: "Yash_CV_Professional.pdf", fileSize: 178000, score: 76.6, skills: 79, experience: 74, education: 78, keywords: 75, formatting: 77 },
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 10, hour: 9, minute: 30, jobTitle: "Product Manager", fileName: "KishanVyas_Latest_CV.pdf", fileSize: 164000, score: 75.3, skills: 77, experience: 73, education: 76, keywords: 74, formatting: 76 },
    
    // Day 11 (9 days ago)
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 9, hour: 11, minute: 55, jobTitle: "Business Analyst", fileName: "Nit_Resume_Professional.pdf", fileSize: 141000, score: 73.8, skills: 76, experience: 71, education: 76, keywords: 73, formatting: 73 },
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 9, hour: 14, minute: 20, jobTitle: "Java Developer", fileName: "Kishan_CV_2024.pdf", fileSize: 167000, score: 70.4, skills: 73, experience: 68, education: 72, keywords: 69, formatting: 70 },
    
    // Day 12 (8 days ago)
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 8, hour: 16, minute: 5, jobTitle: "Angular Developer", fileName: "Hardik_Resume_2024.pdf", fileSize: 152000, score: 67.9, skills: 70, experience: 66, education: 69, keywords: 66, formatting: 68 },
    
    // Day 13 (7 days ago)
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 7, hour: 10, minute: 15, jobTitle: "TypeScript Developer", fileName: "Yash_Updated_Resume.pdf", fileSize: 176000, score: 77.1, skills: 79, experience: 75, education: 78, keywords: 76, formatting: 77 },
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 7, hour: 12, minute: 45, jobTitle: "Frontend Developer", fileName: "KishanVyas_Resume_Final.pdf", fileSize: 158000, score: 78.2, skills: 80, experience: 76, education: 79, keywords: 77, formatting: 79 },
    
    // Day 14 (6 days ago)
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 6, hour: 15, minute: 25, jobTitle: "Machine Learning Engineer", fileName: "Nit_CV_Latest.pdf", fileSize: 143000, score: 79.1, skills: 80, experience: 77, education: 80, keywords: 78, formatting: 80 },
    
    // Day 15 (5 days ago)
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 5, hour: 9, minute: 40, jobTitle: "Full Stack Developer", fileName: "Kishan_Professional_CV.pdf", fileSize: 169000, score: 72.6, skills: 75, experience: 70, education: 74, keywords: 71, formatting: 73 },
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 5, hour: 13, minute: 55, jobTitle: "Backend Developer", fileName: "Hardik_CV_Professional.pdf", fileSize: 147000, score: 71.3, skills: 73, experience: 69, education: 72, keywords: 70, formatting: 72 },
    
    // Day 16 (4 days ago)
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 4, hour: 11, minute: 30, jobTitle: "React Developer", fileName: "Yash_Resume_Latest.pdf", fileSize: 174000, score: 75.7, skills: 78, experience: 73, education: 77, keywords: 74, formatting: 76 },
    
    // Day 17 (3 days ago)
    { user: "Kishan Vyas", email: "kishan.vyas@example.com", userId: "user_001", day: 3, hour: 14, minute: 10, jobTitle: "Software Engineer", fileName: "KishanVyas_CV_Updated.pdf", fileSize: 160000, score: 76.9, skills: 79, experience: 75, education: 78, keywords: 76, formatting: 76 },
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 3, hour: 16, minute: 35, jobTitle: "Data Scientist", fileName: "Nit_Resume_Updated.pdf", fileSize: 144000, score: 78.4, skills: 80, experience: 76, education: 80, keywords: 77, formatting: 79 },
    
    // Day 18 (2 days ago)
    { user: "Kishan", email: "kishan@example.com", userId: "user_002", day: 2, hour: 10, minute: 20, jobTitle: "DevOps Engineer", fileName: "Kishan_Resume_Professional.pdf", fileSize: 166000, score: 68.8, skills: 71, experience: 66, education: 70, keywords: 67, formatting: 70 },
    { user: "Hardik", email: "hardik@example.com", userId: "user_003", day: 2, hour: 15, minute: 50, jobTitle: "Cloud Architect", fileName: "Hardik_Latest_Resume.pdf", fileSize: 149000, score: 73.2, skills: 75, experience: 71, education: 74, keywords: 72, formatting: 74 },
    
    // Day 19 (1 day ago)
    { user: "Yash", email: "yash@example.com", userId: "user_005", day: 1, hour: 12, minute: 15, jobTitle: "Python Developer", fileName: "Yash_CV_Final.pdf", fileSize: 177000, score: 77.5, skills: 79, experience: 75, education: 78, keywords: 76, formatting: 79 },
    
    // Day 20 (today)
    { user: "Nit", email: "nit@example.com", userId: "user_004", day: 0, hour: 9, minute: 45, jobTitle: "AI Engineer", fileName: "Nit_Professional_Resume.pdf", fileSize: 146000, score: 80.0, skills: 80, experience: 78, education: 80, keywords: 79, formatting: 80 }
  ];

  // Process each static entry
  staticDataEntries.forEach(entry => {
    const date = new Date();
    date.setDate(date.getDate() - entry.day);
    date.setHours(entry.hour, entry.minute, 0, 0);
    
    const dayStr = date.toISOString().split('T')[0];
    
    // Create analysis object
    const analysis = {
      overallScore: entry.score,
      categoryScores: {
        skills: entry.skills,
        experience: entry.experience,
        education: entry.education,
        keywords: entry.keywords,
        formatting: entry.formatting
      },
      strengths: [
        "Strong technical skills and programming expertise",
        "Well-structured and professional resume format",
        "Relevant project experience and achievements",
        "Clear educational background and certifications",
        "Good understanding of industry best practices"
      ],
      weaknesses: [
        "Could add more quantified achievements",
        "Missing some industry-specific keywords",
        "Portfolio links could be more prominent",
        "Could improve soft skills presentation"
      ],
      recommendations: [
        "Include more specific metrics and quantified results",
        "Add relevant certifications for the target role",
        "Highlight leadership and teamwork experiences",
        "Include links to portfolio or GitHub projects",
        "Optimize keywords for ATS compatibility"
      ],
      matchingKeywords: ["JavaScript", "React", "Node.js", "Python", "Git"],
      missingKeywords: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      summary: `${entry.user}'s resume demonstrates strong potential for the ${entry.jobTitle} position with an overall score of ${entry.score}%. The analysis reveals solid technical skills and relevant experience, with opportunities for improvement in quantified achievements and keyword optimization.`
    };
    
    // Track user
    if (!userStats.users.has(entry.email)) {
      userStats.users.set(entry.email, {
        firstName: entry.user,
        email: entry.email,
        firstSeen: date.toISOString(),
        lastSeen: date.toISOString(),
        analysisCount: 1
      });
    } else {
      const userData = userStats.users.get(entry.email)!;
      userData.lastSeen = date.toISOString();
      userData.analysisCount += 1;
    }
    
    // Add performance record
    userStats.performances.push({
      userId: entry.userId,
      userName: entry.user,
      userEmail: entry.email,
      analysis: analysis,
      analyzedAt: date.toISOString(),
      jobTitle: entry.jobTitle,
      fileName: entry.fileName,
      fileSize: entry.fileSize
    });
    
    // Track daily stats
    if (!userStats.dailyStats.has(dayStr)) {
      userStats.dailyStats.set(dayStr, { analyses: 0, uniqueUsers: new Set() });
    }
    const dayStats = userStats.dailyStats.get(dayStr)!;
    dayStats.analyses += 1;
    dayStats.uniqueUsers.add(entry.email);
  });
  
  console.log(`Generated ${userStats.performances.length} static sample analyses for ${userStats.users.size} users over the last 20 days`);
};

// Initialize sample data
generateSampleData();

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
            fetchJob: 'GET /api/fetch-job-description',
            adminStats: 'GET /admin/stats'
        }
    });
});

// Fetch job description from Y Combinator job URL
app.get('/api/fetch-job-description', async (req, res) => {
    try {
        const { url } = req.query;

        if (!url || typeof url !== 'string') {
            return res.status(400).json({ 
                success: false,
                error: 'URL parameter is required',
                message: 'Please provide a valid Y Combinator job URL'
            });
        }

        console.log('Fetching job from URL:', url);

        // Validate Y Combinator URL
        if (!url.includes('ycombinator.com/companies') || !url.includes('/jobs/')) {
            return res.status(400).json({ 
                success: false,
                error: 'Invalid URL',
                message: 'Please provide a valid Y Combinator job URL (e.g., https://www.ycombinator.com/companies/*/jobs/*)'
            });
        }

        // Set up timeout controller
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            console.log('Fetching job page...');
            
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                return res.status(response.status).json({ 
                    success: false,
                    error: 'Failed to fetch job page',
                    message: `HTTP ${response.status}: Unable to fetch the job page. Please check if the URL is correct.`
                });
            }

            const html = await response.text();
            console.log('HTML fetched successfully, extracting job description...');

            let extractedDescription = '';
            let jobTitle = '';
            let companyName = '';
            let jobType = '';
            let location = '';
            let salary = '';
            let experience = '';
            let skills: string[] = [];

            // Method 1: Extract from structured data (JSON-LD)
            const structuredDataMatches = html.match(/<script[^>]*type=["\']application\/ld\+json["\'][^>]*>([\s\S]*?)<\/script>/g);
            if (structuredDataMatches) {
                for (const match of structuredDataMatches) {
                    try {
                        const jsonMatch = match.match(/>([\s\S]*?)<\/script>/);
                        if (jsonMatch) {
                            const data = JSON.parse(jsonMatch[1]);
                            if (data['@type'] === 'JobPosting') {
                                jobTitle = data.title || '';
                                companyName = data.hiringOrganization?.name || '';
                                location = data.jobLocation?.map((loc: any) => 
                                    `${loc.address?.addressLocality || ''}, ${loc.address?.addressRegion || ''}, ${loc.address?.addressCountry || ''}`
                                ).join(' / ') || '';
                                extractedDescription = data.description || '';
                                jobType = data.employmentType || '';
                                
                                if (data.baseSalary?.value) {
                                    const minSalary = data.baseSalary.value.minValue;
                                    const maxSalary = data.baseSalary.value.maxValue;
                                    const currency = data.baseSalary.currency || 'USD';
                                    salary = `${currency} ${minSalary ? `$${(minSalary/1000)}K` : ''} - ${maxSalary ? `$${(maxSalary/1000)}K` : ''}`;
                                }
                                
                                console.log('Found job details in structured data');
                                break;
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }

            // Method 2: Extract from meta description tag if structured data not found
            if (!extractedDescription) {
                const metaDescMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']*)["\'][^>]*>/i);
                if (metaDescMatch) {
                    extractedDescription = metaDescMatch[1];
                    console.log('Found job description in meta description');
                }
            }

            // Method 3: Extract job title from meta title or page title
            if (!jobTitle) {
                const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
                if (titleMatch) {
                    const fullTitle = titleMatch[1];
                    // Try to extract job title from title like "Senior Software Engineer at Strac | Y Combinator"
                    const jobTitleMatch = fullTitle.match(/^([^|]+?)\s+at\s+([^|]+)/);
                    if (jobTitleMatch) {
                        jobTitle = jobTitleMatch[1].trim();
                        if (!companyName) companyName = jobTitleMatch[2].trim();
                    } else {
                        jobTitle = fullTitle.replace(' | Y Combinator', '').trim();
                    }
                }
            }

            // Method 4: Extract additional details from visible content patterns
            if (!salary || !location || !experience) {
                // Look for salary patterns like "$110K - $160K"
                const salaryMatch = html.match(/[\$€£]\d+[K]?\s*[-–]\s*[\$€£]\d+[K]?/);
                if (salaryMatch && !salary) {
                    salary = salaryMatch[0];
                }

                // Look for experience patterns like "3+ years"
                const expMatch = html.match(/(\d+\+?\s*years?|\d+\-\d+\s*years?|Any \(new grads ok\))/i);
                if (expMatch && !experience) {
                    experience = expMatch[0];
                }

                // Look for location patterns (city, state, country)
                const locationMatch = html.match(/([A-Z][a-z]+,\s*[A-Z]{2},?\s*[A-Z]{2,3}(?:\s*\/\s*[A-Z][a-z]+,\s*[A-Z]{2},?\s*[A-Z]{2,3})*)/);
                if (locationMatch && !location) {
                    location = locationMatch[0];
                }
            }

            if (!extractedDescription) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Job description not found',
                    message: 'Could not extract job description from the page. Please try copying the job description manually.'
                });
            }

            // Clean and format the description
            let cleanDescription = extractedDescription
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<p>/gi, '\n')
                .replace(/<\/p>/gi, '\n')
                .replace(/<li>/gi, '• ')
                .replace(/<\/li>/gi, '\n')
                .replace(/<ul>/gi, '\n')
                .replace(/<\/ul>/gi, '\n')
                .replace(/<ol>/gi, '\n')
                .replace(/<\/ol>/gi, '\n')
                .replace(/<h\d>/gi, '\n**')
                .replace(/<\/h\d>/gi, '**\n')
                .replace(/<strong>/gi, '**')
                .replace(/<\/strong>/gi, '**')
                .replace(/<em>/gi, '*')
                .replace(/<\/em>/gi, '*')
                .replace(/<[^>]*>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#x27;/g, "'")
                .replace(/\n\s*\n/g, '\n\n')
                .trim();

            // Build comprehensive job description
            let fullDescription = '';
            if (jobTitle) fullDescription += `Job Title: ${jobTitle}\n\n`;
            if (companyName) fullDescription += `Company: ${companyName}\n\n`;
            if (jobType) fullDescription += `Job Type: ${jobType}\n\n`;
            if (experience) fullDescription += `Experience Required: ${experience}\n\n`;
            if (location) fullDescription += `Location: ${location}\n\n`;
            if (salary) fullDescription += `Salary: ${salary}\n\n`;
            if (skills.length > 0) fullDescription += `Required Skills: ${skills.join(', ')}\n\n`;
            
            fullDescription += `Job Description:\n${cleanDescription}`;

            console.log('Successfully extracted job description, length:', fullDescription.length);

            return res.json({ 
                success: true, 
                description: fullDescription,
                title: jobTitle, // Add title directly for frontend access
                source: 'Y Combinator',
                metadata: {
                    jobTitle: jobTitle,
                    companyName: companyName,
                    jobType: jobType,
                    experience: experience,
                    location: location,
                    salary: salary,
                    skills: skills,
                    originalUrl: url,
                    extractedAt: new Date().toISOString()
                }
            });

        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            if (fetchError instanceof Error && fetchError.name === 'AbortError') {
                console.log('Request timed out');
                return res.status(408).json({ 
                    success: false,
                    error: 'Request timeout',
                    message: 'The request took too long to complete. Please try again.'
                });
            }
            
            console.error('Network error:', fetchError);
            return res.status(500).json({ 
                success: false,
                error: 'Network error',
                message: 'Failed to connect to Y Combinator. Please check your internet connection and try again.'
            });
        }

    } catch (error) {
        console.error('Error fetching Y Combinator job description:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
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