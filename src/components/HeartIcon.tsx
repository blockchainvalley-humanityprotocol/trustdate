'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeartIconProps {
  className?: string;
  fill?: boolean;
  size?: number | string;
  color?: string;
  pulse?: boolean;
}

const HeartIcon: React.FC<HeartIconProps> = ({
  className = '',
  fill = false,
  size = 24,
  color = '#ff9ebb',
  pulse = false,
}) => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${className} ${pulse ? 'heart-pulse' : ''}`}
      fill={fill ? color : 'none'}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </motion.svg>
  );
};

export default HeartIcon; 