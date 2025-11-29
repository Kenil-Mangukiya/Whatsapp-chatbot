import React, { useState, useEffect } from 'react';
import api from '../config/api';
import { Building2 } from 'lucide-react';

const Navbar = () => {
  const [businessName, setBusinessName] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
      return `https://ui-avatars.com/api/?name=Business&background=EE3227&color=fff&size=128&bold=true&font-size=0.5`;  
    }
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=EE3227&color=fff&size=128&bold=true&font-size=0.5`;
  };

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
            <div className="business-logo-display">
              <div 
                className="business-logo-btn"
                title={businessName || 'Business'}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
