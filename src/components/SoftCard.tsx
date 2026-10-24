import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface SoftCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'surface' | 'cream' | 'inset' | 'sunken';
  interactive?: boolean;
}

export const SoftCard: React.FC<SoftCardProps> = ({
  children,
  className = '',
  variant = 'surface',
  interactive = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cream':
        return 'bg-[#FAF7F2] border border-amber-900/5 soft-shadow-card';
      case 'inset':
        return 'bg-[#F2ECE1] border border-amber-900/5 soft-shadow-inset';
      case 'sunken':
        return 'bg-[#EDE7DC] border border-black/5 soft-shadow-inset';
      case 'surface':
      default:
        return 'bg-white border border-slate-200/60 soft-shadow-card';
    }
  };

  const interactiveMotion = interactive
    ? {
        whileHover: { y: -2, scale: 1.004 },
        whileTap: { scale: 0.985 },
        transition: { type: 'spring' as const, stiffness: 450, damping: 25 },
      }
    : {};

  return (
    <motion.div
      {...interactiveMotion}
      {...props}
      // Rounded 12px strictly within 8-12px rule
      className={`rounded-[12px] transition-shadow duration-200 ${getVariantStyles()} ${
        interactive ? 'cursor-pointer hover:soft-shadow-card-hover' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};
