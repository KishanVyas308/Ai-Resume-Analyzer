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
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const ScoreCircle: React.FC<{ score: number; size?: string }> = ({ score, size = 'w-24 h-24' }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
      <div className={`relative ${size}`}>
        <svg className="transform -rotate-90 w-full h-full drop-shadow-sm">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            fill="transparent"
            stroke="rgba(148,163,184,0.3)"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r="40"
            fill="transparent"
            stroke={score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#dc2626'}
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)} drop-shadow-sm`}>
            {score}
          </span>
        </div>
      </div>
    );
  };

  const CategoryScore: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="bg-white border border-blue-100 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-700 font-semibold capitalize">{label}</span>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}/100</span>
      </div>
      <div className="relative w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${getScoreBgColor(score)} transition-all duration-1000 animate-slide-in shadow-sm`}
          style={{ width: `${score}%` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-shimmer"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with professional styling */}
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">
          🎯 Resume Analysis Results
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
          Here's your comprehensive AI-powered resume analysis with personalized recommendations.
        </p>
      </div>

      {/* Overall Score - Hero Section */}
      <div className="bg-white border border-blue-100 rounded-xl p-10 text-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-slate-50/50 rounded-xl"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-bold text-slate-700 mb-8">Overall Performance Score</h3>
          <div className="flex justify-center mb-8">
            <ScoreCircle score={analysis.overallScore} size="w-40 h-40" />
          </div>
          <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-700 mb-8 flex items-center gap-3">
          📊 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Category Breakdown</span>
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(analysis.categoryScores).map(([category, score]) => (
            <CategoryScore key={category} label={category} score={score} />
          ))}
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-slate-700 mb-8 flex items-center gap-3">
          🔍 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Keyword Analysis</span>
        </h3>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Matched Keywords */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-emerald-600 flex items-center gap-2">
              ✅ Keywords Found ({analysis.keywordMatch.matched.length})
            </h4>
            <div className="flex flex-wrap gap-3">
              {analysis.keywordMatch.matched.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 hover:scale-105 transition-transform duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-red-600 flex items-center gap-2">
              ❌ Missing Keywords ({analysis.keywordMatch.missing.length})
            </h4>
            <div className="flex flex-wrap gap-3">
              {analysis.keywordMatch.missing.map((keyword, index) => (
                <span
                  key={index}
                  className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200 hover:scale-105 transition-transform duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">
            <span className="text-blue-700 font-bold text-lg">
              🎯 Keyword Match: <span className="text-slate-700">{analysis.keywordMatch.matchPercentage}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="bg-white border border-green-100 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-emerald-600 mb-6 flex items-center gap-3">
            💪 Strengths
          </h3>
          <ul className="space-y-4">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </span>
                <span className="text-slate-700 leading-relaxed">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-white border border-red-100 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center gap-3">
            🎯 Areas for Improvement
          </h3>
          <ul className="space-y-4">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors duration-200">
                <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                  {index + 1}
                </span>
                <span className="text-slate-700 leading-relaxed">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-white border border-blue-100 rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-blue-600 mb-8 flex items-center gap-3">
          💡 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Improvement Suggestions</span>
        </h3>
        <div className="grid gap-6">
          {analysis.suggestions.map((suggestion, index) => (
            <div key={index} className="bg-blue-50 border border-blue-200 rounded-xl p-6 hover:bg-blue-100 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                  {index + 1}
                </span>
                <p className="text-slate-700 leading-relaxed text-lg">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-x-6">
        <button
          onClick={onReset}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
        >
          <span className="relative z-10 flex items-center gap-2">
            🔄 Analyze Another Resume
          </span>
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        <button
          onClick={() => window.print()}
          className="group relative px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
        >
          <span className="relative z-10 flex items-center gap-2">
            🖨️ Print Results
          </span>
          <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;
