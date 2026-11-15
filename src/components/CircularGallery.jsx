import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * CircularGallery - Clean 3D Curved Cylindrical Carousel
 * Focused purely on visual presentation without overlaid text.
 */
export default function CircularGallery({
  items = [],
  radius = 420,
  autoSpin = true,
  autoSpinSpeed = 0.35,
  className = '',
}) {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isHoveredRef = useRef(false);

  const totalItems = items.length;
  const angleStep = 360 / (totalItems || 1);

  // Auto-spin loop
  useEffect(() => {
    if (!autoSpin) return;

    let lastTime = performance.now();

    const loop = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (!isDragging && !isHoveredRef.current) {
        setRotation((prev) => (prev + autoSpinSpeed * 25 * delta) % 360);
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [autoSpin, autoSpinSpeed, isDragging]);

  // Touch and Mouse Drag handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    setStartX(clientX);
    setStartRotation(rotation);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const diff = clientX - startX;
    const sensitivity = 0.45;
    setRotation(startRotation - diff * sensitivity);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const stepNext = () => {
    setRotation((prev) => prev - angleStep);
  };

  const stepPrev = () => {
    setRotation((prev) => prev + angleStep);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        if (isDragging) setIsDragging(false);
      }}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      className={`relative h-[420px] sm:h-[460px] w-full select-none overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* 3D Cylindrical Ring */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translateZ(-${radius}px) rotateY(${rotation}deg)`,
        }}
      >
        {items.map((item, index) => {
          const itemAngle = index * angleStep;
          const imgSrc = typeof item === 'string' ? item : item.image;

          return (
            <div
              key={index}
              className="group/card absolute flex h-[280px] w-[200px] sm:h-[340px] sm:w-[250px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0e121e] shadow-2xl transition-all duration-300 hover:border-neon hover:shadow-neon/20 hover:scale-[1.03]"
              style={{
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                backfaceVisibility: 'hidden',
              }}
            >
              <div className="relative h-full w-full overflow-hidden bg-obsidian">
                <img
                  src={imgSrc}
                  alt={`Gaming lounge visual ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                  draggable={false}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={stepPrev}
          aria-label="Previous image"
          className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-obsidian/80 text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="rounded-full border border-white/10 bg-obsidian/70 px-3 py-1 text-[11px] font-medium text-white/50 backdrop-blur-md">
          Drag to explore
        </span>
        <button
          type="button"
          onClick={stepNext}
          aria-label="Next image"
          className="pointer-events-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-obsidian/80 text-white backdrop-blur-md transition-all hover:border-white/30 hover:bg-white/10 active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
