import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Heart, Sun, Moon } from 'lucide-react';

const Header = ({ theme, toggleTheme }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'עמוד ראשי' },
    { path: '/movies', icon: Film, label: 'סרטים' },
    { path: '/favorites', icon: Heart, label: 'מועדפים' },
  ];

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <motion.div 
              className="logo-icon"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              🎬
            </motion.div>
            <div className="logo-text">
              <h1>CinemaDB</h1>
              <span>גלה סרטים מדהימים</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: theme === 'dark' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;