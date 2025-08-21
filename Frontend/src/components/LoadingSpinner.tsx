import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="relative p-8">
      {/* Professional container */}
      <div className="bg-white border border-blue-100 rounded-xl p-8 text-center shadow-lg">
        {/* Modern spinner */}
        <div className="relative mx-auto w-20 h-20 mb-6">
          {/* Gradient ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-20 animate-spin-slow"></div>
          <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-40 animate-spin"></div>
          <div className="absolute inset-2 rounded-full bg-white border border-blue-100"></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🤖 AI Analysis in Progress
          </h3>
          <p className="text-slate-600 max-w-sm mx-auto leading-relaxed">
            Our advanced AI is analyzing your resume against the job requirements. 
            Please wait while we generate comprehensive insights.
          </p>
        </div>

        {/* Enhanced progress indicators */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Text Extraction
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              Content Analysis
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Insights Generation
            </span>
          </div>
          
          {/* Animated progress bar */}
          <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-full animate-progress-flow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full animate-shimmer"></div>
          </div>
          
          {/* Fun facts */}
          <div className="mt-6 text-xs text-slate-400">
            💡 <em>Our AI analyzes thousands of resume patterns to provide you with the best insights!</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
