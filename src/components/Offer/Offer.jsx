// components/Offer.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../../service/firebase';
import './Offer.css';

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch offers
        const offersRef = ref(db, 'offers');
        const offersSnapshot = await get(offersRef);
        const offersData = offersSnapshot.val() || {};
        setOffers(Object.values(offersData));

        // Fetch blogs
        const blogsRef = ref(db, 'blogs');
        const blogsSnapshot = await get(blogsRef);
        const blogsData = blogsSnapshot.val() || {};
        setBlogs(Object.values(blogsData));

        setLoading(false);
      } catch (err) {
        console.error("Realtime Database error:", err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="offer-container">
      <div className="offer-content-wrapper">
        {/* Hotel & Restaurants Section */}
        <div className="offer-section hotel-section">
          <h3 className="section-title">Hotel & Restaurants</h3>
          <div className="offer-grid">
            {offers.length > 0 ? (
              offers.map((offer, index) => (
                <Link
                  to={`/${offer.type}/${offer.id || index}`}
                  key={offer.id || index}
                  className="offer-card"
                >
                  <div className="offer-image-container">
                    <img
                      src={offer.img || '/images/default-offer.jpg'}
                      className="offer-image"
                      alt={offer.label}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-offer.jpg';
                      }}
                    />
                  </div>
                  <div className="offer-details">
                    <h4 className="offer-title">{offer.label}</h4>
                    {offer.details?.rating && (
                      <div className="offer-rating">⭐ {offer.details.rating}</div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results">No offers available at the moment.</p>
            )}
          </div>
        </div>

        {/* Blog Section */}
        <div className="offer-section blog-section">
          <h3 className="section-title">Latest Blog Posts</h3>
          <div className="blog-list">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <Link
                  to={`/blog/${blog.id || index}`}
                  key={blog.id || index}
                  className="blog-card"
                >
                  <div className="blog-image-container">
                    <img
                      src={blog.img || '/images/default-blog.jpg'}
                      className="blog-image"
                      alt="Blog"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/default-blog.jpg';
                      }}
                    />
                  </div>
                  <div className="blog-content">
                    <h4 className="blog-title">{blog.title}</h4>
                    <p className="blog-excerpt">{blog.content?.substring(0, 100)}...</p>
                    <div className="blog-meta">
                      <span className="blog-date">📅 {blog.date}</span>
                      {blog.details?.difficulty && (
                        <span className="blog-difficulty">🏔️ {blog.details.difficulty}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results">No blog posts available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;