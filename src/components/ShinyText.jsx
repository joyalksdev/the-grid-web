'use client';

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) {
  return (
    <span
      className={`inline-block bg-clip-text text-white/75 ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animation: disabled ? 'none' : `rb-shine ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes rb-shine {
          0% { background-position: 100%; }
          100% { background-position: -100%; }
        }
      `}</style>
      {text}
    </span>
  );
}
