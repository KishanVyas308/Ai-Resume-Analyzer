import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import './AdminPage.css';

interface AdminStats {
  summary: {
    totalUsers: number;
    totalAnalyses: number;
    averageScore: number;
    last7DaysAnalyses: number;
  };
  dailyAnalytics: Array<{
    date: string;
    analyses: number;
    uniqueUsers: number;
  }>;
  categoryAverages: {
    skills: number;
    experience: number;
    education: number;
    keywords: number;
    formatting: number;
  };
  topWeaknesses: Array<{
    weakness: string;
    count: number;
  }>;
  recentAnalyses: Array<{
    userId: string;
    score: number;
    analyzedAt: string;
    jobTitle: string;
    fileName: string;
  }>;
  userDetails: Array<{
    userId: string;
    firstSeen: string;
    lastSeen: string;
    analysisCount: number;
  }>;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchAdminStats();
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      } else {
        setError('Failed to fetch admin stats');
        if (response.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('adminToken');
        }
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setAdminStats(null);
    setPassword('');
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchAdminStats();
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h2>🔒 Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Admin Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="demo-info">
            <small>Demo password: admin123</small>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !adminStats) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <div className="admin-actions">
          <button onClick={fetchAdminStats} className="refresh-btn">
            🔄 Refresh
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      {adminStats && (
        <>
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">👥</div>
              <div className="card-content">
                <h3>Total Users</h3>
                <div className="card-value">{adminStats.summary.totalUsers}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">📄</div>
              <div className="card-content">
                <h3>Total Analyses</h3>
                <div className="card-value">{adminStats.summary.totalAnalyses}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">⭐</div>
              <div className="card-content">
                <h3>Average Score</h3>
                <div className="card-value">{adminStats.summary.averageScore.toFixed(1)}</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>Last 7 Days</h3>
                <div className="card-value">{adminStats.summary.last7DaysAnalyses}</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
            </button>
            <button 
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Users
            </button>
            <button 
              className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
              onClick={() => setActiveTab('recent')}
            >
              🕐 Recent
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="charts-grid">
                  {/* Daily Analytics Chart */}
                  <div className="chart-card">
                    <h3>📅 Daily Activity (Last 7 Days)</h3>
                    <div className="daily-chart">
                      {adminStats.dailyAnalytics.map((day, index) => (
                        <div key={index} className="daily-bar">
                          <div 
                            className="bar analyses-bar" 
                            style={{ height: `${Math.max(day.analyses * 10, 5)}px` }}
                            title={`${day.analyses} analyses`}
                          ></div>
                          <div 
                            className="bar users-bar" 
                            style={{ height: `${Math.max(day.uniqueUsers * 15, 5)}px` }}
                            title={`${day.uniqueUsers} users`}
                          ></div>
                          <div className="bar-label">{formatDateShort(day.date)}</div>
                        </div>
                      ))}
                    </div>
                    <div className="chart-legend">
                      <span><div className="legend-color analyses"></div> Analyses</span>
                      <span><div className="legend-color users"></div> Users</span>
                    </div>
                  </div>

                  {/* Category Averages */}
                  <div className="chart-card">
                    <h3>📊 Category Score Averages</h3>
                    <div className="category-scores">
                      {Object.entries(adminStats.categoryAverages).map(([category, score]) => (
                        <div key={category} className="category-score">
                          <div className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</div>
                          <div className="score-bar">
                            <div 
                              className="score-fill" 
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <div className="score-value">{score.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Weaknesses */}
                <div className="chart-card">
                  <h3>⚠️ Most Common Weaknesses</h3>
                  <div className="weaknesses-list">
                    {adminStats.topWeaknesses.map((weakness, index) => (
                      <div key={index} className="weakness-item">
                        <span className="weakness-rank">#{index + 1}</span>
                        <span className="weakness-text">{weakness.weakness}</span>
                        <span className="weakness-count">{weakness.count} times</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="analytics-tab">
                <div className="analytics-grid">
                  <div className="analytics-card">
                    <h3>📈 Performance Trends</h3>
                    <div className="trend-stats">
                      <div className="trend-item">
                        <span>Peak Activity Day:</span>
                        <span>{adminStats.dailyAnalytics.reduce((max, day) => 
                          day.analyses > max.analyses ? day : max
                        ).date}</span>
                      </div>
                      <div className="trend-item">
                        <span>Average Daily Analyses:</span>
                        <span>{(adminStats.summary.last7DaysAnalyses / 7).toFixed(1)}</span>
                      </div>
                      <div className="trend-item">
                        <span>User Retention:</span>
                        <span>{adminStats.userDetails.filter(u => u.analysisCount > 1).length} returning users</span>
                      </div>
                    </div>
                  </div>

                  <div className="analytics-card">
                    <h3>🎯 Score Distribution</h3>
                    <div className="score-ranges">
                      {[
                        { range: '90-100', label: 'Excellent', color: '#4CAF50' },
                        { range: '80-89', label: 'Good', color: '#8BC34A' },
                        { range: '70-79', label: 'Fair', color: '#FFC107' },
                        { range: '60-69', label: 'Poor', color: '#FF9800' },
                        { range: '0-59', label: 'Very Poor', color: '#F44336' }
                      ].map((range, index) => {
                        const count = adminStats.recentAnalyses.filter(a => {
                          const score = a.score;
                          const [min, max] = range.range.split('-').map(Number);
                          return score >= min && score <= max;
                        }).length;
                        
                        return (
                          <div key={index} className="score-range">
                            <div className="range-info">
                              <span style={{ color: range.color }}>●</span>
                              <span>{range.label} ({range.range})</span>
                            </div>
                            <span className="range-count">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="users-tab">
                <div className="users-table-container">
                  <h3>👥 User Details</h3>
                  <div className="users-table">
                    <div className="table-header">
                      <div>User ID</div>
                      <div>First Seen</div>
                      <div>Last Seen</div>
                      <div>Analyses Count</div>
                      <div>Status</div>
                    </div>
                    {adminStats.userDetails.map((user, index) => (
                      <div key={index} className="table-row">
                        <div className="user-id">{user.userId}</div>
                        <div>{formatDate(user.firstSeen)}</div>
                        <div>{formatDate(user.lastSeen)}</div>
                        <div className="analysis-count">{user.analysisCount}</div>
                        <div className={`user-status ${user.analysisCount > 1 ? 'returning' : 'new'}`}>
                          {user.analysisCount > 1 ? 'Returning' : 'New'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recent' && (
              <div className="recent-tab">
                <div className="recent-analyses">
                  <h3>🕐 Recent Analyses</h3>
                  <div className="analyses-grid">
                    {adminStats.recentAnalyses.map((analysis, index) => (
                      <div key={index} className="analysis-card">
                        <div className="analysis-header">
                          <div className="analysis-score">
                            <span className="score-value">{analysis.score}</span>
                            <span className="score-label">Score</span>
                          </div>
                          <div className="analysis-info">
                            <div className="user-id">User: {analysis.userId}</div>
                            <div className="analysis-time">{formatDate(analysis.analyzedAt)}</div>
                          </div>
                        </div>
                        <div className="analysis-details">
                          <div className="detail-item">
                            <span className="detail-label">Job Title:</span>
                            <span>{analysis.jobTitle}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">File:</span>
                            <span>{analysis.fileName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
