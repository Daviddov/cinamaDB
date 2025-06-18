import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Trash2 } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // טעינת מועדפים מ-localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('movieFavorites');
        if (savedFavorites) {
          const parsedFavorites = JSON.parse(savedFavorites);
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // עדכון מועדפים בזמן אמת
  useEffect(() => {
    const handleStorageChange = () => {
      const savedFavorites = localStorage.getItem('movieFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleToggleFavorite = (movie) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
    setFavorites(updatedFavorites);
    localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
  };

  const handleClearAll = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הסרטים המועדפים?')) {
      setFavorites([]);
      localStorage.setItem('movieFavorites', JSON.stringify([]));
    }
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="loading">
          <div className="spinner"></div>
          <p>טוען מועדפים...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="favorites-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            הסרטים המועדפים שלי
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            כל הסרטים שאהבת במקום אחד
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          // Empty State
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '4rem 2rem' }}
          >
            <motion.div 
              style={{ fontSize: '6rem', marginBottom: '2rem' }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💔
            </motion.div>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
              אין לך סרטים מועדפים עדיין
            </h3>
            <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              התחל לחפש סרטים ותוסיף אותם למועדפים על ידי לחיצה על כפתור הלב!
            </p>
            
            <Link to="/movies" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              <Search size={20} />
              חפש סרטים עכשיו
            </Link>
          </motion.div>
        ) : (
          // Favorites Content
          <>
            {/* Header with Clear All Button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h2 className="gradient-text" style={{ fontSize: '2rem', margin: 0 }}>
                {favorites.length} סרטים מועדפים
              </h2>
              <motion.button
                onClick={handleClearAll}
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                  color: '#f44336', 
                  borderColor: '#f44336',
                  background: 'rgba(244, 67, 54, 0.1)'
                }}
              >
                <Trash2 size={18} />
                מחק הכל
              </motion.button>
            </div>

            {/* Favorites Grid */}
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
              {favorites.map((movie, index) => (
                <MovieCard
                  key={`favorite-${movie.id}`}
                  movie={movie}
                  index={index}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={true}
                />
              ))}
            </motion.div>

            {/* Add More Movies */}
            <motion.div 
              style={{ textAlign: 'center', marginTop: '3rem' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                רוצה להוסיף עוד סרטים למועדפים?
              </p>
              <Link to="/movies" className="btn btn-outline">
                <Search size={18} />
                גלה עוד סרטים
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FavoritesPage;