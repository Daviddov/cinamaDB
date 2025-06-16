// src/pages/MoviesPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const MoviesPage = () => {
  return (
    <motion.div 
      className="movies-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
          <h3>בקרוב...</h3>
          <p>נבנה כאן חיפוש מתקדם, סינון לפי ז'אנרים ורשת סרטים מרשימה!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MoviesPage;
