import React, { useState } from 'react';

interface SettingsPageProps {
  isActive?: boolean;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isActive }) => {
  const [saveStatus, setSaveStatus] = useState('Save Settings');
  const [settings, setSettings] = useState({
    voiceGender: 'female',
    language: 'english',
    responseTime: '2',
    autoTransfer: true,
    callRecording: true,
    emailNotifications: true,
    smsNotifications: false,
    businessName: 'RoadAI Assistant',
    businessPhone: '+91 98765 43210',
    businessEmail: 'support@roadai.com',
    businessAddress: '123 Business Street, Mumbai, Maharashtra 400001',
    aiPersonality: 'professional',
    greetingMessage: 'Hello! Thank you for calling. How can I assist you today?',
    fallbackMessage: 'I apologize, but I didn\'t understand that. Let me transfer you to a human representative.'
  });

  const handleSaveSettings = () => {
    setSaveStatus('Saving...');
    // Simulate save
    setTimeout(() => {
      setSaveStatus('Saved ✓');
      setTimeout(() => {
        setSaveStatus('Save Settings');
      }, 1500);
    }, 1000);
  };

  const handleSettingChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>AI Settings</h1>
          <p>Configure your AI agent's behavior, voice, and response patterns</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-primary save-settings"
            onClick={handleSaveSettings}
            disabled={saveStatus === 'Saving...'}
          >
            {saveStatus}
          </button>
        </div>
      </div>

      <div className="settings-container">
        <div className="settings-section">
          <h3>Voice & Language Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Voice Gender</label>
              <p>Choose the gender of your AI agent's voice</p>
            </div>
            <select 
              className="setting-input"
              value={settings.voiceGender}
              onChange={(e) => handleSettingChange('voiceGender', e.target.value)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Primary Language</label>
              <p>Select the primary language for your AI agent</p>
            </div>
            <select 
              className="setting-input"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="bengali">Bengali</option>
              <option value="tamil">Tamil</option>
              <option value="telugu">Telugu</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Response Time (seconds)</label>
              <p>How quickly should the AI respond to customer queries</p>
            </div>
            <input 
              type="number"
              className="setting-input"
              value={settings.responseTime}
              onChange={(e) => handleSettingChange('responseTime', e.target.value)}
              min="1"
              max="10"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>Call Handling Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Auto Transfer to Human</label>
              <p>Automatically transfer complex queries to human agents</p>
            </div>
            <label className="toggle-switch-setting">
              <input 
                type="checkbox"
                checked={settings.autoTransfer}
                onChange={(e) => handleSettingChange('autoTransfer', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Call Recording</label>
              <p>Record all calls for quality assurance and training</p>
            </div>
            <label className="toggle-switch-setting">
              <input 
                type="checkbox"
                checked={settings.callRecording}
                onChange={(e) => handleSettingChange('callRecording', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Email Notifications</label>
              <p>Receive email alerts for important events</p>
            </div>
            <label className="toggle-switch-setting">
              <input 
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>SMS Notifications</label>
              <p>Receive SMS alerts for urgent matters</p>
            </div>
            <label className="toggle-switch-setting">
              <input 
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Business Information</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>Business Name</label>
              <p>Your business name as it appears to customers</p>
            </div>
            <input 
              type="text"
              className="setting-input"
              value={settings.businessName}
              onChange={(e) => handleSettingChange('businessName', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Business Phone</label>
              <p>Your business phone number</p>
            </div>
            <input 
              type="tel"
              className="setting-input"
              value={settings.businessPhone}
              onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Business Email</label>
              <p>Your business email address</p>
            </div>
            <input 
              type="email"
              className="setting-input"
              value={settings.businessEmail}
              onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Business Address</label>
              <p>Your business address for customer reference</p>
            </div>
            <textarea 
              className="setting-textarea"
              value={settings.businessAddress}
              onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
              rows="3"
            />
          </div>
        </div>

        <div className="settings-section">
          <h3>AI Personality & Messages</h3>
          <div className="setting-item">
            <div className="setting-info">
              <label>AI Personality</label>
              <p>Choose the personality style of your AI agent</p>
            </div>
            <select 
              className="setting-input"
              value={settings.aiPersonality}
              onChange={(e) => handleSettingChange('aiPersonality', e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Greeting Message</label>
              <p>Customize the initial greeting message</p>
            </div>
            <textarea 
              className="setting-textarea"
              value={settings.greetingMessage}
              onChange={(e) => handleSettingChange('greetingMessage', e.target.value)}
              rows="3"
            />
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <label>Fallback Message</label>
              <p>Message when AI doesn't understand the query</p>
            </div>
            <textarea 
              className="setting-textarea"
              value={settings.fallbackMessage}
              onChange={(e) => handleSettingChange('fallbackMessage', e.target.value)}
              rows="3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
