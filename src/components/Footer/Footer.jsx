import React, { useState, useEffect } from 'react';
import './Footer.css';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaChevronDown,
  FaChevronUp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane
} from 'react-icons/fa';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const faqs = [
    {
      question: 'Why Choose Yangbum Expeditions?',
      answer: 'We offer personalized tours, experienced guides, and seamless travel planning to make your Himalayan adventure truly unforgettable.',
    },
    {
      question: "What's the best time to visit?",
      answer: 'The ideal time varies by destination. For Bhutan, visit between October-November; for Bhutan, March-May or September-November offer perfect weather and vibrant festivals.',
    },
    {
      question: 'Are your tours customizable?',
      answer: 'Absolutely! We specialize in tailoring experiences to match your interests, fitness level, and schedule for a perfect Himalayan journey.',
    },
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, color: '#3b5998', name: 'Facebook', url: '#' },
    { icon: <FaInstagram />, color: '#e1306c', name: 'Instagram', url: '#' },
    { icon: <FaTwitter />, color: '#1da1f2', name: 'Twitter', url: '#' },
    { icon: <FaLinkedinIn />, color: '#0077b5', name: 'LinkedIn', url: '#' },
    { icon: <FaYoutube />, color: '#ff0000', name: 'YouTube', url: '#' },
  ];

  // const partners = [
  //   { name: 'Bhutan Heavenly', logo: '../assets/img/partner-ntb.png' },
  //   { name: 'Druk', logo: '../assets/img/partner-taan.png' },
  //   { name: 'TripAdvisor', logo: '../assets/img/partner-tripadvisor.png' },
  // ];
  // const paymentMethods = [
  //   { name: 'Visa', logo: '../assets/img/trip.png' },
  //   { name: 'MasterCard', logo: '../assets/img/mastercard.png' },
  //   { name: 'PayPal', logo: '../assets/img/paypal.png' },
  //   { name: 'American Express', logo: '../assets/img/amex.png' },
  // ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30,
      opacity: 0,
      transition: { ease: [0.455, 0.03, 0.515, 0.955], duration: 0.7 }
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        ease: [0.455, 0.03, 0.515, 0.955],
        duration: 0.7
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.footer 
      className="footer"
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
    >
      <div className="footer-background-elements">
        <div className="footer-particle footer-particle-1"></div>
        <div className="footer-particle footer-particle-2"></div>
        <div className="footer-particle footer-particle-3"></div>
      </div>
      
      <div className="mountain-silhouette"></div>

      <div className="footer-container">
        <div className="footer-top">
          <motion.div className="footer-brand" variants={itemVariants}>
            <div className="logo-wrapper">
              <img 
                src="../assets/img/logo.png"
                alt="yangbum expeditions" 
                className="footer-logo"
              />
               
              <motion.span 
                className="logo-text"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Yangbum Expeditions
              </motion.span>
            </div>
            
            <motion.p className="brand-tagline" variants={fadeInVariants}>
              Crafting extraordinary Himalayan experiences with passion, expertise, and deep local knowledge.
            </motion.p>
            
           
          </motion.div>

          <motion.div className="footer-links" variants={itemVariants}>
            <h4 className="footer-column-title">Explore More</h4>
            <ul className="footer-nav-links">
              {[
  { text: 'About Our Company', url: '/about' },
  { text: 'Tour Packages', url: '/packages' },
  { text: 'Travel Blog', url: '/terms' },
  { text: 'Festivals', url: '/festivals' },
].map((link, index) => (
  <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
    <Link to={link.url} className="nav-link">
      <span className="link-arrow">↠</span>
      {link.text}
    </Link>
  </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer-faqs" variants={itemVariants}>
            <h4 className="footer-column-title">Travel Help</h4>
            <ul className="accordion-list">
              {faqs.map((item, index) => (
                <motion.li 
                  key={index} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.button 
                    className={`accordion-header ${openIndex === index ? 'active' : ''}`}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-${index}`}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <span className="accordion-title">{item.question}</span>
                    <motion.span 
                      className="accordion-icon"
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                    >
                      <FaChevronDown />
                    </motion.span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        id={`faq-${index}`}
                        className="accordion-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: 1,
                          height: 'auto',
                          transition: {
                            opacity: { duration: 0.3 },
                            height: { duration: 0.4 }
                          }
                        }}
                        exit={{ 
                          opacity: 0,
                          height: 0,
                          transition: {
                            opacity: { duration: 0.2 },
                            height: { duration: 0.3 }
                          }
                        }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer-contact" variants={itemVariants}>
            <h4 className="footer-column-title">Stay Connected</h4>
            
            <div className="contact-info">
              <div className="contact-method">
                <div className="contact-icon-circle">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="contact-label">Call Us</p>
                  <a href="tel:+975-17942733" className="contact-value">+975-17942733</a>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon-circle">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="contact-label">Email Us</p>
                  <a href="mailto:yangbumexpeditions@gmail.com" className="contact-value">yangbumexpeditions@gmail.com</a>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon-circle">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="contact-label">Visit Us</p>
                  <p className="contact-value">Bhutan, Thimphu</p>
                </div>
              </div>
            </div>
            
            <motion.form 
              className="newsletter-form"
              onSubmit={handleSubscribe}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
    
            </motion.form>
          </motion.div>
        </div>

        <motion.div 
          className="footer-middle"
          variants={fadeInVariants}
          transition={{ delay: 0.3 }}
        >
          {/* <div className="partners-section">
            <h5 className="section-subtitle">Our Trusted Partners</h5>
            <div className="partners-grid">
         {partners.map((partner, index) => (
  <motion.div
    key={index}
    className="partner-logo-container"
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      type: "spring",
      stiffness: 300,
      delay: 0.1 * index
    }}
  >
    <img 
      src={partner.logo} 
      alt={partner.name} 
      className="partner-logo"
    />
  </motion.div>
))}
            </div>
          </div> */}
{/*           
          <div className="payments-section">
            <h5 className="section-subtitle">Secure Payment Methods</h5>
            <div className="payments-grid">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={index}
                  className="payment-method"
                  whileHover={{ scale: 1.1 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <img 
                    src={method.logo} 
                    alt={method.name} 
                    className="payment-logo"
                  />
                </motion.div>
              ))}
            </div>
          </div> */}
        </motion.div>

        <motion.div 
          className="footer-bottom"
          variants={fadeInVariants}
          transition={{ delay: 0.4 }}
        >

          
         <div className="footer-bottom-center">
  <motion.a 
    href="/terms"
    whileHover={{ color: '#cc2323ff' }}
    transition={{ duration: 0.2 }}
    className="footer-link"
  >
    Terms of Service
  </motion.a>
  <span className="divider">•</span>
  <p className="copyright">
    © {new Date().getFullYear()} Yangbum Expeditions All Rights Reserved.
  </p>
</div>

          
        </motion.div>
      </div>
    </motion.footer>
  );
};

// Helper function to convert hex to rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default Footer;