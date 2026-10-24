import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';

interface CelebrationCheckmarkProps {
  isChecked: boolean;
  onToggle: () => void;
  size?: number;
  className?: string;
}

export const CelebrationCheckmark: React.FC<CelebrationCheckmarkProps> = ({
  isChecked,
  onToggle,
  size = 28,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeChecked = !isChecked;

    if (willBeChecked) {
      sound.playCelebrationChime();
      // Trigger canvas-confetti particle burst originating near the screen center
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x, y },
        colors: ['#E05D38', '#0284C7', '#2D7D63', '#F59E0B', '#8B5CF6'],
        ticks: 200,
        gravity: 1.2,
        scalar: 0.85,
        disableForReducedMotion: true,
      });
    } else {
      sound.playPop();
    }

    onToggle();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 450, damping: 20 }}
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center shrink-0 cursor-pointer select-none transition-colors duration-200 ${
        isChecked
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
          : 'bg-white border-2 border-slate-300 hover:border-slate-400 text-transparent shadow-sm'
      } ${className}`}
      aria-label={isChecked ? 'Mark task pending' : 'Mark task completed'}
    >
      <svg
        width={size * 0.58}
        height={size * 0.58}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none"
      >
        <motion.path
          d="M4.5 12.75l6 6 9-13.5"
          initial={false}
          animate={{
            pathLength: isChecked ? 1 : 0,
            opacity: isChecked ? 1 : 0,
          }}
          transition={{
            pathLength: { type: 'spring', stiffness: 400, damping: 25 },
            opacity: { duration: 0.15 },
          }}
        />
      </svg>
    </motion.button>
  );
};
