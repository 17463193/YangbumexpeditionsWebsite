import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase'; // Import your Firebase configuration
import { doc, getDoc } from 'firebase/firestore';
import './blogdetail.css';
import ErrorPage from '../ErrorPage/ErrorPage';
const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedData, setRelatedData] = useState({ blogs: [], offers: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the specific blog post
        const blogDocRef = doc(db, 'blogs', id);
        const blogSnapshot = await getDoc(blogDocRef);
        
        if (!blogSnapshot.exists()) {
          throw new Error('Blog post not found');
        }
        
        setBlog({ id: blogSnapshot.id, ...blogSnapshot.data() });

        // Fetch related data (blogs and offers)
        const blogsQuery = await getDocs(collection(db, 'blogs'));
        const offersQuery = await getDocs(collection(db, 'offers'));
        
        const blogsData = blogsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const offersData = offersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setRelatedData({
          blogs: blogsData.filter(b => b.id !== id),
          offers: offersData.filter(o => o.type === 'hotel')
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) {
    return <ErrorPage />;
  }  if (!blog) return <div className="blog-not-found">Blog post not found</div>;

  return (
    <div className="blog-detail-container">
      {/* Hero Section */}
      <div className="blog-hero">
        <div className="hero-image-container">
          <img 
            src={blog.img} 
            alt={blog.title} 
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="blog-meta">
            <span className="blog-date">{blog.date}</span>
            {blog.details.difficulty && (
              <span className="blog-difficulty">{blog.details.difficulty}</span>
            )}
          </div>
          <h1 className="blog-title">{blog.title}</h1>
          <p className="blog-excerpt">{blog.content}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="blog-main-content">
        <div className="blog-content-wrapper">
          {/* Article Content */}
          <article className="blog-article">
            <div className="article-content">
              <p className="blog-full-content">{blog.details.fullContent}</p>
              
              {/* Additional Images */}
              {blog.details.images && blog.details.images.length > 0 && (
                <div className="blog-gallery">
                  {blog.details.images.map((image, index) => (
                    <div key={index} className="gallery-item">
                      <img src={image} alt={`${blog.title} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Dynamic Details Sections */}
              {blog.details.difficulty && (
                <div className="detail-section">
                  <h3>Trek Details</h3>
                  <div className="detail-grid">
                    <div className="detail-card">
                      <span className="detail-label">Difficulty</span>
                      <span className="detail-value">{blog.details.difficulty}</span>
                    </div>
                    {blog.details.distance && (
                      <div className="detail-card">
                        <span className="detail-label">Distance</span>
                        <span className="detail-value">{blog.details.distance}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {blog.details.bestFestivals && (
                <div className="detail-section">
                  <h3>Best Festivals</h3>
                  <ul className="festival-list">
                    {blog.details.bestFestivals.map((festival, index) => (
                      <li key={index}>{festival}</li>
                    ))}
                  </ul>
                </div>
              )}

              {blog.details.topCrafts && (
                <div className="detail-section">
                  <h3>Featured Crafts</h3>
                  <div className="crafts-grid">
                    {blog.details.topCrafts.map((craft, index) => (
                      <div key={index} className="craft-card">
                        <span className="craft-icon">{['🧵', '🎨', '🎋'][index] || '✨'}</span>
                        <span>{craft}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-card">
              <h4>Related Posts</h4>
              <div className="related-posts">
                {relatedData.blogs
                  .slice(0, 2)
                  .map(post => (
                    <div key={post.id} className="related-post">
                      <img src={post.img} alt={post.title} />
                      <div>
                        <h5>{post.title}</h5>
                        <span>{post.date}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="sidebar-card">
              <h4>Featured Hotels</h4>
              <div className="featured-hotels">
                {relatedData.offers
                  .slice(0, 2)
                  .map(hotel => (
                    <div key={hotel.id} className="featured-hotel">
                      <img src={hotel.img} alt={hotel.label} />
                      <div>
                        <h5>{hotel.label}</h5>
                        <span>{hotel.details.location}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;