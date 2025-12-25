import React from 'react';
import './Service.css';  // create this CSS file next

const Services = () => {
  return (
    <section id="services" className="py-5">
      <div className="container">
        <div className="title-wrap">
          <span className="sm-title">know about services that we offer</span>
          <h2 className="lg-title">Our services</h2>
        </div>

        <div className="services-row">
          <div className="services-item">
            <span className="services-icon">
              <i className="fas fa-hotel"></i>
            </span>
            <h3>Luxurious Hotel</h3>
            <p className="text">
              We provide carefully selected luxurious hotels that offer comfort, elegance, and world-class hospitality. Our partner hotels feature modern amenities, scenic views, fine dining options, and exceptional service to ensure a relaxing and memorable stay for every traveler.
            </p>
          </div>

          <div className="services-item">
            <span className="services-icon">
              <i className="fas fa-map-marked-alt"></i>
            </span>
            <h3>Travel Guide</h3>
            <p className="text">
             Our experienced travel guides help you explore destinations with ease and confidence. From cultural insights and local traditions to hidden attractions and historical landmarks, our guides ensure you experience the true essence of every place you visit.
            </p>
          </div>

          <div className="services-item">
            <span className="services-icon">
              <i className="fas fa-money-bill"></i>
            </span>
            <h3>Suitable Price</h3>
            <p className="text">
              We offer travel packages at affordable and transparent prices without compromising on quality. Our flexible pricing options are designed to suit different budgets, ensuring you get the best value for your money with no hidden costs.            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
