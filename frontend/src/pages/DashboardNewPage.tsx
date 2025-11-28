import React, { useState, useEffect } from 'react';
import { getDashboardStats, DashboardStats } from '../services/apis/callAPI';
import CallsPerDayChart from '../components/CallsPerDayChart';
import SentimentPieChart from '../components/SentimentPieChart';
import toast from 'react-hot-toast';

interface DashboardNewPageProps {
  isActive?: boolean;
}

const DashboardNewPage: React.FC<DashboardNewPageProps> = ({ isActive }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isActive) {
      fetchDashboardStats();
    }
  }, [isActive]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      toast.error(error.message || 'Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  // Format duration from milliseconds to readable format
  const formatDuration = (durationMs: number): string => {
    if (!durationMs || durationMs === 0) return '0s';
    
    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Calculate total calls and percentages for sentiment
  const getTotalSentimentCalls = () => {
    if (!stats?.sentimentCounts) return 0;
    return stats.sentimentCounts.Positive + 
           stats.sentimentCounts.Negative + 
           stats.sentimentCounts.Neutral + 
           stats.sentimentCounts.Unknown;
  };

  const getSentimentPercentage = (count: number): number => {
    const total = getTotalSentimentCalls();
    if (total === 0) return 0;
    return Math.round((count / total) * 100 * 10) / 10; // Round to 1 decimal
  };

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action);
    toast(`"${action}" feature will be fully functional in production!`);
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1>Welcome to RoadAI Assistant! 👋</h1>
          <p>Your AI voice agent is now live and ready to handle calls. Here's what's happening right now.</p>
        </div>
        <button 
          className="test-call-btn"
          onClick={() => handleActionClick('Make Test Call')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Make Test Call
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {/* Total Calls Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Calls</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="stat-value">
            {loading ? '--' : (stats?.totalCalls || 0)}
          </div>
          <div className="stat-footer">
            <span className="stat-change neutral">All time calls</span>
          </div>
        </div>

        {/* Calls Today Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Calls Today</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="stat-value">
            {loading ? '--' : (stats?.callsToday || 0)}
          </div>
          <div className="stat-footer">
            <span className="stat-change neutral">Ready to receive</span>
          </div>
        </div>

        {/* Total Duration Card */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Duration</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-value">
            {loading ? '--' : formatDuration(stats?.totalDurationMs || 0)}
          </div>
          <div className="stat-footer">
            <span className="stat-change neutral">Total call time</span>
          </div>
        </div>

        {/* Success Rate Card (keeping for layout) */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Success Rate</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-value">--</div>
          <div className="stat-footer">
            <span className="stat-change neutral">No data yet</span>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis Section */}
      <div className="section-header">
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Sentiment Analysis
        </h2>
        <p>Customer sentiment distribution</p>
      </div>

      <div className="sentiment-grid">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
            <p>Loading sentiment data...</p>
          </div>
        ) : stats?.sentimentCounts ? (
          <>
            <div className="sentiment-card">
              <div className="sentiment-header">
                <span className="sentiment-label">Positive</span>
                <span className="sentiment-badge sentiment-positive">Positive</span>
              </div>
              <div className="sentiment-value">{stats.sentimentCounts.Positive}</div>
              <div className="sentiment-percentage">
                {getSentimentPercentage(stats.sentimentCounts.Positive)}%
              </div>
            </div>

            <div className="sentiment-card">
              <div className="sentiment-header">
                <span className="sentiment-label">Neutral</span>
                <span className="sentiment-badge sentiment-neutral">Neutral</span>
              </div>
              <div className="sentiment-value">{stats.sentimentCounts.Neutral}</div>
              <div className="sentiment-percentage">
                {getSentimentPercentage(stats.sentimentCounts.Neutral)}%
              </div>
            </div>

            <div className="sentiment-card">
              <div className="sentiment-header">
                <span className="sentiment-label">Negative</span>
                <span className="sentiment-badge sentiment-negative">Negative</span>
              </div>
              <div className="sentiment-value">{stats.sentimentCounts.Negative}</div>
              <div className="sentiment-percentage">
                {getSentimentPercentage(stats.sentimentCounts.Negative)}%
              </div>
            </div>

            <div className="sentiment-card">
              <div className="sentiment-header">
                <span className="sentiment-label">Unknown</span>
                <span className="sentiment-badge sentiment-unknown">Unknown</span>
              </div>
              <div className="sentiment-value">{stats.sentimentCounts.Unknown}</div>
              <div className="sentiment-percentage">
                {getSentimentPercentage(stats.sentimentCounts.Unknown)}%
              </div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>
            <p>No sentiment data available</p>
          </div>
        )}
      </div>

      {/* Calls Per Day Chart Section */}
      <div className="section-header" style={{ marginTop: '3rem' }}>
        <h2>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Call Volume Analysis
        </h2>
        <p>Daily call statistics and trends</p>
      </div>

      <div className="chart-section">
        <CallsPerDayChart isActive={isActive} />
      </div>

      {/* Sentiment Pie Chart Section */}
      <div className="chart-section" style={{ marginTop: '2rem' }}>
        <SentimentPieChart 
          sentimentCounts={stats?.sentimentCounts || { Positive: 0, Negative: 0, Neutral: 0, Unknown: 0 }}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardNewPage;

