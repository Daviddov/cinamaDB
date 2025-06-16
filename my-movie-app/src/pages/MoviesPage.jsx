// src/pages/MoviesPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, X, Star, Calendar, Heart, Play, Info, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tmdbService } from '../services/tmdbApi';
import { useToast } from '../components/ui/Toast';
import MovieCard from '../components/movies/MovieCard';
import GenreFilter from '../components/movies/GenreFilter';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const { showToast, ToastContainer } = useToast();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreName, setGenreName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentMode, setCurrentMode] = useState('popular'); // 'popular', 'search', 'genre'

  // טעינת סרטים פופולריים בהתחלה
  useEffect(() => {
    loadPopularMovies();
  }, []);

  const loadPopularMovies = async (page = 1) => {
  if (page === 1) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }
  
  try {
    const data = await tmdbService.getPopularMovies(page);
    
    if (page === 1) {
      setMovies(data.movies);
    } else {
      setMovies(prev => [...prev, ...data.movies]);
    }
    
    setTotalPages(data.totalPages);
    setCurrentPage(page);
    setSearchTerm('');
    setLocalSearchTerm('');
    setSelectedGenre(null);
    setGenreName('');
    setCurrentMode('popular');
  } catch (error) {
    console.error('Error loading popular movies:', error);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};

  const handleSearch = async (query, page = 1) => {
  if (!query.trim()) {
    loadPopularMovies();
    return;
  }

  if (page === 1) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }
  
  try {
    const data = await tmdbService.searchMovies(query, page);
    
    if (page === 1) {
      setMovies(data.movies);
    } else {
      setMovies(prev => [...prev, ...data.movies]);
    }
    
    setTotalPages(data.totalPages);
    setCurrentPage(page);
    setSearchTerm(query);
    setSelectedGenre(null);
    setGenreName('');
    setCurrentMode('search');
  } catch (error) {
    console.error('Error searching movies:', error);
  } finally {
    setLoading(false);
    setLoadingMore(false);
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
      showToast(`${movie.title} הוסר מהמועדפים`, 'info');
    } else {
      const updatedFavorites = [...favorites, movie];
      localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
      showToast(`${movie.title} נוסף למועדפים`, 'success');
    }
  };

  const isFavorite = (movieId) => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    return favorites.some(fav => fav.id === movieId);
  };
const handleLoadByGenre = async (genreId, genreName, page = 1) => {
  if (page === 1) {
    setLoading(true);
  } else {
    setLoadingMore(true);
  }
  
  try {
    const data = await tmdbService.getMoviesByGenre(genreId, page);
    
    if (page === 1) {
      setMovies(data.movies);
    } else {
      setMovies(prev => [...prev, ...data.movies]);
    }
    
    setTotalPages(data.totalPages);
    setCurrentPage(page);
    setSearchTerm('');
    setLocalSearchTerm('');
    setGenreName(genreName);
    setCurrentMode('genre');
  } catch (error) {
    console.error('Error loading movies by genre:', error);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};

const loadMoreMovies = async () => {
  if (currentPage >= totalPages || loadingMore) return;
  
  const nextPage = currentPage + 1;
  
  switch (currentMode) {
    case 'search':
      handleSearch(searchTerm, nextPage);
      break;
    case 'genre':
      handleLoadByGenre(selectedGenre, genreName, nextPage);
      break;
    case 'popular':
    default:
      loadPopularMovies(nextPage);
      break;
  }
};

    const getPageTitle = () => {
    if (searchTerm) return `תוצאות חיפוש עבור "${searchTerm}"`;
    if (selectedGenre) return `סרטי ${genreName}`;
    return 'סרטים פופולריים';
  };
  return (

    <motion.div
      className="movies-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ToastContainer />

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
        
        <GenreFilter 
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
          onLoadByGenre={handleLoadByGenre}
        />
        {/* Movies Section */}
        <div className="movies-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }} className="gradient-text">
            {getPageTitle()}
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
                  key={`${currentMode}-${movie.id}-${Math.floor(index / 20)}`}
                  movie={movie}
                  index={index}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite(movie.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {movies.length > 0 && currentPage < totalPages && (
            <motion.div
              style={{ textAlign: 'center', marginTop: '3rem' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={loadMoreMovies}
                disabled={loadingMore}
                className="btn btn-outline"
                style={{ 
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  minWidth: '200px',
                  background: loadingMore ? 'var(--surface-color)' : 'transparent'
                }}
                whileHover={{ scale: loadingMore ? 1 : 1.05 }}
                whileTap={{ scale: loadingMore ? 1 : 0.95 }}
              >
                {loadingMore ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid var(--border-color)',
                        borderTop: '2px solid var(--primary-color)',
                        borderRadius: '50%'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    טוען עוד סרטים...
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ⬇️
                    </motion.div>
                    טען עוד סרטים ({currentPage}/{totalPages})
                  </div>
                )}
              </motion.button>

              {/* Progress Bar */}
              <div style={{ 
                marginTop: '1rem',
                maxWidth: '300px',
                margin: '1rem auto 0',
                background: 'var(--border-color)',
                height: '4px',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
                    borderRadius: '2px'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentPage / totalPages) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                marginTop: '0.5rem' 
              }}>
                עמוד {currentPage} מתוך {totalPages} • {movies.length} סרטים נטענו
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


export default MoviesPage;