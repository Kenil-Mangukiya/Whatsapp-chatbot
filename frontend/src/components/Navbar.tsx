import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#4F46E5" opacity="0.1"/>
            <path d="M20 10L26 16L20 22L14 16L20 10Z" fill="#4F46E5"/>
            <path d="M12 20C12 15.5817 15.5817 12 20 12V20H12Z" fill="#818CF8"/>
            <circle cx="20" cy="20" r="4" fill="#4F46E5"/>
          </svg>
          <span>RoadAI Assistant</span>
        </div>
        <div className="nav-actions">
          <button className="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div className="user-menu">
            <img src="https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff" alt="User" className="user-avatar" />
            <span>John Doe</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
