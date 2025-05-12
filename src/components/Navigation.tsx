'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import HeartIcon from './HeartIcon';
import Image from 'next/image';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/discover', label: 'Discover' },
  { path: '/matches', label: 'Matches' },
  { path: '/messages', label: 'Messages' },
  { path: '/profile', label: 'Profile' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.header 
      className="w-full bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold love-title flex items-center gap-2">
          <img 
            src="/images/logo.png" 
            alt="Beats Logo" 
            width={100} 
            height={40} 
            className="h-10 w-auto" 
          />
        </Link>
        
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-2 py-1 transition-all ${
                  isActive ? 'text-love-pink font-semibold' : 'text-gray-700 hover:text-love-pink'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-love-pink"
                    layoutId="navigation-underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Mobile bottom tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="flex flex-col items-center p-2"
                >
                  <div className={`p-2 rounded-full ${
                    isActive ? 'bg-love-light/30' : 'hover:bg-gray-100'
                  }`}>
                    {item.path === '/' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-love-pink' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                    {item.path === '/discover' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-love-pink' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    {item.path === '/matches' && (
                      <HeartIcon size={20} color={isActive ? '#FF5858' : '#4b5563'} fill={isActive} />
                    )}
                    {item.path === '/messages' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-love-pink' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    )}
                    {item.path === '/profile' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-love-pink' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-love-pink font-medium' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.header>
  );
} 