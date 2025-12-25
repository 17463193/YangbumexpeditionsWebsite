import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h1>Oops! Something Went Wrong</h1>
        <p className="error-message">
          We're having trouble loading the page you requested. Please try again later.
        </p>
        <div className="error-actions">
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-sync-alt"></i> Try Again
          </button>
          <Link to="/" className="home-button">
            <i className="fas fa-home"></i> Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;