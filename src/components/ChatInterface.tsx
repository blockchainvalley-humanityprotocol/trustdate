'use client';

import { useState, useEffect, useRef } from 'react';
import { UserProfile, Message, Conversation } from '@/types';
import HeartIcon from './HeartIcon';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  conversation: Conversation;
  currentUser: UserProfile;
  partnerProfile?: UserProfile;
  partner?: UserProfile | null;
  onSendMessage: (content: string) => void;
  className?: string;
}

const ChatInterface = ({ 
  conversation, 
  currentUser, 
  partnerProfile,
  partner,
  onSendMessage,
  className = ''
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // partnerProfile과 partner 둘 중 하나 사용
  const chatPartner = partner || partnerProfile;
  
  if (!chatPartner) {
    return <div className="p-6 text-center">대화 상대를 찾을 수 없습니다.</div>;
  }

  // 메시지 목록 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  // 엔터 키로 메시지 보내기
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 메시지 날짜별 그룹화
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    conversation.messages.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString('ko-KR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 상대방 프로필 헤더 */}
      <div className="p-4 border-b flex items-center bg-gradient-to-r from-love-light/40 to-love-purple/30">
        <div className="avatar mr-3">
          <div className="w-12 h-12 rounded-full ring ring-love-pink/30 ring-offset-2">
            <img 
              src={chatPartner.avatarUrl} 
              alt={chatPartner.displayName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default.jpg';
              }}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold flex items-center gap-1">
            {chatPartner.displayName}
            {chatPartner.lastActive && new Date(chatPartner.lastActive).getTime() > Date.now() - 10 * 60 * 1000 && (
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full ml-1"></span>
            )}
          </h3>
          <p className="text-xs text-gray-500">
            {chatPartner.lastActive ? 
              `마지막 접속: ${new Date(chatPartner.lastActive).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : 
              '오프라인'}
          </p>
        </div>
        <div className="flex gap-1">
          <HeartIcon size={20} color="#ff9ebb" />
          <span className="text-sm text-love-pink font-medium">매칭됨</span>
        </div>
      </div>
      
      {/* 메시지 목록 */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-love-light/5">
        {Object.entries(messageGroups).map(([date, messages]) => (
          <div key={date}>
            <div className="text-center mb-2">
              <span className="text-xs bg-love-light/20 text-love-dark px-3 py-1 rounded-full font-medium">
                {date}
              </span>
            </div>
            
            <div className="space-y-3">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.senderId !== currentUser.id && (
                    <div className="avatar mr-2 self-end">
                      <div className="w-8 h-8 rounded-full border-2 border-love-light/30">
                        <img 
                          src={chatPartner.avatarUrl} 
                          alt={chatPartner.displayName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/default.jpg';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                        msg.senderId === currentUser.id 
                          ? 'bg-gradient-to-r from-love-pink to-love-purple text-white rounded-br-none' 
                          : 'bg-white border border-love-light/30 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                    <div className={`text-xs text-gray-500 mt-1 ${msg.senderId === currentUser.id ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                      {msg.senderId === currentUser.id && msg.read && (
                        <span className="ml-1 text-love-accent">읽음</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* 메시지 입력 */}
      <div className="p-4 border-t border-love-light/20 bg-white">
        <div className="flex items-center">
          <motion.button 
            className="btn btn-circle btn-sm bg-love-light/20 border-none hover:bg-love-light/40 mr-2"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <HeartIcon size={20} color="#ff9ebb" />
          </motion.button>
          <textarea 
            className="textarea bg-gray-50 border-love-light/30 focus:border-love-pink focus:ring focus:ring-love-pink/20 flex-grow resize-none rounded-xl"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            rows={2}
          />
          <motion.button 
            className="btn btn-circle bg-gradient-to-r from-love-pink to-love-purple border-none hover:from-love-dark hover:to-love-purple ml-2 shadow-md"
            onClick={handleSend}
            disabled={message.trim() === ''}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 