import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type ToastType = 'error' | 'success' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        <AnimatePresence>
          {toasts.map(toast => {
            const isError = toast.type === 'error';
            const isSuccess = toast.type === 'success';

            const bg = isError ? 'var(--tag-critical-bg)' : isSuccess ? 'var(--tag-ok-bg)' : 'var(--surface)';
            const border = isError ? 'var(--tag-critical-ink)' : isSuccess ? 'var(--tag-ok-ink)' : 'var(--border)';
            const color = isError ? 'var(--tag-critical-ink)' : isSuccess ? 'var(--tag-ok-ink)' : 'var(--ink)';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  pointerEvents: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: bg,
                  border: `1px solid ${border}`,
                  padding: '12px 18px',
                  borderRadius: 'var(--r-md)',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                  maxWidth: 420,
                  width: '100%',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                {isError && <AlertCircle size={18} color="var(--tag-critical-ink)" style={{ flexShrink: 0 }} />}
                {isSuccess && <CheckCircle size={18} color="var(--tag-ok-ink)" style={{ flexShrink: 0 }} />}
                {!isError && !isSuccess && <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />}
                
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color,
                  flex: 1,
                  lineHeight: 1.4
                }}>
                  {toast.message}
                </span>

                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color,
                    opacity: 0.7
                  }}
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
