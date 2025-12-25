import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ref, child, get } from "firebase/database";
import { db } from '../../service/firebase';
import { 
  FaSpinner, FaExclamationTriangle, FaSyncAlt,
  FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle,
  FaHistory, FaCamera, FaTicketAlt,
  FaArrowLeft, FaArrowRight, FaStar, FaRegStar,
  FaChevronDown, FaHotel, FaBus, FaPlane
} from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import './festivalDetail.css';
import ErrorPage from '../ErrorPage/ErrorPage'; // Import the ErrorPage component
import Loading from '../LoadingPage/LoadingPage'; // Import the reusable Loading component



const FestivalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDay, setExpandedDay] = useState(null);
  const [autoSlide, setAutoSlide] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all festivals directly from Firebase Realtime Database
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'festivals'));

        let festivalsData = [];
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (Array.isArray(data)) {
            festivalsData = data;
          } else if (typeof data === 'object' && data !== null) {
            festivalsData = Object.values(data);
          }
        } else {
          throw new Error('No festival data available');
        }

        if (!Array.isArray(festivalsData)) {
          throw new Error('Invalid data format received from server');
        }
        
        // Find the festival by ID with flexible comparison
        const foundFestival = festivalsData.find(f => 
          f.id == id ||  // Double equals for type coercion
          f._id == id || 
          f.id?.toString() === id || 
          f._id?.toString() === id
        );
        
        if (foundFestival) {
          setFestival(foundFestival);
        } else {
          throw new Error(`Festival with ID ${id} not found`);
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load festival');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalDetails();
  }, [id, retryCount]);

  // Image slider effect
  useEffect(() => {
    let interval;
    if (autoSlide && festival?.gallery?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => 
          (prev + 1) % festival.gallery.length
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoSlide, festival]);

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      (prev + 1) % (festival?.gallery?.length || 1)
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      (prev - 1 + (festival?.gallery?.length || 1)) % 
      (festival?.gallery?.length || 1)
    );
  };

  const toggleDay = (index) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  const pauseAutoSlide = () => setAutoSlide(false);
  const resumeAutoSlide = () => setAutoSlide(true);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
    } else {
      setError('Maximum retry attempts reached');
    }
  };

 if (isLoading) {
    return <Loading message="Loading Festivals Details..." />;
  }

    if (error) {
    return <ErrorPage />;
  }

  if (!festival) {
    return (
      <div className="festival-not-found">
        <div className="festival-not-found-content">
          <h3 className="festival-not-found-heading">Festival not found</h3>
          <p className="festival-not-found-message">
            The festival you're looking for doesn't exist or may have been removed.
          </p>
          <Link to="/festivals" className="festival-button festival-button--primary">
            Browse all festivals
          </Link>
        </div>
      </div>
    );
  }

  const festivalImages = festival.gallery?.length ? festival.gallery : 
                       [{ url: '/images/default-festival.jpg' }];

  return (
    <div className="festival-page">
      {/* Hero Section */}
      <section className="festival-hero-section">
        <div className="festival-gallery-container">
          <div 
            className="festival-main-image-wrapper"
            onMouseEnter={pauseAutoSlide}
            onMouseLeave={resumeAutoSlide}
          >
            <img 
              src={festivalImages[currentImageIndex]?.url} 
              alt={festival.name}
              className="festival-main-image"
            />
            
            {festivalImages.length > 1 && (
              <>
                <button 
                  className="festival-gallery-nav festival-gallery-nav--prev" 
                  onClick={() => {
                    pauseAutoSlide();
                    prevImage();
                  }}
                >
                  <FaArrowLeft />
                </button>
                <button 
                  className="festival-gallery-nav festival-gallery-nav--next" 
                  onClick={() => {
                    pauseAutoSlide();
                    nextImage();
                  }}
                >
                  <FaArrowRight />
                </button>
                <div className="festival-image-counter">
                  {currentImageIndex + 1}/{festivalImages.length}
                </div>
              </>
            )}
          </div>
          
          {festivalImages.length > 1 && (
            <div 
              className="festival-thumbnails-container"
              onMouseEnter={pauseAutoSlide}
              onMouseLeave={resumeAutoSlide}
            >
              {festivalImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`festival-thumbnail ${index === currentImageIndex ? 'festival-thumbnail--active' : ''}`}
                  onClick={() => {
                    pauseAutoSlide();
                    setCurrentImageIndex(index);
                  }}
                >
                  <img src={img.url} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="festival-booking-card">
          <div className="festival-info-header">
            <h1 className="festival-title">{festival.name}</h1>
            <span className={`festival-tag festival-tag--${festival.type}`}>
              {festival.type === 'religious' ? 'Tshechu' : 'Cultural Festival'}
            </span>
          </div>
          <div className="festival-info-content">
            <div className="festival-meta-info">
              <div className="festival-meta-item">
                <FaMapMarkerAlt className="festival-meta-icon" />
                <span>{festival.location?.venue}, {festival.location?.city}</span>
              </div>
              <div className="festival-meta-item">
                <FaCalendarAlt className="festival-meta-icon" />
                <span>{festival.date}</span>
              </div>
            </div>
            
            {/* <div className="festival-actions">
              <Link 
                to={`/festivals/${id}/tours`} 
                className="festival-button festival-button--cta"
              >
                <FaTicketAlt /> Find Tours
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* Festival Info */}
      <section className="festival-content-section">
        <div className="festival-header-container">
          <div className="festival-breadcrumbs">
            <Link to="/" className="festival-breadcrumb-link">Home</Link>
            <IoIosArrowForward className="festival-breadcrumb-arrow" />
            <Link to="/festivals" className="festival-breadcrumb-link">Festivals</Link>
            <IoIosArrowForward className="festival-breadcrumb-arrow" />
            <span className="festival-breadcrumb-current">{festival.name}</span>
          </div>
          
          <div className="festival-rating-container">
            <div className="festival-stars">
              {[...Array(5)].map((_, i) => (
                i < 4 ? <FaStar key={i} className="festival-star festival-star--filled" /> : <FaRegStar key={i} className="festival-star" />
              ))}
            </div>
            <span className="festival-rating-text">4.7 (18 reviews)</span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="festival-tabs-container">
          <button 
            className={`festival-tab ${activeTab === 'overview' ? 'festival-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaInfoCircle /> Overview
          </button>
          <button 
            className={`festival-tab ${activeTab === 'schedule' ? 'festival-tab--active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FaCalendarAlt /> Schedule
          </button>
          <button 
            className={`festival-tab ${activeTab === 'history' ? 'festival-tab--active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory /> History
          </button>
          <button 
            className={`festival-tab ${activeTab === 'gallery' ? 'festival-tab--active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <FaCamera /> Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="festival-tab-content-container">
          {activeTab === 'overview' && (
            <div className="festival-overview-content">
              <h2 className="festival-section-title">Festival Overview</h2>
              <p className="festival-description">{festival.description}</p>
              
              {festival.detailedDescription && (
                <div className="festival-detailed-content">
                  {festival.detailedDescription.map((para, i) => (
                    <p key={i} className="festival-description-paragraph">{para}</p>
                  ))}
                </div>
              )}
              
              <div className="festival-highlights-section">
                <h2 className="festival-section-title">Key Highlights</h2>
                <div className="festival-highlights-grid">
                  {festival.highlights?.map((highlight, index) => (
                    <div className="festival-highlight-card" key={index}>
                      <div className="festival-highlight-number">{index + 1}</div>
                      <div className="festival-highlight-content">
                        <h3 className="festival-highlight-title">{highlight.title || `Highlight ${index + 1}`}</h3>
                        <p className="festival-highlight-description">
                          {highlight.description || (typeof highlight === 'string' ? highlight : '')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="festival-schedule-content">
              {festival.schedule?.map((day, index) => (
                <div 
                  className={`festival-day-card ${expandedDay === index ? 'festival-day-card--expanded' : ''}`} 
                  key={index}
                >
                  <div 
                    className="festival-day-header" 
                    onClick={() => toggleDay(index)}
                  >
                    <h3 className="festival-day-title">{day.day}</h3>
                    <FaChevronDown className={`festival-day-chevron ${expandedDay === index ? 'festival-day-chevron--expanded' : ''}`} />
                  </div>
                  {expandedDay === index && (
                    <div className="festival-day-events">
                      <ul className="festival-event-list">
                        {day.events.map((event, i) => (
                          <li key={i} className="festival-event-item">{event}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="festival-history-content">
              <h2 className="festival-section-title">Historical Significance</h2>
              {festival.historicalSignificance?.origin && (
                <div className="festival-history-card">
                  <h3 className="festival-history-subtitle">Origin</h3>
                  <p className="festival-history-text">{festival.historicalSignificance.origin}</p>
                </div>
              )}
              {festival.historicalSignificance?.purpose && (
                <div className="festival-history-card">
                  <h3 className="festival-history-subtitle">Purpose</h3>
                  <p className="festival-history-text">{festival.historicalSignificance.purpose}</p>
                </div>
              )}
              {festival.historicalSignificance?.culturalImportance && (
                <div className="festival-history-card">
                  <h3 className="festival-history-subtitle">Cultural Importance</h3>
                  <p className="festival-history-text">{festival.historicalSignificance.culturalImportance}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="festival-gallery-content">
              <div className="festival-image-grid">
                {festivalImages.map((img, index) => (
                  <div className="festival-grid-item" key={index}>
                    <img 
                      src={img.url} 
                      alt={`${festival.name} ${index + 1}`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setActiveTab('overview');
                      }}
                      className="festival-grid-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Visitor Information */}
      <section className="festival-visitor-section">
        <h2 className="festival-section-title festival-section-title--decorated">Visitor Information</h2>
        
        {festival.visitorInformation && (
          <div className="festival-visitor-grid">
            {festival.visitorInformation.dressCode && (
              <div className="festival-visitor-card">
                <div className="festival-visitor-icon">
                  <div className="festival-icon-circle">
                    <FaInfoCircle />
                  </div>
                </div>
                <div className="festival-visitor-content">
                  <h3 className="festival-visitor-title">Dress Code</h3>
                  <p className="festival-visitor-text">{festival.visitorInformation.dressCode}</p>
                </div>
              </div>
            )}
            
            {festival.visitorInformation.etiquette && (
              <div className="festival-visitor-card">
                <div className="festival-visitor-icon">
                  <div className="festival-icon-circle">
                    <FaInfoCircle />
                  </div>
                </div>
                <div className="festival-visitor-content">
                  <h3 className="festival-visitor-title">Etiquette</h3>
                  <ul className="festival-visitor-list">
                    {festival.visitorInformation.etiquette.map((item, i) => (
                      <li key={i} className="festival-visitor-list-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {festival.visitorInformation.tips && (
              <div className="festival-visitor-card">
                <div className="festival-visitor-icon">
                  <div className="festival-icon-circle">
                    <FaInfoCircle />
                  </div>
                </div>
                <div className="festival-visitor-content">
                  <h3 className="festival-visitor-title">Tips</h3>
                  <ul className="festival-visitor-list">
                    {festival.visitorInformation.tips.map((tip, i) => (
                      <li key={i} className="festival-visitor-list-item">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Transportation & Accommodation */}
      <section className="festival-practical-section">
        <div className="festival-transportation-section">
          <h2 className="festival-section-title festival-section-title--decorated">Getting There</h2>
          {festival.transportation?.air && (
            <div className="festival-transport-card">
              <div className="festival-transport-icon">
                <div className="festival-icon-circle festival-icon-circle--blue">
                  <FaPlane />
                </div>
              </div>
              <div className="festival-transport-content">
                <h3 className="festival-transport-title">By Air</h3>
                <p className="festival-transport-text">{festival.transportation.air}</p>
              </div>
            </div>
          )}
          {festival.transportation?.road && (
            <div className="festival-transport-card">
              <div className="festival-transport-icon">
                <div className="festival-icon-circle festival-icon-circle--green">
                  <FaBus />
                </div>
              </div>
              <div className="festival-transport-content">
                <h3 className="festival-transport-title">By Road</h3>
                <ul className="festival-transport-list">
                  {festival.transportation.road.map((option, i) => (
                    <li key={i} className="festival-transport-list-item">{option}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="festival-accommodation-section">
          <h2 className="festival-section-title festival-section-title--decorated">Where to Stay</h2>
          <div className="festival-hotel-grid">
            {festival.accommodation?.map((hotel, index) => (
              <div className="festival-hotel-card" key={index}>
                <div className="festival-hotel-icon">
                  <div className="festival-icon-circle festival-icon-circle--orange">
                    <FaHotel />
                  </div>
                </div>
                <div className="festival-hotel-content">
                  <h3 className="festival-hotel-name">{hotel.name}</h3>
                  <p className="festival-hotel-detail"><span className="festival-hotel-label">Type:</span> {hotel.type}</p>
                  {hotel.distance && <p className="festival-hotel-detail"><span className="festival-hotel-label">Distance:</span> {hotel.distance}</p>}
                  {hotel.priceRange && <p className="festival-hotel-detail"><span className="festival-hotel-label">Price:</span> {hotel.priceRange}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FestivalDetails;