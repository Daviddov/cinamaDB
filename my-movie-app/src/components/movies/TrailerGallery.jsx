// src/components/movies/TrailerGallery.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ExternalLink, Clock, Calendar, Loader2, AlertCircle, Maximize2 } from 'lucide-react';
import { tmdbService } from '../../services/tmdbApi';

const TrailerModal = ({ video, isOpen, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen || !video) return null;

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setIsFullscreen(false);
    onClose();
  };

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
          background: 'rgba(0, 0, 0, 0.95)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isFullscreen ? '1rem' : '1rem'
        }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotateY: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 500 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--surface-color)',
            borderRadius: isFullscreen ? '0' : 'var(--border-radius)',
            overflow: 'hidden',
            maxWidth: isFullscreen ? '100vw' : '95vw',
            maxHeight: isFullscreen ? '100vh' : '95vh',
            width: isFullscreen ? '100vw' : '100%',
            height: isFullscreen ? '100vh' : 'auto',
            maxWidth: isFullscreen ? '100vw' : '1200px',
            position: 'relative',
            border: isFullscreen ? 'none' : '1px solid var(--border-color)',
            boxShadow: isFullscreen ? 'none' : '0 25px 50px rgba(0, 0, 0, 0.5)',
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
            background: 'linear-gradient(135deg, var(--surface-color), var(--bg-color))',
            flexShrink: 0
          }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.4rem' }}>
                {video.name}
              </h2>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>{video.type}</span>
                <span>•</span>
                <span>YouTube</span>
                {video.published_at && (
                  <>
                    <span>•</span>
                    <span>{new Date(video.published_at).getFullYear()}</span>
                  </>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.a
                href={video.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem',
                  background: 'var(--border-color)',
                  borderRadius: '50%',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none'
                }}
                whileHover={{ background: 'var(--primary-color)', color: '#000' }}
                whileTap={{ scale: 0.9 }}
                title="פתח ב-YouTube"
              >
                <ExternalLink size={18} />
              </motion.a>

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
                whileHover={{ background: 'var(--border-color)', color: 'var(--text-color)' }}
                whileTap={{ scale: 0.9 }}
                title={isFullscreen ? 'יציאה ממסך מלא' : 'מסך מלא'}
              >
                <Maximize2 size={20} />
              </motion.button>
              
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
                whileHover={{ background: '#f44336', color: 'white' }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          {/* Video Player */}
          <div style={{ 
            position: 'relative', 
            paddingBottom: isFullscreen ? '0' : '56.25%', 
            height: isFullscreen ? 'calc(100vh - 120px)' : '0',
            flex: isFullscreen ? '1' : 'none'
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.key}?autoplay=0&rel=0&modestbranding=1`}
              title={video.name}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const VideoThumbnail = ({ video, onClick, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getVideoTypeIcon = (type) => {
    switch (type) {
      case 'Trailer': return '🎬';
      case 'Teaser': return '👀';
      case 'Clip': return '📽️';
      case 'Behind the Scenes': return '🎭';
      case 'Bloopers': return '😄';
      default: return '🎥';
    }
  };

  const formatDuration = (publishedAt) => {
    if (!publishedAt) return '';
    const date = new Date(publishedAt);
    return date.toLocaleDateString('he-IL');
  };

  return (
    <motion.div
      className="video-thumbnail"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        background: 'var(--surface-color)',
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        transition: 'var(--transition)',
        position: 'relative'
      }}
    >
      {/* Thumbnail Image */}
      <div style={{ position: 'relative', paddingBottom: '56.25%', overflow: 'hidden' }}>
        {!imageError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}>
            <Play size={48} />
          </div>
        )}

        {/* Play Overlay */}
        <motion.div
          className="play-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            style={{
              width: '60px',
              height: '60px',
              background: 'var(--primary-color)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Play size={24} fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Video Type Badge */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: 'var(--border-radius)',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <span>{getVideoTypeIcon(video.type)}</span>
          <span>{video.type}</span>
        </div>
      </div>

      {/* Video Info */}
      <div style={{ padding: '1rem' }}>
        <h4 style={{
          margin: 0,
          marginBottom: '0.5rem',
          fontSize: '0.95rem',
          fontWeight: '600',
          color: 'var(--text-color)',
          lineHeight: '1.3',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {video.name}
        </h4>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>YouTube</span>
          {video.published_at && (
            <span>{formatDuration(video.published_at)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrailerGallery = ({ movieId, movieTitle }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (movieId) {
      fetchVideos();
    }
  }, [movieId]);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const videosData = await tmdbService.getMovieVideos(movieId);
      setVideos(videosData);
      
      if (videosData.length === 0) {
        setError('לא נמצאו טריילרים או סרטונים לסרט זה');
      }
    } catch (err) {
      setError('שגיאה בטעינת הסרטונים');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const mainTrailer = videos.find(v => v.type === 'Trailer') || videos[0];
  const otherVideos = videos.filter(v => v !== mainTrailer);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>טוען סרטונים...</p>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>{error || 'לא נמצאו סרטונים'}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Trailer Section */}
      {mainTrailer && (
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--primary-color)' }}>
              צפה בטריילר
            </h3>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎬
            </motion.div>
          </div>
          
          <motion.div
            className="main-trailer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '600px' }}
          >
            <VideoThumbnail
              video={mainTrailer}
              onClick={() => handleVideoClick(mainTrailer)}
              index={0}
            />
          </motion.div>
        </div>
      )}

      {/* Other Videos Gallery */}
      {otherVideos.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '1.3rem', 
            marginBottom: '1.5rem', 
            color: 'var(--text-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>סרטונים נוספים</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              ({otherVideos.length})
            </span>
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {otherVideos.map((video, index) => (
              <VideoThumbnail
                key={video.id}
                video={video}
                onClick={() => handleVideoClick(video)}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      <TrailerModal
        video={selectedVideo}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default TrailerGallery;