import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';

const VARIANT_STYLES = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-neon',
    iconBg: 'bg-neon/15 border-neon/30',
    border: 'border-neon/35',
    fuse: 'bg-neon shadow-[0_0_10px_rgba(0,255,102,0.8)]',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15 border-red-500/30',
    border: 'border-red-500/40',
    fuse: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/30',
    border: 'border-amber-500/35',
    fuse: 'bg-amber-400',
  },
  info: {
    icon: Info,
    iconColor: 'text-cyber',
    iconBg: 'bg-cyber/15 border-cyber/30',
    border: 'border-cyber/35',
    fuse: 'bg-cyber shadow-[0_0_10px_rgba(0,240,255,0.8)]',
  },
};

/**
 * React Bits — SwipeToast Component
 * Interactive toast notification with a burning fuse bar, pause-on-hover timer,
 * and vertical/horizontal swipe-to-dismiss physics.
 */
export function SwipeToast({
  id,
  title,
  description,
  variant = 'success',
  duration = 4000,
  fusePosition = 'bottom',
  pauseOnHover = true,
  onDismiss,
}) {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.success;
  const Icon = style.icon;

  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const remainingRef = useRef(duration);
  const lastTickRef = useRef(null);

  useEffect(() => {
    remainingRef.current = duration;
    setProgress(100);
  }, [duration, id]);

  useEffect(() => {
    if (duration <= 0 || paused) {
      lastTickRef.current = null;
      return undefined;
    }

    let rafId;
    const step = (timestamp) => {
      if (lastTickRef.current === null) {
        lastTickRef.current = timestamp;
      }
      const delta = timestamp - lastTickRef.current;
      lastTickRef.current = timestamp;

      remainingRef.current = Math.max(0, remainingRef.current - delta);
      const nextPct = (remainingRef.current / duration) * 100;
      setProgress(nextPct);

      if (remainingRef.current <= 0) {
        onDismiss?.(id);
      } else {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [duration, paused, id, onDismiss]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onDismiss?.(id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 36, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.92, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 460, damping: 30 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 120 }}
      dragElastic={{ top: 0.08, bottom: 0.6 }}
      onDragStart={() => pauseOnHover && setPaused(true)}
      onDragEnd={(_, info) => {
        if (info.offset.y > 45 || info.velocity.y > 320) {
          onDismiss?.(id);
        } else if (pauseOnHover) {
          setPaused(false);
        }
      }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative w-full max-w-sm cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-2xl border ${style.border} bg-[#0d1017]/95 p-4 text-white shadow-[0_18px_45px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl`}
    >
      {/* Top Drag Pill Hint */}
      <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/15" />

      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${style.iconBg} ${style.iconColor}`}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          {title && (
            <p className="font-display text-xs sm:text-sm font-bold text-white leading-snug">
              {title}
            </p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-white/65 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss?.(id)}
          aria-label="Close notification"
          className="rounded-lg p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      {/* Burning Fuse Line */}
      {fusePosition !== 'none' && duration > 0 && (
        <div
          className={`absolute inset-x-0 ${
            fusePosition === 'top' ? 'top-0' : 'bottom-0'
          } h-1 bg-white/[0.06]`}
        >
          <div
            className={`h-full transition-none ${style.fuse}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

const SwipeToastContext = createContext(null);

export function SwipeToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      title,
      description = '',
      variant = 'success',
      duration = 4200,
      fusePosition = 'bottom',
    }) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [
        ...prev.slice(-2), // Keep max 3 stacked toasts
        { id, title, description, variant, duration, fusePosition },
      ]);
      return id;
    },
    []
  );

  const toastApi = React.useMemo(
    () => ({
      show: addToast,
      dismiss: dismissToast,
      success: (title, description, duration) =>
        addToast({ title, description, variant: 'success', duration }),
      error: (title, description, duration) =>
        addToast({ title, description, variant: 'error', duration }),
      warning: (title, description, duration) =>
        addToast({ title, description, variant: 'warning', duration }),
      info: (title, description, duration) =>
        addToast({ title, description, variant: 'info', duration }),
    }),
    [addToast, dismissToast]
  );

  return (
    <SwipeToastContext.Provider value={toastApi}>
      {children}

      {/* Global Bottom-Right / Bottom-Center SwipeToast Viewport */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2.5 px-4 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-96 sm:items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <SwipeToast
              key={item.id}
              {...item}
              onDismiss={dismissToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </SwipeToastContext.Provider>
  );
}

export function useSwipeToast() {
  const ctx = useContext(SwipeToastContext);
  if (!ctx) {
    return {
      show: () => {},
      dismiss: () => {},
      success: () => {},
      error: () => {},
      warning: () => {},
      info: () => {},
    };
  }
  return ctx;
}

export default SwipeToast;
