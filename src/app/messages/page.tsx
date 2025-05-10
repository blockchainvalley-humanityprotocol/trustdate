'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Conversation, Message } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import HeartIcon from '@/components/HeartIcon';
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

// 더미 대화 상대 프로필
const partnerProfiles: { [key: string]: UserProfile } = {
  user1: {
    id: 'user1',
    displayName: '비탈릭 부테린',
    bio: '이더리움의 창시자이자 블록체인 기술의 선구자입니다. 암호화폐와 탈중앙화 기술에 관심이 많으며 개발자 커뮤니티에 기여하고 있습니다.',
    avatarUrl: '/images/eth1.png',
    location: '싱가포르',
    interests: ['블록체인', '암호화폐', '프로그래밍', '철학', '탈중앙화'],
    credentials: [],
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
    credentials: [],
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
    credentials: [],
    matches: ['user123'],
    conversations: ['conv3'],
    createdAt: '2023-10-03T12:00:00Z',
    lastActive: '2023-10-22T14:20:00Z'
  }
};

// 더미 대화 데이터
const dummyConversations: { [key: string]: Conversation } = {
  conv1: {
    id: 'conv1',
    participants: ['user123', 'user1'],
    messages: [
      {
        id: 'msg1_1',
        conversationId: 'conv1',
        senderId: 'user1',
        receiverId: 'user123',
        content: '안녕하세요! 제 프로필에 관심을 가져주셔서 감사합니다. 블록체인 개발자시라고요?',
        createdAt: '2023-10-20T09:30:00Z',
        read: true
      },
      {
        id: 'msg1_2',
        conversationId: 'conv1',
        senderId: 'user123',
        receiverId: 'user1',
        content: '비탈릭님! 정말 팬입니다. 이더리움 백서를 보고 블록체인 개발에 입문했습니다.',
        createdAt: '2023-10-20T09:35:00Z',
        read: true
      },
      {
        id: 'msg1_3',
        conversationId: 'conv1',
        senderId: 'user1',
        receiverId: 'user123',
        content: '와, 정말 기쁘네요. 현재 어떤 프로젝트에 관심을 가지고 계신가요? DeFi나 NFT 분야에서 일하시나요?',
        createdAt: '2023-10-20T09:40:00Z',
        read: true
      },
      {
        id: 'msg1_4',
        conversationId: 'conv1',
        senderId: 'user123',
        receiverId: 'user1',
        content: '최근에는 영지식 증명(ZK)과 Layer 2 솔루션에 관심이 많습니다. 이더리움 확장성이 정말 중요하다고 생각해요.',
        createdAt: '2023-10-20T09:45:00Z',
        read: true
      },
      {
        id: 'msg1_5',
        conversationId: 'conv1',
        senderId: 'user1',
        receiverId: 'user123',
        content: '영지식 증명은 정말 흥미로운 분야죠! 롤업과 함께 이더리움의 미래입니다. 다음 주에 싱가포르에서 개발자 밋업이 있는데, 참석하실래요?',
        createdAt: '2023-10-20T09:50:00Z',
        read: true
      }
    ],
    createdAt: '2023-10-20T09:30:00Z',
    lastMessageAt: '2023-10-20T09:50:00Z'
  },
  conv2: {
    id: 'conv2',
    participants: ['user123', 'user2'],
    messages: [
      {
        id: 'msg2_1',
        conversationId: 'conv2',
        senderId: 'user123',
        receiverId: 'user2',
        content: '일론님, 테슬라와 스페이스X의 혁신적인 기술에 정말 감명받았습니다. 특히 스타쉽 프로젝트가 인상적이에요.',
        createdAt: '2023-10-21T14:30:00Z',
        read: true
      },
      {
        id: 'msg2_2',
        conversationId: 'conv2',
        senderId: 'user2',
        receiverId: 'user123',
        content: '관심 가져줘서 고마워요! 스타쉽은 화성 이주를 위한 중요한 발걸음이죠. 당신도 우주 여행에 관심이 있나요?',
        createdAt: '2023-10-21T14:35:00Z',
        read: true
      },
      {
        id: 'msg2_3',
        conversationId: 'conv2',
        senderId: 'user123',
        receiverId: 'user2',
        content: '물론이죠! 언젠가 민간 우주 여행이 일반화되면 꼭 참여하고 싶습니다. 화성에서 살아볼 수 있다면 정말 꿈같을 것 같아요.',
        createdAt: '2023-10-21T14:40:00Z',
        read: true
      },
      {
        id: 'msg2_4',
        conversationId: 'conv2',
        senderId: 'user2',
        receiverId: 'user123',
        content: '멋지네요! 화성은 인류의 다중행성 문명을 위한 첫 걸음이 될 겁니다. 혹시 AI나 신경과학에도 관심이 있으신가요? 뉴럴링크에서 흥미로운 프로젝트들이 진행 중입니다.',
        createdAt: '2023-10-21T14:45:00Z',
        read: false
      }
    ],
    createdAt: '2023-10-21T14:30:00Z',
    lastMessageAt: '2023-10-21T14:45:00Z'
  },
  conv3: {
    id: 'conv3',
    participants: ['user123', 'user3'],
    messages: [
      {
        id: 'msg3_1',
        conversationId: 'conv3',
        senderId: 'user3',
        receiverId: 'user123',
        content: '안녕하세요, 홍준모님. 관심 가져주셔서 감사합니다. 한국의 기술 산업은 정말 대단하더군요.',
        createdAt: '2023-10-22T10:15:00Z',
        read: true
      },
      {
        id: 'msg3_2',
        conversationId: 'conv3',
        senderId: 'user123',
        receiverId: 'user3',
        content: '트럼프 대통령님, 메시지 감사합니다! 네, 한국의 기술 산업은 빠르게 성장하고 있습니다. 부동산 개발에도 관심이 많으신 것으로 알고 있는데, 어떤 프로젝트가 가장 기억에 남으시나요?',
        createdAt: '2023-10-22T10:20:00Z',
        read: true
      },
      {
        id: 'msg3_3',
        conversationId: 'conv3',
        senderId: 'user3',
        receiverId: 'user123',
        content: '트럼프 타워는 내 경력에서 가장 자랑스러운 프로젝트 중 하나입니다. 위치, 디자인, 품질이 모두 최고죠. 협상에서 가장 중요한 것은 자신감과 강한 입장을 유지하는 것입니다. 당신이 개발자라고 들었는데, Truth Social 같은 플랫폼에 관심 있으신가요?',
        createdAt: '2023-10-22T10:25:00Z',
        read: true
      }
    ],
    createdAt: '2023-10-22T10:15:00Z',
    lastMessageAt: '2023-10-22T10:25:00Z'
  }
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState<{ [key: string]: Conversation }>(dummyConversations);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // 실제 구현에서는 API를 호출하여 대화 데이터를 가져옴
    if (currentUser.conversations.length > 0) {
      setSelectedConversation(currentUser.conversations[0]);
    }
  }, []);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const conversation = conversations[selectedConversation];
    const partnerId = conversation.participants.find(id => id !== currentUser.id);
    
    if (!partnerId) return;

    const newMessage: Message = {
      id: `msg_new_${Date.now()}`,
      conversationId: selectedConversation,
      senderId: currentUser.id,
      receiverId: partnerId,
      content,
      createdAt: new Date().toISOString(),
      read: false
    };

    // 하트 이펙트 추가
    const createHeartEffect = () => {
      const newHearts = Array.from({ length: 5 }).map((_, index) => ({
        id: Date.now() + index,
        x: Math.random() * 300,
        y: Math.random() * 100 + 200,
        delay: Math.random() * 0.3
      }));
      setFloatingHearts(prev => [...prev, ...newHearts]);
    };
    
    createHeartEffect();

    // 실제 구현에서는 API를 통해 메시지를 보냄
    setConversations(prev => ({
      ...prev,
      [selectedConversation]: {
        ...prev[selectedConversation],
        messages: [...prev[selectedConversation].messages, newMessage],
        lastMessageAt: newMessage.createdAt
      }
    }));
  };

  // 대화 목록을 최신 메시지 순으로 정렬
  const sortedConversations = Object.values(conversations)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  // 선택된 대화의 상대방 프로필 가져오기
  const getPartnerProfile = (conversation: Conversation) => {
    const partnerId = conversation.participants.find(id => id !== currentUser.id);
    return partnerId ? partnerProfiles[partnerId] : undefined;
  };

  // 읽지 않은 메시지 수 계산
  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => 
      msg.receiverId === currentUser.id && !msg.read
    ).length;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-4 mb-24">
      <h1 className="text-3xl mb-8 love-title">내 메시지</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 대화 목록 */}
        <div className="md:col-span-1 wave-animation">
          <div className="love-card p-0 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-love-pink/70 to-love-purple/70 text-white flex items-center">
              <HeartIcon size={22} fill={true} color="white" className="mr-2" />
              <h2 className="text-xl font-bold">대화 목록</h2>
            </div>
            <div className="overflow-y-auto max-h-[75vh]">
              {sortedConversations.map(conversation => {
                const partner = getPartnerProfile(conversation);
                if (!partner) return null;
                
                const unreadCount = getUnreadCount(conversation);
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                
                return (
                  <motion.div 
                    key={conversation.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 flex items-center gap-3 border-b border-gray-100 cursor-pointer transition-colors hover:bg-love-light/10 ${
                      selectedConversation === conversation.id ? 'bg-love-light/20' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-love-pink/30">
                        <img 
                          src={partner.avatarUrl} 
                          alt={partner.displayName} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default.jpg';
                          }}
                        />
                      </div>
                      {partner.lastActive && new Date(partner.lastActive).getTime() > Date.now() - 10 * 60 * 1000 && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold truncate">{partner.displayName}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.lastMessageAt).toLocaleDateString('ko-KR', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm truncate text-gray-600 flex-1">
                          {lastMessage.senderId === currentUser.id ? '나: ' : ''}
                          {lastMessage.content}
                        </p>
                        {unreadCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-love-pink rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* 채팅 인터페이스 */}
        <div className="md:col-span-2 relative">
          {selectedConversation ? (
            <>
              <div className="love-card overflow-hidden relative">
                {/* 플로팅 하트 애니메이션 */}
                <AnimatePresence>
                  {floatingHearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      className="absolute pointer-events-none z-10"
                      style={{ 
                        left: heart.x, 
                        bottom: heart.y 
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        y: -200,
                        x: heart.x + Math.sin(heart.delay * 5) * 30 
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: heart.delay,
                        ease: "easeOut" 
                      }}
                      exit={{ opacity: 0 }}
                      onAnimationComplete={() => {
                        setFloatingHearts(prev => prev.filter(h => h.id !== heart.id));
                      }}
                    >
                      <HeartIcon size={16 + Math.random() * 14} fill={true} color="#ff9ebb" />
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <ChatInterface
                  conversation={conversations[selectedConversation]}
                  currentUser={currentUser}
                  partnerProfile={getPartnerProfile(conversations[selectedConversation])}
                  onSendMessage={handleSendMessage}
                  className="love-theme"
                />
              </div>
              <div className="mt-4 text-center">
                <motion.button
                  onClick={() => setSelectedConversation(null)}
                  className="btn btn-sm btn-outline border-love-pink text-love-pink hover:bg-love-light/20 hover:border-love-pink"
                  whileHover={{ scale: 1.05 }}
                >
                  <HeartIcon size={16} className="mr-1" />
                  다른 대화로 돌아가기
                </motion.button>
              </div>
            </>
          ) : (
            <div className="love-card p-12 text-center">
              <div className="mb-6 inline-block">
                <HeartIcon size={80} color="#ff9ebb" pulse={true} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 love-title">대화를 선택해주세요</h3>
              <p className="text-gray-600 mb-8">
                왼쪽 대화 목록에서 대화를 선택하면 메시지를 볼 수 있어요.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 