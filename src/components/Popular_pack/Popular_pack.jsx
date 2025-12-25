import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Popular_pack.css';
import { ref, get } from 'firebase/database';
import { db } from '../../service/firebase'; // Adjust path if needed


// const API_BASE_URL = 'http://localhost:5000/api/packages';

const PopularPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchPackages = async () => {
    setLoading(true);
    setError(null);

    try {
      const snapshot = await get(ref(db, 'packages'));

      if (!snapshot.exists()) {
        throw new Error('No packages found.');
      }

      const packagesData = Object.entries(snapshot.val()).map(([key, value]) => ({
        id: key,
        ...value,
      }));

      console.log('Fetched packages:', packagesData); // ✅

      // Remove filter for now
      const popular = packagesData.slice(0, 6);

      setPackages(popular);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchPackages();
}, []);


  if (loading) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading popular packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xxl py-5">
        <div className="container text-center text-danger">
          <p>Error loading packages: {error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xxl py-5" id="popular-packages">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <p className="hd-subtitle">Bhutan's Finest</p>
          <h2 className="hd-heading">Explore More About Bhutan.</h2>
          <div className="title-underline"></div>
        </div>
        <div className="container py-3">
          {packages.length > 0 ? (
            <div className="row g-4">
              {packages.map((pkg) => (
                <div className="col-md-6 col-lg-4" key={pkg.id}>
                  <div className="tour-card">
                    <img 
                      src={pkg.mainImage || '/images/default-package.jpg'} 
                      alt={pkg.title} 
                      className="tour-img" 
                    />
                    <div className="tour-img-overlay"></div>
                    <div className="tour-name">{pkg.title}</div>
                    <div className="tour-description-overlay">
                      <p>{pkg.description}</p>
                    </div>
                    <Link to={`/package/${pkg.id}`} className="explore-btn">
                      Explore More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p>No popular packages available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularPackages;