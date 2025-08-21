import React from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const wordCount = value.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = value.length;

  const sampleJobDescription = `We are seeking a Senior Software Engineer with 5+ years of experience in JavaScript, React, Node.js, and cloud technologies. The ideal candidate will have:

• Strong proficiency in JavaScript/TypeScript, React, and modern frontend frameworks
• Experience with Node.js, Express, and RESTful APIs
• Knowledge of cloud platforms (AWS, Azure, or GCP)
• Familiarity with databases (MongoDB, PostgreSQL)
• Experience with version control systems (Git)
• Strong problem-solving skills and attention to detail
• Bachelor's degree in Computer Science or related field

Responsibilities include developing scalable web applications, collaborating with cross-functional teams, code review, and mentoring junior developers.`;

  const handleUseSample = () => {
    onChange(sampleJobDescription);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste the job description here..."
          className="w-full h-64 p-4 bg-slate-50 border border-blue-200 rounded-xl text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:bg-blue-50"
          maxLength={5000}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200">
          {charCount}/5000
        </div>
      </div>

      {/* Word and character count */}
      <div className="flex justify-between text-sm text-slate-600">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>{wordCount} words</span>
        </div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2" />
          </svg>
          <span>{charCount} characters</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleUseSample}
          className="group inline-flex items-center px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-sm"
        >
          <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Use Sample
        </button>
        {value && (
          <button
            onClick={handleClear}
            className="group inline-flex items-center px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-300 transform hover:scale-105 shadow-sm"
          >
            <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1V4m8 3H4" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg mr-3 shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-slate-700">Pro Tips for Better Analysis</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-600 text-sm">Include specific skills and technologies</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-600 text-sm">Mention required experience level</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-600 text-sm">Add key responsibilities and qualifications</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-600 text-sm">Include industry-specific keywords</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
