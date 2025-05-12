'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Conversation, Message } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import HeartIcon from '@/components/HeartIcon';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy user data
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
  createdAt: '2025-05-12T00:00:00Z',
  lastActive: '2025-05-12T18:30:00Z'
};

// Dummy conversation partner profiles
const partnerProfiles: { [key: string]: UserProfile } = {
  user1: {
    id: 'user1',
    displayName: 'Vitalik Buterin',
    bio: 'Founder of Ethereum and pioneer in blockchain technology. Interested in cryptocurrency and decentralized technology, and contributing to the developer community.',
    avatarUrl: '/images/eth1.png',
    location: 'Singapore',
    interests: ['Blockchain', 'Cryptocurrency', 'Programming', 'Philosophy', 'Decentralization'],
    credentials: [],
    matches: ['user123'],
    conversations: ['conv1'],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T15:45:00Z'
  },
  user2: {
    id: 'user2',
    displayName: 'Elon Musk',
    bio: 'CEO of Tesla and SpaceX, and owner of X (Twitter). Passionate about innovative technology, space travel, and sustainable energy.',
    avatarUrl: '/images/musk1.png',
    location: 'Austin, Texas',
    interests: ['Space Travel', 'Electric Vehicles', 'AI', 'Sustainability', 'Mars Colonization'],
    credentials: [],
    matches: ['user123'],
    conversations: ['conv2'],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T10:30:00Z'
  },
  user3: {
    id: 'user3',
    displayName: 'Donald Trump',
    bio: 'Former U.S. President and businessman. Active in real estate development and politics, and founder of the social media platform Truth Social.',
    avatarUrl: '/images/trump1.png',
    location: 'Palm Beach, Florida',
    interests: ['Golf', 'Politics', 'Real Estate', 'Negotiation', 'Media'],
    credentials: [],
    matches: ['user123'],
    conversations: ['conv3'],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T14:20:00Z'
  }
};

// Dummy conversation data
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
        content: 'Hello! Thank you for showing interest in my profile. Are you a blockchain developer?',
        createdAt: '2025-05-12T09:30:00Z',
        read: true
      },
      {
        id: 'msg1_2',
        conversationId: 'conv1',
        senderId: 'user123',
        receiverId: 'user1',
        content: 'Vitalik! I\'m a huge fan. I got into blockchain development after reading the Ethereum whitepaper.',
        createdAt: '2025-05-12T09:35:00Z',
        read: true
      },
      {
        id: 'msg1_3',
        conversationId: 'conv1',
        senderId: 'user1',
        receiverId: 'user123',
        content: 'Wow, that\'s great to hear. What kind of projects are you interested in? Are you working in DeFi or NFTs?',
        createdAt: '2025-05-12T09:40:00Z',
        read: true
      },
      {
        id: 'msg1_4',
        conversationId: 'conv1',
        senderId: 'user123',
        receiverId: 'user1',
        content: 'Recently I\'ve been very interested in Zero-Knowledge Proofs (ZK) and Layer 2 solutions. I think Ethereum scalability is really important.',
        createdAt: '2025-05-12T09:45:00Z',
        read: true
      },
      {
        id: 'msg1_5',
        conversationId: 'conv1',
        senderId: 'user1',
        receiverId: 'user123',
        content: 'Zero-knowledge proofs are fascinating! They\'re the future of Ethereum along with rollups. There\'s a developer meetup in Singapore next week, would you like to join?',
        createdAt: '2025-05-12T09:50:00Z',
        read: true
      }
    ],
    createdAt: '2025-05-12T09:30:00Z',
    lastMessageAt: '2025-05-12T09:50:00Z'
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
        content: 'Elon, I\'m really impressed by Tesla and SpaceX\'s innovative technologies. The Starship project is particularly impressive.',
        createdAt: '2025-05-12T14:30:00Z',
        read: true
      },
      {
        id: 'msg2_2',
        conversationId: 'conv2',
        senderId: 'user2',
        receiverId: 'user123',
        content: 'Thanks for your interest! Starship is an important step toward Mars colonization. Are you interested in space travel too?',
        createdAt: '2025-05-12T14:35:00Z',
        read: true
      },
      {
        id: 'msg2_3',
        conversationId: 'conv2',
        senderId: 'user123',
        receiverId: 'user2',
        content: 'Absolutely! I would love to participate in civilian space travel if it becomes more accessible. Living on Mars would be a dream come true.',
        createdAt: '2025-05-12T14:40:00Z',
        read: true
      },
      {
        id: 'msg2_4',
        conversationId: 'conv2',
        senderId: 'user2',
        receiverId: 'user123',
        content: 'Great! Mars will be the first step in humanity\'s multi-planetary civilization. Are you also interested in AI or neuroscience? We\'re working on some exciting projects at Neuralink.',
        createdAt: '2025-05-12T14:45:00Z',
        read: false
      }
    ],
    createdAt: '2025-05-12T14:30:00Z',
    lastMessageAt: '2025-05-12T14:45:00Z'
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
        content: 'Hello, John. Thanks for your interest. Korea\'s technology industry is truly impressive.',
        createdAt: '2025-05-12T10:15:00Z',
        read: true
      },
      {
        id: 'msg3_2',
        conversationId: 'conv3',
        senderId: 'user123',
        receiverId: 'user3',
        content: 'Thank you for your message, President Trump! Yes, Korea\'s tech industry is growing rapidly. I understand you\'re also interested in real estate development - which project do you find most memorable?',
        createdAt: '2025-05-12T10:20:00Z',
        read: true
      },
      {
        id: 'msg3_3',
        conversationId: 'conv3',
        senderId: 'user3',
        receiverId: 'user123',
        content: 'Trump Tower is one of the most proud projects in my career. Top location, design, and quality. In negotiation, the most important thing is confidence and maintaining a strong position. I heard you\'re a developer - are you interested in platforms like Truth Social?',
        createdAt: '2025-05-12T10:25:00Z',
        read: true
      }
    ],
    createdAt: '2025-05-12T10:15:00Z',
    lastMessageAt: '2025-05-12T10:25:00Z'
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

  // Sort conversations by most recent message
  const sortedConversations = Object.values(conversations)
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  // Get partner profile for the selected conversation
  const getPartnerProfile = (conversation: Conversation) => {
    const partnerId = conversation.participants.find(id => id !== currentUser.id);
    return partnerId ? partnerProfiles[partnerId] : undefined;
  };

  // Calculate unread message count
  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => 
      msg.receiverId === currentUser.id && !msg.read
    ).length;
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl mt-4 mb-24">
      <h1 className="text-3xl mb-8 love-title">My Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Conversation list */}
        <div className="md:col-span-1 wave-animation">
          <div className="love-card p-0 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-love-pink/70 to-love-purple/70 text-white flex items-center">
              <HeartIcon size={22} fill={true} color="white" className="mr-2" />
              <h2 className="text-xl font-bold">Conversations</h2>
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
                          {new Date(conversation.lastMessageAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm truncate text-gray-600 flex-1">
                          {lastMessage.senderId === currentUser.id ? 'Me: ' : ''}
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
        
        {/* Chat interface */}
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
                  Back to conversations
                </motion.button>
              </div>
            </>
          ) : (
            <div className="love-card p-12 text-center">
              <div className="mb-6 inline-block">
                <HeartIcon size={80} color="#ff9ebb" pulse={true} />
              </div>
              <h3 className="text-2xl font-semibold mb-4 love-title">Select a conversation</h3>
              <p className="text-gray-600 mb-8">
                Choose a conversation from the list on the left to view messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 