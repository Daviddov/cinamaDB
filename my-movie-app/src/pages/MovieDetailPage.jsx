// src/pages/MovieDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Heart,
  Play,
  Share2,
  User,
  Film
} from 'lucide-react';
import { tmdbService } from '../services/tmdbApi';
import TrailerGallery from '../components/movies/TrailerGallery';


const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'trailers', 'cast'
  const [showTrailerGallery, setShowTrailerGallery] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const movieData = await tmdbService.getMovieDetails(id);
        setMovie(movieData);

        // בדיקה אם הסרט במועדפים
        const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
        setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
      } catch (err) {
        setError('שגיאה בטעינת פרטי הסרט');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);
  useEffect(() => {
    if (activeTab === 'trailers') {
      setShowTrailerGallery(true);
    }
  }, [activeTab]);

  // או לחלופין, שנה את הטיפול בלחיצה על הכרטיסייה:
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'trailers') {
      setShowTrailerGallery(true);
    }
  };
  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');

    if (isFavorite) {
      // הסרה מהמועדפים
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      // הוספה למועדפים
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
      setIsFavorite(true);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'לא ידוע';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'לא ידוע';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')} שעות`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('הקישור הועתק ללוח');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="loading">
          <div className="spinner"></div>
          <p>טוען פרטי הסרט...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="error-message">
          <h2>שגיאה בטעינת הסרט</h2>
          <p>{error || 'הסרט לא נמצא'}</p>
          <button onClick={() => navigate('/movies')} className="btn btn-primary">
            חזור לרשימת הסרטים
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="movie-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section with Backdrop */}
      <div
        className="movie-hero"
        style={{
          backgroundImage: movie.backdrop_path ? `url(${movie.backdrop_path})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          minHeight: '500px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, var(--bg-color), transparent 50%, var(--bg-color))',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '2rem 1rem' }}>
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '2rem' }}
          >
            <Link to="/movies" className="btn btn-outline">
              <ArrowLeft size={18} />
              חזור לרשימת הסרטים
            </Link>
          </motion.div>

          {/* Movie Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src={movie.poster_path || 'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Image'}
                alt={movie.title}
                style={{
                  width: '250px',
                  height: '375px',
                  objectFit: 'cover',
                  borderRadius: 'var(--border-radius)',
                  boxShadow: 'var(--shadow)',
                }}
              />
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }} className="gradient-text">
                {movie.title}
              </h1>

              {movie.original_title && movie.original_title !== movie.title && (
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {movie.original_title}
                </h2>
              )}

              {movie.tagline && (
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                  "{movie.tagline}"
                </p>
              )}

              {/* Stats */}
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Star size={20} color="var(--primary-color)" fill="var(--primary-color)" />
                  <span style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                    {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    ({movie.vote_count?.toLocaleString()} דירוגים)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={18} color="var(--primary-color)" />
                  <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'לא ידוע'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="var(--primary-color)" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        style={{
                          background: 'rgba(255, 215, 0, 0.2)',
                          color: 'var(--primary-color)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: 'var(--border-radius)',
                          fontSize: '0.9rem',
                          border: '1px solid rgba(255, 215, 0, 0.3)',
                        }}
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <motion.button
                  onClick={() => setShowTrailerGallery(true)}
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={18} />
                  צפה בטריילר
                </motion.button>

                <motion.button
                  onClick={handleToggleFavorite}
                  className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: isFavorite ? '#e91e63' : 'transparent',
                    borderColor: isFavorite ? '#e91e63' : 'var(--primary-color)',
                    color: isFavorite ? 'white' : 'var(--primary-color)',
                  }}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  {isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={18} />
                  שתף
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Sections with Tabs */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        {/* Tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
          overflow: 'auto'
        }}>
          {[
            { id: 'overview', label: 'סקירה', icon: Film },
            { id: 'trailers', label: 'טריילרים', icon: Play },
            { id: 'cast', label: 'שחקנים', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)} // שינוי כאן
                style={{
                  padding: '1rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: 'fit-content'
                }}
                whileHover={{ color: 'var(--primary-color)' }}
              >
                <Icon size={18} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '3rem'
            }}>
              {/* Left Column - Overview */}
              <div>
                {movie.overview && (
                  <section style={{ marginBottom: '3rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                      עלילה
                    </h3>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                      {movie.overview}
                    </p>
                  </section>
                )}
              </div>

              {/* Right Column - Movie Details */}
              <div>
                <div className="card">
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                    פרטי הסרט
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {movie.director && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>במאי:</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <User size={16} color="var(--primary-color)" />
                          <span style={{ color: 'var(--text-secondary)' }}>{movie.director}</span>
                        </div>
                      </div>
                    )}

                    {movie.budget > 0 && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>תקציב:</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <DollarSign size={16} color="var(--primary-color)" />
                          <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(movie.budget)}</span>
                        </div>
                      </div>
                    )}

                    {movie.revenue > 0 && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>הכנסות:</strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                          <DollarSign size={16} color="var(--primary-color)" />
                          <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(movie.revenue)}</span>
                        </div>
                      </div>
                    )}

                    {movie.homepage && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>אתר רשמי:</strong>
                        <div style={{ marginTop: '0.25rem' }}>
                          <a
                            href={movie.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: 'var(--primary-color)',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            <Globe size={16} />
                            בקר באתר
                          </a>
                        </div>
                      </div>
                    )}

                    {movie.original_language && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>שפה מקורית:</strong>
                        <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                          {movie.original_language.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {movie.status && (
                      <div>
                        <strong style={{ color: 'var(--text-color)' }}>סטטוס:</strong>
                        <span style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }}>
                          {movie.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trailers' && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: '4rem', marginBottom: '1rem' }}
              >
                              </motion.div>
          <TrailerGallery
            movieId={movie.id}
            movieTitle={movie.title}
            isOpen={showTrailerGallery}
            onClose={() => setShowTrailerGallery(false)}
          />

            </div>
          )}

          {activeTab === 'cast' && movie.cast && movie.cast.length > 0 && (
            <section>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                שחקנים ראשיים
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1.5rem'
              }}>
                {movie.cast.map((actor, index) => (
                  <motion.div
                    key={actor.id}
                    className="card"
                    style={{ textAlign: 'center', padding: '1.5rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <img
                      src={actor.profile_path || 'https://via.placeholder.com/150x200/1a1a1a/666666?text=No+Image'}
                      alt={actor.name}
                      style={{
                        width: '120px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: 'var(--border-radius)',
                        marginBottom: '1rem',
                        border: '2px solid var(--border-color)'
                      }}
                    />
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                      {actor.name}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      {actor.character}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'cast' && (!movie.cast || movie.cast.length === 0) && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
                אין מידע על שחקנים
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                לא נמצא מידע על השחקנים בסרט זה
              </p>
            </div>
          )}

        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;