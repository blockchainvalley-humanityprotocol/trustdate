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
  
  // 모달이 열릴 때 랜덤 하트 생성
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

  // 심장 박동수 측정 완료 핸들러
  const handleHeartRateMeasured = (data: HeartRateData) => {
    setIsHeartRateComplete(true);
    if (onHeartRateMeasured) {
      onHeartRateMeasured(data);
    }
    
    // 측정 완료 후 추가 하트 이펙트 생성
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

  // ESC 키로 모달 닫기
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
          {/* 백드롭 */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* 플로팅 하트 애니메이션 */}
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
          
          {/* 모달 컨텐츠 */}
          <motion.div 
            className="bg-white rounded-xl shadow-2xl overflow-hidden z-10 max-w-5xl w-full max-h-[90vh] relative flex flex-col md:flex-row"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            {/* 닫기 버튼 */}
            <button 
              className="absolute top-4 right-4 z-20 btn btn-circle btn-sm bg-white/80 hover:bg-white border-none shadow-md"
              onClick={onClose}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* 대형 이미지 섹션 */}
            <div className="md:w-2/3 relative overflow-hidden h-[60vh] md:h-[80vh]">
              <motion.img 
                src={imgError ? "/images/default.jpg" : profile.avatarUrl} 
                alt={profile.displayName}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h2 className="text-4xl font-bold love-title mb-2">{profile.displayName}</h2>
                  <p className="text-white/90 text-xl">{profile.location}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.interests.slice(0, 3).map((interest, idx) => (
                      <span key={idx} className="badge bg-love-light/30 text-white border-none p-3">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 심장 박동수 측정 섹션 */}
            <div className="md:w-1/3 p-6 flex flex-col overflow-y-auto">
              <h3 className="text-2xl font-bold love-title mb-4">
                <HeartIcon size={24} color="#ff9ebb" fill={true} className="inline-block mr-2" />
                {isHeartRateComplete ? '심장 박동 결과' : '심장 박동 측정'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {isHeartRateComplete ? 
                  `${profile.displayName}님의
                  사진을 보면서 느끼는 설렘을 측정했습니다.` : 
                  `${profile.displayName}님의 사진을 보며 당신의 심장이 어떻게 반응하는지 측정해보세요. 진짜 설렘이 있어야 매칭이 가능합니다!`
                }
              </p>
              
              <div className="flex-grow">
                <HeartRateMonitor 
                  userId={currentUserId} 
                  targetUserId={profile.id}
                  onMeasurementComplete={handleHeartRateMeasured}
                />
              </div>
              
              <div className="mt-auto pt-4 border-t">
                <button 
                  onClick={onClose}
                  className="btn btn-outline w-full border-love-pink text-love-pink hover:bg-love-light/20 hover:border-love-pink"
                >
                  {isHeartRateComplete ? '결과 확인하고 돌아가기' : '나중에 측정하기'}
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