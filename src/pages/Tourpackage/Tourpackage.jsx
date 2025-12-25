import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../LoadingPage/LoadingPage';
import ErrorPage from '../ErrorPage/ErrorPage';
import './Tourpackage.css';
import { db } from '../../service/firebase';
import { ref, get } from 'firebase/database';

const Card = ({ id, mainImage, title, description, tags, price }) => (
  <Link to={`/package/${id}`} className="card-link">
    <div className="card">
      <div className="card-image-container">
        <img src={mainImage} alt={title} className="card-image" />
        <div className="price-badge">${price}</div>
      </div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-description">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <div className="tags">
          {tags?.map((tag, index) => (
            <span key={index} className="tag">{tag.text}</span>
          ))}
        </div>
      </div>
    </div>
  </Link>
);

const Tourpackage = () => {
  const [allPackages, setAllPackages] = useState([]);
  const [displayedPackages, setDisplayedPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 9;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Reference to the packages node in Firebase
        const packagesRef = ref(db, 'packages');
        const snapshot = await get(packagesRef);
        
        if (!snapshot.exists()) {
          setAllPackages([]);
          setDisplayedPackages([]);
          return;
        }
        
        // Convert the snapshot to an array of packages
        const packagesData = [];
        snapshot.forEach((childSnapshot) => {
          packagesData.push({
            id: childSnapshot.key, // Use Firebase's auto-generated key as ID
            ...childSnapshot.val()
          });
        });
        
        setAllPackages(packagesData);
        setDisplayedPackages(packagesData);
      } catch (err) {
        setError(err.message || 'Failed to load packages');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    if (allPackages.length === 0) return;

    const filtered = allPackages.filter(pkg => {
      const matchesPlace = selectedPlace
        ? pkg.location.toLowerCase().includes(selectedPlace.toLowerCase()) ||
          pkg.title.toLowerCase().includes(selectedPlace.toLowerCase())
        : true;
      
      const matchesType = selectedType
        ? pkg.tags?.some(tag => 
            tag.text.toLowerCase().includes(selectedType.toLowerCase()) ||
            (tag.type === 'recommended' && selectedType.toLowerCase() === 'featured')
          )
        : true;
      
      return matchesPlace && matchesType;
    });

    setDisplayedPackages(filtered);
    setCurrentPage(1);
  }, [selectedPlace, selectedType, allPackages]);

  const handleClearFilters = () => {
    setSelectedPlace('');
    setSelectedType('');
  };

  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentPackages = displayedPackages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(displayedPackages.length / packagesPerPage);

  if (isLoading) {
    return <Loading message="Loading tour packages..." />;
  }

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="main-container">
      <div className="tour-section">
        <div className="tour-content">
          <h1 className="tour-title">Discover Bhutan's Hidden Treasures</h1>
          <p className="tour-subtitle">
            Experience the magic of the Himalayas with our exclusive tour packages
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="filter-card">
          <h3 className="filter-title">
            <i className="fas fa-filter"></i> Filter Packages
          </h3>
          <div className="filter-group">
            <label htmlFor="places-select" className="filter-label">
              <i className="fas fa-map-marker-alt"></i> Destination
            </label>
            <select
              id="places-select"
              onChange={(e) => setSelectedPlace(e.target.value)}
              value={selectedPlace}
              className="filter-select"
            >
              <option value="">All Destinations</option>
              <option value="thimphu">Thimphu</option>
              <option value="paro">Paro</option>
              <option value="punakha">Punakha</option>
              <option value="bumthang">Bumthang</option>
              <option value="gangtey">Gangtey</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-select" className="filter-label">
              <i className="fas fa-tags"></i> Package Type
            </label>
            <select
              id="type-select"
              onChange={(e) => setSelectedType(e.target.value)}
              value={selectedType}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="cultural">Cultural</option>
              <option value="festival">Festival</option>
              <option value="trekking">Trekking</option>
              <option value="wellness">Wellness</option>
              <option value="adventure">Adventure</option>
              <option value="spiritual">Spiritual</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <div className="filter-results">
            <p className="results-count">
              <i className="fas fa-mountain"></i> Showing {displayedPackages.length} packages
            </p>
            {(selectedPlace || selectedType) && (
              <button
                className="clear-filters"
                onClick={handleClearFilters}
              >
                <i className="fas fa-times"></i> Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="packages-section">
          {displayedPackages.length > 0 ? (
            <>
              <div className="card-grid">
                {currentPackages.map((pkg) => (
                  <Card key={pkg.id} {...pkg} />
                ))}
              </div>

              {displayedPackages.length > packagesPerPage && (
                <div className="pagination">
                  <button
                    className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
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
                        className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results-container">
              <i className="fas fa-compass no-results-icon"></i>
              <h3 className="no-results-title">No packages found</h3>
              <p className="no-results-message">
                {allPackages.length === 0
                  ? 'We currently have no tour packages available. Please check back later.'
                  : 'We couldn\'t find any packages matching your filters. Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tourpackage;