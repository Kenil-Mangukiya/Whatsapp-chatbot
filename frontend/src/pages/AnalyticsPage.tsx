import React, { useState } from 'react';

const AnalyticsPage = ({ isActive }) => {
  const [timeRange, setTimeRange] = useState('Last 7 days');

  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    console.log('Time range changed:', e.target.value);
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Track performance metrics and gain insights into your AI agent</p>
        </div>
        <div className="page-actions">
          <select 
            className="filter-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
          </select>
          <button 
            className="btn btn-secondary"
            onClick={() => handleActionClick('Download Report')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Report
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Calls</span>
            <span className="metric-trend positive">↑ 12%</span>
          </div>
          <div className="metric-value">2</div>
          <div className="metric-chart">
            <div className="mini-chart">
              <span style={{ height: '30%' }}></span>
              <span style={{ height: '45%' }}></span>
              <span style={{ height: '60%' }}></span>
              <span style={{ height: '40%' }}></span>
              <span style={{ height: '75%' }}></span>
              <span style={{ height: '55%' }}></span>
              <span style={{ height: '80%' }}></span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Avg Call Duration</span>
            <span className="metric-trend neutral">→ 0%</span>
          </div>
          <div className="metric-value">3m 54s</div>
          <div className="metric-chart">
            <div className="mini-chart">
              <span style={{ height: '60%' }}></span>
              <span style={{ height: '55%' }}></span>
              <span style={{ height: '58%' }}></span>
              <span style={{ height: '62%' }}></span>
              <span style={{ height: '59%' }}></span>
              <span style={{ height: '61%' }}></span>
              <span style={{ height: '60%' }}></span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Resolution Rate</span>
            <span className="metric-trend positive">↑ 5%</span>
          </div>
          <div className="metric-value">50%</div>
          <div className="metric-chart">
            <div className="mini-chart">
              <span style={{ height: '40%' }}></span>
              <span style={{ height: '42%' }}></span>
              <span style={{ height: '45%' }}></span>
              <span style={{ height: '47%' }}></span>
              <span style={{ height: '48%' }}></span>
              <span style={{ height: '49%' }}></span>
              <span style={{ height: '50%' }}></span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Customer Satisfaction</span>
            <span className="metric-trend positive">↑ 8%</span>
          </div>
          <div className="metric-value">--</div>
          <div className="metric-chart">
            <div className="mini-chart">
              <span style={{ height: '70%' }}></span>
              <span style={{ height: '75%' }}></span>
              <span style={{ height: '78%' }}></span>
              <span style={{ height: '80%' }}></span>
              <span style={{ height: '82%' }}></span>
              <span style={{ height: '85%' }}></span>
              <span style={{ height: '88%' }}></span>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card large">
          <div className="card-header">
            <h3>Call Volume Over Time</h3>
            <select className="small-select">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              <div className="chart-bar" style={{ height: '30%' }}>
                <span className="bar-value">3</span>
              </div>
              <div className="chart-bar" style={{ height: '45%' }}>
                <span className="bar-value">5</span>
              </div>
              <div className="chart-bar" style={{ height: '60%' }}>
                <span className="bar-value">7</span>
              </div>
              <div className="chart-bar" style={{ height: '40%' }}>
                <span className="bar-value">4</span>
              </div>
              <div className="chart-bar" style={{ height: '75%' }}>
                <span className="bar-value">9</span>
              </div>
              <div className="chart-bar" style={{ height: '55%' }}>
                <span className="bar-value">6</span>
              </div>
              <div className="chart-bar" style={{ height: '80%' }}>
                <span className="bar-value">10</span>
              </div>
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3>Call Outcomes</h3>
          </div>
          <div className="chart-container">
            <div className="donut-chart">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="20"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" 
                        strokeDasharray="126" strokeDashoffset="63" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F59E0B" strokeWidth="20" 
                        strokeDasharray="63" strokeDashoffset="0" transform="rotate(90 50 50)"/>
              </svg>
              <div className="donut-center">
                <span className="donut-value">2</span>
                <span className="donut-label">Total</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#10B981' }}></span>
                <span>Completed</span>
                <strong>50%</strong>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ background: '#F59E0B' }}></span>
                <span>Transferred</span>
                <strong>50%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-row">
        <div className="analytics-card">
          <div className="card-header">
            <h3>Top Issues</h3>
          </div>
          <div className="issues-list">
            <div className="issue-item">
              <div className="issue-info">
                <span className="issue-name">Tire Puncture</span>
                <span className="issue-count">1 call</span>
              </div>
              <div className="issue-bar">
                <div className="issue-bar-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div className="issue-item">
              <div className="issue-info">
                <span className="issue-name">Battery Dead</span>
                <span className="issue-count">1 call</span>
              </div>
              <div className="issue-bar">
                <div className="issue-bar-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3>Peak Hours</h3>
          </div>
          <div className="timeline-chart">
            <div className="timeline-quarter">
              <span className="quarter-label">Morning (6-12)</span>
              <div className="quarter-bar" style={{ width: '40%' }}>
                <span>2 calls</span>
              </div>
            </div>
            <div className="timeline-quarter">
              <span className="quarter-label">Afternoon (12-18)</span>
              <div className="quarter-bar" style={{ width: '60%' }}>
                <span>3 calls</span>
              </div>
            </div>
            <div className="timeline-quarter">
              <span className="quarter-label">Evening (18-24)</span>
              <div className="quarter-bar" style={{ width: '30%' }}>
                <span>1 call</span>
              </div>
            </div>
            <div className="timeline-quarter">
              <span className="quarter-label">Night (0-6)</span>
              <div className="quarter-bar" style={{ width: '10%' }}>
                <span>0 calls</span>
              </div>
            </div>
          </div>
          <div className="insight-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Insight:</strong> Most calls happen during afternoon hours. Consider adjusting agent availability.
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-header">
            <h3>Customer Demographics</h3>
          </div>
          <div className="demographics-list">
            <div className="demo-item">
              <div className="demo-info">
                <span className="demo-label">Male</span>
                <span className="demo-value">60%</span>
              </div>
              <div className="demo-progress">
                <div className="demo-fill" style={{ width: '60%', background: '#4F46E5' }}></div>
              </div>
            </div>
            <div className="demo-item">
              <div className="demo-info">
                <span className="demo-label">Female</span>
                <span className="demo-value">40%</span>
              </div>
              <div className="demo-progress">
                <div className="demo-fill" style={{ width: '40%', background: '#10B981' }}></div>
              </div>
            </div>
            <div className="demo-item">
              <div className="demo-info">
                <span className="demo-label">Age 25-40</span>
                <span className="demo-value">70%</span>
              </div>
              <div className="demo-progress">
                <div className="demo-fill" style={{ width: '70%', background: '#F59E0B' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
