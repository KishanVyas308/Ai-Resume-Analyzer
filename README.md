# AI Resume Analyzer

A comprehensive AI-powered resume analysis platform that helps job seekers optimize their resumes for specific job descriptions. The system provides detailed scoring, feedback, and actionable recommendations to improve resume effectiveness.

## 🚀 Features

### Core Functionality
- 📄 **Multi-format Resume Upload**: Support for PDF, DOC, and DOCX files
- 📝 **Job Description Analysis**: Input any job posting for targeted analysis
- 🤖 **AI-Powered Scoring**: Advanced analysis using GROQ's Llama AI models
- 📊 **Comprehensive Metrics**: Detailed scoring across multiple categories
- 💡 **Smart Recommendations**: Personalized improvement suggestions
- 🎯 **Keyword Optimization**: Identifies missing and matching keywords
- 📈 **Progress Tracking**: Monitor improvements over time

### User Experience
- 👤 **User Identification**: Name and email collection for personalized experience
- 🎨 **Professional UI**: Clean, modern interface with Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔄 **Real-time Analysis**: Fast processing with loading indicators
- 📋 **Detailed Results**: Comprehensive analysis reports
- 🔄 **User Session Management**: Switch between different user profiles

### Admin Dashboard
- 📊 **Analytics Overview**: Comprehensive usage statistics
- 👥 **User Management**: Track user activity and analysis history
- 📈 **Performance Metrics**: Daily analytics and trending data
- 🎯 **Weakness Analysis**: Common issues across all resumes
- 📅 **Activity Tracking**: Recent analyses and user engagement
- 🔐 **Secure Access**: Password-protected admin panel

## 🛠️ Tech Stack

### Frontend Architecture
- **React 19** with TypeScript for type-safe development
- **Tailwind CSS** for modern, utility-first styling
- **React Router DOM** for client-side routing
- **Vite** for fast development and optimized builds
- **ESLint** for code quality and consistency

### Backend Architecture
- **Node.js** with Express.js framework
- **TypeScript** for enhanced development experience
- **Multer** for handling multipart file uploads
- **GROQ SDK** for AI-powered resume analysis
- **PDF-Parse & Mammoth** for document text extraction
- **CORS** for cross-origin resource sharing

### AI & Analysis
- **GROQ API** with Llama-3.1-70b-versatile model
- **Advanced Prompt Engineering** for accurate analysis
- **Multi-category Scoring System** (Skills, Experience, Education, Keywords, Formatting)
- **Intelligent Keyword Extraction** and matching algorithms

### Data Management
- **In-memory Storage** for session data and analytics
- **Email-based User Identification** for consistent tracking
- **Real-time Analytics** with daily statistics
- **User Activity Tracking** across multiple sessions

## 📋 Setup Instructions

