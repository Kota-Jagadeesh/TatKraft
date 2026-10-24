import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { sound } from '../utils/sound';

interface SoftButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SoftButton: React.FC<SoftButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playClick();
      onClick?.(e);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#E05D38] hover:bg-[#D04E29] text-white soft-shadow-btn border border-white/20';
      case 'secondary':
        return 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/80 soft-shadow-card';
      case 'dark':
        return 'bg-[#2C3E50] hover:bg-[#243342] text-white soft-shadow-btn-dark border border-white/10';
      case 'ghost':
        return 'bg-transparent hover:bg-black/5 text-slate-600 hover:text-slate-900 border border-transparent';
      case 'danger':
        return 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs font-semibold gap-1.5';
      case 'lg':
        return 'px-6 py-3 text-base font-semibold gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2 text-sm font-semibold gap-2';
    }
  };

  return (
    <motion.button
      type="button"
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      disabled={disabled}
      onClick={handleClick}
      {...props}
      // Strictly 10-12px rounding per guideline
      className={`inline-flex items-center justify-center rounded-[10px] whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {children}
    </motion.button>
  );
};
