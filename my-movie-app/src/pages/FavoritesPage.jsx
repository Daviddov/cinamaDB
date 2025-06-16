import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';

const FavoritesPage = () => {
  return (
    <motion.div 
      className="favorites-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h1 className="gradient-text">הסרטים המועדפים שלי</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
          כאן יהיו כל הסרטים שתוסיף למועדפים
        </p>
        
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <motion.div 
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💔
          </motion.div>
          <h3>אין לך סרטים מועדפים עדיין</h3>
          <p style={{ marginBottom: '2rem' }}>
            התחל לחפש סרטים ותוסיף אותם למועדפים!
          </p>
          
          <Link to="/movies" className="btn btn-primary">
            <Search size={20} />
            חפש סרטים
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoritesPage;<><h1 className="gradient-text">עמוד הסרטים</h1><p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
    כאן נבנה את מנוע החיפוש ורשת הסרטים
</p></>
        