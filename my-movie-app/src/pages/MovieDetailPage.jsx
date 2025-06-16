
// src/pages/MovieDetailPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieDetailPage = () => {
  const { id } = useParams();
  
  return (
    <motion.div 
      className="movie-detail-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 className="gradient-text">פרטי סרט</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          כאן נציג את כל הפרטים על הסרט עם מזהה: {id}
        </p>
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
          <h3>בקרוב...</h3>
          <p>נציג כאן: כרזה, תיאור, דירוגים, שחקנים, במאי ועוד הרבה מידע!</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetailPage;
