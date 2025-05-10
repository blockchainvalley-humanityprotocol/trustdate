import axios from 'axios';
import { VerifiableCredential, ApiResponse } from '@/types';

// 실제 API URL
const API_BASE_URL = 'https://issuer.humanity.org';

// API 클라이언트 설정 - 실제 API 키는 환경 변수로 설정해야 합니다
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    // API 키는 .env.local 파일에 설정해야 합니다: NEXT_PUBLIC_HUMANITY_API_KEY=your_api_key
    'X-API-Token': process.env.NEXT_PUBLIC_HUMANITY_API_KEY || 'REPLACE_WITH_YOUR_API_KEY',
  },
});

export const humanityApi = {
  // 자격 증명 발급
  issueCredential: async (
    claims: Record<string, any>,
    subject_address: string
  ): Promise<ApiResponse<VerifiableCredential>> => {
    try {
      const response = await api.post<{
        message: string,
        credential: VerifiableCredential
      }>('/credentials/issue', {
        claims,
        subject_address
      });
      
      return {
        success: true,
        data: response.data.credential
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '자격 증명 발급에 실패했습니다',
      };
    }
  },

  // 자격 증명 검증
  verifyCredential: async (
    credential: VerifiableCredential
  ): Promise<ApiResponse<{ isValid: boolean, message: string }>> => {
    try {
      const response = await api.post<{ 
        isValid: boolean, 
        message: string 
      }>('/credentials/verify', {
        credential
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '자격 증명 검증에 실패했습니다',
      };
    }
  },

  // 자격 증명 취소
  revokeCredential: async (
    credentialId: string
  ): Promise<ApiResponse<{ status: string, message: string }>> => {
    try {
      const response = await api.post<{ 
        status: string, 
        message: string 
      }>('/credentials/revoke', {
        credentialId
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '자격 증명 취소에 실패했습니다',
      };
    }
  },

  // 자격 증명 목록 조회
  listCredentials: async (
    holderDid?: string
  ): Promise<ApiResponse<VerifiableCredential[]>> => {
    try {
      const url = holderDid ? `/credentials/list?holderDid=${holderDid}` : '/credentials/list';
      const response = await api.get<{ data: VerifiableCredential[] }>(url);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || '자격 증명 목록 조회에 실패했습니다',
      };
    }
  }
}; 