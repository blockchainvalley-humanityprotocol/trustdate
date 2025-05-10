// Humanity Protocol API 관련 타입
export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  validFrom: string;
  validUntil: string;
  credentialSubject: {
    id: string;
    [key: string]: any;
  };
  id: string;
  credentialStatus: {
    type: string;
    chain_id: string;
    revocation_registry_contract_address: string;
    did_registry_contract_address: string;
  };
  proof: {
    type: string;
    cryptosuite: string;
    created: string;
    verificationMethod: string;
    proofPurpose: string;
    proofValue: string;
  };
}

// 사용자 프로필 타입
export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  interests: string[];
  credentials: VerifiableCredential[];
  matches: string[];
  conversations: string[];
  createdAt: string;
  lastActive: string;
  walletAddress?: string; // 메타마스크 지갑 주소
  heartRateData?: HeartRateData[]; // 다른 프로필 보면서 측정한 심장 박동수 데이터
  heartRateThreshold?: number; // 매칭에 필요한 심장 박동 변화율 기준 (기본값: 15%)
}

// 메타마스크 인증 관련 타입
export interface MetamaskAuthResult {
  success: boolean;
  address?: string;
  signature?: string;
  provider?: any;
  signer?: any;
  connected?: boolean;
  error?: string;
}

// 매칭 타입
export interface Match {
  id: string;
  users: [string, string];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// 메시지 타입
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// 대화 타입
export interface Conversation {
  id: string;
  participants: [string, string];
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 심장 박동수 관련 타입 추가
export interface HeartRateData {
  userId: string;
  targetUserId: string;
  timestamp: string;
  baselineRate: number; // 기본 심장 박동수
  viewingRate: number;  // 프로필 열람 시 심장 박동수
  percentageChange: number; // 변화율 (%)
} 