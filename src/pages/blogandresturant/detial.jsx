// components/DetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import travelData from './detail.json';
import './detail.css';

const DetailPage = () => {
  const { type, id } = useParams();

  // Find the item in our data
  const item = type === 'blog' 
    ? travelData.blogs.find(item => item.id === id)
    : travelData.offers.find(item => item.id === id);

  if (!item) return <div className="dp-not-found">Item not found</div>;

  return (
    <div className="dp-container">
      {/* Header Section */}
      <header className="dp-header">
        <h1 className="dp-title">
          {type === 'blog' ? item.title : item.details.name}
        </h1>
        {type !== 'blog' && (
          <div className="dp-subtitle">
            {type === 'hotel' ? (
              <span className="dp-location">📍 {item.details.location}</span>
            ) : (
              <span className="dp-cuisine">🍽️ {item.details.cuisine}</span>
            )}
          </div>
        )}
      </header>

      {/* First Image */}
      {item.details.images?.[0] && (
        <section className="dp-gallery">
          <figure className="dp-gallery-item">
            <img
              src={item.details.images[0]}
              alt={`${item.label || item.title} 1`}
              className="dp-gallery-img"
            />
          </figure>
        </section>
      )}

      {/* About Section */}
      <main className="dp-main-content">
        <article className="dp-article">
          <section className="dp-about-section">
          <h2 className="dp-section-title">{item.details.name}</h2>

            <p className="dp-description">
              {item.details.description || item.content}
            </p>
          </section>
        </article>
      </main>

      {/* Second Image */}
      {item.details.images?.[1] && (
        <section className="dp-gallery">
          <figure className="dp-gallery-item">
            <img
              src={item.details.images[1]}
              alt={`${item.label || item.title} 2`}
              className="dp-gallery-img"
            />
          </figure>
        </section>
      )}

      {/* Additional Dynamic Sections */}
      {type === 'blog' && <BlogContent details={item.details} />}
      {type === 'hotel' && <HotelContent details={item.details} />}
      {type === 'restaurant' && <RestaurantContent details={item.details} />}
    </div>
  );
};

// Blog Specific Content
const BlogContent = ({ details }) => (
  <>
    {/* Show Trek Details only if difficulty or distance exists */}
    {(details.difficulty || details.distance || details.elevationGain) && (
      <section className="dp-trek-section">
        <h2 className="dp-section-title">Trek Details</h2>
        <div className="dp-info-grid">
          {details.difficulty && (
            <div className="dp-info-card">
              <span className="dp-info-label">Difficulty:</span>
              <span className="dp-info-value">{details.difficulty}</span>
            </div>
          )}
          {details.distance && (
            <div className="dp-info-card">
              <span className="dp-info-label">Distance:</span>
              <span className="dp-info-value">{details.distance}</span>
            </div>
          )}
          {details.elevationGain && (
            <div className="dp-info-card">
              <span className="dp-info-label">Elevation Gain:</span>
              <span className="dp-info-value">{details.elevationGain}</span>
            </div>
          )}
        </div>
      </section>
    )}

    {/* Always show full content */}
    <section className="dp-experience-section">
      <h2 className="dp-section-title">Full Experience</h2>
      <p className="dp-full-content">{details.fullContent}</p>
    </section>

    {/* Show Best Festivals only if they exist */}
    {details.bestFestivals && (
      <section className="dp-festivals-section">
        <h2 className="dp-section-title">Best Festivals</h2>
        <ul className="dp-festivals-list">
          {details.bestFestivals.map((festival, index) => (
            <li key={index} className="dp-festival-item">{festival}</li>
          ))}
        </ul>
      </section>
    )}

    {/* Optional: Handle other blog-specific content like topCrafts */}
    {details.topCrafts && (
      <section className="dp-crafts-section">
        <h2 className="dp-section-title">Top Crafts</h2>
        <ul className="dp-crafts-list">
          {details.topCrafts.map((craft, index) => (
            <li key={index} className="dp-craft-item">{craft}</li>
          ))}
        </ul>
      </section>
    )}
  </>
);

// Hotel Specific Content
const HotelContent = ({ details }) => (
  <>
    <section className="dp-facilities-section">
      <h2 className="dp-section-title">Amenities</h2>
      <ul className="dp-facilities-list">
        {details.facilities.map((facility, index) => (
          <li key={index} className="dp-facility-item">
            <span className="dp-facility-icon">✓</span>
            {facility}
          </li>
        ))}
      </ul>
    </section>

    <section className="dp-rooms-section">
      <h2 className="dp-section-title">Rooms</h2>
      <div className="dp-rooms-grid">
        {details.rooms.map((room, index) => (
          <div key={index} className="dp-room-card">
            <h3 className="dp-room-type">{room.type}</h3>
            <ul className="dp-amenities-list">
              {room.amenities.map((amenity, i) => (
                <li key={i} className="dp-amenity-item">{amenity}</li>
              ))}
            </ul>
            <div className="dp-room-price">${room.price}/night</div>
          </div>
        ))}
      </div>
    </section>
  </>
);

// Restaurant Specific Content
const RestaurantContent = ({ details }) => (
  <>
    <section className="dp-dishes-section">
      <h2 className="dp-section-title">Signature Dishes</h2>
      <ul className="dp-dishes-list">
        {details.signatureDishes.map((dish, index) => (
          <li key={index} className="dp-dish-item">
            <span className="dp-dish-icon">🍽️</span>
            {dish}
          </li>
        ))}
      </ul>
    </section>

    <div className="dp-restaurant-info">
      
      <div className="dp-price-card">
        <h3 className="dp-info-title">Price Range</h3>
        <p className="dp-price-text">{details.priceRange}</p>
      </div>
    </div>
  </>
);

export default DetailPage;
