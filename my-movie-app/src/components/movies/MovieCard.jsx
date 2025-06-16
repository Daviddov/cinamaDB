import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, Heart, Play, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      className="movie-card"
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
    >
      <div className="movie-card-inner">
        {/* Movie Poster */}
        <div className="movie-poster">
          <img
            src={movie.poster_path || placeholderImage}
            alt={movie.title}
            className={`poster-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={e => {
              e.target.src = placeholderImage;
            }}
          />
          
          {/* Overlay with actions */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="movie-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="overlay-actions">
                  <motion.button
                    className="action-btn play-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      // יוכל להוסיף פונקציונליות ניגון טריילר
                    }}
                  >
                    <Play size={20} fill="currentColor" />
                  </motion.button>
                  
                  <motion.button
                    className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleFavorite && onToggleFavorite(movie);
                    }}
                  >
                    <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rating Badge */}
          <div className="rating-badge">
            <Star size={14} fill="currentColor" />
            <span>{formatRating(movie.vote_average)}</span>
          </div>
        </div>

        {/* Movie Info */}
        <div className="movie-info">
          <h3 className="movie-title" title={movie.title}>
            {movie.title}
          </h3>
          
          <div className="movie-meta">
            <div className="movie-year">
              <Calendar size={14} />
              <span>{formatDate(movie.release_date)}</span>
            </div>
            {movie.vote_count && (
              <div className="vote-count">
                {movie.vote_count.toLocaleString()} דירוגים
              </div>
            )}
          </div>

          {movie.overview && (
            <motion.p 
              className="movie-overview"
              initial={{ height: 0, opacity: 0 }}
              animate={{ 
                height: isHovered ? 'auto' : 0, 
                opacity: isHovered ? 1 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {movie.overview.length > 100 
                ? `${movie.overview.substring(0, 100)}...` 
                : movie.overview
              }
            </motion.p>
          )}

          <Link to={`/movie/${movie.id}`} className="details-link">
            <motion.button
              className="btn btn-outline details-btn"
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

export default MovieCard;