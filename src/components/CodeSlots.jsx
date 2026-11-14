import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * React Bits — CodeSlots Component
 * Animated 6-digit OTP / PIN verification slots with spring-physics digit entry,
 * animated focus indicator, clipboard paste, and mobile SMS autofill support.
 */
export default function CodeSlots({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  className = '',
}) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const cleanValue = String(value || '')
    .replace(/\D/g, '')
    .slice(0, length);
  const activeIndex = Math.min(cleanValue.length, length - 1);

  useEffect(() => {
    if (autoFocus && !disabled) {
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [autoFocus, disabled]);

  const emitChange = (nextRaw) => {
    const digits = String(nextRaw || '')
      .replace(/\D/g, '')
      .slice(0, length);
    onChange?.(digits);
    if (digits.length === length) {
      onComplete?.(digits);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    emitChange(e.target.value);
  };

  const handlePaste = (e) => {
    if (disabled) return;
    const pasted = e.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '').slice(0, length);
    if (digits) {
      e.preventDefault();
      emitChange(digits);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Backspace' && cleanValue.length > 0) {
      e.preventDefault();
      emitChange(cleanValue.slice(0, -1));
    }
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.focus()}
      className={`relative select-none ${className}`}
    >
      {/* Hidden Native Input for Keyboard, Paste & SMS One-Time-Code Autofill */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={length}
        disabled={disabled}
        value={cleanValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={`${length}-digit verification code`}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />

      {/* Animated Slots Grid */}
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
        {Array.from({ length }).map((_, idx) => {
          const digit = cleanValue[idx] || '';
          const isFilled = Boolean(digit);
          const isActive =
            focused &&
            !disabled &&
            (idx === cleanValue.length ||
              (cleanValue.length === length && idx === length - 1));

          return (
            <motion.div
              key={idx}
              whileTap={!disabled ? { scale: 0.96 } : undefined}
              className={`relative flex h-12 sm:h-14 cursor-text items-center justify-center overflow-hidden rounded-xl border font-mono text-lg sm:text-xl font-extrabold transition-colors ${
                isFilled
                  ? 'border-neon/60 bg-neon/[0.08] text-neon shadow-[0_0_18px_-6px_rgba(0,255,102,0.4)]'
                  : isActive
                  ? 'border-neon bg-white/[0.05] text-white'
                  : 'border-white/15 bg-white/[0.03] text-white/40 hover:border-white/30'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Animated Active Slot Glow Ring */}
              {isActive && (
                <motion.div
                  layoutId="code-slot-focus-ring"
                  transition={{ type: 'spring', stiffness: 480, damping: 32 }}
                  className="pointer-events-none absolute inset-0 rounded-xl border-2 border-neon shadow-[0_0_20px_-4px_rgba(0,255,102,0.5)]"
                />
              )}

              {/* Spring-Animated Digit */}
              <AnimatePresence mode="popLayout" initial={false}>
                {isFilled ? (
                  <motion.span
                    key={`digit-${idx}-${digit}`}
                    initial={{ y: 18, opacity: 0, scale: 0.65, filter: 'blur(4px)' }}
                    animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ y: -16, opacity: 0, scale: 0.65, filter: 'blur(4px)' }}
                    transition={{
                      type: 'spring',
                      stiffness: 540,
                      damping: 26,
                      mass: 0.7,
                    }}
                    className="relative z-10 text-neon"
                  >
                    {digit}
                  </motion.span>
                ) : isActive ? (
                  <motion.span
                    key={`caret-${idx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="h-5 w-0.5 rounded-full bg-neon"
                  />
                ) : (
                  <span
                    key={`placeholder-${idx}`}
                    className="h-1.5 w-1.5 rounded-full bg-white/20"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
