import React, { useState } from 'react';

const CRMPage = ({ isActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Customers');
  const [insuranceFilter, setInsuranceFilter] = useState('All Insurance Companies');

  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('Searching for:', e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    console.log('Filter changed:', value);
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'insurance':
        setInsuranceFilter(value);
        break;
      default:
        break;
    }
  };

  const openAddCustomerModal = () => {
    alert('Add Customer modal would open here.\n\nIn production, this would show a form to add:\n- Customer name & contact\n- Insurance company & policy ID\n- Vehicle details\n- Issue description\n- Location information');
  };

  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      location: '📍 Mumbai, Maharashtra',
      insuranceCompany: 'ICICI Lombard',
      insuranceId: 'POL-2024-45678',
      vehicleInfo: 'MH-02-AX-1234',
      issueType: 'Tire Puncture',
      issueTypeClass: 'mechanical',
      date: 'Oct 22, 2025',
      time: '2:45 PM',
      status: 'Resolved',
      statusClass: 'resolved'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      location: '📍 Pune, Maharashtra',
      insuranceCompany: 'HDFC ERGO',
      insuranceId: 'POL-2024-78901',
      vehicleInfo: 'MH-12-BC-5678',
      issueType: 'Battery Dead',
      issueTypeClass: 'electrical',
      date: 'Oct 22, 2025',
      time: '1:20 PM',
      status: 'Pending Claim',
      statusClass: 'pending'
    }
  ];

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Customer Relationship Management</h1>
          <p>Manage customer records, track issues, and coordinate with insurance companies</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-secondary"
            onClick={openAddCustomerModal}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Add Customer
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleActionClick('Export to Insurance')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export to Insurance
          </button>
        </div>
      </div>

      <div className="crm-stats">
        <div className="crm-stat-card">
          <div className="crm-stat-icon" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="crm-stat-info">
            <div className="crm-stat-value">128</div>
            <div className="crm-stat-label">Total Customers</div>
          </div>
        </div>

        <div className="crm-stat-card">
          <div className="crm-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="crm-stat-info">
            <div className="crm-stat-value">45</div>
            <div className="crm-stat-label">Active Cases</div>
          </div>
        </div>

        <div className="crm-stat-card">
          <div className="crm-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="crm-stat-info">
            <div className="crm-stat-value">12</div>
            <div className="crm-stat-label">Pending Claims</div>
          </div>
        </div>

        <div className="crm-stat-card">
          <div className="crm-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div className="crm-stat-info">
            <div className="crm-stat-value">8</div>
            <div className="crm-stat-label">Insurance Partners</div>
          </div>
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
            placeholder="Search customers by name, phone, or insurance ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option>All Customers</option>
          <option>Active Cases</option>
          <option>Resolved Cases</option>
          <option>Pending Claims</option>
        </select>
        <select 
          className="filter-select"
          value={insuranceFilter}
          onChange={(e) => handleFilterChange('insurance', e.target.value)}
        >
          <option>All Insurance Companies</option>
          <option>ICICI Lombard</option>
          <option>HDFC ERGO</option>
          <option>Bajaj Allianz</option>
          <option>TATA AIG</option>
        </select>
      </div>

      <div className="crm-table-container">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Customer Details</th>
              <th>Insurance Info</th>
              <th>Issue Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <div className="customer-details">
                    <div className="customer-avatar">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-contact">{customer.phone}</div>
                      <div className="customer-location">{customer.location}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="insurance-info">
                    <div className="insurance-company">{customer.insuranceCompany}</div>
                    <div className="insurance-id">{customer.insuranceId}</div>
                    <div className="vehicle-info">{customer.vehicleInfo}</div>
                  </div>
                </td>
                <td>
                  <span className={`issue-type-badge ${customer.issueTypeClass}`}>
                    {customer.issueType}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <div>{customer.date}</div>
                    <div className="time-info">{customer.time}</div>
                  </div>
                </td>
                <td>
                  <span className={`crm-status ${customer.statusClass}`}>
                    {customer.status}
                  </span>
                </td>
                <td>
                  <div className="crm-actions">
                    <button 
                      className="icon-btn" 
                      title="View Details"
                      onClick={() => handleActionClick('View Details')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-btn" 
                      title="Edit"
                      onClick={() => handleActionClick('Edit')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-btn" 
                      title="Send to Insurance"
                      onClick={() => handleActionClick('Send to Insurance')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMPage;
