import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scissors, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="page-container flex-col items-center justify-center text-center"
      style={{ minHeight: '85vh', padding: '32px 24px' }}
    >
      {/* Animated Barber Pole / Scissors Icon Container */}
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 'var(--r-lg)',
          background: 'var(--tag-critical-bg)',
          border: '2px solid var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(217, 90, 43, 0.15)',
          marginBottom: 28,
        }}
      >
        <Scissors size={48} color="var(--primary)" />
      </motion.div>

      {/* 404 Badge */}
      <span
        style={{
          display: 'inline-block',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--primary)',
          background: 'var(--tag-warn-bg)',
          padding: '4px 14px',
          borderRadius: 'var(--r-pill)',
          marginBottom: 14,
        }}
      >
        Error 404
      </span>

      {/* Title */}
      <div
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--ink)',
          lineHeight: 1.2,
          marginBottom: 10,
        }}
      >
        Looks like you got a bad trim!
      </div>

      {/* Description */}
      <p
        className="body"
        style={{
          maxWidth: 320,
          color: 'var(--ink-muted)',
          fontSize: 14,
          lineHeight: 1.5,
          marginBottom: 32,
        }}
      >
        The page you are looking for has been cut, moved, or never existed in the first place.
      </p>

      {/* Action Buttons */}
      <div className="flex-col gap-3" style={{ width: '100%', maxWidth: 300 }}>
        <button
          className="btn-primary"
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 20px',
            fontSize: 15,
          }}
        >
          <Home size={18} />
          Back to Home
        </button>

        <button
          className="btn-secondary"
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '12px 20px',
            fontSize: 14,
          }}
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </motion.div>
  );
}
