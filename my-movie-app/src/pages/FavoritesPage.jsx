
// src/pages/FavoritesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, Trash2 } from 'lucide-react';
import MovieCard from '../components/movies/MovieCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  // טעינת מועדפים מ-localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // שמירת מועדפים ל-localStorage
  useEffect(() => {
    localStorage.setItem('movieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleToggleFavorite = (movie) => {
    setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
  };

  const handleClearAll = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל הסרטים המועדפים?')) {
      setFavorites([]);
    }
  };

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
            <div className="movies-header" style={{ marginBottom: '2rem' }}>
              <h2 className="movies-title gradient-text">
                {favorites.length} סרטים מועדפים
              </h2>
              <motion.button
                onClick={handleClearAll}
                className="btn btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ color: '#f44336', borderColor: '#f44336' }}
              >
                <Trash2 size={18} />
                מחק הכל
              </motion.button>
            </div>

            {/* Favorites Grid */}
            <motion.div 
              className="movies-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {favorites.map((movie, index) => (
                <MovieCard
                  key={movie.id}
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

export default FavoritesPage;<><h1 className="gradient-text">עמוד הסרטים</h1><p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
  כאן נבנה את מנוע החיפוש ורשת הסרטים
</p></>