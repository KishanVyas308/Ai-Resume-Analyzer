import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
        {/* Inner ring */}
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Analyzing Your Resume
        </h3>
        <p className="text-sm text-gray-500 max-w-md">
          Our AI is carefully reviewing your resume against the job description. 
          This may take a few moments...
        </p>
      </div>

      {/* Progress indicators */}
      <div className="mt-6 w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Extracting text</span>
          <span>Analyzing content</span>
          <span>Generating insights</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
