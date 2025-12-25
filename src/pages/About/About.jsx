import React from "react";
import './About.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Discover Our Story</h1>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="content-container">
          <div className="about-image">
            <img src="assets/img/about.jpg" alt="" />
          </div>
          
          <div className="about-text">
            <h2>Welcome to <span className="highlight">Yangbum Expeditions</span></h2>
            <div className="section-divider"></div>          
            <p className="intro-text">
              Founded in 2011 by seven brothers from the same family, we bring good fortune to travelers 
              through our deep-rooted Bhutanese heritage and spiritual connection. In Buddhist tradition, seven brothers from one family are considered an auspicious sign - 
                just as Lord Buddha took seven steps at birth in Lumbini.
            </p>          
          </div>
        </div>
      </section>

  
{/* Gallery */}
<section id="gallery" className="photo-gallery">
  <div className="gallery-header">
    <h2>Our Gallery</h2>
    <div className="section-divider center"></div>
    <p>Moments from our travelers' journeys</p>
  </div>

  <div className="gallery-slider-container">
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="gallery-swiper"
    >
      {[
        "/assets/img/About/tourist.jpg",
        "/assets/img/About/tourist2.jpg",
        "/assets/img/About/paro.jpg",
        "/assets/img/About/phajoding.jpg",
        "/assets/img/About/Drukgyal.jpg",
        "/assets/img/About/druk-asia-tourists.jpg"
      ].map((img, index) => (
        <SwiperSlide key={index}>
          <div className="slider-card">
            <img src={img} alt={`Gallery ${index + 1}`} />
            <div className="image-overlay"></div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</section>



      {/* Services */}
      <section id="servic" className="our-services">
        <div className="services-container">
          <div className="services-intro">
            <h2>Our Exclusive Services</h2>
            <div className="section-divider"></div>
            <p>
              We maintain strong partnerships with Bhutan's finest hotels and venues to deliver 
              exceptional value and unforgettable experiences.
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-category">
              <h3>Cultural Journeys</h3>
              <ul>
                <li>Heritage Tours</li>
                <li>Temple Visits</li>
                <li>Festival Experiences</li>
              </ul>
            </div>
            
            <div className="service-category">
              <h3>Adventure Tours</h3>
              <ul>
                <li>Trekking Expeditions</li>
                <li>Mountain Biking</li>
                <li>River Activities</li>
              </ul>
            </div>
            
            <div className="service-category">
              <h3>Specialty Travel</h3>
              <ul>
                <li>Spiritual Retreats</li>
                <li>Photography Tours</li>
                <li>Wellness Holidays</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
   

      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2>Traveler Stories</h2>
            <div className="section-divider center"></div>
            <p>Hear from our global community</p>
          </div>
          
          <div className="testimonial-cards">
            {[
              {
                name: "Sarah Johnson",
                location: "London, UK",
                text: "The most authentic Bhutan experience imaginable. The brothers' personal connections made us feel like family.",
                img: "../assets/img/testimonal/sarah.jpg"
              },
              {
                name: "Michael Chen",
                location: "Singapore",
                text: "Every detail was perfect - from the luxury accommodations to the hidden temple visits only locals know about.",
                img: "../assets/img/testimonal/chen_michael_1.jpg"
              },
              {
                name: "Chai",
                location: "Hongkong City",
                text: "Their knowledge of Bhutanese art and culture transformed our trip into a true educational journey.",
                img: "../assets/img/testimonal/x.png"
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-img">
                  <img src={testimonial.img} alt={testimonial.name} />
                </div>
                <div className="testimonial-content">
                  <h4>{testimonial.name}</h4>
                  <p className="location">{testimonial.location}</p>
                  <p className="quote">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;