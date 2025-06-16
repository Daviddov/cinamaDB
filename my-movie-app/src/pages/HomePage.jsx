// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Star, Film, Users, Award, Heart } from 'lucide-react';
const HomePage = () => {
  const features = [
    {
      icon: Search,
      title: 'חיפוש מתקדם',
      description: 'חפש סרטים לפי שם, ז\'אנר, שחקנים או במאי עם מנוע חיפוש חכם'
    },
    {
      icon: Star,
      title: 'דירוגים אמיתיים',
      description: 'צפה בדירוגים וביקורות של משתמשים אמיתיים מרחבי העולם'
    },
    {
      icon: Heart,
      title: 'רשימות אישיות',
      description: 'צור רשימות מועדפים, צפייה לאחר ותן דירוגים לסרטים'
    }
  ];

  const stats = [
    { icon: Film, value: '50,000+', label: 'סרטים' },
    { icon: Users, value: '10M+', label: 'משתמשים' },
    { icon: Award, value: '4.8★', label: 'דירוג ממוצע' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="hero-icon animate-float"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            >
              🌟
            </motion.div>
            
            <motion.h1 
              className="hero-title gradient-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              ברוכים הבאים ל-CinemaDB
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              המקום הטוב ביותר לגלות סרטים חדשים ומעניינים מכל העולם
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to="/movies" className="btn btn-primary">
                <Search size={20} />
                התחל לחפש
              </Link>
              <Link to="/movies" className="btn btn-outline">
                <TrendingUp size={20} />
                סרטים פופולריים
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.h2 
            className="section-title gradient-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            מה תמצא כאן?
          </motion.h2>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="feature-card card animate-fade-in"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <div className="feature-icon">
                    <Icon size={48} color="var(--primary-color)" />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <motion.div 
            className="stats-card card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="stats-grid">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="stat-item"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Icon size={32} color="var(--primary-color)" />
                    <div className="stat-number gradient-text">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;