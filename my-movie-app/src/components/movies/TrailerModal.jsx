// src/components/movies/TrailerModal.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, AlertCircle, Loader2, Maximize2 } from 'lucide-react';
import { tmdbService } from '../../services/tmdbApi';

const TrailerModal = ({ movieId, movieTitle, isOpen, onClose }) => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && movieId) {
      fetchTrailers();
    }
  }, [isOpen, movieId]);

  const fetchTrailers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const videos = await tmdbService.getMovieVideos(movieId);
      setTrailers(videos);
      
      if (videos.length > 0) {
        // בחר את הטריילר הראשון כברירת מחדל
        setSelectedTrailer(videos[0]);
      } else {
        setError('לא נמצאו טריילרים לסרט זה');
      }
    } catch (err) {
      setError('שגיאה בטעינת הטריילר');
      console.error('Error fetching trailers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTrailer(null);
    setTrailers([]);
    setError(null);
    setIsFullscreen(false);
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // אם המודאל סגור, לא מציגים כלום
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="trailer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isFullscreen ? '1rem' : '2rem'
        }}
      >
        <motion.div
          className="trailer-modal"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--surface-color)',
            borderRadius: isFullscreen ? '0' : 'var(--border-radius)',
            overflow: 'hidden',
            maxWidth: isFullscreen ? '100vw' : '90vw',
            maxHeight: isFullscreen ? '100vh' : '90vh',
            width: isFullscreen ? '100vw' : '100%',
            height: isFullscreen ? '100vh' : 'auto',
            position: 'relative',
            border: isFullscreen ? 'none' : '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <h3 style={{ 
              margin: 0, 
              color: 'var(--text-color)',
              fontSize: '1.1rem'
            }}>
              טריילר: {movieTitle}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {/* כפתור מסך מלא */}
              <motion.button
                onClick={toggleFullscreen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%'
                }}
                whileHover={{ 
                  background: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
                whileTap={{ scale: 0.9 }}
                title={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
              >
                <Maximize2 size={20} />
              </motion.button>
              
              {/* כפתור סגירה */}
              <motion.button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%'
                }}
                whileHover={{ 
                  background: 'var(--border-color)',
                  color: 'var(--text-color)'
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div style={{ 
            padding: '1.5rem',
            flex: 1,
            overflow: 'auto'
          }}>
            {loading && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                color: 'var(--text-secondary)'
              }}>
                <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem' }} />
                <p>טוען טריילר...</p>
              </div>
            )}

            {error && (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem 1rem',
                color: '#f44336'
              }}>
                <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                <p>{error}</p>
                <motion.button
                  onClick={handleClose}
                  className="btn btn-outline"
                  style={{ marginTop: '1rem' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  סגור
                </motion.button>
              </div>
            )}

            {selectedTrailer && !loading && !error && (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* נגן YouTube */}
                <div style={{ 
                  position: 'relative',
                  paddingBottom: isFullscreen ? '0' : '56.25%', // 16:9 aspect ratio
                  height: isFullscreen ? 'calc(100vh - 200px)' : '0',
                  overflow: 'hidden',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1rem',
                  flex: isFullscreen ? '1' : 'none'
                }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=0&rel=0&modestbranding=1`}
                    title={selectedTrailer.name}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>

                {/* מידע על הטריילר */}
                <div style={{ 
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  background: 'var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem'
                }}>
                  <strong>{selectedTrailer.name}</strong>
                  {selectedTrailer.type && (
                    <span style={{ marginRight: '0.5rem' }}>• {selectedTrailer.type}</span>
                  )}
                </div>

                {/* בחירת טריילרים אם יש יותר מאחד */}
                {trailers.length > 1 && (
                  <div>
                    <h4 style={{ 
                      marginBottom: '1rem',
                      color: 'var(--text-color)',
                      fontSize: '1rem'
                    }}>
                      טריילרים נוספים:
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      flexWrap: 'wrap' 
                    }}>
                      {trailers.map((trailer, index) => (
                        <motion.button
                          key={trailer.id}
                          onClick={() => setSelectedTrailer(trailer)}
                          className={`btn ${selectedTrailer.key === trailer.key ? 'btn-primary' : 'btn-outline'}`}
                          style={{ 
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play size={14} />
                          {trailer.name || `טריילר ${index + 1}`}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrailerModal;