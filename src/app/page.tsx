'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeartIcon from '@/components/HeartIcon';
import LoveButton from '@/components/LoveButton';

// Floating heart component
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
    <HeartIcon size={size} fill={true} color="#FF5858" />
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
      {/* Random floating hearts - only rendered on client side */}
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

      {/* Hero section */}
      <section className="w-full bg-gradient-to-r from-love-light/30 to-love-purple/20 py-20 mt-16">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 gap-10">
          <motion.div 
            className="flex flex-col gap-6 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold leading-tight love-title">
              Experience Exciting<br/>
              Connections with<br/>
              Verified Identities
            </h2>
            <motion.p 
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Beats uses Humanity Protocol's verification system
              to help you find genuine connections. Experience true interest
              and matching verified by heart rate monitoring.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <LoveButton href="/register" size="lg">
                Get Started
              </LoveButton>
              <LoveButton href="/about" variant="outline" size="lg" iconPosition="right">
                Learn More
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

      {/* Features section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 love-title">
            The Beats Experience
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="love-card p-6"
              whileHover={{ scale: 1.03, boxShadow: '0 10px 25px rgba(255, 158, 187, 0.2)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-14 h-14 bg-love-light rounded-full flex items-center justify-center mb-4">
                <HeartIcon size={30} fill={true} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Identity</h3>
              <p className="text-gray-600">
                Only users verified by Humanity Protocol can participate, providing a safe environment with no fake profiles.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
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
              <h3 className="text-xl font-semibold mb-2">Privacy Protection</h3>
              <p className="text-gray-600">
                Verify your age, education, and occupation without directly revealing your personal information.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
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
              <h3 className="text-xl font-semibold mb-2">Personalized Matching</h3>
              <p className="text-gray-600">
                Receive more meaningful matches based on verified interests and backgrounds. Meet people who share your interests.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-16 bg-gradient-to-r from-love-pink/10 to-love-purple/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 love-title">
            Start Your Exciting Connection Today
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Experience safer and more meaningful connections with verified identities
          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <LoveButton href="/register" size="lg">
              Get Started Now
            </LoveButton>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4 love-title">Beats</h3>
              <div className="flex space-x-4 ml-8">
                <a href="#" className="text-gray-600 hover:text-love-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-love-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-love-pink">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 mb-2">support@beats.example</p>
              <div className="flex justify-center md:justify-end space-x-4">
                <a href="#" className="text-gray-600 hover:text-love-pink text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-love-pink text-sm">Terms of Service</a>
              </div>
              <p className="text-gray-400">© 2025 Beats. Korea University Hackathon.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 