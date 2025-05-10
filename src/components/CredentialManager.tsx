'use client';

import React, { useState, useEffect } from 'react';
import { VerifiableCredential, UserProfile } from '@/types';
import { humanityApi } from '@/services/humanityApi';
import { motion, AnimatePresence } from 'framer-motion';
import HeartIcon from './HeartIcon';

interface CredentialManagerProps {
  user: UserProfile;
  walletAddress?: string;
  onCredentialIssued?: (credential: VerifiableCredential) => void;
  onCredentialRevoked?: (credentialId: string) => void;
}

const CredentialManager: React.FC<CredentialManagerProps> = ({
  user,
  walletAddress = '0xSample123456789abcdef0123456789abcdef01234567', // 샘플 지갑 주소
  onCredentialIssued,
  onCredentialRevoked
}) => {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<VerifiableCredential | null>(null);
  const [showIssuanceForm, setShowIssuanceForm] = useState(false);
  const [claimType, setClaimType] = useState<string>('kyc');
  const [claimValue, setClaimValue] = useState<string>('');
  
  // 사용자 인증 정보 조회
  const fetchCredentials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 (테스트/개발 환경에서는 주석 처리)
      // const fetchedCredentials = await humanityApi.listCredentials(walletAddress);
      
      // 개발용 더미 데이터 (실제 환경에서는 주석 처리)
      const fetchedCredentials = user.credentials || [];
      
      setCredentials(fetchedCredentials);
    } catch (error) {
      console.error('인증 정보 조회 오류:', error);
      setError('인증 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchCredentials();
  }, [walletAddress, user]);

  // 인증 정보 발급
  const issueCredential = async () => {
    if (!claimType || !claimValue) {
      setError('클레임 타입과 값을 모두 입력해주세요.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const claims = { [claimType]: claimValue };
      
      // 실제 API 호출 (테스트/개발 환경에서는 주석 처리)
      // const newCredential = await humanityApi.issueCredential(claims, walletAddress);
      
      // 개발용 더미 데이터 생성 (실제 환경에서는 주석 처리)
      const newCredential: VerifiableCredential = {
        '@context': ['https://www.w3.org/ns/credentials/v2'],
        type: ['VerifiableCredential'],
        issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        validFrom: new Date().toISOString(),
        validUntil: '',
        credentialSubject: {
          id: `did:ethr:${walletAddress}`,
          ...claims
        },
        id: `urn:uuid:sample-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        credentialStatus: {
          type: 'T3RevocationRegistry',
          chain_id: '1234567890',
          revocation_registry_contract_address: '0xSampleAddress1234567890abcdef1234567890abcdef',
          did_registry_contract_address: '0xSampleAddress0987654321fedcba0987654321fedcba'
        },
        proof: {
          type: 'DataIntegrityProof',
          cryptosuite: 'bbs-2023',
          created: new Date().toISOString(),
          verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
          proofPurpose: 'assertionMethod',
          proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
        }
      };
      
      if (newCredential) {
        setCredentials(prev => [...prev, newCredential]);
        setSuccess('인증 정보가 성공적으로 발급되었습니다.');
        
        // 폼 초기화
        setClaimType('kyc');
        setClaimValue('');
        setShowIssuanceForm(false);
        
        // 부모 컴포넌트에 알림
        if (onCredentialIssued) {
          onCredentialIssued(newCredential);
        }
      } else {
        setError('인증 정보 발급에 실패했습니다.');
      }
    } catch (error) {
      console.error('인증 정보 발급 오류:', error);
      setError('인증 정보 발급 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 인증 정보 취소
  const revokeCredential = async (credentialId: string) => {
    if (!confirm('이 인증 정보를 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // 실제 API 호출 (테스트/개발 환경에서는 주석 처리)
      // const success = await humanityApi.revokeCredential(credentialId);
      
      // 개발용 더미 응답 (실제 환경에서는 주석 처리)
      const success = true;
      
      if (success) {
        // 로컬 상태 업데이트
        setCredentials(prev => 
          prev.map(cred => 
            cred.id === credentialId ? { ...cred, status: 'revoked' } : cred
          )
        );
        setSuccess('인증 정보가 성공적으로 취소되었습니다.');
        
        // 부모 컴포넌트에 알림
        if (onCredentialRevoked) {
          onCredentialRevoked(credentialId);
        }
      } else {
        setError('인증 정보 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('인증 정보 취소 오류:', error);
      setError('인증 정보 취소 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 클레임 타입 옵션
  const claimTypeOptions = [
    { value: 'kyc', label: 'KYC' },
    { value: 'age', label: '연령 인증' },
    { value: 'education', label: '학력 인증' },
    { value: 'employment', label: '직업 인증' },
    { value: 'interests', label: '관심사 인증' }
  ];

  // DID를 간략화하는 함수 추가
  const formatDid = (did: string) => {
    if (!did) return '';
    if (did.startsWith('did:key:')) {
      const prefix = 'did:key:';
      const key = did.substring(prefix.length);
      return `${prefix}${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
    }
    if (did.startsWith('did:ethr:')) {
      const prefix = 'did:ethr:';
      const address = did.substring(prefix.length);
      return `${prefix}${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    if (did.startsWith('urn:uuid:')) {
      const prefix = 'urn:uuid:';
      const uuid = did.substring(prefix.length);
      return `${prefix}${uuid.substring(0, 6)}...${uuid.substring(uuid.length - 4)}`;
    }
    return did;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <HeartIcon size={24} color="#ff9ebb" className="mr-2" />
          인증 정보 관리
        </h2>
        <button
          onClick={() => setShowIssuanceForm(!showIssuanceForm)}
          className="btn btn-sm btn-primary"
          disabled={loading}
        >
          {showIssuanceForm ? '취소' : '인증 정보 추가'}
        </button>
      </div>
      
      {/* 알림 메시지 */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
        
        {success && (
          <motion.div 
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p>{success}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 인증 정보 발급 폼 */}
      <AnimatePresence>
        {showIssuanceForm && (
          <motion.div 
            className="bg-gray-50 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">새 인증 정보 발급</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  클레임 타입
                </label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="select select-bordered w-full"
                  disabled={loading}
                >
                  {claimTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  클레임 값
                </label>
                <input
                  type="text"
                  value={claimValue}
                  onChange={(e) => setClaimValue(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="클레임 값 입력"
                  disabled={loading}
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={issueCredential}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                      발급 중...
                    </>
                  ) : (
                    '인증 정보 발급'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 인증 정보 목록 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">내 인증 정보</h3>
        
        {loading && credentials.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : credentials.length > 0 ? (
          <div className="space-y-4">
            {credentials.map(credential => (
              <motion.div
                key={credential.id}
                className="border rounded-lg p-4 border-green-200 bg-green-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedCredential(credential)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold">
                        {credential.credentialSubject.kyc ? '신원 인증' : 
                         credential.credentialSubject.age ? `나이 ${credential.credentialSubject.age}세` :
                         credential.credentialSubject.institution ? `학력: ${credential.credentialSubject.institution}` :
                         '검증된 자격 증명'}
                      </h4>
                      <span className="ml-2 badge badge-success badge-sm">
                        활성
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <p>발급자: {formatDid(credential.issuer)}</p>
                      <p>발급일: {new Date(credential.validFrom).toLocaleDateString('ko-KR')}</p>
                      <div className="mt-2">
                        <p className="font-medium">클레임:</p>
                        <ul className="list-disc list-inside pl-2">
                          {Object.entries(credential.credentialSubject)
                            .filter(([key]) => key !== 'id')
                            .map(([key, value]) => (
                              <li key={key}>
                                {key}: <span className="font-medium">{value as string}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      revokeCredential(credential.id);
                    }}
                    className="btn btn-error btn-xs"
                    disabled={loading}
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              아직 발급된 인증 정보가 없습니다.
            </p>
            <button
              onClick={() => setShowIssuanceForm(true)}
              className="btn btn-primary btn-sm mt-4"
            >
              인증 정보 발급하기
            </button>
          </div>
        )}
      </div>
      
      {/* 선택된 인증 정보 상세 모달 */}
      <AnimatePresence>
        {selectedCredential && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCredential(null)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">인증 정보 상세</h3>
                <button
                  onClick={() => setSelectedCredential(null)}
                  className="btn btn-sm btn-circle"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-medium truncate">{formatDid(selectedCredential.id)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">타입</p>
                  <p className="font-medium">
                    {selectedCredential.type.join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">발급자</p>
                  <p className="font-medium">{formatDid(selectedCredential.issuer)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">사용자 ID</p>
                  <p className="font-medium truncate">{formatDid(selectedCredential.credentialSubject.id)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">발급일</p>
                  <p className="font-medium">
                    {new Date(selectedCredential.validFrom).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                
                {selectedCredential.validUntil && (
                  <div>
                    <p className="text-sm text-gray-500">만료일</p>
                    <p className="font-medium">
                      {selectedCredential.validUntil 
                        ? new Date(selectedCredential.validUntil).toLocaleDateString('ko-KR') 
                        : '무기한'}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">클레임</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {Object.entries(selectedCredential.credentialSubject)
                      .filter(([key]) => key !== 'id')
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1">
                          <span className="text-gray-600">{key}:</span>
                          <span className="font-medium">{value as string}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      revokeCredential(selectedCredential.id);
                      setSelectedCredential(null);
                    }}
                    className="btn btn-error"
                    disabled={loading}
                  >
                    인증 정보 취소
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CredentialManager; 