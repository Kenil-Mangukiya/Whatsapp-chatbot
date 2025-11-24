import React, { useState } from 'react';

interface CallsPageProps {
  isActive?: boolean;
}

const CallsPage: React.FC<CallsPageProps> = ({ isActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Calls');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [languageFilter, setLanguageFilter] = useState('All Languages');

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    console.log('Searching for:', e.target.value);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    console.log('Filter changed:', value);
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'time':
        setTimeFilter(value);
        break;
      case 'language':
        setLanguageFilter(value);
        break;
      default:
        break;
    }
  };

  const calls = [
    {
      id: 1,
      date: 'Oct 22, 2025',
      time: '2:45 PM',
      customer: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      location: 'Mumbai, MH',
      issue: 'Tire Puncture',
      language: '🇮🇳 Hindi',
      duration: '4m 32s',
      status: 'Completed'
    },
    {
      id: 2,
      date: 'Oct 22, 2025',
      time: '1:20 PM',
      customer: 'Priya Sharma',
      phone: '+91 87654 32109',
      location: 'Pune, MH',
      issue: 'Battery Dead',
      language: '🇬🇧 English',
      duration: '3m 15s',
      status: 'Transferred'
    }
  ];

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Call History</h1>
          <p>View and manage all customer calls handled by your AI agent</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => handleActionClick('Export Report')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Export Report
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleActionClick('Make Test Call')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Make Test Call
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search calls by phone, location, or issue..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option>All Calls</option>
          <option>Completed</option>
          <option>Transferred</option>
          <option>Missed</option>
        </select>
        <select 
          className="filter-select"
          value={timeFilter}
          onChange={(e) => handleFilterChange('time', e.target.value)}
        >
          <option>All Time</option>
          <option>Today</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
        <select 
          className="filter-select"
          value={languageFilter}
          onChange={(e) => handleFilterChange('language', e.target.value)}
        >
          <option>All Languages</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Other</option>
        </select>
      </div>

      <div className="calls-table">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Customer</th>
              <th>Location</th>
              <th>Issue</th>
              <th>Language</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call) => (
              <tr key={call.id}>
                <td>
                  <div className="time-cell">
                    <span className="date">{call.date}</span>
                    <span className="time">{call.time}</span>
                  </div>
                </td>
                <td>
                  <div className="customer-cell">
                    <div className="customer-avatar">
                      {call.customer.charAt(0)}
                    </div>
                    <div>
                      <div className="customer-name">{call.customer}</div>
                      <div className="customer-phone">{call.phone}</div>
                    </div>
                  </div>
                </td>
                <td>{call.location}</td>
                <td>
                  <span className="issue-badge">{call.issue}</span>
                </td>
                <td>
                  <span className="language-badge">{call.language}</span>
                </td>
                <td>{call.duration}</td>
                <td>
                  <span className={`status-badge status-${call.status.toLowerCase()}`}>
                    {call.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-action" 
                      title="Play recording"
                      onClick={() => handleActionClick('Play recording')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-action" 
                      title="View transcript"
                      onClick={() => handleActionClick('View transcript')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-action" 
                      title="More options"
                      onClick={() => handleActionClick('More options')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="empty-state-small" style={{ display: 'none' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <h3>No calls yet</h3>
        <p>Your AI agent is ready. Make a test call to see it in action!</p>
        <button 
          className="btn btn-primary"
          onClick={() => handleActionClick('Make Test Call')}
        >
          Make Test Call
        </button>
      </div>
    </div>
  );
};

export default CallsPage;
