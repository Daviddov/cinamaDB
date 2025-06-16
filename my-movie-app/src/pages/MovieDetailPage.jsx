

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


const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

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
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2rem', alignItems: 'start' }}>
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

      {/* Content Sections */}
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
          {/* Left Column */}
          <div>
            {/* Overview */}
            {movie.overview && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ marginBottom: '3rem' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                  עלילה
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                  {movie.overview}
                </p>
              </motion.section>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{ marginBottom: '3rem' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                  שחקנים
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                  {movie.cast.slice(0, 6).map((actor) => (
                    <div key={actor.id} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                      <img
                        src={actor.profile_path || 'https://via.placeholder.com/150x200/1a1a1a/666666?text=No+Image'}
                        alt={actor.name}
                        style={{
                          width: '100px',
                          height: '130px',
                          objectFit: 'cover',
                          borderRadius: 'var(--border-radius)',
                          marginBottom: '0.5rem',
                        }}
                      />
                      <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>{actor.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{actor.character}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;
