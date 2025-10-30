import { motion } from 'framer-motion';
import { useState } from 'react';
import { ModernIcon } from './IconSystem';

export default function SwipeCard({ cause, onSwipe }) {
  const [dragDirection, setDragDirection] = useState(null);

  const handleDragEnd = (event, info) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe('right', cause);
    } else if (info.offset.x < -threshold) {
      onSwipe('left', cause);
    }
    setDragDirection(null);
  };

  const handleDrag = (event, info) => {
    if (info.offset.x > 50) {
      setDragDirection('right');
    } else if (info.offset.x < -50) {
      setDragDirection('left');
    } else {
      setDragDirection(null);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        x: dragDirection === 'right' ? 600 : dragDirection === 'left' ? -600 : 0,
        rotate: dragDirection === 'right' ? 10 : dragDirection === 'left' ? -10 : 0,
        opacity: 0,
        transition: { duration: 0.45, ease: 'easeInOut' },
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute w-full max-w-sm bg-white rounded-2xl shadow-soft hover:shadow-soft-hover transition-shadow duration-180 p-6 cursor-grab active:cursor-grabbing"
      style={{ touchAction: 'none' }}
    >
      {/* Overlay for swipe direction */}
      {dragDirection && (
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-2xl ${
            dragDirection === 'right'
              ? 'bg-primary/80'
              : 'bg-gray-400/80'
          } opacity-80 pointer-events-none`}
        >
          <span className="text-white text-3xl font-bold">
            {dragDirection === 'right' ? '✓ Join' : '✗ Skip'}
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10">
        {/* Category Badge */}
        <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
          {cause.category}
        </div>

        {/* Cause Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{cause.name}</h3>

        {/* Description */}
        <p className="text-secondary text-sm mb-4 leading-relaxed">
          {cause.description}
        </p>

        {/* Location & Similarity */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <ModernIcon name="location" size="xs" gradient="teal" animated={false} glow={false} />
            <span className="text-secondary">{cause.city}</span>
          </div>
          {cause.similarity !== undefined && (
            <div className="flex items-center space-x-2">
              <ModernIcon name="causes" size="xs" gradient="blue" animated={false} glow={false} />
              <span className="text-primary font-semibold">
                {(cause.similarity * 100).toFixed(0)}% match
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
