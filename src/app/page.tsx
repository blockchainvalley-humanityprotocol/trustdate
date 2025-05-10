'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeartIcon from '@/components/HeartIcon';
import LoveButton from '@/components/LoveButton';

// 플로팅 하트 컴포넌트
const FloatingHeart = ({ size = 20, delay = 0, duration = 3, x = 0 }) => (
  <motion.div
    className="absolute z-0"
    initial={{ opacity: 0, y: 0, x }}
    animate={{ 
      opacity: [0, 1, 0], 
      y: -100,
      x: x + Math.sin(delay) * 20
    }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <HeartIcon size={size} fill={true} color="#ff9ebb" />
  </motion.div>
);

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsLoaded(true);
  }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* 랜덤 위치에 떠다니는 하트들 - 클라이언트 사이드에서만 렌더링 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {isLoaded && windowWidth > 0 && Array.from({ length: 20 }).map((_, i) => (
          <FloatingHeart 
            key={i} 
            size={10 + Math.random() * 15} 
            delay={Math.random() * 10} 
            duration={2 + Math.random() * 4}
            x={Math.random() * windowWidth} 
          />
        ))}
      </div>

      {/* 히어로 섹션 */}
      <section className="w-full bg-gradient-to-r from-love-light/30 to-love-purple/20 py-20 mt-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 gap-10">
          <motion.div 
            className="flex flex-col gap-6 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold leading-tight love-title">
              검증된 신원으로<br/>
              더 설레는 만남을<br/>
              경험하세요
            </h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              TrustDate는 Humanity Protocol의 검증 시스템을 활용하여 
              진짜 설렘을 찾아드립니다. 심장 박동수로 확인하는 
              진정한 관심과 매칭을 경험해보세요.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <LoveButton href="/register" size="lg">
                설레는 시작하기
              </LoveButton>
              <LoveButton href="/about" variant="outline" size="lg" iconPosition="right">
                더 알아보기
              </LoveButton>
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative w-full max-w-md h-[400px]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <div className="w-full h-full relative">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-love-light/30 animate-pulse" />
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-love-purple/20 animate-pulse" style={{animationDelay: '1s'}} />
              <div className="w-full h-full flex items-center justify-center">
                <motion.div 
                  className="w-64 h-64 relative"
                  animate={{ 
                    rotateY: 360,
                    rotateZ: 5,
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-love-pink/80 to-love-purple/80 rounded-[30%] shadow-xl" style={{ transform: 'rotateX(10deg) rotateY(20deg)' }} />
                  <div className="absolute inset-4 flex items-center justify-center bg-white/90 rounded-[25%] shadow-inner">
                    <HeartIcon size={100} fill={true} pulse={true} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 특징 섹션 */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 love-title">
            TrustDate 만의 특별한 경험
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* 특징 1 */}
            <motion.div 
              className="love-card p-6"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255, 158, 187, 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-love-light rounded-full flex items-center justify-center mb-4">
                <HeartIcon size={30} fill={true} />
              </div>
              <h3 className="text-xl font-semibold mb-2">검증된 신원</h3>
              <p className="text-gray-600">
                Humanity Protocol로 검증된 사용자만 참여하여 가짜 프로필 없는 안전한 환경을 제공합니다.
              </p>
            </motion.div>
            
            {/* 특징 2 */}
            <motion.div 
              className="love-card p-6"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255, 158, 187, 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-love-light rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-love-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">프라이버시 보호</h3>
              <p className="text-gray-600">
                개인정보를 직접 공개하지 않고도 나이, 학력, 직업 등의 정보가 검증되었음을 증명합니다.
              </p>
            </motion.div>
            
            {/* 특징 3 */}
            <motion.div 
              className="love-card p-6"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255, 158, 187, 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-love-light rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-love-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">맞춤형 매칭</h3>
              <p className="text-gray-600">
                검증된 관심사와 배경을 기반으로 더 의미 있는 매칭을 제공합니다. 공통점이 많은 상대를 만나보세요.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="w-full py-16 bg-gradient-to-r from-love-pink/10 to-love-purple/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 love-title">
            지금 바로 설레는 만남을 시작하세요
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            검증된 신원으로 더 안전하고 의미 있는 만남을 경험해보세요
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LoveButton href="/register" size="lg">
              지금 바로 시작하기
            </LoveButton>
          </motion.div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="w-full bg-neutral text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 love-title">TrustDate</h3>
              <p className="text-gray-300">
                Humanity Protocol 기반의 검증된 신원으로 안전한 데이팅을 제공합니다.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">링크</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-love-light">소개</Link></li>
                <li><Link href="/privacy" className="text-gray-300 hover:text-love-light">개인정보 보호정책</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-love-light">이용약관</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-love-light">연락처</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">연락처</h3>
              <p className="text-gray-300">
                고려대학교 해커톤 프로젝트<br />
                support@trustdate.example
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400">© 2023 TrustDate. 고려대학교 해커톤.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 