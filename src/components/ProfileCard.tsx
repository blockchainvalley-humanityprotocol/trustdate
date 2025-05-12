'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, HeartRateData } from '@/types';
import CredentialCard from './CredentialCard';
import HeartRateMonitor from './HeartRateMonitor';
import HeartIcon from './HeartIcon';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import ProfileImageModal from './ProfileImageModal';

interface ProfileCardProps {
  profile: UserProfile;
  onMatch?: () => void;
  isMatched?: boolean;
  isPending?: boolean;
  showHeartRateMonitor?: boolean;
  currentUserId?: string;
}

const ProfileCard = ({ 
  profile, 
  onMatch, 
  isMatched = false, 
  isPending = false,
  showHeartRateMonitor = false,
  currentUserId = 'user123' // 기본값
}: ProfileCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [heartRateData, setHeartRateData] = useState<HeartRateData | null>(null);
  const [isPassedHeartRateThreshold, setIsPassedHeartRateThreshold] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, x: number, delay: number}>>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // 카드 틸트 효과를 위한 모션 값
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // 마우스 위치에 따른 회전 변환
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const scale = useTransform(y, [-100, 100], [1.05, 0.95]);

  // 초기 랜덤 하트 생성
  useEffect(() => {
    const newHearts = Array.from({ length: 3 }).map((_, index) => ({
      id: index,
      x: Math.random() * 100 - 50,
      delay: Math.random() * 2,
    }));
    setFloatingHearts(newHearts);
  }, []);

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  // 마우스 나갈 때 효과 초기화
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleHeartRateMeasurementComplete = (data: HeartRateData) => {
    setHeartRateData(data);
    // 15% 이상 증가하면 매칭 가능 기준 통과
    const heartRateThreshold = 15;
    setIsPassedHeartRateThreshold(data.percentageChange >= heartRateThreshold);
  };

  // 매칭 버튼 클릭 처리
  const handleMatchClick = () => {
    // 하트 효과 추가
    const newHearts = Array.from({ length: 8 }).map((_, index) => ({
      id: Date.now() + index,
      x: Math.random() * 100 - 50,
      delay: Math.random() * 2,
    }));
    setFloatingHearts([...floatingHearts, ...newHearts]);

    if (onMatch) {
      onMatch();
    }
  };

  // 카드 뒤집기 효과
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // 디테일 버튼 클릭 처리
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // 이미지 모달 열기
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div 
        ref={cardRef}
        className="relative w-full"
        style={{
          perspective: 2000,
        }}
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 플로팅 하트 애니메이션 */}
        {floatingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute z-10 pointer-events-none"
            style={{ 
              x: heart.x, 
              top: '50%', 
              left: '50%' 
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{ 
              y: -150, 
              opacity: [0, 1, 0], 
              scale: [0, 1, 0.5],
              x: heart.x + Math.sin(heart.delay * 5) * 30,
            }}
            transition={{ 
              duration: 2.5, 
              delay: heart.delay,
              ease: "easeOut",
              onComplete: () => {
                setFloatingHearts(prev => prev.filter(h => h.id !== heart.id));
              }
            }}
          >
            <HeartIcon size={16 + Math.random() * 14} fill={true} />
          </motion.div>
        ))}

        <motion.div
          className="love-card"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* 카드 앞면 */}
          <div style={{ 
            backfaceVisibility: 'hidden', 
            display: isFlipped ? 'none' : 'block'
          }}>
            <div className="relative h-48 bg-gradient-to-r from-love-light/50 to-love-purple/30">
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 cursor-pointer"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={openImageModal}
              >
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-love-pink ring-offset-base-100 ring-offset-2 shadow-lg overflow-hidden">
                    <img 
                      src={imgError ? "/images/default.jpg" : profile.avatarUrl} 
                      alt={profile.displayName} 
                      onError={() => setImgError(true)}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                      <HeartIcon size={40} fill={true} color="white" pulse={true} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="card-body pt-16">
              <motion.h2 
                className="card-title justify-center text-2xl mb-1 love-title"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {profile.displayName}
              </motion.h2>
              <motion.p 
                className="text-center text-gray-500 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {profile.location}
              </motion.p>
              
              <motion.div 
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <p className="text-gray-700">{profile.bio}</p>
              </motion.div>
              
              {/* Heart rate monitor or modal button */}
              {showHeartRateMonitor && (
                <div className="my-4">
                  <button 
                    onClick={openImageModal}
                    className="btn btn-primary w-full gap-2"
                  >
                    <HeartIcon size={20} fill={true} color="white" />
                    {isPassedHeartRateThreshold ? 
                      "Heart Rate Check Complete!" : 
                      "Measure Heart Rate with Full Photo"}
                  </button>
                </div>
              )}
              
              <motion.div 
                className="flex gap-2 justify-center my-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.button 
                  onClick={flipCard} 
                  className="btn btn-circle btn-outline border-love-pink text-love-pink hover:bg-love-light/20 hover:border-love-pink"
                  title="View Back of Profile"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </motion.button>
                <motion.button 
                  onClick={toggleDetails} 
                  className="btn btn-circle btn-outline border-love-pink text-love-pink hover:bg-love-light/20 hover:border-love-pink"
                  title="View Details"
                  whileHover={{ scale: 1.1, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
              </motion.div>
              
              <div className="card-actions justify-center mt-4">
                {!isMatched && !isPending && onMatch && (
                  <motion.button 
                    onClick={handleMatchClick} 
                    className={`heart-button px-6 py-3 gap-2 ${!isPassedHeartRateThreshold && showHeartRateMonitor ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={showHeartRateMonitor && !isPassedHeartRateThreshold}
                    whileHover={{ scale: isPassedHeartRateThreshold || !showHeartRateMonitor ? 1.05 : 1 }}
                    whileTap={{ scale: isPassedHeartRateThreshold || !showHeartRateMonitor ? 0.95 : 1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <HeartIcon size={24} color="white" fill={true} pulse={isPassedHeartRateThreshold} />
                    {showHeartRateMonitor && !isPassedHeartRateThreshold
                      ? "Heart Rate Measurement Required"
                      : "Show Interest"}
                  </motion.button>
                )}
                
                {isPending && (
                  <div className="badge bg-love-accent/80 gap-2 p-4 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Awaiting Response
                  </div>
                )}
                
                {isMatched && (
                  <div className="badge bg-gradient-to-r from-love-pink to-love-purple text-white gap-2 p-4 shadow-md">
                    <HeartIcon size={20} fill={true} color="white" pulse={true} />
                    Matched
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400 text-center mt-6">
                Last active: {new Date(profile.lastActive).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* 카드 뒷면 */}
          <div style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)',
            display: isFlipped ? 'block' : 'none'
          }}>
            <div className="card-body p-6 bg-gradient-to-br from-white to-love-light/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title text-xl love-title">Detailed Information</h3>
                <motion.button 
                  onClick={flipCard} 
                  className="btn btn-circle btn-sm bg-love-pink border-none hover:bg-love-dark"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="divider before:bg-love-pink/30 after:bg-love-pink/30">Verified Information</div>
              <div className="space-y-3 mb-6">
                {profile.credentials.map(credential => (
                  <CredentialCard 
                    key={credential.id} 
                    credential={credential} 
                  />
                ))}
              </div>
              
              <div className="divider before:bg-love-pink/30 after:bg-love-pink/30">Interests</div>
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {profile.interests.map((interest, index) => (
                  <motion.span 
                    key={index} 
                    className="badge bg-love-light text-love-dark border-none p-3"
                    whileHover={{ scale: 1.1, rotate: 3, backgroundColor: '#ff9ebb', color: '#ffffff' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Detail panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              className="absolute top-full left-0 right-0 love-card mt-4 p-6 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold love-title">Detailed Information</h3>
                <motion.button 
                  onClick={toggleDetails} 
                  className="btn btn-circle btn-sm bg-love-pink border-none hover:bg-love-dark"
                  whileHover={{ scale: 1.1, rotate: 45 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="divider before:bg-love-pink/30 after:bg-love-pink/30">Verified Information</div>
              <div className="space-y-3 mb-6">
                {profile.credentials.map(credential => (
                  <CredentialCard 
                    key={credential.id} 
                    credential={credential} 
                  />
                ))}
              </div>
              
              <div className="divider before:bg-love-pink/30 after:bg-love-pink/30">Interests</div>
              <div className="flex flex-wrap gap-2 mb-6 justify-center">
                {profile.interests.map((interest, index) => (
                  <motion.span 
                    key={index} 
                    className="badge bg-love-light text-love-dark border-none p-3"
                    whileHover={{ scale: 1.1, rotate: 3, backgroundColor: '#ff9ebb', color: '#ffffff' }}
                  >
                    {interest}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Image modal */}
        <ProfileImageModal 
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          profile={profile}
          currentUserId={currentUserId}
          onHeartRateMeasured={handleHeartRateMeasurementComplete}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCard; 