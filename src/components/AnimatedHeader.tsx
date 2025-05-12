'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ 
  title, 
  subtitle, 
  className = '' 
}) => {
  useEffect(() => {
    // GSAP animation effects
    const tl = gsap.timeline();
    tl.from('.animated-title', {
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out'
    }).from('.animated-subtitle', {
      duration: 0.6,
      y: 20,
      opacity: 0,
      ease: 'power2.out'
    }, '-=0.4');
  }, []);

  // Split title into individual letters for animation
  const titleLetters = title.split('').map((letter, index) => (
    <span 
      key={index} 
      className="animated-title inline-block"
      style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
    >
      {letter === ' ' ? '\u00A0' : letter}
    </span>
  ));

  return (
    <div className={`mb-10 text-center ${className}`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 overflow-hidden">
        {titleLetters}
      </h1>
      
      {subtitle && (
        <motion.p 
          className="animated-subtitle text-xl text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.7, 
            delay: 0.4, 
            ease: [0.17, 0.67, 0.83, 0.67] 
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default AnimatedHeader; 