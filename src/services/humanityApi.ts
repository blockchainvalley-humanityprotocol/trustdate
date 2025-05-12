import axios from 'axios';
import { VerifiableCredential, ApiResponse } from '@/types';

// Local API Route URL
const API_ROUTE_URL = '/api/credentials';

// Client-side API call configuration
const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
});

export const humanityApi = {
  // Issue credential
  issueCredential: async (
    claims: Record<string, any>,
    subject_address: string
  ): Promise<ApiResponse<VerifiableCredential>> => {
    try {
      const response = await api.post(API_ROUTE_URL, {
        endpoint: '/credentials/issue',
        payload: {
          claims,
          subject_address
        }
      });
      
      return {
        success: true,
        data: response.data.credential
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to issue credential',
      };
    }
  },

  // Verify credential
  verifyCredential: async (
    credential: VerifiableCredential
  ): Promise<ApiResponse<{ isValid: boolean, message: string }>> => {
    try {
      const response = await api.post(API_ROUTE_URL, {
        endpoint: '/credentials/verify',
        payload: {
          credential
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to verify credential',
      };
    }
  },

  // Revoke credential
  revokeCredential: async (
    credentialId: string
  ): Promise<ApiResponse<{ status: string, message: string }>> => {
    try {
      const response = await api.post(API_ROUTE_URL, {
        endpoint: '/credentials/revoke',
        payload: {
          credentialId
        }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to revoke credential',
      };
    }
  },

  // List credentials
  listCredentials: async (
    holderDid?: string
  ): Promise<ApiResponse<VerifiableCredential[]>> => {
    try {
      const response = await api.get(API_ROUTE_URL);
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to retrieve credential list',
      };
    }
  }
}; 