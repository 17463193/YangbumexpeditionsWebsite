import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Clock, DollarSign, Calendar, Star, Users } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../../service/firebase';
import './DestinationDetail.css';
import ErrorPage from '../ErrorPage/ErrorPage'; // Import the ErrorPage component
import Loading from '../LoadingPage/LoadingPage';

const DestinationDetail = () => {
  const { location: locationParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDestination, setCurrentDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setCurrentDestination(null);

        // Check if destination was passed in state
        if (location.state?.destination) {
          setCurrentDestination(location.state.destination);
          setIsLoading(false);
          return;
        }

        const decodedLocation = decodeURIComponent(locationParam);
        
        if (!decodedLocation || decodedLocation === '0') {
          throw new Error('Please select a destination from the menu.');
        }

        const destinationsRef = ref(db, 'destinations');
        const snapshot = await get(destinationsRef);
        
        if (!snapshot.exists()) {
          throw new Error('Destinations database unavailable. Please try again later.');
        }

        const destinationsData = [];
        snapshot.forEach((child) => {
          destinationsData.push({
            id: child.key,
            ...child.val()
          });
        });

        const foundDestination = destinationsData.find(
          dest => dest.location.toLowerCase() === decodedLocation.toLowerCase()
        );

        if (!foundDestination) {
          navigate('/destinations', {
            state: {
              error: `Destination "${decodedLocation}" not found.`,
              availableLocations: destinationsData.map(d => d.location)
            }
          });
          return;
        }

        setCurrentDestination(foundDestination);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
        window.scrollTo(0, 0);
      }
    };

    fetchDestination();
  }, [locationParam, navigate, location.state]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const renderRatingStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="dd-rating-star dd-filled" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="dd-rating-star dd-half" size={16} />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="dd-rating-star dd-empty" size={16} />);
    }

    return stars;
  };

  // Calculate average rating and total reviews
  const averageRating = currentDestination?.attractions?.length > 0 ? 
    currentDestination.attractions.reduce((acc, attraction) => acc + (attraction.rating || 0), 0) / currentDestination.attractions.length : 0;
  
  const totalReviews = currentDestination?.attractions?.length > 0 ? 
    currentDestination.attractions.reduce((acc, attraction) => acc + (attraction.reviewCount || 0), 0) : 0;

  if (isLoading) {
    return <Loading message={`Loading ${decodeURIComponent(locationParam) || 'destination'}...`} />;
  }
  
  if (error) {
    return <ErrorPage message={error} />;
  }

  if (!currentDestination) {
    return (
      <div className="dd-not-found">
        <div className="dd-not-found-content">
          <h2>Destination Not Found</h2>
          <p>The requested destination could not be found.</p>
          <button 
            className="dd-btn dd-primary" 
            onClick={() => navigate('/destinations')}
          >
            <ArrowLeft size={18} />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dd-container">
      {/* Hero Section */}
      <div 
        className="dd-hero"
        style={{ 
          backgroundImage: `url(${currentDestination.header?.backgroundImage || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="dd-hero-overlay"></div>
        <div className="dd-hero-content">
          <nav className="dd-breadcrumb">
            <Link to="/">Home</Link>

            <span> / </span>
            <span>{currentDestination.location}</span>
          </nav>
          
          <div className="dd-header-content">
            <h1 className="dd-title">{currentDestination.header?.title || currentDestination.location}</h1>
            <p className="dd-subtitle">{currentDestination.header?.subtitle || ''}</p>
            
            <div className="dd-meta-info">
              <div className="dd-meta-item">
                <MapPin className="dd-meta-icon" />
                <span>Bhutan</span>
              </div>
              {currentDestination.attractions?.length > 0 && (
                <div className="dd-meta-item">
                  <div className="dd-rating-stars">{renderRatingStars(averageRating)}</div>
                  <span>({totalReviews.toLocaleString()} reviews)</span>
                </div>
              )}
            </div>
            
          
          
          </div>
        </div>
      </div>

      <div className="dd-main-content">
        <div className="dd-layout-grid">
          <div className="dd-primary-content">
            <div className="dd-content-card">
              <div className="dd-tab-navigation">
                <nav className="dd-tab-list">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'attractions', label: 'Attractions' },
                    { id: 'travel-info', label: 'Travel Info' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`dd-tab-btn ${activeTab === tab.id ? 'dd-tab-active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="dd-tab-content">
                {activeTab === 'overview' && (
                  <div className="dd-overview-tab">
                    <div className="dd-about-section">
                      <h2 className="dd-section-heading">About {currentDestination.location}</h2>
                      <div className="dd-description-block">
                        {currentDestination.description?.map((paragraph, index) => (
                          <p key={index} className="dd-description-text">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {currentDestination.details && (
                      <div className="dd-highlights-section">
                        <h3 className="dd-section-subheading">Destination Highlights</h3>
                        <div className="dd-highlight-grid">
                          {currentDestination.details.map((detail, index) => (
                            <div key={index} className="dd-highlight-item">
                              <h4 className="dd-highlight-title">{detail.title}</h4>
                              <p className="dd-highlight-text">{detail.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'attractions' && (
                  <div className="dd-attractions-tab">
                    <h2 className="dd-section-heading">Top Attractions</h2>
                    {currentDestination.attractions?.length > 0 ? (
                      <div className="dd-attraction-list">
                        {currentDestination.attractions.map((attraction) => (
                          <div key={attraction.id} className="dd-attraction-card">
                            <div className="dd-attraction-wrapper">
                              <Link 
                                to={`/attractions/${attraction.id}`}
                                state={{ 
                                  attraction,
                                  fromDestination: currentDestination.location 
                                }}
                                className="dd-attraction-image-link"
                              >
                                <div 
                                  className="dd-attraction-image"
                                  style={{
                                    backgroundImage: `url(${attraction.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                  }}
                                >
                                  <div className="dd-image-overlay"></div>
                                  <span className="dd-attraction-category">
                                    {attraction.category}
                                  </span>
                                </div>
                              </Link>
                              <div className="dd-attraction-details">
                                <div className="dd-attraction-header">
                                  <Link 
                                    to={`/attractions/${attraction.id}`}
                                    state={{ 
                                      attraction,
                                      fromDestination: currentDestination.location 
                                    }}
                                    className="dd-attraction-name-link"
                                  >
                                    <h3 className="dd-attraction-name">{attraction.title}</h3>
                                  </Link>
                                  <div className="dd-attraction-rating">
                                    {renderRatingStars(attraction.rating)}
                                    <span className="dd-review-count">({attraction.reviewCount?.toLocaleString() || 0})</span>
                                  </div>
                                </div>
                                
                                <p className="dd-attraction-description">{attraction.description}</p>
                                
                                {attraction.highlights && (
                                  <div className="dd-feature-highlights">
                                    <h4 className="dd-highlights-heading">Highlights:</h4>
                                    <ul className="dd-highlight-points">
                                      {attraction.highlights.map((highlight, idx) => (
                                        <li key={idx} className="dd-highlight-point">
                                          <div className="dd-point-marker"></div>
                                          {highlight}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                <div className="dd-attraction-meta">
                                  <div className="dd-meta-info">
                                    <MapPin className="dd-info-icon" />
                                    {attraction.location}
                                  </div>
                                  <div className="dd-meta-info">
                                    <DollarSign className="dd-info-icon" />
                                    {attraction.entryFee || 'Free'}
                                  </div>
                                  <div className="dd-meta-info">
                                    <Clock className="dd-info-icon" />
                                    {attraction.duration || 'Flexible'}
                                  </div>
                                </div>

                                <Link 
                                  to={`/attractions/${attraction.id}`}
                                  state={{ 
                                    attraction,
                                    fromDestination: currentDestination.location 
                                  }}
                                  className="contact-btn"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No attractions available for this destination.</p>
                    )}
                  </div>
                )}

                {activeTab === 'travel-info' && (
                  <div className="dd-travel-info-tab">
                    <h2 className="dd-section-heading">Travel Information</h2>
                    
                    <div className="dd-info-card">
                      <div className="dd-card-header">
                        <Calendar className="dd-card-icon" />
                        <h3 className="dd-card-title">Best Time to Visit</h3>
                      </div>
                      <p className="dd-card-text">
                        {currentDestination.details?.find(d => d.title === "Best Time to Visit")?.description || 
                         "The best time to visit is during the spring (March-May) and autumn (September-November) seasons when the weather is pleasant and skies are clear."}
                      </p>
                    </div>
                    
                    <div className="dd-info-card">
                      <div className="dd-card-header">
                        <MapPin className="dd-card-icon" />
                        <h3 className="dd-card-title">Getting There</h3>
                      </div>
                      <div className="dd-transport-options">
                        <div className="dd-transport-card">
                          <h4 className="dd-transport-title">By Air</h4>
                          <p className="dd-transport-description">
                            Paro International Airport is the only airport in Bhutan with international flights. 
                            From there, you can take a domestic flight or drive to {currentDestination.location}.
                          </p>
                        </div>
                        <div className="dd-transport-card">
                          <h4 className="dd-transport-title">By Road</h4>
                          <p className="dd-transport-description">
                            Bhutan has a well-maintained road network. {currentDestination.location} is connected 
                            to other major towns by comfortable buses and private taxis.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dd-info-card">
                      <div className="dd-card-header">
                        <Users className="dd-card-icon" />
                        <h3 className="dd-card-title">Local Tips</h3>
                      </div>
                      <ul className="dd-tips-list">
                        <li className="dd-tip-item">
                          <div className="dd-tip-marker"></div>
                          Carry cash as ATMs may be limited in some areas
                        </li>
                        <li className="dd-tip-item">
                          <div className="dd-tip-marker"></div>
                          Dress modestly when visiting religious sites
                        </li>
                        <li className="dd-tip-item">
                          <div className="dd-tip-marker"></div>
                          Respect local customs and traditions
                        </li>
                        <li className="dd-tip-item">
                          <div className="dd-tip-marker"></div>
                          Stay hydrated as the altitude can cause dehydration
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="dd-experiences-section">
              <h2 className="dd-section-heading">Unique Experiences in {currentDestination.location}</h2>
              <div className="dd-experiences-grid">
                {[
                  { 
                    icon: '🏯', 
                    title: 'Cultural Immersion', 
                    desc: 'Visit ancient dzongs and monasteries',
                    activities: ['Traditional mask dances', 'Monastic life experience', 'Prayer flag printing']
                  },
                  { 
                    icon: '🥘', 
                    title: 'Culinary Delights', 
                    desc: 'Taste authentic Bhutanese cuisine',
                    activities: ['Ema Datshi cooking class', 'Farm-to-table dining', 'Butter tea tasting']
                  },
                  { 
                    icon: '🥾', 
                    title: 'Trekking Adventures', 
                    desc: 'Explore scenic Himalayan trails',
                    activities: ['Day hikes to viewpoints', 'Multi-day treks', 'Nature photography tours']
                  },
                  { 
                    icon: '🛍️', 
                    title: 'Local Markets', 
                    desc: 'Shop for handmade crafts and textiles',
                    activities: ['Textile weaving demonstrations', 'Handicraft workshops', 'Local artisan meetups']
                  },
                  { 
                    icon: '🕌', 
                    title: 'Spiritual Journeys', 
                    desc: 'Meditation and mindfulness retreats',
                    activities: ['Monk-led meditation', 'Temple stays', 'Philosophy discussions']
                  },
                  { 
                    icon: '🦜', 
                    title: 'Wildlife Encounters', 
                    desc: 'Discover Bhutan\'s diverse ecosystems',
                    activities: ['Bird watching tours', 'National park visits', 'Wildlife photography']
                  }
                ].map((experience, index) => (
                  <div key={index} className="dd-experience-card">
                    <div className="dd-experience-icon">{experience.icon}</div>
                    <div className="dd-experience-content">
                      <h3 className="dd-experience-title">{experience.title}</h3>
                      <p className="dd-experience-desc">{experience.desc}</p>
                      <div className="dd-experience-activities">
                        {experience.activities.map((activity, i) => (
                          <span key={i} className="dd-activity-tag">{activity}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dd-sidebar">
            <div className="dd-sidebar-card">
              <h3 className="dd-sidebar-title">Quick Facts</h3>
              <dl className="dd-facts-list">
                <div className="dd-fact-item">
                  <MapPin className="dd-fact-icon" />
                  <div className="dd-fact-content">
                    <dt>Location</dt>
                    <dd>{currentDestination.location}, Bhutan</dd>
                  </div>
                </div>
                {currentDestination.attractions?.length > 0 && (
                  <div className="dd-fact-item">
                    <Star className="dd-fact-icon" />
                    <div className="dd-fact-content">
                      <dt>Average Rating</dt>
                      <dd>
                        {averageRating.toFixed(1)} ({totalReviews.toLocaleString()} reviews)
                      </dd>
                    </div>
                  </div>
                )}
                <div className="dd-fact-item">
                  <Calendar className="dd-fact-icon" />
                  <div className="dd-fact-content">
                    <dt>Best Time</dt>
                    <dd>March - May, Sept - Nov</dd>
                  </div>
                </div>
                <div className="dd-fact-item">
                  <Users className="dd-fact-icon" />
                  <div className="dd-fact-content">
                    <dt>Tourist Visa</dt>
                    <dd>Required for all visitors</dd>
                  </div>    
                </div>
                <div className="dd-fact-item">
                  <DollarSign className="dd-fact-icon" />
                  <div className="dd-fact-content">
                    <dt>Daily Fee</dt>
                    <dd>$200-$250 per person</dd>
                  </div>
                </div>
              </dl>
            </div>

            {currentDestination.attractions?.length > 0 && (
              <div className="dd-featured-card">
                <Link 
                  to={`/attractions/${currentDestination.attractions[0].id}`}
                  state={{ 
                    attraction: currentDestination.attractions[0],
                    fromDestination: currentDestination.location 
                  }}
                  className="dd-featured-image-link"
                >
                  <div 
                    className="dd-featured-image"
                    style={{
                      backgroundImage: `url(${currentDestination.attractions[0].image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                </Link>
                <div className="dd-featured-content">
                  <h3 className="dd-featured-label">Featured Attraction</h3>
                  <Link 
                    to={`/attractions/${currentDestination.attractions[0].id}`}
                    state={{ 
                      attraction: currentDestination.attractions[0],
                      fromDestination: currentDestination.location 
                    }}
                    className="dd-featured-title-link"
                  >
                    <h4 className="dd-featured-title">{currentDestination.attractions[0].title}</h4>
                  </Link>
                  <div className="dd-featured-rating">
                    {renderRatingStars(currentDestination.attractions[0].rating)}
                    <span className="dd-review-count">
                      ({currentDestination.attractions[0].reviewCount?.toLocaleString() || 0})
                    </span>
                  </div>
                  <p className="dd-featured-description">
                    {currentDestination.attractions[0].description?.substring(0, 120)}...
                  </p>
                  <Link 
                    to={`/attractions/${currentDestination.attractions[0].id}`}
                    state={{ 
                      attraction: currentDestination.attractions[0],
                      fromDestination: currentDestination.location 
                    }}
                    className="contact-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )}

            <div className="dd-sidebar-card">
              <h3 className="dd-sidebar-title">Essential Tips</h3>
              <ul className="dd-tips-list">
                <li className="dd-tip-item">
                  <div className="dd-tip-icon">💰</div>
                  <div className="dd-tip-content">
                    <h4>Currency</h4>
                    <p>Bhutanese Ngultrum (BTN). Indian Rupees also accepted.</p>
                  </div>
                </li>
                <li className="dd-tip-item">
                  <div className="dd-tip-icon">🗣️</div>
                  <div className="dd-tip-content">
                    <h4>Language</h4>
                    <p>Dzongkha is official language but English widely spoken.</p>
                  </div>
                </li>
                <li className="dd-tip-item">
                  <div className="dd-tip-icon">🌡️</div>
                  <div className="dd-tip-content">
                    <h4>Altitude</h4>
                    <p>{currentDestination.location} is at {Math.floor(Math.random() * 2000) + 1000}m. Acclimatize properly.</p>
                  </div>
                </li>
                <li className="dd-tip-item">
                  <div className="dd-tip-icon">📶</div>
                  <div className="dd-tip-content">
                    <h4>Connectivity</h4>
                    <p>WiFi available in hotels. SIM cards can be purchased.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;