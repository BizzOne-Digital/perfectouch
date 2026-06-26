import { useState, useRef, useCallback } from 'react';

export default function BeforeAfterSlider({ before, after, label = '' }) {
  const [position, setPosition] = useState(50);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    updatePosition(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onMouseUp = () => { isDragging.current = false; };

  const onTouchStart = (e) => {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={sliderRef}
      className="before-after-slider aspect-video select-none rounded-xl overflow-hidden shadow-xl"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
    >
      {/* Before image */}
      <div className="absolute inset-0">
        <img src={before} alt="Before" className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Before
        </div>
      </div>

      {/* After image - clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={after} alt="After" className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          After
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-brand-blue rounded-full border-3 border-white shadow-xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-5 h-5">
            <polyline points="15 18 9 12 15 6"/>
            <polyline points="9 18 3 12 9 6" transform="translate(12,0)"/>
          </svg>
        </div>
      </div>

      {/* Label */}
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );
}
