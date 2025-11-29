import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Phone, Building2, Search, Filter, UserPlus, Clock, Car, DollarSign, Trash2, Edit2, AlertTriangle, Shield, LogOut } from 'lucide-react';
import { getAllBusinesses, assignPhoneNumber, removePhoneNumber, changeUserRole, BusinessData } from '../services/apis/authAPI';
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
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <div className="empty-state-content">
                      <Building2 size={48} className="empty-icon" />
                      <p>No businesses found</p>
                      <span>Try adjusting your search criteria</span>
                    </div>
                  </td>
                </tr>
              ) : (
              filteredBusinesses.map((business) => (
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
                        <Phone size={16} className="assigned-icon" />
                        <span>{business.assignedPhoneNumber}</span>
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
                    <button
                      className="view-more-btn"
                      onClick={() => handleViewMore(business)}
                    >
                      <Eye size={16} />
                      View More
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        )}
      </div>

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
    </div>
  );
};

export default AdminPage;

