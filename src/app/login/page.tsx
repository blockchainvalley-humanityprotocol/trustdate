'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { metamaskAuth } from '@/services/metamaskAuth';
import { MetamaskAuthResult } from '@/types';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 이미 연결되어 있는지 확인
    const checkConnection = async () => {
      const result = await metamaskAuth.checkConnection();
      if (result.success && result.connected && result.address) {
        setAddress(result.address);
        setIsAuthenticated(true);
      }
    };

    checkConnection();
  }, []);

  const handleMetamaskLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // 메타마스크 연결
      const connectResult = await metamaskAuth.connectWallet();
      
      if (!connectResult.success) {
        throw new Error(connectResult.error || '메타마스크 연결 실패');
      }

      const { address } = connectResult;
      setAddress(address || '');

      // 로그인 인증을 위한 메시지 서명
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `TrustDate 로그인 요청: ${nonce}`;
      
      const signResult = await metamaskAuth.signMessage(message);
      
      if (!signResult.success) {
        throw new Error(signResult.error || '메시지 서명 실패');
      }

      // 서명 성공 시 인증 완료 상태로 변경
      setIsAuthenticated(true);
      
      // 실제 구현에서는 서버에 서명 검증 요청을 보내고 토큰을 받아옴
      // 토큰을 받아오면 localStorage 등에 저장
      localStorage.setItem('userAddress', address || '');
      localStorage.setItem('userSignature', signResult.signature || '');
      
      // 홈 화면으로 이동
      setTimeout(() => {
        router.push('/profile');
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-4">
            <Link href="/login" className="btn btn-sm btn-primary">로그인</Link>
            <Link href="/register" className="btn btn-sm btn-outline">회원가입</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">로그인</h1>
            <p className="text-gray-600">메타마스크로 안전하게 로그인하세요</p>
          </div>

          {isAuthenticated ? (
            <div className="text-center py-4">
              <div className="mb-4">
                <div className="avatar">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">인증 완료</h2>
              <p className="text-gray-600 mb-4">지갑 주소: {address.slice(0, 6)}...{address.slice(-4)}</p>
              <div className="animate-pulse">
                <p className="text-primary">프로필 페이지로 이동합니다...</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
                <img 
                  src="/metamask-fox.svg" 
                  alt="Metamask 로고" 
                  className="w-16 h-16 mx-auto mb-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg';
                  }}
                />
                <p className="text-gray-700 mb-4">
                  메타마스크 지갑을 연결하여 간편하게 로그인하세요. 안전한 블록체인 인증으로 신원을 보호합니다.
                </p>
                <button 
                  onClick={handleMetamaskLogin} 
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      연결 중...
                    </>
                  ) : (
                    '메타마스크로 로그인'
                  )}
                </button>
                {error && (
                  <div className="text-error mt-2 text-sm">{error}</div>
                )}
              </div>

              <div className="divider">또는</div>

              <div className="text-center">
                <p className="mb-4 text-gray-600">TrustDate가 처음이신가요?</p>
                <Link href="/register" className="btn btn-outline btn-block">회원가입</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 