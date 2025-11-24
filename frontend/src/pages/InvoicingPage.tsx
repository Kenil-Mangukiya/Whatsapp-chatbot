import React from 'react';

const InvoicingPage = ({ isActive }) => {
  const handleActionClick = (action) => {
    console.log('Action clicked:', action);
    alert(`"${action}" feature will be fully functional in production!`);
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="page-header">
        <div>
          <h1>Invoicing & Billing</h1>
          <p>Manage invoices, track payments, and coordinate with insurance companies</p>
        </div>
        <div className="page-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => handleActionClick('Generate Invoice')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            Generate Invoice
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

      <div className="invoice-summary">
        <div className="summary-card">
          <div className="summary-header">
            <h3>Monthly Summary</h3>
            <span className="summary-period">October 2025</span>
          </div>
          <div className="summary-stats">
            <div className="summary-item">
              <div className="summary-label">Total Invoices</div>
              <div className="summary-value">24</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Amount Billed</div>
              <div className="summary-value">₹1,24,500</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Amount Received</div>
              <div className="summary-value">₹98,200</div>
            </div>
            <div className="summary-item">
              <div className="summary-label">Pending Amount</div>
              <div className="summary-value">₹26,300</div>
            </div>
          </div>
        </div>
      </div>

      <div className="insurance-companies-grid">
        <div className="insurance-card">
          <div className="insurance-card-header">
            <div className="insurance-logo">IC</div>
            <div className="insurance-details">
              <h3>ICICI Lombard</h3>
              <div className="partner-code">Partner Code: IC001</div>
            </div>
            <button className="btn btn-sm btn-secondary">View Details</button>
          </div>
          <div className="insurance-stats-grid">
            <div className="insurance-stat">
              <div className="stat-label">Cases</div>
              <div className="stat-value">12</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Amount</div>
              <div className="stat-value">₹45,600</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Paid</div>
              <div className="stat-value">₹38,200</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Status</div>
              <div className="payment-status paid">Paid</div>
            </div>
          </div>
          <div className="case-types">
            <span className="case-type-tag">Tire Puncture</span>
            <span className="case-type-tag">Battery</span>
            <span className="case-type-tag">Towing</span>
          </div>
        </div>

        <div className="insurance-card">
          <div className="insurance-card-header">
            <div className="insurance-logo">HE</div>
            <div className="insurance-details">
              <h3>HDFC ERGO</h3>
              <div className="partner-code">Partner Code: HE002</div>
            </div>
            <button className="btn btn-sm btn-secondary">View Details</button>
          </div>
          <div className="insurance-stats-grid">
            <div className="insurance-stat">
              <div className="stat-label">Cases</div>
              <div className="stat-value">8</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Amount</div>
              <div className="stat-value">₹32,400</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Paid</div>
              <div className="stat-value">₹28,100</div>
            </div>
            <div className="insurance-stat">
              <div className="stat-label">Status</div>
              <div className="payment-status pending">Pending</div>
            </div>
          </div>
          <div className="case-types">
            <span className="case-type-tag">Electrical</span>
            <span className="case-type-tag">Mechanical</span>
          </div>
        </div>
      </div>

      <div className="detailed-invoice-section">
        <div className="section-header-invoice">
          <h2>Recent Invoices</h2>
          <p>Detailed breakdown of recent billing activity</p>
        </div>
        <div className="invoice-table-container">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Insurance Co.</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>INV-2025-001</td>
                <td>Rajesh Kumar</td>
                <td>ICICI Lombard</td>
                <td>₹3,200</td>
                <td>Oct 22, 2025</td>
                <td>
                  <span className="invoice-status completed">Paid</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-action" 
                      title="View Invoice"
                      onClick={() => handleActionClick('View Invoice')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-action" 
                      title="Download"
                      onClick={() => handleActionClick('Download')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>INV-2025-002</td>
                <td>Priya Sharma</td>
                <td>HDFC ERGO</td>
                <td>₹2,800</td>
                <td>Oct 22, 2025</td>
                <td>
                  <span className="invoice-status pending">Pending</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="icon-action" 
                      title="View Invoice"
                      onClick={() => handleActionClick('View Invoice')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button 
                      className="icon-action" 
                      title="Download"
                      onClick={() => handleActionClick('Download')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoicingPage;
