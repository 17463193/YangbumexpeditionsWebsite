import { useRef, useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { FaSpinner } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import "./Contact.css";

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
      .sendForm('service_g5vy013', 'template_vpwnoob', form.current, {
        publicKey: 'X4tpbC_P9duLCM_9u',
      })
      .then(
        () => {
          setSubmitStatus({
            success: true,
            message: 'Message sent successfully!'
          });
          setFormData({
            name: '',
            email: '',
            message: ''
          });
        },
        (error) => {
          setSubmitStatus({
            success: false,
            message: 'Failed to send message. Please try again.'
          });
          console.error('Email sending failed:', error);
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our team for any inquiries or feedback.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Information */}
        <div className="contact-info">
          <div className="info-card">
            <h2>Our Details</h2>
            
            <div className="contact-method">
              <div className="icon-circle">
                <FaPhone className="contact-icon" />
              </div>
              <div>
                <h3>Phone</h3>
                <p>+975-17942733</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="icon-circle">
                <FaEnvelope className="contact-icon" />
              </div>
              <div>  
                <h3>Email</h3>
                <p>yangbumexpeditions@gmail.com</p>
              </div>
            </div>

            <div className="contact-method">
              <div className="icon-circle">
                <FaMapMarkerAlt className="contact-icon" />
              </div>
              <div>
                <h3>Address</h3>
                <p>Thimphu, Bhutan</p>
              </div>
            </div>

            {/* <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" aria-label="Twitter"><FaTwitter /></a>
                <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#" aria-label="Instagram"><FaInstagram /></a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <form ref={form} className="contact-form" onSubmit={sendEmail}>
            <h2>Send a Message</h2>
            
            {submitStatus && (
              <div className={`status-message ${submitStatus.success ? "success" : "error"}`}>
                {submitStatus.message}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Your message"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>
            <input type="hidden" name="reply_to" value={formData.email} />

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  Sending...
                </>
              ) : (
                <>
                  <MdSend className="send-icon" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Our Location</h2>
          <p>Find us in beautiful Thimphu, Bhutan</p>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113032.12922145763!2d89.6053115!3d27.4727924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e1941c38e1a7a5%3A0x6d8a8b2cc6b3e3b4!2sThimphu%2C%20Bhutan!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Our Location in Thimphu"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;