import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface SplashOpeningAnimationProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const SplashOpeningAnimation: React.FC<SplashOpeningAnimationProps> = ({
  isOpen,
  onFinish,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger launch sound
    const timerAudio = setTimeout(() => {
      sound.playLaunchWhooshChime();
    }, 180);

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 45);

    // Auto complete splash after 1.8s
    const timerDone = setTimeout(() => {
      onFinish();
    }, 1850);

    return () => {
      clearTimeout(timerAudio);
      clearTimeout(timerDone);
      clearInterval(interval);
    };
  }, [isOpen, onFinish]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tatkraft-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(8px)',
            transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8F6F1] select-none overflow-hidden"
        >
          {/* Ambient Soft UI radial glows */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1], opacity: [0.2, 0.45, 0.35] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#FFEBE5]/60 via-[#E0F2FE]/40 to-[#E6F5F0]/50 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center text-center px-6">
            {/* Logo Squircle with Spring Bounce Overshoot */}
            <motion.div
              initial={{ scale: 0, rotate: -20, y: 30 }}
              animate={{
                scale: [0, 1.22, 0.94, 1.03, 1],
                rotate: [-20, 4, -2, 0],
                y: [30, -8, 2, 0],
              }}
              transition={{
                duration: 0.9,
                times: [0, 0.45, 0.7, 0.88, 1],
                ease: 'easeOut',
              }}
              className="relative p-1.5 rounded-[24px] bg-white soft-shadow-card border border-amber-900/10 mb-6 group"
            >
              <img
                src="/public/assets/aistudio/image_ecd9de76.png"
                alt="TatKraft Logo"
                className="w-24 h-24 rounded-[20px] object-cover shadow-inner"
              />

              {/* Energy Sparks around logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.3] }}
                transition={{ duration: 0.8, delay: 0.35 }}
                className="absolute -top-1.5 -right-1.5 text-[#E05D38]"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Typography Reveal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
              className="space-y-1.5"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>TatKraft</span>
                <span className="text-[#E05D38] text-2xl font-bold">⚡</span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
                Action-Driven Momentum Engine
              </p>
              <p className="text-[11px] font-semibold text-[#0284C7] tracking-wider uppercase">
                Conquer Friction · Crush Deadlines
              </p>
            </motion.div>

            {/* Micro Progress Track */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="w-48 sm:w-56 mt-7 space-y-2"
            >
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#E05D38] via-[#0284C7] to-[#2D7D63]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Calibrating momentum...</span>
                <span className="tabular-nums font-semibold text-slate-600">{progress}%</span>
              </div>
            </motion.div>

            {/* Instant Skip Touch Affordance */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 0.7 }}
              onClick={onFinish}
              className="mt-6 inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-slate-800 hover:opacity-100 transition-all cursor-pointer py-1 px-2.5 rounded-full hover:bg-black/5"
            >
              <span>Tap to enter</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
