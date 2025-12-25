import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../service/firebase';
import './Navbar.css';

const Navbar = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef(null);

  // Check viewport size and set mobile state
  useEffect(() => {
    const checkViewport = () => {
      setIsMobileView(window.innerWidth <= 992);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch destinations from Firebase
  useEffect(() => {
    const fetchDestinations = () => {
      const destinationsRef = ref(db, 'destinations');
      onValue(
        destinationsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const destinationsArray = Object.keys(data).map((key) => ({
              _id: key,
              ...data[key],
            }));
            setDestinations(destinationsArray);
          } else {
            setError('No destinations found.');
          }
          setLoading(false);
        },
        (error) => {
          console.error('Firebase fetch error:', error);
          setError('Failed to load destinations.');
          setLoading(false);
        }
      );
    };
    fetchDestinations();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.classList.contains('mobile-menu-button') &&
          !navbarRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const toggleDropdown = (e) => {
    e.preventDefault();
    if (isMobileView) {
      // On mobile, keep dropdown open until explicitly closed
      setDropdownOpen(prev => !prev);
    } else {
      // On desktop, toggle normally
      setDropdownOpen(prev => !prev);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
    // Close dropdown when mobile menu is toggled
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (!isMobileView) setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobileView) setDropdownOpen(false);
  };

  const handleDestinationClick = (destination) => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(`/destinations/${encodeURIComponent(destination.location)}`, {
      state: { destination },
      replace: false
    });
  };

  return (
    <nav className={`custom-navbar ${scrolled ? 'scrolled-up' : ''}`} ref={navbarRef}>
      <div className="navbar-inner-container">
        {/* Logo Floating */}
        <div className="logo-floating">
          <Link to="/">
            <img src="../assets/img/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <ul className="desktop-menu">
          <li>
            <Link to="/" className="menu-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="menu-link">
              About
            </Link>
          </li>
          <li>
            <Link to="/packages" className="menu-link">
              Tour Packages
            </Link>
          </li>
          <li>
            <Link to="/festivals" className="menu-link">
              Festivals
            </Link>
          </li>

          {/* Destinations Dropdown */}
          <li
            className="has-dropdown"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="#"
              className={`menu-link ${dropdownOpen ? 'active' : ''}`}
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Destinations
              <span className="arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>

            {/* Dropdown Content */}
            <div 
              className={`dropdown-menu-simple ${dropdownOpen ? 'show' : ''}`}
              aria-hidden={!dropdownOpen}
            >
              <div className="dropdown-header">
                <h5>Explore Bhutan</h5>
                <p>Discover our beautiful destinations</p>
              </div>
              <div className="dropdown-content">
                {loading ? (
                  <div className="dropdown-loading">
                    <div className="spinner"></div>
                    <span>Loading destinations...</span>
                  </div>
                ) : error ? (
                  <div className="dropdown-error">{error}</div>
                ) : destinations.length > 0 ? (
                  destinations.map((destination) => (
                    <button
                      key={destination._id}
                      className="dropdown-item-button"
                      onClick={() => handleDestinationClick(destination)}
                    >
                      <span className="destination-name">{destination.location}</span>
                      {destination.region && (
                        <span className="destination-region"> - {destination.region}</span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="dropdown-empty">No destinations available</div>
                )}
              </div>
            </div>
          </li>

          <li>
            <Link to="/contact" className="menu-link">
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button - Right side */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu - Appears below navbar */}
      <div 
        className={`mobile-menu-container ${mobileMenuOpen ? 'open' : ''}`}
        ref={mobileMenuRef}
        aria-hidden={!mobileMenuOpen}
      >
        <ul className="mobile-menu">
          <li>
            <Link to="/" className="menu-link" onClick={toggleMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="menu-link" onClick={toggleMobileMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="/packages" className="menu-link" onClick={toggleMobileMenu}>
              Tour Packages
            </Link>
          </li>
          <li>
            <Link to="/festivals" className="menu-link" onClick={toggleMobileMenu}>
              Festivals
            </Link>
          </li>
          
          {/* Mobile Destinations Dropdown */}
          <li className="has-dropdown">
            <button
              className={`menu-link dropdown-toggle ${dropdownOpen ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setDropdownOpen(!dropdownOpen);
              }}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Destinations
              <span className="arrow">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div 
              className={`mobile-dropdown-content ${dropdownOpen ? 'open' : ''}`}
              aria-hidden={!dropdownOpen}
            >
              {loading ? (
                <div className="dropdown-loading">
                  <div className="spinner"></div>
                  <span>Loading destinations...</span>
                </div>
              ) : error ? (
                <div className="dropdown-error">{error}</div>
              ) : destinations.length > 0 ? (
                destinations.map((destination) => (
                  <button
                    key={destination._id}
                    className="dropdown-item-button"
                    onClick={() => {
                      handleDestinationClick(destination);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="destination-name">{destination.location}</span>
                    {destination.region && (
                      <span className="destination-region"> - {destination.region}</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="dropdown-empty">No destinations available</div>
              )}
            </div>
          </li>

          <li>
            <Link to="/contact" className="menu-link" onClick={toggleMobileMenu}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;