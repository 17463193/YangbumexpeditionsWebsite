import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaArrowRight, FaSpinner, FaCheck, FaStar, 
  FaRegStar, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, 
  FaUtensils, FaHotel, FaCar, FaChevronDown, FaQuoteLeft, 
  FaExpand, FaExclamationTriangle
} from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import ErrorPage from '../ErrorPage/ErrorPage';
import Loading from '../LoadingPage/LoadingPage';
import './PackageDetails.css';
import { db } from '../../service/firebase.js';
import { ref, get } from 'firebase/database';
import emailjs from '@emailjs/browser';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    selectedPackage: null,
    isLoading: true,
    error: null,
    currentImageIndex: 0,
    imageLoading: true,
    formData: {
      fullName: '',
      email: '',
      contactNo: '',
      departureDate: '',
      travelers: '1'
    },
    isSubmitting: false,
    bookingSuccess: false,
    bookingError: '',
    fullscreenImage: false,
    activeTab: 'itinerary',
    expandedDay: null,
    expandedFaq: null,
    retryCount: 0
  });

  const galleryRef = useRef(null);

  const processImagePath = (imgPath) => {
    if (!imgPath) return '/assets/img/placeholder.jpg';
    let cleanedPath = imgPath.replace(/^\.\.\//, '').replace(/^\.\//, '');
    if (!cleanedPath.startsWith('assets/') && !cleanedPath.startsWith('/assets/')) {
      cleanedPath = `assets/${cleanedPath}`;
    }
    cleanedPath = cleanedPath.replace(/assets\/assets\//, 'assets/');
    return `/${cleanedPath.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        
        // Reference to the packages node in Firebase
        const packagesRef = ref(db, 'packages');
        const snapshot = await get(packagesRef);
        
        if (!snapshot.exists()) {
          throw new Error('No packages data available');
        }
        
        // Convert the snapshot to an array of packages
        const packagesData = [];
        snapshot.forEach((childSnapshot) => {
          packagesData.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        // Find the package by ID
        const foundPackage = packagesData.find(p => 
          p.id === id || p._id === id || p.id?.toString() === id || p._id?.toString() === id
        );
        
        if (foundPackage) {
          // Process images
          const processedGallery = foundPackage.gallery?.map(img => processImagePath(img)) || [];
          const processedMainImage = processImagePath(foundPackage.mainImage);
          
          setState(prev => ({
            ...prev,
            selectedPackage: {
              ...foundPackage,
              mainImage: processedMainImage,
              gallery: processedGallery.length > 0 ? processedGallery : [processedMainImage]
            },
            isLoading: false
          }));
        } else {
          throw new Error(`Package with ID ${id} not found`);
        }
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err.message || 'Failed to load package',
          isLoading: false,
          retryCount: prev.retryCount + 1
        }));
        console.error('Fetch error:', err);
      }
    };

    fetchPackageDetails();
  }, [id, state.retryCount]);

  const retryFetch = () => {
    setState(prev => ({ ...prev, error: null, retryCount: prev.retryCount + 1 }));
  };  

  const nextImage = () => {
    setState(prev => ({
      ...prev,
      imageLoading: true,
      currentImageIndex: (prev.currentImageIndex + 1) % (prev.selectedPackage?.gallery?.length || 1)
    }));
  };

  const prevImage = () => {
    setState(prev => ({
      ...prev,
      imageLoading: true,
      currentImageIndex: (prev.currentImageIndex - 1 + (prev.selectedPackage?.gallery?.length || 1)) % (prev.selectedPackage?.gallery?.length || 1)
    }));
  };

  const selectImage = (index) => {
    setState(prev => ({
      ...prev,
      imageLoading: true,
      currentImageIndex: index
    }));
    if (window.innerWidth < 768) {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFullscreen = () => {
    setState(prev => ({ ...prev, fullscreenImage: !prev.fullscreenImage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isSubmitting: true, bookingError: '' }));

    const { fullName, email, departureDate } = state.formData;
    
    if (!fullName.trim() || !email.trim() || !departureDate) {
      setState(prev => ({ ...prev, bookingError: 'Please fill in all required fields', isSubmitting: false }));
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState(prev => ({ ...prev, bookingError: 'Please enter a valid email address', isSubmitting: false }));
      return;
    }

    try {
      const serviceId = import.meta.env.VITE_BOOKING_EMAIL_SERVICE_ID;
      const templateId = import.meta.env.VITE_BOOKING_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Email service is not properly configured');
      }

      const templateParams = {
        package_name: state.selectedPackage?.name || 'N/A',
        full_name: fullName,
        email,
        contact_no: state.formData.contactNo,
        departure_date: departureDate,
        travelers: state.formData.travelers,
      };

      await emailjs.send(serviceId, templateId, templateParams, {
        publicKey,
      });

      setState(prev => ({ ...prev, bookingSuccess: true }));
    } catch (error) {
      setState(prev => ({ ...prev, bookingError: 'Booking failed. Please try again.' }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
  };

  const toggleDay = (index) => {
    setState(prev => ({
      ...prev,
      expandedDay: prev.expandedDay === index ? null : index
    }));
  };

  const toggleFaq = (index) => {
    setState(prev => ({
      ...prev,
      expandedFaq: prev.expandedFaq === index ? null : index
    }));
  };

  if (state.isLoading) {
    return <Loading message="Loading tour package details..." />;
  }

  if (state.error) {
    return <ErrorPage error={state.error} onRetry={retryFetch} />;
  }

  if (!state.selectedPackage) {
    return <div className="pkg-not-found">Package not found</div>;
  }

  const images = state.selectedPackage.gallery || [state.selectedPackage.mainImage];

  return (
    <div className="pkg-details" key={`package-${id}`}>
      {/* Fullscreen Image Viewer */}
      {state.fullscreenImage && (
        <div className="pkg-fullscreen-viewer">
          <button className="pkg-close-fullscreen" onClick={toggleFullscreen}>
            &times;
          </button>
          <div className="pkg-fullscreen-content">
            <button className="pkg-nav-btn pkg-nav-btn--left" onClick={prevImage}>
              <FaArrowLeft />
            </button>
            <img 
              src={images[state.currentImageIndex]} 
              alt={`Tour view ${state.currentImageIndex + 1}`} 
              className={`pkg-fullscreen-img ${state.imageLoading ? 'pkg-img-loading' : ''}`}
              onLoad={() => setState(prev => ({ ...prev, imageLoading: false }))}
              onError={(e) => {
                e.target.src = '/assets/img/placeholder.jpg';
                setState(prev => ({ ...prev, imageLoading: false }));
              }}
            />
            <button className="pkg-nav-btn pkg-nav-btn--right" onClick={nextImage}>
              <FaArrowRight />
            </button>
          </div>
          <div className="pkg-fullscreen-counter">
            {state.currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="pkg-hero">
        {/* Gallery Section */}
        <div className="pkg-gallery" ref={galleryRef}>
          <div className="pkg-gallery__main">
            <div className="pkg-gallery__img-container">
              <img 
                src={images[state.currentImageIndex]} 
                alt={`Tour view ${state.currentImageIndex + 1}`} 
                className={`pkg-gallery__img ${state.imageLoading ? 'pkg-img-loading' : ''}`}
                onClick={toggleFullscreen}
                onLoad={() => setState(prev => ({ ...prev, imageLoading: false }))}
                onError={(e) => {
                  e.target.src = '/assets/img/placeholder.jpg';
                  setState(prev => ({ ...prev, imageLoading: false }));
                }}
              />
              <button 
                className="pkg-expand-btn"
                onClick={toggleFullscreen}
                aria-label="Expand image"
              >
                <FaExpand />
              </button>
            </div>
            
            {images.length > 1 && (
              <>
                <button 
                  className="pkg-nav-btn pkg-nav-btn--left"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <FaArrowLeft />
                </button>
                <button 
                  className="pkg-nav-btn pkg-nav-btn--right"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FaArrowRight />
                </button>
                <div className="pkg-gallery__counter">
                  {state.currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="pkg-gallery__thumbs">
              {images.map((img, index) => (
                <div 
                  key={index}
                  className={`pkg-gallery__thumb ${index === state.currentImageIndex ? 'pkg-gallery__thumb--active' : ''}`}
                  onClick={() => selectImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="pkg-gallery__thumb-img" 
                    onError={(e) => {
                      e.target.src = '/assets/img/placeholder-thumb.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Section */}
        <div className="pkg-booking">
          <div className="pkg-price-card">
            <div className="pkg-price-card__header">Starting from</div>
            <div className="pkg-price-card__content">
              <div className="pkg-price-card__amount">${state.selectedPackage.price}</div>
              <div className="pkg-price-card__details">per person</div>
            </div>
          </div>

          <div className="pkg-booking-form">
            <h3>Book This Tour</h3>

            {state.bookingSuccess ? (
              <div className="pkg-booking-success">
                <FaCheck className="pkg-icon" />
                <h4>Booking Confirmed!</h4>
                <p>Confirmation sent to your email.</p>
                <button 
                  onClick={() => setState(prev => ({ ...prev, bookingSuccess: false }))} 
                  className="pkg-btn pkg-btn--secondary"
                >
                  Make Another Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="pkg-form-row">
                  <div className="pkg-form-group pkg-form-group--full">
                    <input 
                      type="text" 
                      name="fullName" 
                      value={state.formData.fullName} 
                      onChange={handleChange} 
                      placeholder="Full Name *" 
                      required 
                    />
                  </div>
                </div>

                <div className="pkg-form-row">
                  <div className="pkg-form-group">
                    <input 
                      type="email" 
                      name="email" 
                      value={state.formData.email} 
                      onChange={handleChange} 
                      placeholder="Email *" 
                      required 
                    />
                  </div>
                  <div className="pkg-form-group">
                    <input 
                      type="tel" 
                      name="contactNo" 
                      value={state.formData.contactNo} 
                      onChange={handleChange} 
                      placeholder="Phone Number" 
                    />
                  </div>
                </div>

                <div className="pkg-form-row">
                  <div className="pkg-form-group">
                    <input 
                      type="date" 
                      name="departureDate" 
                      value={state.formData.departureDate} 
                      onChange={handleChange} 
                      required 
                      min={new Date().toISOString().split('T')[0]} 
                    />
                  </div>
                  <div className="pkg-form-group">
                    <select 
                      name="travelers" 
                      value={state.formData.travelers} 
                      onChange={handleChange}
                    >
                      <option value="1">1 Person</option>
                      <option value="2">2 People</option>
                      <option value="3-5">3-5 People</option>
                      <option value="6+">6+ People</option>
                    </select>
                  </div>
                </div>

                {state.bookingError && (
                  <div className="pkg-booking-error">
                    <FaExclamationTriangle className="pkg-error-icon" />
                    <p>{state.bookingError}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="pkg-btn pkg-btn--primary pkg-btn--block" 
                  disabled={state.isSubmitting || !state.selectedPackage}
                >
                  {state.isSubmitting ? (
                    <>
                      <FaSpinner className="pkg-spinner" /> Processing...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Package Information Section */}
      <section className="pkg-info">
        <div className="pkg-header">
          <div className="pkg-breadcrumbs">
            <Link to="/">Home</Link>
            <IoIosArrowForward className="pkg-breadcrumb-arrow" />
            <Link to="/packages">Tours</Link>
            <IoIosArrowForward className="pkg-breadcrumb-arrow" />
            <span>{state.selectedPackage.title}</span>
          </div>
          <h3 className="pkg-title">{state.selectedPackage.title}</h3>
          <div className="pkg-meta">
            <div className="pkg-meta__item">
              <FaMapMarkerAlt className="pkg-meta__icon" />
              <span>{state.selectedPackage.location}</span>
            </div>
            <div className="pkg-meta__item">
              <FaCalendarAlt className="pkg-meta__icon" />
              <span>{state.selectedPackage.duration}</span>
            </div>
            <div className="pkg-rating">
              <div className="pkg-stars">
                {[...Array(5)].map((_, i) => (
                  i < state.selectedPackage.rating ? (
                    <FaStar key={i} className="pkg-star pkg-star--filled" />
                  ) : (
                    <FaRegStar key={i} className="pkg-star" />
                  )
                ))}
              </div>
              <span>{state.selectedPackage.rating} ({state.selectedPackage.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        <div className="pkg-description">
          <h4>Tour Overview</h4>
          <p>{state.selectedPackage.description}</p>
        </div>

        <div className="pkg-highlights">
          <h4>Experience Highlights</h4>
          <div className="pkg-highlights__grid">
            {state.selectedPackage.highlights?.map((highlight, index) => (
              <div className="pkg-highlight" key={index}>
                <div className="pkg-highlight__number">{index + 1}</div>
                <p>{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pkg-inclusions">
          <h4>What's Included</h4>
          <div className="pkg-inclusions__grid">
            <div className="pkg-inclusion">
              <div className="pkg-inclusion__icon"><FaHotel /></div>
                            <div className="pkg-inclusion__details">
                <h4>Accommodation</h4>
                <p>{state.selectedPackage.hotel}</p>
              </div>
            </div>
            <div className="pkg-inclusion">
              <div className="pkg-inclusion__icon"><FaCar /></div>
              <div className="pkg-inclusion__details">
                <h4>Transport</h4>
                <p>{state.selectedPackage.vehicle}</p>
              </div>
            </div>
            <div className="pkg-inclusion">
              <div className="pkg-inclusion__icon"><FaUtensils /></div>
              <div className="pkg-inclusion__details">
                <h4>Meals</h4>
                <p>{state.selectedPackage.meals}</p>
              </div>
            </div>
            <div className="pkg-inclusion">
              <div className="pkg-inclusion__icon"><FaUserFriends /></div>
              <div className="pkg-inclusion__details">
                <h4>Group Size</h4>
                <p>{state.selectedPackage.groupSize}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="pkg-tabs">
        <button 
          className={`pkg-tab ${state.activeTab === 'itinerary' ? 'pkg-tab--active' : ''}`}
          onClick={() => setState(prev => ({ ...prev, activeTab: 'itinerary' }))}
        >
          Itinerary
        </button>
        <button 
          className={`pkg-tab ${state.activeTab === 'reviews' ? 'pkg-tab--active' : ''}`}
          onClick={() => setState(prev => ({ ...prev, activeTab: 'reviews' }))}
        >
          Reviews
        </button>
        <button 
          className={`pkg-tab ${state.activeTab === 'faq' ? 'pkg-tab--active' : ''}`}
          onClick={() => setState(prev => ({ ...prev, activeTab: 'faq' }))}
        >
          FAQ
        </button>
      </div>

      {/* Tab Content */}
      <div className="pkg-tab-content">
        {state.activeTab === 'itinerary' && (
          <div className="pkg-itinerary pkg-itinerary--timeline">
            {state.selectedPackage.itinerary?.map((day, index) => (
              <div 
                className={`pkg-timeline-item ${state.expandedDay === index ? 'pkg-timeline-item--expanded' : ''}`} 
                key={index}
              >
                <div className="pkg-timeline-marker"></div>
                <div className="pkg-timeline-content">
                  <div 
                    className="pkg-day__header" 
                    onClick={() => toggleDay(index)}
                  >
                    <div className="pkg-day__number">Day {index + 1}</div>
                    <h5 className="pkg-day__title">{day.title}</h5>
                    <FaChevronDown className={`pkg-chevron ${state.expandedDay === index ? 'pkg-chevron--expanded' : ''}`} />
                  </div>
                  {state.expandedDay === index && (
                    <div className="pkg-day__content">
                      <p className="pkg-day__description">{day.description}</p>
                      {day.activities && (
                        <>
                 <h5 style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;" }}>Activities:</h5>


                          <div className="pkg-activities">
                            {day.activities.map((activity, i) => (
                              <div className="pkg-activity" key={i}>
                                <div className="pkg-activity__icon">{activity.icon}</div>
                                <span className="pkg-activity__name">{activity.name}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {state.activeTab === 'reviews' && (
          <div className="pkg-reviews">
            <div className="pkg-reviews__header">
              <div className="pkg-rating-card">
                <div className="pkg-rating-card__value">{state.selectedPackage.rating}</div>
                <div className="pkg-stars">
                  {[...Array(5)].map((_, i) => (
                    i < Math.floor(state.selectedPackage.rating) ? (
                      <FaStar key={i} className="pkg-star pkg-star--filled" />
                    ) : (
                      <FaRegStar key={i} className="pkg-star" />
                    )
                  ))}
                </div>
                <div className="pkg-rating-card__count">{state.selectedPackage.reviewCount} reviews</div>
              </div>
            </div>
            
            <div className="pkg-review-list">
              {state.selectedPackage.reviews?.map((review, index) => (
                <div className="pkg-review" key={index}>
                  <div className="pkg-review__header">
                    <div className="pkg-review__avatar">{review.name.charAt(0)}</div>
                    <div className="pkg-review__info">
                      <h4 className="pkg-review__name">{review.name}</h4>
                      <div className="pkg-review__meta">
                        <div className="pkg-stars">
                          {[...Array(5)].map((_, i) => (
                            i < review.rating ? (
                              <FaStar key={i} className="pkg-star pkg-star--filled" />
                            ) : (
                              <FaRegStar key={i} className="pkg-star" />
                            )
                          ))}
                        </div>
                        <div className="pkg-review__date">{review.date}</div>
                      </div>
                    </div>
                    <FaQuoteLeft className="pkg-quote-icon" />
                  </div>
                  <p className="pkg-review__text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.activeTab === 'faq' && (
          <div className="pkg-faq">
            {state.selectedPackage.faqs?.map((faq, index) => (
              <div 
                className={`pkg-faq-item ${state.expandedFaq === index ? 'pkg-faq-item--expanded' : ''}`} 
                key={index}
              >
                <div 
                  className="pkg-faq-question" 
                  onClick={() => toggleFaq(index)}
                >
                  <h4>{faq.question}</h4>
                  <FaChevronDown className={`pkg-chevron ${state.expandedFaq === index ? 'pkg-chevron--expanded' : ''}`} />
                </div>
                {state.expandedFaq === index && (
                  <div className="pkg-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetails;