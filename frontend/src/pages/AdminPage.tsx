import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Phone, Building2, Search, Filter, UserPlus, Clock, Car, DollarSign, Trash2, Edit2, AlertTriangle, Shield, LogOut, Bot, LogIn } from 'lucide-react';
import { getAllBusinesses, assignPhoneNumber, removePhoneNumber, changeUserRole, BusinessData, adminLoginAsUser } from '../services/apis/authAPI';
import api from '../config/api';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [assignPhoneModal, setAssignPhoneModal] = useState<BusinessData | null>(null);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<BusinessData | null>(null);
  const [showAgentSetupModal, setShowAgentSetupModal] = useState<BusinessData | null>(null);
  const [showLoginConfirmModal, setShowLoginConfirmModal] = useState<BusinessData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Fetch current admin user ID
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response: any = await api.get('/user/me');
        const user = response?.data?.user || response?.user;
        if (user?.id) {
          setCurrentAdminId(user.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Fetch businesses from API
  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await getAllBusinesses();
      if (response.data) {
        setBusinesses(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching businesses:', error);
      toast.error(error.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  };

  // Filter businesses based on search
  const filteredBusinesses = businesses.filter(business =>
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.phoneNumber.includes(searchTerm) ||
    business.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (business.serviceArea && business.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBusinesses.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredBusinesses.slice(indexOfFirstRecord, indexOfLastRecord);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    const tableContainer = document.querySelector('.admin-table-container');
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  };

  // Handle view more details
  const handleViewMore = (business: BusinessData) => {
    setSelectedBusiness(business);
    setShowDetailsModal(true);
  };

  // Handle assign phone number
  const handleAssignPhone = (business: BusinessData) => {
    setAssignPhoneModal(business);
    setNewPhoneNumber(business.assignedPhoneNumber || '');
  };

  // Format phone number utility for Indian numbers
  // Normalizes inputs to +91XXXXXXXXXX:
  //  - +919904665554   -> +919904665554 (kept)
  //  - 9904665554     -> +919904665554
  //  - 919904665554   -> +919904665554
  //  - +912269539280  -> +912269539280 (kept, landline style allowed)
  const formatPhoneNumber = (phoneNumber: string): string | null => {
    if (!phoneNumber) return null;
    
    // Remove spaces, dashes, brackets but keep leading + if present
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const digitsOnly = cleaned.replace(/\D/g, '');
    
    // Case 1: already +91XXXXXXXXXX
    if (/^\+91\d{10}$/.test(cleaned)) {
      return cleaned;
    }
    
    // Case 2: 91XXXXXXXXXX (12 digits, no +)
    if (/^91\d{10}$/.test(digitsOnly)) {
      return `+${digitsOnly}`;
    }
    
    // Case 3: 10-digit mobile starting with 6–9
    if (/^[6-9]\d{9}$/.test(digitsOnly)) {
      return `+91${digitsOnly}`;
    }
    
    return null;
  };

  // Validate Indian phone number
  const validatePhoneNumber = (phoneNumber: string): { valid: boolean; message?: string; formatted?: string } => {
    if (!phoneNumber || !phoneNumber.trim()) {
      return { valid: false, message: 'Phone number is required' };
    }
    
    const formatted = formatPhoneNumber(phoneNumber);
    if (!formatted) {
      return { valid: false, message: 'Invalid Indian phone number format. Please enter a 10-digit mobile or +91XXXXXXXXXX.' };
    }
    
    if (!/^\+91\d{10}$/.test(formatted)) {
      return { valid: false, message: 'Invalid Indian phone number format. Must be +91 followed by 10 digits.' };
    }
    
    return { valid: true, formatted };
  };

  // Save assigned phone number
  const handleSavePhoneNumber = async () => {
    if (!assignPhoneModal || !newPhoneNumber.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    // Validate phone number
    const validation = validatePhoneNumber(newPhoneNumber);
    if (!validation.valid) {
      toast.error(validation.message || 'Invalid phone number');
      return;
    }

    try {
      await assignPhoneNumber({
        businessId: assignPhoneModal.id,
        phoneNumber: validation.formatted!
      });

      // Update local state
      setBusinesses(prev =>
        prev.map(business =>
          business.id === assignPhoneModal.id
            ? { ...business, assignedPhoneNumber: validation.formatted! }
            : business
        )
      );

      toast.success('Phone number assigned successfully');
      setAssignPhoneModal(null);
      setNewPhoneNumber('');
    } catch (error: any) {
      console.error('Error assigning phone number:', error);
      toast.error(error.message || 'Failed to assign phone number');
    }
  };

  // Handle edit phone number
  const handleEditPhoneNumber = (business: BusinessData) => {
    setAssignPhoneModal(business);
    setNewPhoneNumber(business.assignedPhoneNumber || '');
  };

  // Handle delete phone number - show confirmation modal
  const handleDeletePhoneNumber = (business: BusinessData) => {
    setDeleteConfirmModal(business);
  };

  // Confirm delete phone number
  const confirmDeletePhoneNumber = async () => {
    if (!deleteConfirmModal) return;

    try {
      await removePhoneNumber({
        businessId: deleteConfirmModal.id
      });

      // Update local state
      setBusinesses(prev =>
        prev.map(b =>
          b.id === deleteConfirmModal.id
            ? { ...b, assignedPhoneNumber: null }
            : b
        )
      );

      toast.success('Phone number removed successfully');
      setDeleteConfirmModal(null);
    } catch (error: any) {
      console.error('Error removing phone number:', error);
      toast.error(error.message || 'Failed to remove phone number');
    }
  };

  // Handle role change
  const handleRoleChange = async (business: BusinessData, newRole: 'user' | 'admin') => {
    // Prevent admin from changing their own role
    if (business.id === currentAdminId) {
      toast.error('You cannot change your own role');
      return;
    }

    try {
      await changeUserRole({
        businessId: business.id,
        newRole
      });

      // Update local state
      setBusinesses(prev =>
        prev.map(b =>
          b.id === business.id
            ? { ...b, role: newRole }
            : b
        )
      );

      toast.success(`Role updated to ${newRole}`);
    } catch (error: any) {
      console.error('Error changing role:', error);
      toast.error(error.message || 'Failed to change role');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time (HH:MM:SS to HH:MM)
  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not set';
    // Handle both HH:MM:SS and HH:MM formats
    const time = timeString.includes(':') ? timeString.substring(0, 5) : timeString;
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Format price
  const formatPrice = (price: string | number) => {
    if (!price) return '₹0';
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return '₹0';
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      toast.success('Logged out successfully');
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  // Check if agent setup is complete
  const isAgentSetupComplete = (business: BusinessData): boolean => {
    if (!business.agentSetup) return false;
    const setup = business.agentSetup;
    return !!(
      setup.agentName ||
      setup.agentVoice ||
      setup.agentLanguage ||
      setup.welcomeMessage ||
      setup.agentFlow ||
      setup.customerDetails ||
      setup.transferCall ||
      setup.endingMessage
    );
  };

  // Handle login as user - show confirmation modal
  const handleLoginAsUser = (business: BusinessData) => {
    setShowLoginConfirmModal(business);
  };

  // Confirm login as user
  const confirmLoginAsUser = async () => {
    if (!showLoginConfirmModal) return;
    
    const business = showLoginConfirmModal;
    setShowLoginConfirmModal(null);
    
    try {
      // Store admin session info before logging in as user
      // Also store the current auth token so we can restore it later
      const adminSession = {
        isAdminSession: true,
        adminId: currentAdminId,
        timestamp: Date.now(),
        returnUrl: '/admin'
      };
      localStorage.setItem('adminSession', JSON.stringify(adminSession));
      
      await adminLoginAsUser({ userId: business.id });
      toast.success(`Logged in as ${business.businessName}`);
      // Navigate to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error logging in as user:', error);
      toast.error(error.message || 'Failed to login as user');
    }
  };

  // Handle view agent setup details
  const handleViewAgentSetup = (business: BusinessData) => {
    const isComplete = isAgentSetupComplete(business);
    if (isComplete) {
      // Show modal with agent setup details
    setShowAgentSetupModal(business);
    } else {
      // Navigate to agent setup page with userId
      navigate(`/agent-setup?userId=${business.id}`);
    }
  };

  return (
    <div className="page-content active admin-page-wrapper">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Business Administration</h1>
          <p className="admin-subtitle">Manage and monitor all registered businesses</p>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
        <div className="admin-stats">
          <div className="admin-stat-card">
            <Building2 size={20} className="stat-icon" />
            <div>
              <div className="stat-value">{businesses.length}</div>
              <div className="stat-label">Total Businesses</div>
            </div>
          </div>
          <div className="admin-stat-card">
            <Phone size={20} className="stat-icon" />
            <div>
              <div className="stat-value">
                {businesses.filter(b => b.assignedPhoneNumber).length}
              </div>
              <div className="stat-label">Assigned Numbers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="admin-search-bar">
        <div className="search-input-wrapper">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by business name, phone, owner name, or service area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="filter-btn">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Business Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>Loading businesses...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registered At</th>
                <th>Business Name</th>
                <th>Phone Number</th>
                <th>Assigned Phone Number</th>
                <th>Service Area</th>
                <th>Agent Setup</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <div className="empty-state-content">
                      <Building2 size={48} className="empty-icon" />
                      <p>No businesses found</p>
                      <span>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
              currentRecords.map((business) => (
                <tr key={business.id}>
                  <td>
                    <div className="registered-date-cell">
                      {formatDate(business.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="business-name-cell">
                      <div>
                        <div className="business-name">{business.businessName}</div>
                        <div className="business-owner">{business.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="phone-cell">
                      <Phone size={16} />
                      <span>{business.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    {business.assignedPhoneNumber ? (
                      <div className="assigned-phone-cell">
                        <div className="phone-number-display">
                          <Phone size={16} className="assigned-icon" />
                          <span>{business.assignedPhoneNumber}</span>
                        </div>
                        <div className="phone-actions">
                          <button
                            className="edit-phone-btn"
                            onClick={() => handleEditPhoneNumber(business)}
                            title="Edit phone number"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            className="delete-phone-btn"
                            onClick={() => handleDeletePhoneNumber(business)}
                            title="Remove phone number"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="assign-phone-btn"
                        onClick={() => handleAssignPhone(business)}
                      >
                        <UserPlus size={16} />
                        Assign Number
                      </button>
                    )}
                  </td>
                  <td>
                    <span className="service-area-badge">
                      {business.serviceArea || 'Not specified'}
                    </span>
                  </td>
                  <td>
                    <div className="agent-setup-cell">
                      {business.agentSetup && isAgentSetupComplete(business) ? (
                        <span
                          className="agent-setup-status complete"
                          onClick={() => handleViewAgentSetup(business)}
                          title="Click to view agent setup details"
                          style={{ cursor: 'pointer' }}
                        >
                          Complete
                        </span>
                      ) : (
                        <span
                          className="agent-setup-status not-configured"
                          title="Agent setup not configured"
                        >
                          Not Configured
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="role-select-wrapper">
                      <select
                        className={`role-select ${business.role === 'admin' ? 'role-admin' : 'role-user'}`}
                        value={business.role || 'user'}
                        onChange={(e) => handleRoleChange(business, e.target.value as 'user' | 'admin')}
                        disabled={business.id === currentAdminId}
                        title={business.id === currentAdminId ? 'You cannot change your own role' : 'Change user role'}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      {business.role === 'admin' && (
                        <Shield size={14} className="admin-icon" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="view-more-btn"
                        onClick={() => handleViewMore(business)}
                        title="View business details"
                      >
                        <Eye size={16} />
                        View More
                      </button>
                      <button
                        className="login-as-user-btn"
                        onClick={() => handleLoginAsUser(business)}
                        title="Login as this user"
                      >
                        <LogIn size={16} />
                        Login
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredBusinesses.length > 0 && totalPages > 1 && (
        <div className="admin-pagination">
          <div className="pagination-info">
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredBusinesses.length)} of {filteredBusinesses.length} businesses
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="pagination-ellipsis">...</span>;
                }
                return null;
              })}
            </div>
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View More Details Modal */}
      {showDetailsModal && selectedBusiness && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Business Details</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Business Name</label>
                    <p>{selectedBusiness.businessName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Owner Name</label>
                    <p>{selectedBusiness.fullName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone Number</label>
                    <p>{selectedBusiness.phoneNumber}</p>
                  </div>
                  <div className="detail-item">
                    <label>Assigned Phone Number</label>
                    <p>{selectedBusiness.assignedPhoneNumber || 'Not assigned'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Registered On</label>
                    <p>{formatDate(selectedBusiness.createdAt)}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedBusiness.email || 'Not provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Service Area</label>
                    <p>{selectedBusiness.serviceArea || 'Not specified'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Business Size</label>
                    <p>{selectedBusiness.businessSize || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Business Hours Section */}
              {(selectedBusiness.startTime || selectedBusiness.endTime) && (
                <div className="detail-section">
                  <h3>
                    <Clock size={20} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Business Hours
                  </h3>
                  <div className="business-hours-display">
                    <div className="hours-item">
                      <span className="hours-label">Start Time</span>
                      <span className="hours-value">{formatTime(selectedBusiness.startTime)}</span>
                    </div>
                    <div className="hours-separator">→</div>
                    <div className="hours-item">
                      <span className="hours-label">End Time</span>
                      <span className="hours-value">{formatTime(selectedBusiness.endTime)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Types & Pricing Section */}
              {selectedBusiness.vehicleTypes && Array.isArray(selectedBusiness.vehicleTypes) && selectedBusiness.vehicleTypes.length > 0 && (
                <div className="detail-section">
                  <h3>
                    <Car size={20} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Vehicle Types & Pricing
                  </h3>
                  <div className="vehicle-types-container">
                    {selectedBusiness.vehicleTypes.map((vehicle: any, index: number) => (
                      <div key={index} className="vehicle-type-card">
                        <div className="vehicle-type-header">
                          <Car size={18} />
                          <h4>{vehicle.vehicleType || `Vehicle Type ${index + 1}`}</h4>
                        </div>

                        {/* Services List */}
                        {vehicle.services && Array.isArray(vehicle.services) && vehicle.services.length > 0 && (
                          <div className="services-list">
                            <div className="services-header">
                              <span>Services & Pricing</span>
                            </div>
                            {vehicle.services.map((service: any, serviceIndex: number) => (
                              <div key={serviceIndex} className="service-item">
                                <div className="service-name">
                                  <DollarSign size={16} />
                                  <span>{service.serviceName}</span>
                                </div>
                                <div className="service-pricing">
                                  <div className="price-tag day">
                                    <span className="price-label">Day</span>
                                    <span className="price-value">{formatPrice(service.dayPrice)}</span>
                                  </div>
                                  <div className="price-tag night">
                                    <span className="price-label">Night</span>
                                    <span className="price-value">{formatPrice(service.nightPrice)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Per KM Charge */}
                        {vehicle.kmRate && (
                          <div className="km-rate-section">
                            <div className="km-rate-label">
                              <DollarSign size={16} />
                              <span>Per KM Charge</span>
                            </div>
                            <div className="km-rate-value">{formatPrice(vehicle.kmRate)}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Vehicle Types Message */}
              {(!selectedBusiness.vehicleTypes || !Array.isArray(selectedBusiness.vehicleTypes) || selectedBusiness.vehicleTypes.length === 0) && (
                <div className="detail-section">
                  <h3>
                    <Car size={20} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Vehicle Types & Pricing
                  </h3>
                  <div className="no-data-message">
                    <Car size={32} className="no-data-icon" />
                    <p>No vehicle types configured yet</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              {!selectedBusiness.assignedPhoneNumber && (
                <button
                  className="modal-btn primary"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleAssignPhone(selectedBusiness);
                  }}
                >
                  <UserPlus size={16} />
                  Assign Phone Number
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Phone Number Modal */}
      {assignPhoneModal && (
        <div className="modal-overlay" onClick={() => setAssignPhoneModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Phone Number</h2>
              <button
                className="modal-close-btn"
                onClick={() => setAssignPhoneModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="assign-phone-section">
                <div className="business-info-card">
                  <Building2 size={24} />
                  <div>
                    <h4>{assignPhoneModal.businessName}</h4>
                    <p>{assignPhoneModal.fullName}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="XXXXXXXXXX or +91XXXXXXXXXX or 91XXXXXXXXXX"
                    className="phone-input"
                  />
                  <p className="form-hint">
                    Enter the phone number (10 digits, +91XXXXXXXXXX, or 91XXXXXXXXXX). 
                    {newPhoneNumber && formatPhoneNumber(newPhoneNumber) && (
                      <span className="formatted-phone">Formatted: {formatPhoneNumber(newPhoneNumber)}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setAssignPhoneModal(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={handleSavePhoneNumber}
                disabled={!newPhoneNumber.trim()}
              >
                <Phone size={16} />
                Assign Number
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmModal(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">
              <Trash2 size={48} />
            </div>
            <h2>Delete Assigned Phone Number</h2>
            <p className="delete-confirm-message">
              Are you sure you want to remove the assigned phone number from
              <strong> "{deleteConfirmModal.businessName}"</strong>?
            </p>
            <p className="delete-confirm-warning">
              <AlertTriangle size={16} />
              This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button
                className="delete-confirm-btn cancel"
                onClick={() => setDeleteConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn delete"
                onClick={confirmDeletePhoneNumber}
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Setup Details Modal */}
      {showAgentSetupModal && showAgentSetupModal.agentSetup && (
        <div className="modal-overlay" onClick={() => setShowAgentSetupModal(null)}>
          <div className="modal-content agent-setup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Agent Setup Details - {showAgentSetupModal.businessName}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowAgentSetupModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
                <div className="agent-setup-details">
                  <div className="detail-section">
                    <h3>Agent Configuration</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <label>Agent Name</label>
                      <p>{showAgentSetupModal.agentSetup?.agentName || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item">
                        <label>Agent Voice</label>
                        <p>
                        {showAgentSetupModal.agentSetup?.agentVoice ? (
                            <span className="badge">{showAgentSetupModal.agentSetup.agentVoice === 'male' ? 'Male' : 'Female'}</span>
                          ) : (
                            <span className="not-filled">Not filled</span>
                          )}
                        </p>
                      </div>
                      <div className="detail-item">
                        <label>Agent Language</label>
                      <p>{showAgentSetupModal.agentSetup?.agentLanguage || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item">
                        <label>Welcome Message</label>
                      <p>{showAgentSetupModal.agentSetup?.welcomeMessage || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Agent Flow</label>
                      <p>{showAgentSetupModal.agentSetup?.agentFlow || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Customer Details Required</label>
                      <p>{showAgentSetupModal.agentSetup?.customerDetails || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Transfer Call Conditions</label>
                      <p>{showAgentSetupModal.agentSetup?.transferCall || <span className="not-filled">Not filled</span>}</p>
                      </div>
                      <div className="detail-item full-width">
                        <label>Ending Message</label>
                      <p>{showAgentSetupModal.agentSetup?.endingMessage || <span className="not-filled">Not filled</span>}</p>
                      </div>
                    </div>
                  </div>
                  <div className="detail-section">
                    <h3>Setup Status</h3>
                    <div className="status-summary">
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={isAgentSetupComplete(showAgentSetupModal) ? 'status-complete' : 'status-incomplete'}>
                        {isAgentSetupComplete(showAgentSetupModal) ? 'Complete' : 'Incomplete'}
                        </span>
                      </p>
                      <p>
                      <strong>Created:</strong> {showAgentSetupModal.agentSetup?.createdAt ? formatDate(showAgentSetupModal.agentSetup.createdAt) : 'N/A'}
                      </p>
                      <p>
                      <strong>Last Updated:</strong> {showAgentSetupModal.agentSetup?.updatedAt ? formatDate(showAgentSetupModal.agentSetup.updatedAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
            <div className="modal-footer">
              <button
                className="modal-btn secondary"
                onClick={() => setShowAgentSetupModal(null)}
              >
                Close
              </button>
              <button
                className="modal-btn primary"
                onClick={() => {
                  setShowAgentSetupModal(null);
                  navigate(`/update-agent-setup?userId=${showAgentSetupModal.id}`);
                }}
              >
                <Edit2 size={16} />
                Edit Agent Setup
              </button>
            </div>
          </div>
                </div>
              )}

      {/* Login Confirmation Modal */}
      {showLoginConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowLoginConfirmModal(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon" style={{ background: '#3b82f6', color: 'white' }}>
              <LogIn size={48} />
            </div>
            <h2>Login as User</h2>
            <p className="delete-confirm-message">
              Are you sure you want to login as
              <strong> "{showLoginConfirmModal.businessName}"</strong>?
            </p>
            <p className="delete-confirm-warning" style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>
              <AlertTriangle size={16} />
              You will be logged in as this user. Use "Back to Admin" button to return.
            </p>
            <div className="delete-confirm-actions">
              <button
                className="delete-confirm-btn cancel"
                onClick={() => setShowLoginConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                className="delete-confirm-btn delete"
                onClick={confirmLoginAsUser}
                style={{ background: '#3b82f6', borderColor: '#3b82f6' }}
              >
                <LogIn size={18} />
                Login
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;

