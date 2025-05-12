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
  walletAddress = '0xSample123456789abcdef0123456789abcdef01234567', // Sample wallet address
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
  
  // Retrieve user's credentials
  const fetchCredentials = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Actual API call (commented out in test/dev environment)
      // const fetchedCredentials = await humanityApi.listCredentials(walletAddress);
      
      // Development dummy data (comment out in production)
      const fetchedCredentials = user.credentials || [];
      
      setCredentials(fetchedCredentials);
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      setError('An error occurred while loading credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Initial loading
  useEffect(() => {
    fetchCredentials();
  }, [walletAddress, user]);

  // Issue credential
  const issueCredential = async () => {
    if (!claimType || !claimValue) {
      setError('Please enter both claim type and value.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const claims = { [claimType]: claimValue };
      
      // Actual API call (commented out in test/dev environment)
      // const newCredential = await humanityApi.issueCredential(claims, walletAddress);
      
      // Development dummy data creation (comment out in production)
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
        setSuccess('Credential issued successfully.');
        
        // Reset form
        setClaimType('kyc');
        setClaimValue('');
        setShowIssuanceForm(false);
        
        // Notify parent component
        if (onCredentialIssued) {
          onCredentialIssued(newCredential);
        }
      } else {
        setError('Failed to issue credential.');
      }
    } catch (error) {
      console.error('Error issuing credential:', error);
      setError('An error occurred while issuing credential.');
    } finally {
      setLoading(false);
    }
  };

  // Revoke credential
  const revokeCredential = async (credentialId: string) => {
    if (!confirm('Are you sure you want to revoke this credential? This action cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Actual API call (commented out in test/dev environment)
      // const success = await humanityApi.revokeCredential(credentialId);
      
      // Development dummy response (comment out in production)
      const success = true;
      
      if (success) {
        // Update local state
        setCredentials(prev => 
          prev.map(cred => 
            cred.id === credentialId ? { ...cred, status: 'revoked' } : cred
          )
        );
        setSuccess('Credential revoked successfully.');
        
        // Notify parent component
        if (onCredentialRevoked) {
          onCredentialRevoked(credentialId);
        }
      } else {
        setError('Failed to revoke credential.');
      }
    } catch (error) {
      console.error('Error revoking credential:', error);
      setError('An error occurred while revoking credential.');
    } finally {
      setLoading(false);
    }
  };

  // Claim type options
  const claimTypeOptions = [
    { value: 'kyc', label: 'KYC' },
    { value: 'age', label: 'Age Verification' },
    { value: 'education', label: 'Education Verification' },
    { value: 'employment', label: 'Employment Verification' },
    { value: 'interests', label: 'Interests Verification' }
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
          Credential Management
        </h2>
        <button
          onClick={() => setShowIssuanceForm(!showIssuanceForm)}
          className="btn btn-sm btn-primary"
          disabled={loading}
        >
          {showIssuanceForm ? 'Cancel' : 'Add Credential'}
        </button>
      </div>
      
      {/* Notification messages */}
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
      
      {/* Credential issuance form */}
      <AnimatePresence>
        {showIssuanceForm && (
          <motion.div 
            className="bg-gray-50 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Issue New Credential</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Claim Type
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
                  Claim Value
                </label>
                <input
                  type="text"
                  value={claimValue}
                  onChange={(e) => setClaimValue(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Enter claim value"
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
                      Issuing...
                    </>
                  ) : (
                    'Issue Credential'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Credential list */}
      <div>
        <h3 className="text-lg font-semibold mb-4">My Credentials</h3>
        
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
                        {credential.credentialSubject.kyc ? 'Identity Verification' : 
                         credential.credentialSubject.age ? `Age ${credential.credentialSubject.age} years` :
                         credential.credentialSubject.institution ? `Education: ${credential.credentialSubject.institution}` :
                         'Verified Credential'}
                      </h4>
                      <span className="ml-2 badge badge-success badge-sm">
                        Active
                      </span>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      <p>Issuer: {formatDid(credential.issuer)}</p>
                      <p>Issued: {new Date(credential.validFrom).toLocaleDateString()}</p>
                      <div className="mt-2">
                        <p className="font-medium">Claims:</p>
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
                    Revoke
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              You don't have any credentials yet.
            </p>
            <button
              onClick={() => setShowIssuanceForm(true)}
              className="btn btn-primary btn-sm mt-4"
            >
              Issue a Credential
            </button>
          </div>
        )}
      </div>
      
      {/* Selected credential detail modal */}
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
                <h3 className="text-xl font-bold">Credential Details</h3>
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
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">
                    {selectedCredential.type.join(', ')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Issuer</p>
                  <p className="font-medium">{formatDid(selectedCredential.issuer)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Subject ID</p>
                  <p className="font-medium truncate">{formatDid(selectedCredential.credentialSubject.id)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Issued Date</p>
                  <p className="font-medium">
                    {new Date(selectedCredential.validFrom).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedCredential.validUntil && (
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium">
                      {selectedCredential.validUntil 
                        ? new Date(selectedCredential.validUntil).toLocaleDateString() 
                        : 'No expiration'}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Claims</p>
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
                    Revoke Credential
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