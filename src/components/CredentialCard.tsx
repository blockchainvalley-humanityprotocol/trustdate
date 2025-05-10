import { VerifiableCredential } from '@/types';

interface CredentialCardProps {
  credential: VerifiableCredential;
  showDetails?: boolean;
}

const CredentialCard = ({ credential, showDetails = false }: CredentialCardProps) => {
  // credentialSubject가 없는 경우를 대비한 안전한 접근
  const subject = credential?.credentialSubject || {};

  const getCredentialIcon = () => {
    if (!subject) return getDefaultIcon();

    if (subject.kyc) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      );
    } else if (subject.age) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (subject.institution) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      );
    } else {
      return getDefaultIcon();
    }
  };

  const getDefaultIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    );
  };

  const getCredentialTitle = () => {
    if (!subject) return '검증된 자격 증명';
    
    if (subject.kyc) {
      return '신원 검증됨';
    } else if (subject.age) {
      return `나이 ${subject.age}세`;
    } else if (subject.institution) {
      return `학력: ${subject.institution} ${subject.degree || ''}`;
    } else {
      return '검증된 자격 증명';
    }
  };

  const getCredentialColor = () => {
    if (!subject) return 'bg-gray-100 text-gray-800';
    
    if (subject.kyc) {
      return 'bg-red-100 text-red-800';
    } else if (subject.age) {
      return 'bg-blue-100 text-blue-800';
    } else if (subject.institution) {
      return 'bg-purple-100 text-purple-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  const isActive = credential?.credentialStatus?.type === 'T3RevocationRegistry';
  const isRevoked = credential?.credentialStatus?.type === 'T3RevocationRegistry-revoked';

  // DID를 간략화하는 함수 추가
  const formatDid = (did: string) => {
    if (!did) return '';
    if (did.startsWith('did:key:')) {
      const prefix = 'did:key:';
      const key = did.substring(prefix.length);
      return `${prefix}${key.substring(0, 6)}...${key.substring(key.length - 4)}`;
    }
    return did;
  };

  // 자격 증명 정보가 없는 경우에 대한 처리
  if (!credential) {
    return (
      <div className="rounded-lg p-4 shadow-sm bg-gray-100 text-gray-800">
        <div className="flex items-center">
          <div className="mr-3 text-lg">
            {getDefaultIcon()}
          </div>
          <div>
            <h3 className="font-semibold">정보 없음</h3>
            <span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded">오류</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg p-4 shadow-sm ${getCredentialColor()}`}>
      <div className="flex items-center">
        <div className="mr-3 text-lg">
          {getCredentialIcon()}
        </div>
        <div>
          <h3 className="font-semibold">{getCredentialTitle()}</h3>
          {isActive && !isRevoked ? (
            <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">검증됨</span>
          ) : (
            <span className="text-xs font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded">취소됨</span>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 text-sm">
          <p className="text-xs truncate mb-1">발급자: {formatDid(credential.issuer || '')}</p>
          <p>발급일: {credential.validFrom ? new Date(credential.validFrom).toLocaleDateString('ko-KR') : '정보 없음'}</p>
          {credential.validUntil && (
            <p>만료일: {new Date(credential.validUntil).toLocaleDateString('ko-KR')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CredentialCard; 