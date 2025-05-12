// Humanity Protocol API related types
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

// User profile type
export interface UserProfile {
  id: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  profileImage?: string; // 프로필 이미지 URL (회원가입 시 업로드한 이미지)
  location: string;
  interests: string[];
  credentials: VerifiableCredential[];
  matches: string[];
  conversations: string[];
  createdAt: string;
  lastActive: string;
  walletAddress?: string; // MetaMask wallet address
  heartRateData?: HeartRateData[]; // Heart rate data measured while viewing other profiles
  heartRateThreshold?: number; // Heart rate change threshold required for matching (default: 15%)
}

// MetaMask authentication related types
export interface MetamaskAuthResult {
  success: boolean;
  address?: string;
  signature?: string;
  provider?: any;
  signer?: any;
  connected?: boolean;
  error?: string;
}

// Matching type
export interface Match {
  id: string;
  users: [string, string];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Message type
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

// Conversation type
export interface Conversation {
  id: string;
  participants: [string, string];
  messages: Message[];
  createdAt: string;
  lastMessageAt: string;
}

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Heart rate related types
export interface HeartRateData {
  userId: string;
  targetUserId: string;
  timestamp: string;
  baselineRate: number; // Baseline heart rate
  viewingRate: number;  // Heart rate while viewing profile
  percentageChange: number;
}

// Add window ethereum type declaration
interface Window {
  ethereum?: any;
} 