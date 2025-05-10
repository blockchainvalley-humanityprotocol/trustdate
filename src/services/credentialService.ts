'use client';

import { Credential } from '@/types';

// 환경 변수에서 API 키를 가져오거나 임시 테스트 API 키 사용
const API_KEY = process.env.HUMANITY_API_KEY || 'YOUR_API_KEY';
const API_BASE_URL = 'https://issuer.humanity.org';

export const credentialService = {
  // 인증 정보 발급
  issueCredential: async (claims: Record<string, any>, subjectAddress: string): Promise<Credential | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/issue`, {
        method: 'POST',
        headers: {
          'X-API-Token': API_KEY,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          claims: claims,
          subject_address: subjectAddress
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('발급된 인증 정보:', data);

      // 발급된 인증 정보를 애플리케이션 형식으로 변환
      const credential: Credential = {
        id: data.credential.id,
        type: Object.keys(claims)[0] as any, // 첫 번째 클레임 타입 사용
        issuer: data.credential.issuer,
        holder: subjectAddress,
        issuanceDate: data.credential.validFrom,
        expirationDate: data.credential.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        claims: claims,
        status: 'active'
      };

      return credential;
    } catch (error) {
      console.error('인증 정보 발급 오류:', error);
      return null;
    }
  },

  // 인증 정보 목록 조회
  listCredentials: async (holderDid?: string): Promise<Credential[]> => {
    try {
      let url = `${API_BASE_URL}/credentials/list`;
      if (holderDid) {
        url += `?holderDid=${holderDid}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Token': API_KEY,
          'Accept': '*/*'
        }
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('인증 정보 목록:', data);

      // API 응답을 애플리케이션 형식으로 변환
      const credentials: Credential[] = data.data.map((vc: any) => {
        return {
          id: vc.id,
          type: Object.keys(vc.credentialSubject).find(key => key !== 'id') as any,
          issuer: vc.issuer,
          holder: vc.credentialSubject.id,
          issuanceDate: vc.validFrom,
          expirationDate: vc.validUntil || '',
          claims: Object.fromEntries(
            Object.entries(vc.credentialSubject).filter(([key]) => key !== 'id')
          ),
          status: 'active'
        };
      });

      return credentials;
    } catch (error) {
      console.error('인증 정보 목록 조회 오류:', error);
      return [];
    }
  },

  // 인증 정보 검증
  verifyCredential: async (credential: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/verify`, {
        method: 'POST',
        headers: {
          'X-API-Token': API_KEY,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          credential: credential
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('인증 정보 검증 결과:', data);

      return data.isValid === true;
    } catch (error) {
      console.error('인증 정보 검증 오류:', error);
      return false;
    }
  },

  // 인증 정보 취소
  revokeCredential: async (credentialId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/credentials/revoke`, {
        method: 'POST',
        headers: {
          'X-API-Token': API_KEY,
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify({
          credentialId: credentialId
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log('인증 정보 취소 결과:', data);

      return data.status === 'success';
    } catch (error) {
      console.error('인증 정보 취소 오류:', error);
      return false;
    }
  },

  // 추가 유틸리티 메서드

  // 타입별 인증정보 필터링
  filterCredentialsByType: (credentials: Credential[], type: string): Credential[] => {
    return credentials.filter(credential => credential.type === type);
  },

  // 유효한 인증정보만 필터링
  filterValidCredentials: (credentials: Credential[]): Credential[] => {
    const now = new Date().toISOString();
    return credentials.filter(credential => 
      credential.status === 'active' && 
      (credential.expirationDate === '' || credential.expirationDate > now)
    );
  }
};

export default credentialService; 