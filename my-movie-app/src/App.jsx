// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Router>
      <div className="App">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movie/:id" element={<MovieDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </motion.main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">
                <div className="logo-icon">🎬</div>
                <div>
                  <strong>CinemaDB</strong>
                  <p>המקום הטוב ביותר לגלות סרטים</p>
                </div>
              </div>
              
              <div className="footer-links">
                <span>© 2025 CinemaDB</span>
                <span>•</span>
                <span>כל הזכויות שמורות</span>
                <span>•</span>
                <span>נתונים מ-TMDB</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;