import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';

const SearchBar = ({ onSearch, searchTerm, isLoading, onClear }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = localSearchTerm.trim();
    if (trimmedTerm) {
      onSearch(trimmedTerm);
    }
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onClear();
  };

  const handleInputChange = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  return (
    <motion.div 
      className="search-bar-container"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          
          <input
            type="text"
            value={localSearchTerm}
            onChange={handleInputChange}
            placeholder="חפש סרטים לפי שם, תיאור או שחקנים..."
            className="search-input"
            disabled={isLoading}
          />
          
          {localSearchTerm && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="clear-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
        
        <div className="search-buttons">
          <motion.button
            type="submit"
            disabled={isLoading || !localSearchTerm.trim()}
            className="btn btn-primary search-submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="loading-content">
                <div className="spinner-small"></div>
                מחפש...
              </div>
            ) : (
              <>
                <Search size={18} />
                חפש סרטים
              </>
            )}
          </motion.button>
          
          <motion.button
            type="button"
            className="btn btn-outline random-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // יוכל להוסיף פונקציונליות של חיפוש אקראי
              const randomTerms = ['action', 'comedy', 'drama', 'thriller', 'adventure'];
              const randomTerm = randomTerms[Math.floor(Math.random() * randomTerms.length)];
              setLocalSearchTerm(randomTerm);
              onSearch(randomTerm);
            }}
          >
            <Sparkles size={18} />
            הפתעה אקראית
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default SearchBar;