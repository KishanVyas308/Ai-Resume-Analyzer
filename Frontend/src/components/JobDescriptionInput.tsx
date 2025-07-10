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
    <div className="space-y-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          placeholder="Paste the job description here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          maxLength={5000}
        />
        
        {/* Character counter */}
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          {charCount}/5000
        </div>
      </div>

      {/* Word and character count */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleUseSample}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          📝 Use Sample Job Description
        </button>
        {value && (
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better analysis:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Include specific skills, technologies, and requirements</li>
          <li>• Mention required experience level and education</li>
          <li>• Add key responsibilities and qualifications</li>
          <li>• Include industry-specific keywords and tools</li>
        </ul>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
