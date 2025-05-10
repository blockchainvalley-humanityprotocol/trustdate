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
  displayName: '홍준모',
  bio: '블록체인과 AI 기술에 관심이 많은 개발자입니다. 새로운 기술과 혁신적인 아이디어에 흥미가 있습니다.',
  avatarUrl: '/images/default.jpg',
  location: '서울시 강남구',
  interests: ['블록체인', '인공지능', '프로그래밍', '혁신기술', '창업'],
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
    displayName: '비탈릭 부테린',
    bio: '이더리움의 창시자이자 블록체인 기술의 선구자입니다. 암호화폐와 탈중앙화 기술에 관심이 많으며 개발자 커뮤니티에 기여하고 있습니다.',
    avatarUrl: '/images/eth1.png',
    location: '싱가포르',
    interests: ['블록체인', '암호화폐', '프로그래밍', '철학', '탈중앙화'],
    credentials: [
      {
        id: 'cred1_1',
        type: 'education',
        issuer: 'University of Waterloo',
        holder: 'user1',
        issuanceDate: '2023-09-01T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          institution: '토론토 대학교',
          degree: '컴퓨터과학'
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
          company: '이더리움 재단',
          position: '창립자'
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
    displayName: '일론 머스크',
    bio: '테슬라와 스페이스X의 CEO이자 X(트위터)의 소유주입니다. 혁신적인 기술과 우주 여행, 지속 가능한 에너지에 열정을 가지고 있습니다.',
    avatarUrl: '/images/musk1.png',
    location: '텍사스 오스틴',
    interests: ['우주여행', '전기차', '인공지능', '지속가능성', '화성 이주'],
    credentials: [
      {
        id: 'cred2_3',
        type: 'education',
        issuer: 'University of Pennsylvania',
        holder: 'user2',
        issuanceDate: '2023-09-05T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          institution: '펜실베니아 대학교',
          degree: '물리학 & 경제학'
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
          company: '테슬라, 스페이스X',
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
    displayName: '도널드 트럼프',
    bio: '미국의 전 대통령이자 사업가입니다. 부동산 개발과 정치에서 활발히 활동했으며, 소셜 미디어 플랫폼 Truth Social의 설립자입니다.',
    avatarUrl: '/images/trump1.png',
    location: '플로리다 팜비치',
    interests: ['골프', '정치', '부동산', '협상', '미디어'],
    credentials: [
      {
        id: 'cred3_3',
        type: 'education',
        issuer: 'Wharton School of Business',
        holder: 'user3',
        issuanceDate: '2023-09-10T09:30:00Z',
        expirationDate: '2026-09-10T09:30:00Z',
        claims: {
          institution: '와튼 스쿨',
          degree: '경제학'
        },
        status: 'active'
      },
      {
        id: 'cred3_4',
        type: 'employment',
        issuer: 'United States Government',
        holder: 'user3',
        issuanceDate: '2023-09-15T09:30:00Z',
        expirationDate: '2024-09-15T09:30:00Z',
        claims: {
          company: '미국 연방정부',
          position: '전 대통령'
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

      <h1 className="text-3xl love-title mb-8">내 매치</h1>

      {loading ? (
        <div className="h-64 w-full flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <HeartIcon size={80} pulse={true} color="#ff9ebb" />
          </div>
          <p className="mt-4 text-love-pink">매치 정보를 불러오는 중...</p>
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
                  <h2 className="text-2xl font-semibold">대기중인 매치</h2>
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
                            <span className="text-sm font-medium text-love-dark">관심사:</span>
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
                              거절하기
                            </motion.button>
                            <motion.button 
                              onClick={() => acceptMatch(match.id)}
                              className="heart-button px-4 py-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <HeartIcon size={20} fill={true} color="#ffffff" className="mr-1" />
                              수락하기
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
              <h2 className="text-2xl font-semibold">매칭된 프로필</h2>
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
                            메시지 보내기
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
                <h3 className="text-xl font-semibold mb-4 love-title">아직 매칭된 프로필이 없어요</h3>
                <p className="text-gray-600 mb-6">
                  탐색 페이지에서 관심 있는 프로필을 찾아보세요.<br />
                  진정한 설렘을 찾아드립니다!
                </p>
                <LoveButton href="/discover" size="lg">
                  프로필 탐색하기
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