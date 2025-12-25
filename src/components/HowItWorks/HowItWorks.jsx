import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './HowItWorks.css'; // Import the CSS file below

const HowItWorks = () => {
  const steps = [
    {
      title: "Expert Guidance",
      description:
        "Embark on a smooth and hassle-free travelling experience with expert guidance and seamless assistance throughout your journey."
    },
    {
      title: "Review Listings",
      description:
        "Get valuable insights about listings and share your experiences by leaving reviews for businesses."
    },
    {
      title: "Authentic experiences",
      description:
        "Our tour operators will ensure that you have an authentic travelling experience that will allow acknowledge the rich culture of Bhutan."
    },
    {
      title: "Custom tours",
      description:
        "We specialize in curating tours tailored to your travelling needs and budget ensuring you a unique travelling experience."
    },
    {
      title: "Track Appointments",
      description:
        "Manage all your appointments and reviews in one place with your personalized dashboard."
    }
  ];

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className="container-xxl wow fadeInUp" data-wow-delay="0.1s" id="how-it-works">
      <div className="container text-center">
        <h4 className="section-title">Why Choose Us?</h4>
        <div className="section-underline"></div>
        <Slider {...settings}>
          {steps.map((step, index) => (
            <div className="slide-item" key={index}>
              <div className="card-testimonial">
                <p className="card-title">{step.title}</p>
                <p className="card-desc">{step.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HowItWorks;