### Prerequisites
- **Node.js 18+** installed on your system
- **GROQ API Key** (obtain from [GROQ Console](https://console.groq.com/keys))
- **Git** for cloning the repository

### 🔧 Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KishanVyas308/Ai-Resume-Analyzer.git
   cd Ai-Resume-Analyzer
   ```

2. **Navigate to Backend directory**:
   ```bash
   cd Backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   Create a `.env` file in the Backend directory:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   PORT=3001
   NODE_ENV=development
   ADMIN_PASSWORD=admin123
   ```

5. **Start the backend server**:
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

   ✅ Backend will run on `http://localhost:3001`

### 🎨 Frontend Setup

1. **Navigate to Frontend directory**:
   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   ✅ Frontend will run on `http://localhost:5173`

### 🚀 Quick Start

1. Ensure both servers are running
2. Open `http://localhost:5173` in your browser
3. Enter your name and email for user identification
4. Upload a resume file (PDF, DOC, or DOCX)
5. Paste the job description you're targeting
6. Click "Analyze Resume" and get comprehensive feedback!

### 🔐 Admin Access

- Navigate to `/admin` route
- Default password: `admin123`
- View user analytics, activity, and system statistics

## 🔌 API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### 1. Health Check
```http
GET /
```
**Response**: API status and available endpoints

#### 2. Resume Analysis
```http
POST /api/analyze-resume
```
**Content-Type**: `multipart/form-data`

**Body Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resume` | File | ✅ | Resume file (PDF/DOC/DOCX, max 5MB) |
| `jobDescription` | String | ✅ | Target job description |
| `userId` | String | ✅ | Unique user identifier |
| `userName` | String | ✅ | User's full name |
| `userEmail` | String | ✅ | User's email address |
| `jobTitle` | String | ❌ | Optional job title |

**Success Response** (200):
```json
{
  "success": true,
  "analysis": {
    "overallScore": 85,
    "categoryScores": {
      "skills": 90,
      "experience": 80,
      "education": 85,
      "keywords": 75,
      "formatting": 95
    },
    "strengths": ["Strong technical skills", "Relevant experience"],
    "weaknesses": ["Missing key certifications", "Limited leadership experience"],
    "suggestions": ["Add project management certification", "Highlight team leadership"],
    "keywordAnalysis": {
      "found": ["JavaScript", "React", "Node.js"],
      "missing": ["TypeScript", "AWS", "Docker"]
    }
  },
  "metadata": {
    "originalName": "resume.pdf",
    "fileSize": 245760,
    "analyzedAt": "2025-08-22T10:30:00.000Z"
  }
}
```

#### 3. Admin Authentication
```http
POST /admin/login
```
**Body**:
```json
{
  "password": "admin123"
}
```

#### 4. Admin Statistics
```http
GET /admin/stats
```
**Headers**: `Authorization: Bearer <admin_token>`

**Response**: Comprehensive analytics including user stats, daily analytics, and performance metrics

## 📊 Analysis Features

### Comprehensive Scoring System
The AI analyzer evaluates resumes across five key categories:

#### 🎯 Skills Assessment (0-100)
- **Technical Skills Matching**: Alignment with job requirements
- **Skill Relevance**: How well skills match the role
- **Skill Presentation**: Clear articulation of capabilities

#### 💼 Experience Evaluation (0-100)
- **Relevance**: Experience directly related to the target role
- **Progression**: Career growth and advancement
- **Impact**: Quantified achievements and results

#### 🎓 Education Background (0-100)
- **Educational Relevance**: Degree alignment with job requirements
- **Certifications**: Professional credentials and training
- **Continuous Learning**: Additional courses and skill development

#### 🔍 Keyword Optimization (0-100)
- **Keyword Density**: Presence of job-specific terms
- **Industry Terminology**: Use of relevant technical language
- **ATS Compatibility**: Applicant Tracking System optimization

#### 📄 Formatting & Structure (0-100)
- **Readability**: Clear structure and organization
- **Professional Appearance**: Visual presentation quality
- **Contact Information**: Completeness and accessibility

### 🎯 Detailed Analysis Output

#### Strengths Identification
- Highlights what the resume does exceptionally well
- Identifies competitive advantages
- Recognizes unique value propositions

#### Weakness Detection
- Pinpoints areas needing improvement
- Identifies missing critical elements
- Suggests enhancement opportunities

#### Actionable Recommendations
- **Specific Suggestions**: Targeted improvements for each category
- **Keyword Additions**: Missing terms to include
- **Structural Changes**: Formatting and organization tips
- **Content Enhancement**: Ways to strengthen existing sections

#### Keyword Analysis
- **Found Keywords**: Terms already present that match the job
- **Missing Keywords**: Important terms absent from the resume
- **Optimization Score**: Percentage of key terms included

## 📁 File Support & Limitations

### Supported File Formats
| Format | Extension | Max Size | Status |
|--------|-----------|----------|---------|
| PDF | `.pdf` | 5MB | ✅ Fully Supported |
| Microsoft Word | `.doc` | 5MB | ✅ Fully Supported |
| Microsoft Word | `.docx` | 5MB | ✅ Fully Supported |

### File Processing Features
- **Intelligent Text Extraction**: Advanced parsing for complex layouts
- **Format Preservation**: Maintains document structure during analysis
- **Error Handling**: Graceful handling of corrupted or unsupported files
- **Security**: File validation and malware protection

### Limitations
- Maximum file size: 5MB per upload
- Text-based content only (images and charts not analyzed)
- English language content optimized
- Internet connection required for AI processing

## 🗂️ Project Structure

```
Ai-Resume-Analyzer/
├── Backend/                    # Node.js API Server
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── services/
│   │   │   └── resumeAnalyzer.ts  # AI analysis logic
│   │   └── utils/
│   │       └── fileProcessor.ts   # File handling utilities
│   ├── package.json
│   └── tsconfig.json
│
├── Frontend/                   # React Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AdminPage.tsx  # Admin dashboard
│   │   │   ├── AnalysisResults.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── JobDescriptionInput.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── UserInfo.tsx
│   │   ├── pages/            # Route components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── layout/
│   │   │   └── Layout.tsx
│   │   ├── config/
│   │   │   └── api.ts        # API configuration
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── README.md
```

## 🔐 Security Features

### Data Protection
- **File Validation**: Strict file type and size checking
- **Input Sanitization**: Protection against malicious content
- **Secure Upload**: Memory-based file processing (no disk storage)
- **Admin Authentication**: Password-protected admin panel

### Privacy Considerations
- **No Permanent Storage**: Files processed in memory only
- **User Data**: Minimal collection (name, email for tracking)
- **Analytics**: Aggregated data only, no personal information stored
- **API Security**: Rate limiting and error handling

## 🤝 Contributing

We welcome contributions to improve the AI Resume Analyzer! Here's how you can help:

### Development Workflow
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/Ai-Resume-Analyzer.git
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our coding standards
5. **Test thoroughly** with both frontend and backend
6. **Commit your changes**:
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Submit a Pull Request** with detailed description

### Areas for Contribution
- 🚀 **New Features**: Additional analysis metrics, file format support
- 🐛 **Bug Fixes**: Issues and improvements
- 📚 **Documentation**: README updates, code comments
- 🎨 **UI/UX**: Design improvements and accessibility
- 🔧 **Performance**: Optimization and efficiency improvements
- 🧪 **Testing**: Unit tests and integration tests

### Code Standards
- **TypeScript**: Strict typing required
- **ESLint**: Follow configured linting rules
- **Tailwind CSS**: Use utility-first approach for styling
- **Component Structure**: Keep components focused and reusable
- **API Design**: RESTful principles and proper error handling

## 📄 License

This project is open source and available under the **MIT License**.

```
MIT License

Copyright (c) 2025 Kishan Vyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support & Contact

### Getting Help
- 📋 **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/KishanVyas308/Ai-Resume-Analyzer/issues)
- 💬 **Discussions**: Join conversations in [GitHub Discussions](https://github.com/KishanVyas308/Ai-Resume-Analyzer/discussions)
- 📧 **Email**: For urgent matters, contact the maintainer

### Project Maintainer
- **Kishan Vyas** - *Full Stack Developer*
- GitHub: [@KishanVyas308](https://github.com/KishanVyas308)
- Project Repository: [Ai-Resume-Analyzer](https://github.com/KishanVyas308/Ai-Resume-Analyzer)

### Acknowledgments
- **GROQ** for providing the AI analysis capabilities
- **Tailwind CSS** for the beautiful, responsive design system
- **React & TypeScript** community for excellent development tools
- All contributors who help improve this project

---

<div align="center">

**⭐ If this project helped you, please consider giving it a star on GitHub! ⭐**

Made with ❤️ by [Kishan Vyas](https://github.com/KishanVyas308)

</div>
