import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Heart, MapPin, Clock, 
  DollarSign, Calendar, Star, Share2, Users 
} from 'lucide-react';
import axios from 'axios';
import './AttractionDetails.css';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loading from '../LoadingPage/LoadingPage';

// Simple cache implementation
const attractionCache = new Map();

// Rating stars component (moved outside main component)
const renderRatingStars = (rating) => {
  return Array(5).fill(0).map((_, i) => {
    const starValue = i + 1;
    let starClass = 'ad-empty';
    if (rating >= starValue) starClass = 'ad-filled';
    else if (rating >= starValue - 0.5) starClass = 'ad-half';

    return (
      <Star
        key={`star-${i}`}
        className={`ad-rating-star ${starClass}`}
        size={16}
        fill={starClass === 'ad-filled' ? 'currentColor' : 'none'}
      />
    );
  });
};

const AttractionDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [data, setData] = useState({
    attraction: state?.attraction || null,
    loading: !state?.attraction,
    error: null,
    retryCount: 0
  });
  
  const [uiState, setUiState] = useState({
    isFavorite: false,
    currentImageIndex: 0
  });

  const fetchAttraction = useCallback(async () => {
    // Check cache first
    if (attractionCache.has(id)) {
      setData(prev => ({
        ...prev,
        attraction: attractionCache.get(id),
        loading: false
      }));
      return;
    }

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await axios.get(`/api/attractions/${id}`, {
        timeout: 8000,
        headers: {
          'Cache-Control': 'max-age=300'
        }
      });

      if (response.data?.success) {
        const attractionData = response.data.data;
        attractionCache.set(id, attractionData);
        setData(prev => ({
          ...prev,
          attraction: attractionData,
          loading: false
        }));
      } else {
        throw new Error(response.data?.error || 'Invalid server response');
      }
    } catch (error) {
      console.error('Fetch error:', {
        error,
        config: error.config,
        response: error.response
      });

      if (data.retryCount < 2) {
        setTimeout(() => {
          setData(prev => ({
            ...prev,
            retryCount: prev.retryCount + 1
          }));
        }, 1000 * (data.retryCount + 1));
      } else {
        setData(prev => ({
          ...prev,
          loading: false,
          error: {
            message: error.response?.data?.error || 
                   error.message || 
                   'Failed to load attraction',
            code: error.response?.data?.errorCode || 'FETCH_ERROR'
          }
        }));
      }
    }
  }, [id, data.retryCount]);

  useEffect(() => {
    if (!data.attraction && !data.error) {
      fetchAttraction();
    }
  }, [data.attraction, data.error, fetchAttraction]);

  const handleImageNavigation = (direction) => {
    setUiState(prev => {
      const totalImages = data.attraction?.images?.length || 1;
      const newIndex = (prev.currentImageIndex + direction + totalImages) % totalImages;
      return { ...prev, currentImageIndex: newIndex };
    });
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `${data.attraction.title} | Travel App`,
        text: `Check out ${data.attraction.title} in ${data.attraction.location}`,
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // Loading and error states at the top
  if (data.loading) {
    return <Loading message="Loading attraction details..." />;
  }

  if (data.error) {
    return <ErrorPage error={data.error} />;
  }

  if (!data.attraction) {
    return <ErrorPage message="Attraction not found" />;
  }

  const { attraction } = data;
  const images = attraction.images?.length ? attraction.images : ['/images/default-attraction.jpg'];
  const { currentImageIndex, isFavorite } = uiState;

  return (
    <div className="ad-container">
      {/* Hero Section */}
      <div className="ad-hero">
        <div className="ad-hero-image-container">
          <img
            src={images[currentImageIndex]}
            alt={attraction.title}
            className="ad-hero-image"
            loading="eager"
          />
          
          {images.length > 1 && (
            <>
              <button 
                className="ad-image-nav ad-prev"
                onClick={() => handleImageNavigation(-1)}
                aria-label="Previous image"
              >
                <ArrowLeft size={24} />
              </button>
              <button 
                className="ad-image-nav ad-next"
                onClick={() => handleImageNavigation(1)}
                aria-label="Next image"
              >
                <ArrowLeft size={24} style={{ transform: 'rotate(180deg)' }} />
              </button>
              <div className="ad-image-counter">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>

        <div className="ad-hero-content">
          <nav className="ad-breadcrumb">
            <Link to="/">Home</Link>
            <span> / </span>
            <Link to="/destinations">Destinations</Link>
            {state?.fromDestination && (
              <>
                <span> / </span>
                <Link to={`/destinations/${state.fromDestination}`}>
                  {state.fromDestination}
                </Link>
              </>
            )}
            <span> / </span>
            <span>{attraction.title}</span>
          </nav>

          <div className="ad-header-content">
            <h1 className="ad-title">{attraction.title}</h1>
            
            <div className="ad-meta-info">
              <div className="ad-meta-item">
                <MapPin className="ad-meta-icon" size={18} />
                <span>{attraction.location}</span>
              </div>
              <div className="ad-meta-item">
                {renderRatingStars(attraction.rating || 0)}
                <span>({attraction.reviewCount?.toLocaleString() || 0} reviews)</span>
              </div>
            </div>

            <div className="ad-hero-actions">
              <button 
                onClick={() => setUiState(prev => ({ ...prev, isFavorite: !prev.isFavorite }))}
                className={`ad-btn ad-icon-btn ${isFavorite ? 'ad-favorite-active' : ''}`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className="ad-btn-icon" fill={isFavorite ? 'currentColor' : 'none'} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>
              
              <button 
                className="ad-btn ad-icon-btn ad-share"
                onClick={handleShare}
                aria-label="Share this attraction"
              >
                <Share2 className="ad-btn-icon" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ad-main-content">
        <div className="ad-layout-grid">
          <div className="ad-primary-content">
            <div className="ad-content-card">
              {/* Overview Section */}
              <div className="ad-overview-section">
                <h2 className="ad-section-heading">About {attraction.title}</h2>
                <p className="ad-description-text">{attraction.description}</p>
              </div>

              {/* Highlights Section */}
              {attraction.highlights?.length > 0 && (
                <div className="ad-highlights-section">
                  <h2 className="ad-section-heading">Experience Highlights</h2>
                  <ul className="ad-highlights-list">
                    {attraction.highlights.map((highlight, index) => (
                      <li key={`highlight-${index}`} className="ad-highlight-item">
                        <div className="ad-highlight-marker"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practical Info Section */}
              <div className="ad-practical-section">
                <h2 className="ad-section-heading">Practical Information</h2>
                
                <div className="ad-info-grid">
                  <div className="ad-info-card">
                    <div className="ad-info-header">
                      <Clock className="ad-info-icon" size={20} />
                      <h3 className="ad-info-title">Duration</h3>
                    </div>
                    <p className="ad-info-text">{attraction.duration || 'Not specified'}</p>
                  </div>
                  
                  <div className="ad-info-card">
                    <div className="ad-info-header">
                      <DollarSign className="ad-info-icon" size={20} />
                      <h3 className="ad-info-title">Entry Fee</h3>
                    </div>
                    <p className="ad-info-text">{attraction.entryFee || 'Free'}</p>
                  </div>
                  
                  <div className="ad-info-card">
                    <div className="ad-info-header">
                      <Calendar className="ad-info-icon" size={20} />
                      <h3 className="ad-info-title">Best Time to Visit</h3>
                    </div>
                    <p className="ad-info-text">{attraction.bestTime || 'Year-round'}</p>
                  </div>
                  
                  <div className="ad-info-card">
                    <div className="ad-info-header">
                      <Users className="ad-info-icon" size={20} />
                      <h3 className="ad-info-title">Visitor Tips</h3>
                    </div>
                    <ul className="ad-tips-list">
                      {attraction.tips?.length > 0 ? (
                        attraction.tips.map((tip, index) => (
                          <li key={`tip-${index}`} className="ad-tip-item">{tip}</li>
                        ))
                      ) : (
                        <>
                          <li className="ad-tip-item">Wear comfortable walking shoes</li>
                          <li className="ad-tip-item">Bring water and sun protection</li>
                          <li className="ad-tip-item">Check weather conditions in advance</li>
                          <li className="ad-tip-item">Arrive early to avoid crowds</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gallery Section */}
              {images.length > 0 && (
                <div className="ad-gallery-section">
                  <h2 className="ad-section-heading">Photo Gallery</h2>
                  <div className="ad-gallery-grid">
                    {images.map((image, index) => (
                      <button
                        key={`gallery-${index}`}
                        className="ad-gallery-item"
                        onClick={() => setUiState(prev => ({ ...prev, currentImageIndex: index }))}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img 
                          src={image} 
                          alt={`${attraction.title} - ${index + 1}`}
                          className="ad-gallery-image"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related Attractions */}
            {attraction.relatedAttractions?.length > 0 && (
              <div className="ad-related-section">
                <h2 className="ad-section-heading">More in {attraction.location}</h2>
                <div className="ad-related-grid">
                  {attraction.relatedAttractions.map((related) => (
                    <Link 
                      key={related.id}
                      to={`/attractions/${related.id}`}
                      className="ad-related-card"
                    >
                      <img 
                        src={related.image || '/images/default-attraction.jpg'} 
                        alt={related.title}
                        className="ad-related-image"
                        loading="lazy"
                      />
                      <div className="ad-related-content">
                        <h3 className="ad-related-title">{related.title}</h3>
                        <div className="ad-related-meta">
                          {renderRatingStars(related.rating || 0)}
                          <span>({related.reviewCount?.toLocaleString() || 0})</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="ad-sidebar">
            <div className="ad-sidebar-card">
              <h3 className="ad-sidebar-title">Quick Facts</h3>
              <dl className="ad-facts-list">
                <div className="ad-fact-item">
                  <MapPin className="ad-fact-icon" size={18} />
                  <div className="ad-fact-content">
                    <dt>Location</dt>
                    <dd>{attraction.location}</dd>
                  </div>
                </div>
                
                <div className="ad-fact-item">
                  <Clock className="ad-fact-icon" size={18} />
                  <div className="ad-fact-content">
                    <dt>Duration</dt>
                    <dd>{attraction.duration || 'Not specified'}</dd>
                  </div>
                </div>
                
                <div className="ad-fact-item">
                  <DollarSign className="ad-fact-icon" size={18} />
                  <div className="ad-fact-content">
                    <dt>Entry Fee</dt>
                    <dd>{attraction.entryFee || 'Free'}</dd>
                  </div>
                </div>
                
                <div className="ad-fact-item">
                  <Calendar className="ad-fact-icon" size={18} />
                  <div className="ad-fact-content">
                    <dt>Best Time</dt>
                    <dd>{attraction.bestTime || 'Year-round'}</dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="ad-booking-card">
              <h3 className="ad-booking-title">Plan Your Visit</h3>
              <div className="ad-price-section">
                <span className="ad-price-label">From</span>
                <span className="ad-price-amount">
                  {attraction.entryFee?.includes('Nu.') ? 
                    attraction.entryFee : 
                    `$ ${attraction.entryFee === 'Free' ? '12' : attraction.entryFee || '0'}`
                  }
                </span>
                <span className="ad-price-per">per person</span>
              </div>
              
              <Link to="/contact" className="contact-btn">
                Contact Us to Book
              </Link>
              
            </div>

            <div className="ad-sidebar-card">
              <h3 className="ad-sidebar-title">Getting There</h3>
              <div className="ad-transport-options">
                <div className="ad-transport-item">
                  <div className="ad-transport-icon">✈️</div>
                  <div className="ad-transport-content">
                    <h4>By Air</h4>
                    <p>Fly to Paro International Airport, then take a domestic flight or drive to {attraction.location}.</p>
                  </div>
                </div>
                
                <div className="ad-transport-item">
                  <div className="ad-transport-icon">🚗</div>
                  <div className="ad-transport-content">
                    <h4>By Road</h4>
                    <p>{attraction.location} is well connected by Bhutan's road network. Private taxis and buses are available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ad-back-link">
        <button 
          className="ad-btn ad-back-btn"
          onClick={() => navigate(state?.fromDestination ? `/destinations/${state.fromDestination}` : '/destinations')}
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={18} />
          Back to {state?.fromDestination || 'Destinations'}
        </button>
      </div>
    </div>
  );
};

export default AttractionDetail;