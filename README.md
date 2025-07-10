# AI Resume Analyzer

An intelligent resume analyzer that scores resumes based on job descriptions using AI and provides improvement suggestions.

## Features

- 📄 Upload resume files (PDF, DOC, DOCX)
- 📝 Input job descriptions
- 🤖 AI-powered analysis using GROQ API
- 📊 Comprehensive scoring system
- 💡 Personalized improvement suggestions
- 🎯 Keyword matching analysis
- 🎨 Beautiful, responsive UI with Tailwind CSS

## Tech Stack

### Frontend
- React 19 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling

### Backend  
- Node.js with Express
- TypeScript
- Multer for file uploads
- GROQ SDK for AI analysis
- PDF/DOC text extraction

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- GROQ API key (get from https://console.groq.com/keys)

### Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your GROQ API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=3001
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:3001

### Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:5173

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:5173 in your browser
3. Upload a resume file (PDF, DOC, or DOCX)
4. Paste a job description
5. Click "Analyze Resume" to get your results

## API Endpoints

- `GET /` - API status and information
- `POST /api/analyze-resume` - Analyze resume against job description
  - Body: FormData with `resume` (file) and `jobDescription` (text)

## Analysis Features

The analyzer provides:
- **Overall Score** (0-100)
- **Category Scores**:
  - Skills relevance
  - Experience quality  
  - Education background
  - Keyword matching
  - Resume formatting
- **Keyword Analysis**: Found vs missing keywords
- **Strengths**: What the resume does well
- **Weaknesses**: Areas needing improvement  
- **Actionable Suggestions**: Specific recommendations

## File Support

- PDF files
- Microsoft Word (.doc, .docx)
- Maximum file size: 5MB

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
