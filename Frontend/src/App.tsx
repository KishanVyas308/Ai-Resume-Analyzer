import React, { useState } from 'react';
import './App.css';
import { API_ENDPOINTS } from './config/api';
import FileUpload from './components/FileUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import AnalysisResults from './components/AnalysisResults';
import LoadingSpinner from './components/LoadingSpinner';
import AdminPage from './components/AdminPage';

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

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAdmin, setShowAdmin] = useState<boolean>(false);

  // Generate a random userId for demo (persist for session)
  const [userId] = useState<string>(() => {
    return 'user_' + Math.random().toString(36).substring(2, 10);
  });

  const handleAnalyze = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setError('Please upload a resume and provide a job description.');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('jobDescription', jobDescription);
    formData.append('jobTitle', jobTitle || 'Not specified');
    formData.append('userId', userId);

    try {
      const response = await fetch(API_ENDPOINTS.ANALYZE_RESUME, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze resume');
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setJobDescription('');
    setJobTitle('');
    setAnalysis(null);
    setError('');
  };

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <button onClick={() => setShowAdmin(false)} className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded">Back to App</button>
          <AdminPage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Resume Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and job description to get an AI-powered analysis
            with personalized improvement suggestions and scoring.
          </p>
          <button onClick={() => setShowAdmin(true)} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Admin Dashboard</button>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {!analysis ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Upload Resume
                </h2>
                <FileUpload 
                  onFileSelect={setSelectedFile} 
                  selectedFile={selectedFile}
                />
              </div>

              {/* Job Description Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Job Information
                </h2>
                
                {/* Job Title Input */}
                <div className="mb-4">
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Software Engineer, Marketing Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Job Description */}
                <JobDescriptionInput 
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <AnalysisResults analysis={analysis} onReset={handleReset} />
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!analysis && (
            <div className="mt-8 text-center">
              <button
                onClick={handleAnalyze}
                disabled={loading || !selectedFile || !jobDescription.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
              >
                {loading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="mt-8">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
