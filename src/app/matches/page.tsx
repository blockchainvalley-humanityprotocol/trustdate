'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Match } from '@/types';
import ProfileCard from '@/components/ProfileCard';
import HeartIcon from '@/components/HeartIcon';
import LoveButton from '@/components/LoveButton';
import { motion, AnimatePresence } from 'framer-motion';

// 더미 사용자 데이터
const currentUser: UserProfile = {
  id: 'user123',
  displayName: 'John Mo',
  bio: 'Developer interested in blockchain and AI technology. Fascinated by new technologies and innovative ideas.',
  avatarUrl: '/images/default.jpg',
  location: 'Gangnam, Seoul',
  interests: ['Blockchain', 'Artificial Intelligence', 'Programming', 'Innovative Tech', 'Startups'],
  credentials: [],
  matches: ['user1', 'user2', 'user3'],
  conversations: ['conv1', 'conv2', 'conv3'],
  createdAt: '2023-10-01T00:00:00Z',
  lastActive: '2023-10-22T18:30:00Z'
};

// 더미 매치 데이터
const dummyMatches: Match[] = [
  {
    id: 'match1',
    users: ['user123', 'user1'],
    status: 'accepted',
    createdAt: '2023-10-20T09:00:00Z',
    updatedAt: '2023-10-20T10:00:00Z'
  },
  {
    id: 'match2',
    users: ['user123', 'user2'],
    status: 'accepted',
    createdAt: '2023-10-21T14:00:00Z',
    updatedAt: '2023-10-21T15:30:00Z'
  },
  {
    id: 'match3',
    users: ['user123', 'user3'],
    status: 'pending',
    createdAt: '2023-10-22T11:00:00Z',
    updatedAt: '2023-10-22T11:00:00Z'
  }
];

// 더미 매치 프로필 데이터
const matchProfiles: { [key: string]: UserProfile } = {
  user1: {
    id: 'user1',
    displayName: 'Vitalik Buterin',
    bio: 'Founder of Ethereum and pioneer in blockchain technology. Interested in cryptocurrency and decentralized technology, and contributing to the developer community.',
    avatarUrl: '/images/eth1.png',
    location: 'Singapore',
    interests: ['Blockchain', 'Cryptocurrency', 'Programming', 'Philosophy', 'Decentralization'],
    credentials: [
      {
        id: 'cred1_1',
        type: 'education',
        issuer: 'University of Toronto',
        holder: 'user1',
        issuanceDate: '2023-09-01T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          institution: 'University of Toronto',
          degree: 'Computer Science'
        },
        status: 'active'
      },
      {
        id: 'cred1_4',
        type: 'employment',
        issuer: 'Ethereum Foundation',
        holder: 'user1',
        issuanceDate: '2023-09-01T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          company: 'Ethereum Foundation',
          position: 'Founder'
        },
        status: 'active'
      }
    ],
    matches: ['user123'],
    conversations: ['conv1'],
    createdAt: '2023-10-01T12:00:00Z',
    lastActive: '2023-10-21T15:45:00Z'
  },
  user2: {
    id: 'user2',
    displayName: 'Elon Musk',
    bio: 'CEO of Tesla and SpaceX, and owner of X (Twitter). Passionate about innovative technology, space travel, and sustainable energy.',
    avatarUrl: '/images/musk1.png',
    location: 'Austin, Texas',
    interests: ['Space Travel', 'Electric Vehicles', 'AI', 'Sustainability', 'Mars Colonization'],
    credentials: [
      {
        id: 'cred2_3',
        type: 'education',
        issuer: 'University of Pennsylvania',
        holder: 'user2',
        issuanceDate: '2023-09-05T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          institution: 'University of Pennsylvania',
          degree: 'Physics & Economics'
        },
        status: 'active'
      },
      {
        id: 'cred2_4',
        type: 'employment',
        issuer: 'Tesla & SpaceX',
        holder: 'user2',
        issuanceDate: '2023-09-05T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          company: 'Tesla, SpaceX',
          position: 'CEO'
        },
        status: 'active'
      }
    ],
    matches: ['user123'],
    conversations: ['conv2'],
    createdAt: '2023-10-05T12:00:00Z',
    lastActive: '2023-10-22T10:30:00Z'
  },
  user3: {
    id: 'user3',
    displayName: 'Donald Trump',
    bio: 'Former U.S. President and businessman. Active in real estate development and politics, and founder of the social media platform Truth Social.',
    avatarUrl: '/images/trump1.png',
    location: 'Palm Beach, Florida',
    interests: ['Golf', 'Politics', 'Real Estate', 'Negotiation', 'Media'],
    credentials: [
      {
        id: 'cred3_3',
        type: 'education',
        issuer: 'Wharton School',
        holder: 'user3',
        issuanceDate: '2023-09-10T09:30:00Z',
        expirationDate: '2026-09-10T09:30:00Z',
        claims: {
          institution: 'Wharton School',
          degree: 'Economics'
        },
        status: 'active'
      },
      {
        id: 'cred3_4',
        type: 'employment',
        issuer: 'U.S. Federal Government',
        holder: 'user3',
        issuanceDate: '2023-09-15T09:30:00Z',
        expirationDate: '2024-09-15T09:30:00Z',
        claims: {
          company: 'U.S. Federal Government',
          position: 'Former President'
        },
        status: 'active'
      }
    ],
    matches: ['user123'],
    conversations: ['conv3'],
    createdAt: '2023-10-03T12:00:00Z',
    lastActive: '2023-10-22T14:20:00Z'
  }
};

