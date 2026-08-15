import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';

const LOADING_TIPS = [
  "Did you know? Trimming your hair every 6 weeks keeps split ends away.",
  "Preparing the best styling chairs...",
  "Warming up the hair dryers...",
  "Sharpening the scissors...",
  "Sweeping the floors for a fresh start...",
  "Did you know? Argan oil is liquid gold for frizzy hair."
];

export default function LoadingScreen({ fullScreen = true }: { fullScreen?: boolean }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Cycle through tips every 2.5 seconds
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      ...(fullScreen ? { position: 'fixed', inset: 0, zIndex: 9999 } : { width: '100%', height: '100%', minHeight: '300px' }),
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center'
    }}>
      
      {/* Discord-style bouncing/pulsing main icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: 72,
          height: 72,
          background: 'var(--primary)',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 8px 32px rgba(217, 90, 43, 0.3)'
        }}
      >
        <Scissors size={36} color="#fff" strokeWidth={2.5} />
      </motion.div>

      {/* Rotating Tips Text */}
      <div style={{ height: 40, position: 'relative', width: '100%', maxWidth: 300 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              width: '100%',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--ink-muted)',
              lineHeight: 1.4
            }}
          >
            {LOADING_TIPS[tipIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
