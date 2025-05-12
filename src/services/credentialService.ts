'use client';

import { Credential } from '@/types';

// Get API key from environment variables or use a temporary test API key
const API_KEY = process.env.HUMANITY_API_KEY || 'YOUR_API_KEY';
const API_BASE_URL = 'https://issuer.humanity.org';

export const credentialService = {
  // Issue credential
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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Issued credential:', data);

      // Convert issued credential to application format
      const credential: Credential = {
        id: data.credential.id,
        type: Object.keys(claims)[0] as any, // Use first claim type
        issuer: data.credential.issuer,
        holder: subjectAddress,
        issuanceDate: data.credential.validFrom,
        expirationDate: data.credential.validUntil || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        claims: claims,
        status: 'active'
      };

      return credential;
    } catch (error) {
      console.error('Error issuing credential:', error);
      return null;
    }
  },

  // List credentials
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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Credential list:', data);

      // Convert API response to application format
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
      console.error('Error retrieving credential list:', error);
      return [];
    }
  },

  // Verify credential
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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Credential verification result:', data);

      return data.isValid === true;
    } catch (error) {
      console.error('Error verifying credential:', error);
      return false;
    }
  },

  // Revoke credential
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
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Credential revocation result:', data);

      return data.status === 'success';
    } catch (error) {
      console.error('Error revoking credential:', error);
      return false;
    }
  },

  // Additional utility methods

  // Filter credentials by type
  filterCredentialsByType: (credentials: Credential[], type: string): Credential[] => {
    return credentials.filter(credential => credential.type === type);
  },

  // Filter valid credentials only
  filterValidCredentials: (credentials: Credential[]): Credential[] => {
    const now = new Date().toISOString();
    return credentials.filter(credential => 
      credential.status === 'active' && 
      (credential.expirationDate === '' || credential.expirationDate > now)
    );
  }
};

export default credentialService; 