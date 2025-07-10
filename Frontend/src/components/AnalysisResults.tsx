import React from 'react';

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

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onReset }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ScoreCircle: React.FC<{ score: number; size?: string }> = ({ score, size = 'w-24 h-24' }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
      <div className={`relative ${size}`}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            fill="transparent"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            fill="transparent"
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  const CategoryScore: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 capitalize">{label}</span>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Resume Analysis Results
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Here's your comprehensive resume analysis with personalized recommendations.
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Overall Score</h3>
          <div className="flex justify-center mb-6">
            <ScoreCircle score={analysis.overallScore} size="w-32 h-32" />
          </div>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Category Breakdown</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analysis.categoryScores).map(([category, score]) => (
            <CategoryScore key={category} label={category} score={score} />
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Keyword Analysis</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Matched Keywords */}
          <div>
            <h4 className="text-lg font-semibold text-green-700 mb-4">
              ✅ Keywords Found ({analysis.keywordMatch.matched.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordMatch.matched.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <h4 className="text-lg font-semibold text-red-700 mb-4">
              ❌ Missing Keywords ({analysis.keywordMatch.missing.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keywordMatch.missing.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-blue-50 rounded-lg px-4 py-2">
            <span className="text-blue-700 font-medium">
              Keyword Match: {analysis.keywordMatch.matchPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-green-700 mb-6">
            💪 Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-red-700 mb-6">
            🎯 Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-semibold text-indigo-700 mb-6">
          💡 Improvement Suggestions
        </h3>
        <div className="grid gap-4">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <p className="text-gray-700 leading-relaxed">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-4">
        <button
          onClick={onReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
        >
          Analyze Another Resume
        </button>
        <button
          onClick={() => window.print()}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
        >
          Print Results
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
