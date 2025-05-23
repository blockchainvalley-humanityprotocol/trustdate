'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeartRateMonitor from './HeartRateMonitor';
import HeartIcon from './HeartIcon';
import { UserProfile, HeartRateData } from '@/types';

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentUserId: string;
  onHeartRateMeasured?: (data: HeartRateData) => void;
}

const ProfileImageModal = ({ 
  isOpen, 
  onClose, 
  profile, 
  currentUserId,
  onHeartRateMeasured
}: ProfileImageModalProps) => {
  const [imgError, setImgError] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [isHeartRateComplete, setIsHeartRateComplete] = useState(false);
  
  // Create random hearts when modal opens
  useEffect(() => {
    if (isOpen) {
      const newHearts = Array.from({ length: 8 }).map((_, index) => ({
        id: Date.now() + index,
        x: Math.random() * 400 - 200,
        y: Math.random() * 400,
        delay: Math.random() * 2
      }));
      setFloatingHearts(newHearts);
    } else {
      setFloatingHearts([]);
      setIsHeartRateComplete(false);
    }
  }, [isOpen]);

  // Heart rate measurement complete handler
  const handleHeartRateMeasured = (data: HeartRateData) => {
    setIsHeartRateComplete(true);
    if (onHeartRateMeasured) {
      onHeartRateMeasured(data);
    }
    
    // Create additional heart effect after measurement is complete
    if (data.percentageChange >= 15) {
      const celebrationHearts = Array.from({ length: 15 }).map((_, index) => ({
        id: Date.now() + 100 + index,
        x: Math.random() * 500 - 250,
        y: Math.random() * 600,
        delay: Math.random() * 1.5
      }));
      setFloatingHearts(prev => [...prev, ...celebrationHearts]);
    }
  };

  // Close modal with ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Floating heart animations */}
          {floatingHearts.map((heart) => (
            <motion.div
              key={heart.id}
              className="absolute pointer-events-none z-50"
              style={{ 
                left: `calc(50% + ${heart.x}px)`, 
                top: `calc(50% + ${heart.y - 200}px)` 
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
                y: -300,
                x: heart.x + Math.sin(heart.delay * 5) * 50 
              }}
              transition={{ 
                duration: 3, 
                delay: heart.delay,
                ease: "easeOut" 
              }}
              exit={{ opacity: 0 }}
            >
              <HeartIcon size={20 + Math.random() * 20} fill={true} color="#ff9ebb" />
            </motion.div>
          ))}
          
          {/* Modal content */}
          <motion.div 
            className="bg-white rounded-xl shadow-2xl overflow-y-auto z-10 max-w-5xl w-full max-h-[90vh] relative flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 z-20 btn btn-circle btn-sm bg-white/80 hover:bg-white border-none shadow-md"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Large image section */}
            <div className="w-full bg-gray-100">
              <img 
                src={imgError ? "/images/default.jpg" : profile.avatarUrl} 
                alt={profile.displayName}
                onError={() => setImgError(true)}
                className="w-full max-h-[40vh] md:max-h-[50vh] object-contain mx-auto"
              />
              
              <div className="bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                <h2 className="text-3xl font-bold love-title mb-1">{profile.displayName}</h2>
                <p className="text-white/90 text-lg">{profile.location}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.interests.slice(0, 3).map((interest, idx) => (
                    <span key={idx} className="badge bg-love-light/30 text-white border-none p-3">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Heart rate measurement section - with distinct background color */}
            <div className="p-6 flex flex-col bg-white">
              <h3 className="text-2xl font-bold love-title mb-4">
                <HeartIcon size={24} color="#ff9ebb" fill={true} className="inline-block mr-2" />
                {isHeartRateComplete ? 'Heart Rate Results' : 'Heart Rate Measurement'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {isHeartRateComplete ? 
                  `We measured how your heart reacts while viewing ${profile.displayName}'s photo.` : 
                  `Measure how your heart reacts while viewing ${profile.displayName}'s photo. Real excitement is required for matching!`
                }
              </p>
              
              <div className="flex-grow">
                <HeartRateMonitor 
                  userId={currentUserId} 
                  targetUserId={profile.id}
                  onMeasurementComplete={handleHeartRateMeasured}
                />
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <button 
                  onClick={onClose}
                  className="btn btn-outline w-full border-love-pink text-love-pink hover:bg-love-light/20 hover:border-love-pink"
                >
                  {isHeartRateComplete ? 'Check Results and Return' : 'Measure Later'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileImageModal; 