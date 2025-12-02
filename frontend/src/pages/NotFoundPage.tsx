import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          {/* 404 Number Display */}
          <div className="not-found-number">
            <span className="number-4">4</span>
            <div className="number-0-wrapper">
              <AlertCircle size={120} className="number-0-icon" />
            </div>
            <span className="number-4">4</span>
          </div>

          {/* Main Message */}
          <h1 className="not-found-title">Page Not Found</h1>
          <p className="not-found-description">
            Oops! The page you're looking for seems to have wandered off into the digital void.
            <br />
            Don't worry, let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="not-found-actions">
            <button
              className="not-found-btn primary"
              onClick={() => navigate('/dashboard')}
            >
              <Home size={20} />
              Go to Dashboard
            </button>
            <button
              className="not-found-btn secondary"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="not-found-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;





