// src/components/ui/Toast.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          onClose();
          return 0;
        }
        return prev - (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, duration, onClose]);

  useEffect(() => {
    if (isVisible) {
      setProgress(100);
    }
  }, [isVisible]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #10B981, #059669)',
          border: '#10B981',
          text: '#ffffff'
        };
      case 'error':
        return {
          bg: 'linear-gradient(135deg, #EF4444, #DC2626)',
          border: '#EF4444',
          text: '#ffffff'
        };
      case 'info':
      default:
        return {
          bg: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          border: 'var(--primary-color)',
          text: '#000000'
        };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.3 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '400px',
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: colors.text
          }}>
            {getIcon()}
            <span style={{ 
              flex: 1, 
              fontWeight: '500',
              fontSize: '0.95rem' 
            }}>
              {message}
            </span>
            <motion.button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text,
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%',
                opacity: 0.7
              }}
              whileHover={{ 
                opacity: 1,
                background: 'rgba(255, 255, 255, 0.1)' 
              }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>
          </div>
          
          {/* Progress Bar */}
          <div style={{
            height: '3px',
            background: 'rgba(255, 255, 255, 0.2)',
            overflow: 'hidden'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.8)',
                width: `${progress}%`
              }}
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Manager Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 1000 }}>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ marginBottom: '10px' }}>
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => hideToast(toast.id)}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );

  return {
    showToast,
    ToastContainer
  };
};

export default Toast;