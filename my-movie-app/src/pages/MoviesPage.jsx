// src/pages/MoviesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, X, Star, Calendar, Heart, Play, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tmdbService } from '../services/tmdbApi';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  // טעינת סרטים פופולריים בהתחלה
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async () => {
    setLoading(true);
    try {
      const data = await tmdbService.getPopularMovies();
      setMovies(data.movies);
      setSearchTerm('');
      setLocalSearchTerm('');
    } catch (error) {
      console.error('Error loading popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      loadPopularMovies();
      return;
    }

    setLoading(true);
    try {
      const data = await tmdbService.searchMovies(query);
      setMovies(data.movies);
      setSearchTerm(query);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(localSearchTerm);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    loadPopularMovies();
  };

  const handleToggleFavorite = (movie) => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const isFavorite = favorites.some(fav => fav.id === movie.id);
    
    if (isFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
    }
  };

  const isFavorite = (movieId) => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    return favorites.some(fav => fav.id === movieId);
  };

  return (
    <motion.div 
      className="movies-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        {/* Header */}
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ padding: '3rem 0 2rem 0', textAlign: 'center' }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            גלה סרטים מדהימים
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            חפש מבין אלפי סרטים ומצא את הסרט המושלם עבורך
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={loadPopularMovies}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp size={20} />
              סרטים פופולריים
            </motion.button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="search-bar-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '800px', margin: '0 auto 3rem auto', padding: '0 1rem' }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search 
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-secondary)',
                  pointerEvents: 'none'
                }} 
                size={20} 
              />
              
              <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="חפש סרטים לפי שם, תיאור או שחקנים..."
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 3rem',
                  fontSize: '1.1rem',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  background: 'var(--surface-color)',
                  color: 'var(--text-color)',
                  fontFamily: 'inherit'
                }}
                disabled={loading}
              />
              
              {localSearchTerm && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    borderRadius: '50%'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.button
                type="submit"
                disabled={loading || !localSearchTerm.trim()}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Loader2 size={16} className="animate-spin" />
                    מחפש...
                  </div>
                ) : (
                  <>
                    <Search size={18} />
                    חפש סרטים
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Movies Section */}
        <div className="movies-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }} className="gradient-text">
              {searchTerm ? `תוצאות חיפוש עבור "${searchTerm}"` : 'סרטים פופולריים'}
            </h2>
            <div style={{ 
              color: 'var(--text-secondary)', 
              background: 'var(--surface-color)', 
              padding: '0.5rem 1rem', 
              borderRadius: 'var(--border-radius)', 
              border: '1px solid var(--border-color)' 
            }}>
              {movies.length} סרטים
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '4rem 0' }}
            >
              <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                טוען סרטים מדהימים...
              </p>
            </motion.div>
          )}

          {/* No Results */}
          {!loading && movies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '4rem 2rem' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3>לא נמצאו סרטים</h3>
              <p style={{ color: 'var(--text-secondary)' }}>נסה מילות חיפוש אחרות</p>
            </motion.div>
          )}

          {/* Movies Grid */}
          {movies.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem',
                marginBottom: '3rem'
              }}
            >
              {movies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite(movie.id)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Movie Card Component
const MovieCard = ({ movie, index, onToggleFavorite, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'לא ידוע';
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const placeholderImage = 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.04, 0.62, 0.23, 0.98]
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: '100%', cursor: 'pointer' }}
    >
      <div style={{
        background: 'var(--surface-color)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        transition: 'var(--transition)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow)',
        borderColor: isHovered ? 'rgba(255, 215, 0, 0.3)' : 'var(--border-color)'
      }}>
        {/* Movie Poster */}
        <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden' }}>
          <img
            src={movie.poster_path || placeholderImage}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'var(--transition)',
              opacity: imageLoaded ? 1 : 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
            onLoad={() => setImageLoaded(true)}
            onError={e => {
              e.target.src = placeholderImage;
            }}
          />
          
          {/* Rating Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'var(--primary-color)',
            padding: '0.5rem 0.75rem',
            borderRadius: 'var(--border-radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <Star size={14} fill="currentColor" />
            <span>{formatRating(movie.vote_average)}</span>
          </div>

          {/* Overlay with actions */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem' }}>
                <motion.button
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--primary-color)',
                    color: '#000'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={20} fill="currentColor" />
                </motion.button>
                
                <motion.button
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite && onToggleFavorite(movie);
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isFavorite ? '#e91e63' : 'rgba(0, 0, 0, 0.7)',
                    color: 'white'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Movie Info */}
        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '0.75rem',
            lineHeight: '1.3',
            color: 'var(--text-color)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.title}
          </h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} />
              <span>{formatDate(movie.release_date)}</span>
            </div>
            
            {movie.vote_count && (
              <div style={{ fontSize: '0.8rem' }}>
                {movie.vote_count.toLocaleString()} דירוגים
              </div>
            )}
          </div>

          {movie.overview && isHovered && (
            <motion.p 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.4',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}
            >
              {movie.overview.length > 100 
                ? `${movie.overview.substring(0, 100)}...` 
                : movie.overview
              }
            </motion.p>
          )}

          <Link to={`/movie/${movie.id}`} style={{ marginTop: 'auto' }}>
            <motion.button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Info size={16} />
              פרטים נוספים
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MoviesPage;