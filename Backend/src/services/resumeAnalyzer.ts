import Groq from 'groq-sdk';

import dotenv from 'dotenv';

dotenv.config();

interface ResumeAnalysis {
    overallScore: number;
    categoryScores: {
        skills: number;
        experience: number;
        education: number;
        keywords: number;
        formatting: number;
    };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywordMatch: {
        matched: string[];
        missing: string[];
        matchPercentage: number;
    };
    summary: string;
}

class ResumeAnalyzer {
    private groq: Groq;

    constructor() {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not set in environment variables');
        }
        
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY
        });
    }

    async analyzeResume(resumeText: string, jobDescription: string): Promise<ResumeAnalysis> {
        try {
            const prompt = this.createAnalysisPrompt(resumeText, jobDescription);
            
            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are an expert resume analyzer and career counselor. Analyze resumes against job descriptions and provide detailed, actionable feedback. Always respond with valid JSON that matches the expected structure.`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.3,
                max_tokens: 2048,
            });

            const response = completion.choices[0]?.message?.content;
            
            if (!response) {
                throw new Error('No response from GROQ API');
            }

            // Parse the JSON response
            try {
                // Extract JSON from markdown code blocks if present
                let jsonString = response;
                
                // Check if response is wrapped in markdown code blocks
                const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
                if (jsonMatch) {
                    jsonString = jsonMatch[1];
                }
                
                // Remove any leading/trailing whitespace
                jsonString = jsonString.trim();
                
                const analysis = JSON.parse(jsonString) as ResumeAnalysis;
                
                // Validate the response structure
                this.validateAnalysisResponse(analysis);
                
                return analysis;
            } catch (parseError) {
                console.error('Failed to parse GROQ response:', response);
                console.error('Parse error:', parseError);
                throw new Error('Invalid response format from AI analysis');
            }

        } catch (error) {
            console.error('Error in resume analysis:', error);
            throw new Error(`Resume analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private createAnalysisPrompt(resumeText: string, jobDescription: string): string {
        return `
Analyze the following resume against the job description and provide a comprehensive analysis.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Please analyze the resume and provide your response ONLY as valid JSON in the following format. Do not include any explanatory text, markdown formatting, or code blocks - just return the raw JSON:

{
    "overallScore": <number between 0-100>,
    "categoryScores": {
        "skills": <number between 0-100>,
        "experience": <number between 0-100>,
        "education": <number between 0-100>,
        "keywords": <number between 0-100>,
        "formatting": <number between 0-100>
    },
    "strengths": [
        "<strength 1>",
        "<strength 2>",
        "<strength 3>"
    ],
    "weaknesses": [
        "<weakness 1>",
        "<weakness 2>",
        "<weakness 3>"
    ],
    "suggestions": [
        "<actionable suggestion 1>",
        "<actionable suggestion 2>",
        "<actionable suggestion 3>",
        "<actionable suggestion 4>",
        "<actionable suggestion 5>"
    ],
    "keywordMatch": {
        "matched": ["<matched keyword 1>", "<matched keyword 2>"],
        "missing": ["<missing important keyword 1>", "<missing important keyword 2>"],
        "matchPercentage": <percentage of important keywords found>
    },
    "summary": "<2-3 sentence overall assessment and recommendation>"
}

Analysis Guidelines:
1. Overall Score: Holistic assessment of resume quality and job fit (0-100)
2. Category Scores:
   - Skills: Relevance and depth of technical/soft skills
   - Experience: Quality and relevance of work experience
   - Education: Educational background relevance
   - Keywords: Presence of job-relevant keywords
   - Formatting: Resume structure, readability, and professional appearance
3. Strengths: What the candidate does well
4. Weaknesses: Areas needing improvement
5. Suggestions: Specific, actionable recommendations
6. Keyword Match: Important keywords from job description found/missing in resume
7. Summary: Brief overall assessment

Ensure all scores are realistic and justified. Provide constructive, specific feedback.
`;
    }

    private validateAnalysisResponse(analysis: any): void {
        const requiredFields = [
            'overallScore',
            'categoryScores',
            'strengths',
            'weaknesses',
            'suggestions',
            'keywordMatch',
            'summary'
        ];

        for (const field of requiredFields) {
            if (!(field in analysis)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate score ranges
        if (analysis.overallScore < 0 || analysis.overallScore > 100) {
            throw new Error('Overall score must be between 0 and 100');
        }

        // Validate category scores
        const categoryFields = ['skills', 'experience', 'education', 'keywords', 'formatting'];
        for (const category of categoryFields) {
            const score = analysis.categoryScores[category];
            if (typeof score !== 'number' || score < 0 || score > 100) {
                throw new Error(`Invalid ${category} score: must be between 0 and 100`);
            }
        }

        // Validate arrays
        const arrayFields = ['strengths', 'weaknesses', 'suggestions'];
        for (const field of arrayFields) {
            if (!Array.isArray(analysis[field])) {
                throw new Error(`${field} must be an array`);
            }
        }

        // Validate keyword match structure
        if (!analysis.keywordMatch.matched || !analysis.keywordMatch.missing || 
            typeof analysis.keywordMatch.matchPercentage !== 'number') {
            throw new Error('Invalid keywordMatch structure');
        }
    }
}

// Lazy initialization to ensure environment variables are loaded
let resumeAnalyzer: ResumeAnalyzer | null = null;

const getAnalyzer = (): ResumeAnalyzer => {
    if (!resumeAnalyzer) {
        resumeAnalyzer = new ResumeAnalyzer();
    }
    return resumeAnalyzer;
};

export const analyzeResume = (resumeText: string, jobDescription: string): Promise<ResumeAnalysis> => {
    return getAnalyzer().analyzeResume(resumeText, jobDescription);
};

export type { ResumeAnalysis };
