import React, { useState, useEffect } from 'react';
import './Sub_header.css';
import {Link } from 'react-router-dom';
const Navbarhero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides = [
    {
      image: "https://i0.wp.com/theluxurytravelexpert.com/wp-content/uploads/2019/10/bhutan-sightseeing-things-to-see-do-attractions.jpg?fit=1920%2C1080&ssl=1",
      title: "Discover\nBhutan",
      subtitle: "Land of the Thunder Dragon",
      description: "Explore the rich cultural heritage and stunning architecture of Bhutan's landmarks.",
      location: "Paro, Bhutan"
    },
    {
      image: "/assets/img/booking1.jpg",
      title: "Unforgettable\nJourneys",
      subtitle: "Himalayan Adventures",
      description: "Embark on breathtaking adventures through Bhutan's pristine landscapes.",
      location: "Thimphu, Bhutan"
    },
    {
      image: "./assets/img/punakhabg.jpg",
      title: "Spiritual\nRetreats",
      subtitle: "Find Your Inner Peace",
      description: "Discover tranquility in Bhutan's sacred monasteries and retreats.",
      location: "Punakha, Bhutan"
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="hero-slider">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="slide-overlay"></div>
          <div className="slide-content">
           
            <h1 className="main-title">
              {slide.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < slide.title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <h2 className="subtitle">{slide.subtitle}</h2>
            <p className="description">{slide.description}</p>
             <Link to="/contact" className="contact-btn">
                Contact
              </Link>
              
          </div>
        </div>
      ))}
    
      {/* Navigation */}
      <div className="navigation">
        <button className="nav-btn" onClick={prevSlide} aria-label="Previous slide">
          <i className="fas fa-chevron-left"></i>
        </button>

        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button 
          className="play-btn" 
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>

        <button className="nav-btn" onClick={nextSlide} aria-label="Next slide">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className={`progress-fill ${isPlaying ? 'playing' : ''}`}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default Navbarhero;