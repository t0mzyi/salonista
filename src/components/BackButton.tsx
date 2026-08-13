import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
}

export default function BackButton({ to, label = 'Back' }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      onClick={() => (to ? navigate(to) : navigate(-1))}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-pill)',
        padding: '8px 14px 8px 10px',
        fontFamily: 'Poppins, sans-serif',
        fontSize: 14,
        fontWeight: 700,
        color: 'var(--primary)',
        cursor: 'pointer',
        marginBottom: 16,
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.12s',
      }}
      whileTap={{ scale: 0.93 }}
    >
      <ChevronLeft size={16} strokeWidth={2.5} />
      {label}
    </motion.button>
  );
}
