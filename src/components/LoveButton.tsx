'use client';

import React from 'react';
import { motion } from 'framer-motion';
import HeartIcon from './HeartIcon';
import Link from 'next/link';

interface LoveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'ghost';
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}

const LoveButton: React.FC<LoveButtonProps> = ({
  children,
  onClick,
  href,
  className = '',
  size = 'md',
  variant = 'solid',
  showIcon = true,
  iconPosition = 'left',
  disabled = false,
}) => {
  // 버튼 크기 클래스
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // 버튼 스타일 클래스
  const variantClasses = {
    solid: 'bg-gradient-to-r from-love-pink to-love-purple text-white',
    outline: 'bg-white border-2 border-love-pink text-love-pink hover:bg-love-light hover:text-white',
    ghost: 'bg-transparent text-love-pink hover:bg-love-light/20',
  };

  const baseClasses = `
    rounded-full 
    font-medium 
    transition-all 
    shadow-md 
    hover:shadow-lg 
    active:scale-95 
    focus:outline-none 
    flex 
    items-center 
    justify-center 
    gap-2
    disabled:opacity-50 
    disabled:cursor-not-allowed
  `;

  const buttonClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${className}
  `;

  const ButtonContent = () => (
    <>
      {showIcon && iconPosition === 'left' && (
        <HeartIcon 
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
          fill={variant === 'solid'} 
          color={variant === 'solid' ? '#ffffff' : '#ff9ebb'}
        />
      )}
      {children}
      {showIcon && iconPosition === 'right' && (
        <HeartIcon 
          size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
          fill={variant === 'solid'} 
          color={variant === 'solid' ? '#ffffff' : '#ff9ebb'}
        />
      )}
    </>
  );

  // 링크 버튼인 경우
  if (href) {
    return (
      <Link href={href} className={disabled ? 'pointer-events-none' : ''}>
        <motion.span
          className={buttonClasses}
          whileHover={{ scale: disabled ? 1 : 1.03 }}
          whileTap={{ scale: disabled ? 1 : 0.97 }}
        >
          <ButtonContent />
        </motion.span>
      </Link>
    );
  }

  // 일반 버튼인 경우
  return (
    <motion.button
      onClick={onClick}
      className={buttonClasses}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
    >
      <ButtonContent />
    </motion.button>
  );
};

export default LoveButton; 