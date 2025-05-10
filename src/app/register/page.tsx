'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { humanityApi } from '@/services/humanityApi';
import { metamaskAuth } from '@/services/metamaskAuth';

// 회원가입 단계
enum RegistrationStep {
  CONNECT_WALLET = 1, // 메타마스크 연결
  PERSONAL_INFO = 2, // 개인 정보 입력
  CREDENTIALS = 3, // 자격 증명 요청
  COMPLETE = 4 // 완료
}

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.CONNECT_WALLET);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    profileImage: null as File | null,
    bio: '',
    location: '',
    interests: [] as string[],
    agreeTerms: false,
    agreePrivacy: false,
    age: {
      verified: false,
      verifying: false,
      value: ''
    },
    education: {
      verified: false,
      verifying: false,
      institution: '',
      degree: ''
    },
    employment: {
      verified: false,
      verifying: false,
      company: '',
      position: ''
    }
  });
  
  // 메타마스크 연결
  const connectWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await metamaskAuth.connectWallet();
      
      if (!result.success) {
        throw new Error(result.error || '메타마스크 연결 실패');
      }
      
      const address = result.address || '';
      setWalletAddress(address);
      
      // 메시지 서명 요청
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `TrustDate 회원가입 요청: ${nonce}`;
      
      const signResult = await metamaskAuth.signMessage(message);
      
      if (!signResult.success) {
        throw new Error(signResult.error || '메시지 서명 실패');
      }
      
      // 다음 단계로 이동
      setCurrentStep(RegistrationStep.PERSONAL_INFO);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 입력값 업데이트 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev]) as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 프로필 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  };
  
  // 관심사 토글 함수
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };
  
  // 자격 증명 요청 처리
  const requestCredential = async (type: 'age' | 'education' | 'employment') => {
    setLoading(true);
    setError('');
    
    try {
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verifying: true
        }
      }));
      
      // 실제 구현에서는 Humanity Protocol API 호출
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verified: true,
          verifying: false
        }
      }));
    } catch (err) {
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verifying: false
        }
      }));
      setError(err instanceof Error ? err.message : '인증 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 다음 단계로 이동
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1 as RegistrationStep);
  };
  
  // 양식 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 실제 구현에서는 서버 API 호출하여 사용자 등록
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 회원가입 완료 후 프로필 페이지로 이동
      goToNextStep();
      
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  
  // 사용자 정보 입력 폼
  const renderPersonalInfoForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">이름</span>
        </label>
        <input 
          type="text" 
          name="displayName" 
          value={formData.displayName} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">이메일</span>
        </label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">프로필 이미지</span>
        </label>
        <input 
          type="file" 
          onChange={handleImageUpload} 
          className="file-input file-input-bordered w-full" 
          accept="image/*" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">자기소개</span>
        </label>
        <textarea 
          name="bio" 
          value={formData.bio} 
          onChange={handleChange} 
          className="textarea textarea-bordered h-24" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">지역</span>
        </label>
        <input 
          type="text" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">관심사 (최대 5개)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {['여행', '음식', '영화', '독서', '음악', '스포츠', '게임', '댄스', '미술', '사진', '패션', '요리'].map(interest => (
            <label 
              key={interest}
              className={`badge p-3 cursor-pointer ${
                formData.interests.includes(interest) 
                  ? 'badge-primary text-white' 
                  : 'badge-outline'
              }`}
            >
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
                disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.displayName || !formData.email}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              처리 중...
            </>
          ) : '다음'}
        </button>
      </div>
    </form>
  );
  
  // 자격 증명 요청 폼
  const renderCredentialsForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">자격 증명 요청 (선택사항)</h3>
      <p className="text-gray-600 mb-4">
        Humanity Protocol을 통해 귀하의 정보를 안전하게 검증하여 더 신뢰할 수 있는 프로필을 만들어보세요.
        개인정보는 보호되며, 검증 정보만 공유됩니다.
      </p>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">나이 인증</h4>
            <p className="text-sm text-gray-600">만 18세 이상임을 확인합니다</p>
          </div>
          <div>
            {formData.age.verified ? (
              <span className="badge badge-success">인증됨</span>
            ) : formData.age.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                인증 중...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('age')} 
                className="btn btn-sm btn-outline"
              >
                인증하기
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">학력 인증</h4>
            <p className="text-sm text-gray-600">귀하의 학력 정보를 확인합니다</p>
          </div>
          <div>
            {formData.education.verified ? (
              <span className="badge badge-success">인증됨</span>
            ) : formData.education.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                인증 중...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('education')} 
                className="btn btn-sm btn-outline"
              >
                인증하기
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">직업 인증</h4>
            <p className="text-sm text-gray-600">귀하의 직업 정보를 확인합니다</p>
          </div>
          <div>
            {formData.employment.verified ? (
              <span className="badge badge-success">인증됨</span>
            ) : formData.employment.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                인증 중...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('employment')} 
                className="btn btn-sm btn-outline"
              >
                인증하기
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="form-control">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="checkbox checkbox-primary" 
            required
          />
          <span className="label-text">이용약관에 동의합니다</span>
        </label>
      </div>
      
      <div className="form-control">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={handleChange}
            className="checkbox checkbox-primary" 
            required
          />
          <span className="label-text">개인정보 처리방침에 동의합니다</span>
        </label>
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.agreeTerms || !formData.agreePrivacy}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              가입 중...
            </>
          ) : '가입 완료'}
        </button>
      </div>
    </form>
  );
  
  // 메타마스크 연결 화면
  const renderConnectWalletForm = () => (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <img 
          src="/metamask-fox.svg" 
          alt="Metamask 로고" 
          className="w-24 h-24 mx-auto"
          onError={(e) => {
            e.currentTarget.src = 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg';
          }}
        />
      </div>
      
      <h3 className="text-xl font-semibold">메타마스크 지갑 연결</h3>
      <p className="text-gray-600 mb-6">
        TrustDate에 가입하려면 메타마스크 지갑을 연결해주세요.<br />
        안전한 블록체인 인증으로 신원을 보호합니다.
      </p>
      
      <button 
        onClick={connectWallet} 
        disabled={loading}
        className="btn btn-primary btn-lg"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm mr-2"></span>
            연결 중...
          </>
        ) : '메타마스크 연결하기'}
      </button>
      
      {error && (
        <div className="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="divider">또는</div>
      
      <div>
        <p className="mb-4 text-gray-600">이미 계정이 있으신가요?</p>
        <Link href="/login" className="btn btn-outline">로그인</Link>
      </div>
    </div>
  );
  
  // 회원가입 완료 화면
  const renderCompletionView = () => (
    <div className="text-center py-10">
      <div className="mb-8">
        <div className="avatar">
          <div className="w-24 h-24 mx-auto rounded-full bg-success/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">가입이 완료되었습니다!</h2>
      <p className="text-gray-600 mb-8">
        TrustDate에 오신 것을 환영합니다!<br />
        이제 신뢰할 수 있는 데이팅을 시작해보세요.
      </p>
      
      <div className="flex justify-center gap-4">
        <div className="animate-pulse">
          <p className="text-primary">프로필 페이지로 이동합니다...</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-4">
            <Link href="/login" className="btn btn-sm btn-outline">로그인</Link>
            <Link href="/register" className="btn btn-sm btn-primary">회원가입</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">회원가입</h1>
            <p className="text-gray-600">당신의 진정한 매칭을 찾아보세요</p>
          </div>
          
          {/* 단계 진행 바 */}
          {currentStep < RegistrationStep.COMPLETE && (
            <ul className="steps w-full mb-8">
              <li className={`step ${currentStep >= RegistrationStep.CONNECT_WALLET ? 'step-primary' : ''}`}>지갑 연결</li>
              <li className={`step ${currentStep >= RegistrationStep.PERSONAL_INFO ? 'step-primary' : ''}`}>기본 정보</li>
              <li className={`step ${currentStep >= RegistrationStep.CREDENTIALS ? 'step-primary' : ''}`}>자격 증명</li>
              <li className={`step ${currentStep >= RegistrationStep.COMPLETE ? 'step-primary' : ''}`}>완료</li>
            </ul>
          )}
          
          {/* 에러 메시지 */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* 현재 단계에 따른 컨텐츠 렌더링 */}
          {currentStep === RegistrationStep.CONNECT_WALLET && renderConnectWalletForm()}
          {currentStep === RegistrationStep.PERSONAL_INFO && renderPersonalInfoForm()}
          {currentStep === RegistrationStep.CREDENTIALS && renderCredentialsForm()}
          {currentStep === RegistrationStep.COMPLETE && renderCompletionView()}
        </div>
      </div>
    </main>
  );
} 