import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorPage from '../ErrorPage/ErrorPage';
import { FaSpinner, FaFilter, FaTimes, FaSearch, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Loading from '../LoadingPage/LoadingPage';
import './FestivalList.css';
import { db } from '../../service/firebase';
import { ref, get } from 'firebase/database';

const FestivalCard = ({ id, image, name, type, location, date, description, highlights }) => (
  <Link to={`/festival/${id}`} className="bhutan-festival-card-link">
    <div className="bhutan-festival-card">
      <div
        className="bhutan-festival-image-container"
        style={{ 
          backgroundImage: image 
            ? `url(${image})` 
            : 'linear-gradient(135deg, #f5f5f5, #e0e0e0)'
        }}
      >
        <div className="bhutan-festival-type-tag">
          {type === 'religious' ? 'Tshechu' : type?.charAt(0).toUpperCase() + type?.slice(1)}
        </div>
        <div className="bhutan-image-overlay"></div>
      </div>
      <div className="bhutan-festival-details">
        <h3 className="bhutan-festival-title">{name}</h3>
        <div className="bhutan-festival-meta">
          <div className="bhutan-meta-item">
            <FaMapMarkerAlt className="bhutan-meta-icon" />
            {location?.city}, {location?.dzongkhag}
          </div>
          <div className="bhutan-meta-item">
            <FaCalendarAlt className="bhutan-meta-icon" />
            {date}
          </div>
        </div>
        <p className="bhutan-festival-description">
          {typeof description === 'string' ? 
            description.length > 100 ? description.substring(0, 100) + '...' : description : 
            Array.isArray(description) ? 
              (description[0] || 'Experience this vibrant Bhutanese festival').substring(0, 100) + '...' :
              'Experience this vibrant Bhutanese festival'}
        </p>
        {highlights && (
          <div className="bhutan-festival-highlights">
            {highlights.slice(0, 2).map((highlight, index) => (
              <span key={index} className="bhutan-highlight-tag">
                {highlight.title || highlight}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </Link>
);

const FestivalList = () => {
  const [allFestivals, setAllFestivals] = useState([]);
  const [displayedFestivals, setDisplayedFestivals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const festivalsPerPage = 9;

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Reference to the festivals node in Firebase
        const festivalsRef = ref(db, 'festivals');
        const snapshot = await get(festivalsRef);
        
        if (!snapshot.exists()) {
          setAllFestivals([]);
          setDisplayedFestivals([]);
          return;
        }
        
        // Convert the snapshot to an array of festivals
        const festivalsData = [];
        snapshot.forEach((childSnapshot) => {
          festivalsData.push({
            id: childSnapshot.key, // Use Firebase's auto-generated key as ID
            ...childSnapshot.val()
          });
        });
        
        setAllFestivals(festivalsData);
        setDisplayedFestivals(festivalsData);
      } catch (err) {
        setError(err.message || 'Failed to load festivals');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  useEffect(() => {
    if (!Array.isArray(allFestivals)) return;

    const filtered = allFestivals.filter(festival => {
      const matchesSearch = searchQuery
        ? (festival.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (festival.location?.city?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (festival.location?.dzongkhag?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        : true;
      
      const matchesCategory = selectedCategory !== 'all'
        ? festival.type === selectedCategory
        : true;
      
      const matchesMonth = selectedMonth !== 'all'
        ? (festival.date?.toLowerCase() || '').startsWith(selectedMonth.toLowerCase())
        : true;
      
      return matchesSearch && matchesCategory && matchesMonth;
    });

    setDisplayedFestivals(filtered);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedMonth, allFestivals]);

  const allMonths = Array.from(
    new Set(
      (Array.isArray(allFestivals) ? allFestivals : []).flatMap(f => {
        const monthMatch = f.date?.match(/^(\w+)/);
        return monthMatch ? [monthMatch[1]] : [];
      })
    )
  ).filter(Boolean).sort();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMonth('all');
  };

  const indexOfLastFestival = currentPage * festivalsPerPage;
  const indexOfFirstFestival = indexOfLastFestival - festivalsPerPage;
  const currentFestivals = displayedFestivals.slice(indexOfFirstFestival, indexOfLastFestival);
  const totalPages = Math.ceil(displayedFestivals.length / festivalsPerPage);

  if (isLoading) {
    return <Loading message="Loading Festivals..." />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="bhutan-festivals-page">
      <div className="bhutan-festivals-hero-banner">
        <div className="bhutan-hero-content-container">
          <h1 className="bhutan-festivals-main-heading">Bhutan's Vibrant Festivals</h1>
          <p className="bhutan-festivals-subheading">
            Immerse yourself in the rich cultural tapestry of Bhutan through its colorful celebrations
          </p>
        </div>
      </div>

      <div className="bhutan-content-wrapper">
        <div className="bhutan-festivals-main-container">
          <button 
            className="bhutan-mobile-filter-toggle"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <FaFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className={`bhutan-filter-card ${showMobileFilters ? 'bhutan-mobile-visible' : ''}`}>
            <button 
              className="bhutan-close-mobile-filters"
              onClick={() => setShowMobileFilters(false)}
            >
              <FaTimes />
            </button>
            
            <h3 className="bhutan-filter-title">
              <FaFilter /> Filter Festivals
            </h3>
            
            <div className="bhutan-filter-group">
              <label htmlFor="search-input" className="bhutan-filter-label">
                <FaSearch /> Search
              </label>
              <input
                type="text"
                id="search-input"
                placeholder="Search festivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bhutan-filter-select"
              />
            </div>

            <div className="bhutan-filter-group">
              <label htmlFor="category-select" className="bhutan-filter-label">
                Category
              </label>
              <select
                id="category-select"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
                className="bhutan-filter-select"
              >
                <option value="all">All Categories</option>
                <option value="religious">Tshechus</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            <div className="bhutan-filter-group">
              <label htmlFor="month-select" className="bhutan-filter-label">
                <FaCalendarAlt /> Month
              </label>
              <select
                id="month-select"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
                className="bhutan-filter-select"
              >
                <option value="all">All Months</option>
                {allMonths.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="bhutan-filter-results">
              <p className="bhutan-results-count">
                Showing {displayedFestivals.length} festivals
              </p>
              {(searchQuery || selectedCategory !== 'all' || selectedMonth !== 'all') && (
                <button className="bhutan-clear-filters" onClick={handleResetFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="bhutan-packages-section">
            <div className="bhutan-results-summary">
              <h3>
                {displayedFestivals.length} {displayedFestivals.length === 1 ? 'Festival' : 'Festivals'} Found
              </h3>
              {displayedFestivals.length !== allFestivals.length && (
                <button className="bhutan-clear-filters-btn" onClick={handleResetFilters}>
                  Clear all filters
                </button>
              )}
            </div>

            {currentFestivals.length > 0 ? (
              <>
                <div className="bhutan-festivals-grid">
                  {currentFestivals.map((festival) => (
                    <FestivalCard key={festival.id} {...festival} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="bhutan-pagination">
                    <button
                      className={`bhutan-pagination-button ${currentPage === 1 ? 'bhutan-disabled' : ''}`}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          className={`bhutan-pagination-button ${currentPage === pageNum ? 'bhutan-active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      className={`bhutan-pagination-button ${currentPage === totalPages ? 'bhutan-disabled' : ''}`}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bhutan-no-results-container">
                <h3 className="bhutan-no-results-title">No festivals found</h3>
                <p className="bhutan-no-results-message">
                  {allFestivals.length === 0
                    ? 'We currently have no festivals available. Please check back later.'
                    : 'We couldn\'t find any festivals matching your filters. Try adjusting your search criteria.'}
                </p>
                <button className="bhutan-primary-action-btn" onClick={handleResetFilters}>
                  Show All Festivals
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalList;