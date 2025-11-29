import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { Building2, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: any = await api.get('/user/me');
        const user = response?.data?.user || response?.user;
        if (user?.businessName) {
          setBusinessName(user.businessName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Generate business logo initials
  const getBusinessInitials = (name: string): string => {
    if (!name) return 'BS'; // Business default
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate business logo URL or use initials
  const getBusinessLogo = (name: string): string => {
    if (!name) {
      return `https://ui-avatars.com/api/?name=Business&background=4F46E5&color=fff&size=128&bold=true&font-size=0.5`;
    }
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=fff&size=128&bold=true&font-size=0.5`;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      toast.success('Logged out successfully');
      // Clear any local storage if needed
      localStorage.clear();
      // Navigate to login page
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage and redirect
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <div className="logo">
          <img
            src="/html/Untitled-2-04.webp"
            alt="RoadAI Assistant"
            className="app-logo-image"
          />
          <span className="logo-text">RoadAI Assistant</span>
        </div>
        <div className="nav-actions">
          {!loading && (
            <div className="business-logo-dropdown" ref={dropdownRef}>
              <button 
                className="business-logo-btn"
                title={businessName || 'Business'}
                onClick={() => setShowDropdown(!showDropdown)}
                onMouseEnter={() => setShowDropdown(true)}
              >
                {businessName ? (
                  <div className="business-logo-container">
                    <img 
                      src={getBusinessLogo(businessName)} 
                      alt={businessName}
                      className="business-logo-image"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="business-logo-fallback" style={{ display: 'none' }}>
                      {getBusinessInitials(businessName)}
                    </div>
                  </div>
                ) : (
                  <div className="business-logo-container">
                    <div className="business-logo-fallback">
                      <Building2 size={20} />
                    </div>
                  </div>
                )}
              </button>
              
              {showDropdown && (
                <div className="business-dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/update-setup');
                    }}
                  >
                    <User size={18} />
                    <span>View Business Profile</span>
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
