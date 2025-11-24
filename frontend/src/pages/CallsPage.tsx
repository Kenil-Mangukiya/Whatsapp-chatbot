import React, { useState, useEffect } from 'react';
import { getCallHistory, CallHistoryItem } from '../services/apis/callAPI';
import toast from 'react-hot-toast';

interface CallsPageProps {
  isActive?: boolean;
}

const CallsPage: React.FC<CallsPageProps> = ({ isActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [issueFilter, setIssueFilter] = useState('All Issue');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [calls, setCalls] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallHistoryItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch call history on component mount
  useEffect(() => {
    fetchCallHistory();
  }, []);

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const response = await getCallHistory();
      if (response.data) {
        setCalls(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching call history:', error);
      toast.error(error.message || 'Failed to fetch call history');
    } finally {
      setLoading(false);
    }
  };

  // Format duration: if >= 60 seconds, show in minutes, otherwise seconds
  const formatDuration = (durationMs: number | null): string => {
    if (!durationMs) return 'Null';
    const seconds = Math.floor(durationMs / 1000);
    if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    }
    return `${seconds}s`;
  };

  // Format date and time from created_at
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return { date: 'Null', time: 'Null' };
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return { date: dateStr, time: timeStr };
  };

  // Get customer name from dynamic_variables
  const getCustomerName = (dynamicVars: { [key: string]: any } | null): string => {
    if (!dynamicVars) return 'Null';
    // Try common field names for customer name
    return dynamicVars.customer_name || dynamicVars.name || dynamicVars.username || dynamicVars.customer || 'Null';
  };

  // Get location from dynamic_variables
  const getLocation = (dynamicVars: { [key: string]: any } | null): string => {
    if (!dynamicVars) return 'Null';
    return dynamicVars.location || 'Null';
  };

  // Get issue from dynamic_variables
  const getIssue = (dynamicVars: { [key: string]: any } | null): string => {
    if (!dynamicVars) return 'Null';
    return dynamicVars.issue || dynamicVars.problem || 'Null';
  };

  // Parse transcript into chat messages (Agent and User)
  const parseTranscript = (transcript: string | null): Array<{ role: 'agent' | 'user'; content: string }> => {
    if (!transcript) return [];
    
    const messages: Array<{ role: 'agent' | 'user'; content: string }> = [];
    const lines = transcript.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Agent:')) {
        messages.push({
          role: 'agent',
          content: trimmedLine.replace(/^Agent:\s*/, '')
        });
      } else if (trimmedLine.startsWith('User:')) {
        messages.push({
          role: 'user',
          content: trimmedLine.replace(/^User:\s*/, '')
        });
      } else if (messages.length > 0) {
        // Continue previous message if line doesn't start with Agent: or User:
        messages[messages.length - 1].content += ' ' + trimmedLine;
      }
    });
    
    return messages;
  };

  // Handle view details button click
  const handleViewDetails = (call: CallHistoryItem) => {
    setSelectedCall(call);
    setShowDetailsModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCall(null);
  };

  // Filter calls based on search and filters
  const filteredCalls = calls.filter((call) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const customerName = getCustomerName(call.dynamic_variables).toLowerCase();
      const location = getLocation(call.dynamic_variables).toLowerCase();
      const issue = getIssue(call.dynamic_variables).toLowerCase();
      const transcript = (call.transcript || '').toLowerCase();
      
      if (!customerName.includes(searchLower) && 
          !location.includes(searchLower) && 
          !issue.includes(searchLower) &&
          !transcript.includes(searchLower)) {
        return false;
      }
    }

    // Issue filter
    if (issueFilter !== 'All Issue') {
      const issue = getIssue(call.dynamic_variables).toLowerCase();
      const filterLower = issueFilter.toLowerCase();
      
      // Map filter options to possible issue values
      const issueMappings: { [key: string]: string[] } = {
        'tyre punctured': ['tyre puncture', 'tyre punctured', 'puncture', 'टायर पंक्चर'],
        'battery issue': ['battery', 'battery dead', 'battery issue', 'dead battery'],
        'towing': ['towing', 'tow'],
        'lockout': ['lockout', 'lock out', 'locked out'],
        'empty fuel': ['empty fuel', 'fuel खत्म', 'fuel empty', 'out of fuel'],
        'accident': ['accident', 'crash', 'collision'],
        'engine not starting': ['engine not starting', 'start problem', 'start issue', 'not starting']
      };
      
      const possibleValues = issueMappings[filterLower] || [filterLower];
      const matches = possibleValues.some(value => issue.includes(value.toLowerCase()));
      
      if (!matches) return false;
    }

    // Time filter
    if (timeFilter !== 'All Time' && call.created_at) {
      const callDate = new Date(call.created_at);
      const now = new Date();
      const diffTime = now.getTime() - callDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (timeFilter === 'Today' && diffDays >= 1) return false;
      if (timeFilter === 'Last 7 days' && diffDays >= 7) return false;
      if (timeFilter === 'Last 30 days' && diffDays >= 30) return false;
    }

    return true;
  });

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case 'issue':
        setIssueFilter(value);
        break;
      case 'time':
        setTimeFilter(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Call History</h1>
          <p>View and manage all customer calls handled by your AI agent</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => toast('Test call feature coming soon')}
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
            placeholder="Search calls by customer, location, or issue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={issueFilter}
          onChange={(e) => handleFilterChange('issue', e.target.value)}
        >
          <option>All Issue</option>
          <option>Tyre punctured</option>
          <option>Battery issue</option>
          <option>Towing</option>
          <option>Lockout</option>
          <option>Empty fuel</option>
          <option>Accident</option>
          <option>Engine not starting</option>
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
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading call history...</p>
        </div>
      ) : filteredCalls.length === 0 ? (
        <div className="empty-state-small">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <h3>No calls found</h3>
          <p>{calls.length === 0 ? 'Your AI agent is ready. Make a test call to see it in action!' : 'No calls match your filters.'}</p>
        </div>
      ) : (
        <div className="calls-table">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Phone Number</th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Issue</th>
                <th>Duration</th>
                <th>Sentiment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call, index) => {
                const { date, time } = formatDateTime(call.created_at);
                const customerName = getCustomerName(call.dynamic_variables);
                const location = getLocation(call.dynamic_variables);
                const issue = getIssue(call.dynamic_variables);
                const duration = formatDuration(call.duration_ms);

                return (
                  <tr key={index}>
                    <td>
                      <div className="time-cell">
                        <span className="date">{date}</span>
                        <span className="time">{time}</span>
                      </div>
                    </td>
                    <td>{call.to_number || 'Null'}</td>
                    <td>
                      <div className="customer-name">{customerName}</div>
                    </td>
                    <td>{location}</td>
                    <td>
                      <span className="issue-badge">{issue}</span>
                    </td>
                    <td>{duration}</td>
                    <td>
                      <span className={`sentiment-badge sentiment-${(call.call_sentiment || 'Unknown').toLowerCase()}`}>
                        {call.call_sentiment || 'Null'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-view-details"
                        onClick={() => handleViewDetails(call)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedCall && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Call Details</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Information
                </h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">{formatDuration(selectedCall.duration_ms)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Disconnection Reason:</span>
                    <span className="detail-value">{selectedCall.disconnection_reason || 'Null'}</span>
                  </div>
                </div>
              </div>

              {selectedCall.dynamic_variables && Object.keys(selectedCall.dynamic_variables).length > 0 && (
                <div className="detail-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    User Information
                  </h3>
                  <div className="detail-grid">
                    {Object.entries(selectedCall.dynamic_variables).map(([key, value]) => (
                      <div key={key} className="detail-item">
                        <span className="detail-label">{key}:</span>
                        <span className="detail-value">{String(value) || 'Null'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCall.transcript && (
                <div className="detail-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    Transcript
                  </h3>
                  <div className="chat-transcript">
                    {parseTranscript(selectedCall.transcript).map((message, index) => (
                      <div key={index} className={`chat-message ${message.role === 'agent' ? 'agent-message' : 'user-message'}`}>
                        <div className="message-bubble">
                          <div className="message-role">{message.role === 'agent' ? 'Agent' : 'User'}</div>
                          <div className="message-content">{message.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCall.call_summary && (
                <div className="detail-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                      <line x1="9" y1="12" x2="15" y2="12"/>
                      <line x1="9" y1="16" x2="15" y2="16"/>
                    </svg>
                    Call Summary
                  </h3>
                  <div className="call-summary-content">
                    <p>{selectedCall.call_summary}</p>
                  </div>
                </div>
              )}

              {selectedCall.recording_url && (
                <div className="detail-section">
                  <h3>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }}>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                    Recording
                  </h3>
                  <audio controls src={selectedCall.recording_url} style={{ width: '100%', marginBottom: '1rem' }}>
                    Your browser does not support the audio element.
                  </audio>
                  <button 
                    className="btn-download-recording"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedCall.recording_url!;
                      link.download = `recording-${selectedCall.created_at ? new Date(selectedCall.created_at).toISOString() : Date.now()}.wav`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success('Recording download started');
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Recording
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallsPage;
