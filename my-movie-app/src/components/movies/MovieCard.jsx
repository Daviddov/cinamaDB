import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Heart, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrailerModal from './TrailerModal';

const MovieCard = ({ movie, index, onToggleFavorite, isFavorite }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'לא ידוע';
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const placeholderImage = 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image';

  const handleTrailerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // בדיקה אם יש כבר מודאל פתוח
    const existingModals = document.querySelectorAll('.trailer-overlay');
    if (existingModals.length > 0) {
      return; // לא לפתוח מודאל חדש אם יש כבר אחד פתוח
    }
    
    setShowTrailer(true);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite && onToggleFavorite(movie);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.04, 0.62, 0.23, 0.98]
      }}
      whileHover={{ y: -10 }} // הסרנו את ה-scale מכאן
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
          <motion.img
            src={movie.poster_path || placeholderImage}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'var(--transition)',
              opacity: imageLoaded ? 1 : 0
            }}
            animate={{
              scale: isHovered ? 1.05 : 1 // רק התמונה תגדל, לא כל הקארד
            }}
            transition={{ duration: 0.3 }}
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
            fontWeight: '600',
            zIndex: 2
          }}>
            <Star size={14} fill="currentColor" />
            <span>{formatRating(movie.vote_average)}</span>
          </div>

          {/* Overlay with actions */}
          <AnimatePresence>
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
                  justifyContent: 'center',
                  zIndex: 3
                }}
              >
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <motion.button
                    onClick={handleTrailerClick}
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
                      color: '#000',
                      position: 'relative',
                      zIndex: 4
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Play size={20} fill="currentColor" />
                  </motion.button>

                  <motion.button
                    onClick={handleFavoriteClick}
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
                      color: 'white',
                      position: 'relative',
                      zIndex: 4
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
              exit={{ height: 0, opacity: 0 }}
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

          <Link to={`/movie/${movie.id}`} style={{ marginTop: 'auto', textDecoration: 'none' }}>
            <motion.button
              className="btn btn-outline"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '0.75rem', 
                fontSize: '0.9rem'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Info size={16} />
              פרטים נוספים
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movieId={movie.id}
        movieTitle={movie.title}

        onClose={() => setShowTrailer(false)}
      />
    </motion.div>
  );
};

export default MovieCard;