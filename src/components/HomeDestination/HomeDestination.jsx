import React, { useEffect, useState } from 'react';
import './HomeDestination.css';
import { Link } from 'react-router-dom';
import { db } from '../../service/firebase.js';
import { ref, get } from 'firebase/database';


const DestinationItem = ({ id, location, image, title, subtitle, rating = 5, tall = false }) => {
  const imageSrc = image || '/images/default-destination.jpg';

  return (
    <div className={`hd-destination-item ${tall ? 'hd-tall-item' : ''}`}>
      <div className="hd-image-container">
        <img
          src={imageSrc}
          alt={title || 'Destination image'}
          className="hd-destination-image"
          onError={(e) => {
            e.target.src = '/images/default-destination.jpg';
          }}
        />
        <div className="hd-location-tag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="currentColor"/>
          </svg>
          <span>{location}</span>
        </div>
        <div className="hd-destination-overlay">
          <div className="hd-overlay-content">
            <h3 className="hd-destination-title">{title}</h3>
            {subtitle && <p className="hd-destination-subtitle">{subtitle}</p>}
            <div className="hd-rating">
              {Array(Math.min(5, Math.max(1, rating))).fill('★').map((star, idx) => (
                <span key={idx} className="hd-star">{star}</span>
              ))}
            </div>
            <Link to={`/destinations/${encodeURIComponent(location)}`} className="hd-explore-btn">
              Explore Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomeDestination() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, 'destinations'));
      if (!snapshot.exists()) {
        setDestinations([]);
        setLoading(false);
        return;
      }

      const destinationsObject = snapshot.val();
      const destinationsData = Object.entries(destinationsObject).map(
        ([id, dest]) => ({
          id,
          location: dest.location || 'Unknown',
          header: {
            backgroundImage: dest.header?.backgroundImage || '',
            title: dest.header?.title || 'Destination',
            subtitle: dest.header?.subtitle || '',
          },
        })
      );

      setDestinations(destinationsData);
    } catch (err) {
      console.error("Error fetching destinations:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchDestinations();
}, []);


  // Filter and limit destinations
  const featuredDestinations = destinations
    .filter(dest => dest?.header && dest.header?.backgroundImage)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="hd-section">
        <div className="hd-loading-spinner"></div>
        <p>Loading destinations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hd-section">
        <div className="hd-error-message">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <section className="hd-section">
      <div className="hd-container">
        <div className="hd-header">
          <p className="hd-subtitle">Bhutan's Finest</p>
          <h2 className="hd-heading">Journey Through the Dragon Kingdom</h2>
        </div>

        {featuredDestinations.length > 0 ? (
          <>
            <div className="hd-destinations-layout">
              <div className="hd-left-column">
                <div className="hd-top-row">
                  {featuredDestinations.slice(0, 2).map((dest) => (
                    <div key={dest.id} className="hd-grid-item">
                      <DestinationItem
                        id={dest.id}
                        location={dest.location}
                        image={dest.header.backgroundImage}
                        title={dest.header.title}
                        subtitle={dest.header.subtitle}
                        rating={5}
                      />
                    </div>
                  ))}
                </div>
                <div className="hd-bottom-row">
                  {featuredDestinations.slice(2, 4).map((dest) => (
                    <div key={dest.id} className="hd-grid-item">
                      <DestinationItem
                        id={dest.id}
                        location={dest.location}
                        image={dest.header.backgroundImage}
                        title={dest.header.title}
                        subtitle={dest.header.subtitle}
                        rating={5}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="hd-right-column">
                {featuredDestinations[4] && (
                  <div className="hd-grid-item">
                    <DestinationItem
                      id={featuredDestinations[4].id}
                      location={featuredDestinations[4].location}
                      image={featuredDestinations[4].header.backgroundImage}
                      title={featuredDestinations[4].header.title}
                      subtitle={featuredDestinations[4].header.subtitle}
                      rating={5}
                      tall={true}
                    />
                  </div>
                )}
              </div>
            </div>

          </>
        ) : (
          <div className="hd-no-destinations">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <p>No featured destinations found.</p>
            <Link to="/destinations" className="hd-view-all-btn">
              Browse All Destinations
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}