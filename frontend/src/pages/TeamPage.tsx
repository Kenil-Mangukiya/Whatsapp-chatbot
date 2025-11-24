import React, { useState } from 'react';

const TeamPage = ({ isActive }) => {
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'agent',
    message: ''
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    alert('Team invitation sent! (In production, this would send an actual email)');
    setInviteModalOpen(false);
    setInviteForm({ email: '', role: 'agent', message: '' });
  };

  const handleInviteFormChange = (field, value) => {
    setInviteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const teamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@roadai.com',
      role: 'Owner',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff',
      permissions: ['Full Access', 'Manage Team', 'View Analytics', 'Manage Settings'],
      lastActive: '2 minutes ago',
      isOwner: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@roadai.com',
      role: 'Manager',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=10B981&color=fff',
      permissions: ['View Calls', 'Manage Customers', 'View Analytics'],
      lastActive: '1 hour ago',
      isOwner: false
    }
  ];

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Team Management</h1>
          <p>Manage team members, roles, and permissions for your RoadAI account</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setInviteModalOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Invite Team Member
          </button>
        </div>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className={`team-card ${member.isOwner ? 'owner' : ''}`}>
            <div className="team-card-header">
              <img src={member.avatar} alt={member.name} className="team-avatar" />
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.email}</p>
              </div>
              <span className={`role-badge ${member.isOwner ? 'owner-badge' : ''}`}>
                {member.role}
              </span>
            </div>
            <div className="team-card-body">
              {member.permissions.map((permission, index) => (
                <div key={index} className="permission-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"/>
                  </svg>
                  <span>{permission}</span>
                </div>
              ))}
            </div>
            <div className="team-card-footer">
              Last active: {member.lastActive}
            </div>
          </div>
        ))}

        <div className="team-card-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h3>Invite More Team Members</h3>
          <p>Add team members to collaborate and manage your AI agent together</p>
          <button 
            className="btn btn-primary"
            onClick={() => setInviteModalOpen(true)}
          >
            Invite Team Member
          </button>
        </div>
      </div>

      <div className="roles-section">
        <h2>Role Permissions</h2>
        <p>Understand what each role can access and manage</p>
        <div className="roles-grid">
          <div className="role-card">
            <div className="role-icon">👑</div>
            <h3>Owner</h3>
            <ul>
              <li>Full system access</li>
              <li>Manage team members</li>
              <li>View all analytics</li>
              <li>Manage billing & settings</li>
              <li>Delete account</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-icon">👨‍💼</div>
            <h3>Manager</h3>
            <ul>
              <li>View call history</li>
              <li>Manage customers</li>
              <li>View analytics</li>
              <li>Invite team members</li>
              <li>Export reports</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-icon">👨‍💻</div>
            <h3>Agent</h3>
            <ul>
              <li>View assigned calls</li>
              <li>Update customer info</li>
              <li>View basic analytics</li>
              <li>Create notes</li>
              <li>Download recordings</li>
            </ul>
          </div>
          <div className="role-card">
            <div className="role-icon">👀</div>
            <h3>Viewer</h3>
            <ul>
              <li>View call history</li>
              <li>View customer records</li>
              <li>View basic reports</li>
              <li>Download files</li>
              <li>Read-only access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>Invite Team Member</h2>
              <button 
                className="modal-close"
                onClick={() => setInviteModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form className="modal-form" onSubmit={handleInviteSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => handleInviteFormChange('email', e.target.value)}
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select 
                  value={inviteForm.role}
                  onChange={(e) => handleInviteFormChange('role', e.target.value)}
                >
                  <option value="agent">Agent</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Personal Message (Optional)</label>
                <textarea 
                  value={inviteForm.message}
                  onChange={(e) => handleInviteFormChange('message', e.target.value)}
                  placeholder="Add a personal message to the invitation..."
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setInviteModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
