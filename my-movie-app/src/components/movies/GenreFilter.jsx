import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { tmdbService } from '../../services/tmdbApi';

const GenreFilter = ({ selectedGenre, onGenreSelect, onLoadByGenre }) => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await tmdbService.getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genre) => {
    if (selectedGenre === genre.id) {
      // אם הז'אנר כבר נבחר, נבטל הבחירה
      onGenreSelect(null);
    } else {
      onGenreSelect(genre.id);
      onLoadByGenre(genre.id, genre.name);
    }
  };

  const clearGenreFilter = () => {
    onGenreSelect(null);
  };

  if (loading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ 
        marginBottom: '3rem', 
        textAlign: 'center', 
        background: 'var(--surface-color)', 
        padding: '2rem', 
        borderRadius: 'var(--border-radius)',
        border: '1px solid var(--border-color)'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <Filter size={20} color="var(--primary-color)" />
        <h3 style={{ 
          margin: 0, 
          color: 'var(--primary-color)', 
          fontSize: '1.2rem' 
        }}>
          סינון לפי ז'אנר
        </h3>
        {selectedGenre && (
          <motion.button
            onClick={clearGenreFilter}
            style={{
              background: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              color: '#f44336',
              padding: '0.25rem 0.5rem',
              borderRadius: 'var(--border-radius)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.8rem'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={14} />
            נקה סינון
          </motion.button>
        )}
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '0.75rem', 
        justifyContent: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {genres.slice(0, 10).map((genre, index) => {
          const isSelected = selectedGenre === genre.id;
          
          return (
            <motion.button
              key={genre.id}
              onClick={() => handleGenreClick(genre)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.5rem 1rem',
                border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                background: isSelected 
                  ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))' 
                  : 'var(--bg-color)',
                color: isSelected ? '#000' : 'var(--text-color)',
                borderRadius: 'var(--border-radius)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: isSelected ? '600' : '400',
                transition: 'var(--transition)',
                boxShadow: isSelected ? 'var(--shadow)' : 'none'
              }}
            >
              {genre.name}
            </motion.button>
          );
        })}
      </div>

      {selectedGenre && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            marginTop: '1rem', 
            fontSize: '0.9rem', 
            color: 'var(--text-secondary)' 
          }}
        >
          מציג סרטים בז'אנר: <span style={{ 
            color: 'var(--primary-color)', 
            fontWeight: '600' 
          }}>
            {genres.find(g => g.id === selectedGenre)?.name}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenreFilter;