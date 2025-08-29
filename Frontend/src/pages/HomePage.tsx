import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import FileUpload from '../components/FileUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import LoadingSpinner from '../components/LoadingSpinner';
import UserInfo from '../components/UserInfo';

interface UserData {
    name: string;
    email: string;
    userId: string;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [jobTitle, setJobTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userInfo, setUserInfo] = useState<UserData | null>(null);
    const [showUserForm, setShowUserForm] = useState<boolean>(true);

    // Check if user info exists in localStorage on component mount
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('resumeAnalyzerUser');
        if (storedUserInfo) {
            try {
                const userData = JSON.parse(storedUserInfo);
                setUserInfo(userData);
                setShowUserForm(false);
            } catch (error) {
                console.error('Error parsing stored user info:', error);
                localStorage.removeItem('resumeAnalyzerUser');
            }
        }
    }, []);

    const handleUserInfoSubmit = (userData: { name: string; email: string }) => {
        // Use email as the primary identifier instead of random userId
        const userId = userData.email; // Use email as userId for consistent identification
        const userDataWithId = { ...userData, userId };

        // Store user info in localStorage
        localStorage.setItem('resumeAnalyzerUser', JSON.stringify(userDataWithId));
        setUserInfo(userDataWithId);
        setShowUserForm(false);
    };

    const handleAnalyze = async () => {
        if (!selectedFile || !jobDescription.trim() || !userInfo) {
            setError('Please upload a resume and provide a job description.');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('jobDescription', jobDescription);
        formData.append('jobTitle', jobTitle || 'Not specified');
        formData.append('userId', userInfo.userId);
        formData.append('userName', userInfo.name);
        formData.append('userEmail', userInfo.email);

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

            // Navigate to results page with the analysis data
            navigate('/results', {
                state: {
                    analysis: result.analysis,
                    resumeName: selectedFile.name,
                    jobTitle: jobTitle || 'Not specified',
                    userInfo: userInfo
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during analysis');
        } finally {
            setLoading(false);
        }
    };

    // Show user info form if no user data exists
    if (showUserForm || !userInfo) {
        return <UserInfo onSubmit={handleUserInfoSubmit} loading={loading} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Professional Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-slate-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            {/* Switch User button positioned at the bottom left corner */}
            <div className="fixed bottom-5 right-5 z-50">
                <button
                    onClick={() => {
                        localStorage.removeItem('resumeAnalyzerUser');
                        setUserInfo(null);
                        setShowUserForm(true);
                    }}
                    className="px-4 py-2 bg-white border cursor-pointer border-blue-200  shadow-lg shadow-blue-400/70 text-slate-600 rounded-lg hover:bg-slate-50 transition-all duration-300 transform hover:scale-105  flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Switch User
                </button>
            </div>
          




            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-16">


                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6 leading-tight">
                            AI Resume Analyzer
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Professional AI-powered analysis to optimize your resume. Get detailed insights,
                            scoring, and personalized recommendations to enhance your career prospects.
                        </p>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Upload Section */}
                            <div className="group">
                                <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ">
                                    <div className="flex items-center mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4 group-hover:rotate-12 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-700">
                                            Upload Resume
                                        </h2>
                                    </div>
                                    <FileUpload
                                        onFileSelect={setSelectedFile}
                                        selectedFile={selectedFile}
                                    />
                                </div>
                            </div>

                            {/* Job Information Section */}
                            <div className="group">
                                <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ">
                                    <div className="flex items-center mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl mr-4 group-hover:rotate-12 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6v10a2 2 0 002 2h4a2 2 0 002-2V6" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-700">
                                            Job Information
                                        </h2>
                                    </div>

                                    {/* Job Title Input */}
                                    <div className="mb-6">
                                        <label htmlFor="jobTitle" className="block text-sm font-semibold text-slate-600 mb-3">
                                            Job Title (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            id="jobTitle"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g., Software Engineer, Marketing Manager"
                                            className="w-full px-4 py-3 bg-slate-50 border border-blue-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        />
                                    </div>

                                    {/* Job Description */}
                                    <JobDescriptionInput
                                        value={jobDescription}
                                        onChange={setJobDescription}
                                        onJobTitleChange={setJobTitle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-8 mx-auto max-w-2xl">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-6 animate-shake">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-red-700 font-medium">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !selectedFile || !jobDescription.trim()}
                                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing Resume...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Analyze Resume
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Loading Spinner */}
                        {loading && (
                            <div className="mt-8 flex justify-center">
                                <LoadingSpinner />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
