// src/components/Loading/Loading.js
import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './LoadingPage.css';

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <FaSpinner className="loading-spinner" />
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default Loading;