const MatchesPage = () => {
  const [acceptedMatches, setAcceptedMatches] = useState<Match[]>([]);
  const [pendingMatches, setPendingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API를 호출하여 매치 데이터를 가져옴
    setTimeout(() => {
      const accepted = dummyMatches.filter(match => match.status === 'accepted');
      const pending = dummyMatches.filter(match => match.status === 'pending');
      setAcceptedMatches(accepted);
      setPendingMatches(pending);
      setLoading(false);
    }, 1000);
  }, []);

  // 매치 수락
  const acceptMatch = (matchId: string) => {
    // 실제 구현에서는 API를 통해 매치 수락 처리
    setPendingMatches(prev => prev.filter(match => match.id !== matchId));
    setAcceptedMatches(prev => [
      ...prev,
      { ...dummyMatches.find(match => match.id === matchId)!, status: 'accepted', updatedAt: new Date().toISOString() }
    ]);
    
    // 축하 이펙트 표시
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  // 매치 거절
  const rejectMatch = (matchId: string) => {
    // 실제 구현에서는 API를 통해 매치 거절 처리
    setPendingMatches(prev => prev.filter(match => match.id !== matchId));
  };

  // 매치의 상대방 ID 찾기
  const getPartnerIdFromMatch = (match: Match) => {
    return match.users.find(userId => userId !== currentUser.id) || '';
  };

  // 매치의 상대방 프로필 찾기
  const getPartnerProfile = (match: Match) => {
    const partnerId = getPartnerIdFromMatch(match);
    return matchProfiles[partnerId];
  };

  // 컨페티 효과 랜덤 생성
  const generateConfetti = () => {
    return Array.from({ length: 50 }).map((_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: -20,
      size: 5 + Math.random() * 15,
      color: [
        '#ff9ebb', '#ffcbd7', '#d9a9ff', '#b8e1ff', 
        '#ffb6c1', '#ffc0cb', '#e6a8d7', '#c6a4f4'
      ][Math.floor(Math.random() * 8)],
      rotation: Math.random() * 360,
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {/* 축하 컨페티 */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {generateConfetti().map((confetti) => (
            <motion.div
              key={confetti.id}
              className="absolute"
              style={{
                left: confetti.x,
                top: confetti.y,
                width: confetti.size,
                height: confetti.size,
                backgroundColor: confetti.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                rotate: confetti.rotation,
              }}
              animate={{
                y: window.innerHeight,
                x: confetti.x + (Math.random() - 0.5) * 200,
                rotate: confetti.rotation + (Math.random() * 2 - 1) * 360,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      <h1 className="text-3xl love-title mb-8">My Matches</h1>

      {loading ? (
        <div className="h-64 w-full flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <HeartIcon size={80} pulse={true} color="#ff9ebb" />
          </div>
          <p className="mt-4 text-love-pink">Loading match information...</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 대기중인 매치 */}
          <AnimatePresence>
            {pendingMatches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <HeartIcon size={24} color="#ff9ebb" className="mr-2" />
                  <h2 className="text-2xl font-semibold">Pending Matches</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {pendingMatches.map(match => {
                    const partnerProfile = getPartnerProfile(match);
                    return (
                      <motion.div 
                        key={match.id} 
                        className="love-card overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="avatar">
                              <div className="w-16 h-16 rounded-full ring ring-love-pink/20 ring-offset-2">
                                <img 
                                  src={partnerProfile.avatarUrl} 
                                  alt={partnerProfile.displayName}
                                  onError={(e) => {
                                    e.currentTarget.src = '/images/default.jpg';
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold love-title">{partnerProfile.displayName}</h3>
                              <p className="text-gray-500">{partnerProfile.location}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4">{partnerProfile.bio.substring(0, 100)}...</p>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium text-love-dark">Interests:</span>
                            <div className="flex flex-wrap gap-1">
                              {partnerProfile.interests.slice(0, 3).map((interest, index) => (
                                <motion.span 
                                  key={index} 
                                  className="badge bg-love-light/30 text-love-dark border-none"
                                  whileHover={{ scale: 1.1, backgroundColor: '#ff9ebb', color: '#ffffff' }}
                                >
                                  {interest}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-end items-center gap-3 mt-6">
                            <motion.button 
                              onClick={() => rejectMatch(match.id)}
                              className="btn btn-sm bg-white text-love-dark border-love-light hover:bg-gray-100 hover:border-love-pink"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Reject
                            </motion.button>
                            <motion.button 
                              onClick={() => acceptMatch(match.id)}
                              className="heart-button px-4 py-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HeartIcon size={20} fill={true} color="#ffffff" className="mr-1" />
                              Accept
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 수락된 매치 */}
          <div>
            <div className="flex items-center mb-6">
              <HeartIcon size={24} color="#ff9ebb" pulse={true} className="mr-2" />
              <h2 className="text-2xl font-semibold">Matched Profiles</h2>
            </div>
            {acceptedMatches.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {acceptedMatches.map(match => {
                  const partnerProfile = getPartnerProfile(match);
                  return (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProfileCard 
                        profile={partnerProfile}
                        isMatched={true}
                      />
                      <div className="mt-3 flex justify-center">
                        <Link href={`/messages?partner=${partnerProfile.id}`}>
                          <motion.button 
                            className="btn btn-sm bg-gradient-to-r from-love-pink to-love-purple text-white border-none shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Send Message
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                className="love-card p-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 inline-block">
                  <HeartIcon size={80} color="#ffcbd7" />
                </div>
                <h3 className="text-xl font-semibold mb-4 love-title">No matches yet</h3>
                <p className="text-gray-600 mb-6">
                  Find interesting profiles in the Discover page.<br />
                  We'll help you find true excitement!
                </p>
                <LoveButton href="/discover" size="lg">
                  Explore Profiles
                </LoveButton>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesPage; 