import React from 'react';

const DashboardPage = ({ isActive }) => {
  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
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
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Agent Status</span>
            <span className="status-dot active"></span>
          </div>
          <div className="stat-value">Active</div>
          <div className="stat-footer">
            <span className="stat-change positive">Online for 2h 15m</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Calls Today</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div className="stat-value">0</div>
          <div className="stat-footer">
            <span className="stat-change neutral">Ready to receive</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Avg Response Time</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-value">2.1s</div>
          <div className="stat-footer">
            <span className="stat-change positive">↓ 0.3s faster</span>
          </div>
        </div>

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

      {/* Quick Actions */}
      <div className="section-header">
        <h2>Quick Actions</h2>
        <p>Common tasks to get you started</p>
      </div>

      <div className="actions-grid">
        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h3>Test Your Agent</h3>
          <p>Make a test call to experience how your AI agent handles customer interactions</p>
          <button 
            className="action-btn"
            onClick={() => handleActionClick('Test Now')}
          >
            Test Now
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <h3>Customize Responses</h3>
          <p>Fine-tune your AI agent's responses to match your brand voice</p>
          <button 
            className="action-btn"
            onClick={() => handleActionClick('Customize')}
          >
            Customize
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Invite Team Members</h3>
          <p>Add your team to collaborate and manage the AI agent together</p>
          <button 
            className="action-btn"
            onClick={() => handleActionClick('Invite')}
          >
            Invite
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h3>Setup Call Forwarding</h3>
          <p>Complete phone forwarding setup to start receiving actual calls</p>
          <button 
            className="action-btn"
            onClick={() => handleActionClick('Setup')}
          >
            Setup
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="section-header">
        <h2>Recent Activity</h2>
        <button className="view-all-link" onClick={() => alert('View All feature coming soon!')}>View All</button>
      </div>

      <div className="activity-card">
        <div className="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <h3>No calls yet</h3>
          <p>Your AI agent is ready and waiting. Make a test call or complete your phone forwarding setup to start receiving calls.</p>
          <div className="empty-actions">
            <button 
              className="btn btn-primary"
              onClick={() => handleActionClick('Make Test Call')}
            >
              Make Test Call
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleActionClick('View Setup Guide')}
            >
              View Setup Guide
            </button>
          </div>
        </div>
      </div>

      {/* Setup Checklist */}
      <div className="section-header">
        <h2>Setup Checklist</h2>
        <p>Complete these steps to get the most out of RoadAI</p>
      </div>

      <div className="checklist-card">
        <div className="checklist-item completed">
          <div className="checklist-check">✓</div>
          <div className="checklist-content">
            <h4>Create Your Account</h4>
            <p>You've successfully set up your RoadAI account</p>
          </div>
        </div>

        <div className="checklist-item completed">
          <div className="checklist-check">✓</div>
          <div className="checklist-content">
            <h4>Configure AI Agent</h4>
            <p>Voice settings and responses are configured</p>
          </div>
        </div>

        <div className="checklist-item">
          <div className="checklist-check">3</div>
          <div className="checklist-content">
            <h4>Test Your Agent</h4>
            <p>Make a test call to ensure everything works perfectly</p>
          </div>
          <button 
            className="checklist-btn"
            onClick={() => handleActionClick('Test')}
          >
            Test
          </button>
        </div>

        <div className="checklist-item">
          <div className="checklist-check">4</div>
          <div className="checklist-content">
            <h4>Complete Phone Setup</h4>
            <p>Forward your business calls to start receiving</p>
          </div>
          <button 
            className="checklist-btn"
            onClick={() => handleActionClick('Setup')}
          >
            Setup
          </button>
        </div>

        <div className="checklist-item">
          <div className="checklist-check">5</div>
          <div className="checklist-content">
            <h4>Invite Your Team</h4>
            <p>Add team members to collaborate on call management</p>
          </div>
          <button 
            className="checklist-btn"
            onClick={() => handleActionClick('Invite')}
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
