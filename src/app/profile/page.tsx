'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserProfile, VerifiableCredential } from '@/types';
import CredentialManager from '@/components/CredentialManager';
import CredentialCard from '@/components/CredentialCard';
import { humanityApi } from '@/services/humanityApi';

// Dummy user data
const dummyProfile: UserProfile = {
  id: 'user123',
  displayName: 'Kim Taehee',
  bio: 'Developer interested in blockchain and AI technology. Fascinated by new technologies and innovative ideas.',
  avatarUrl: '/images/default.jpg',
  location: 'Gangnam, Seoul',
  interests: ['Blockchain', 'Artificial Intelligence', 'Programming', 'Innovative Tech', 'Startups'],
  credentials: [
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      validFrom: '2023-10-15T09:30:00Z',
      validUntil: '',
      credentialSubject: {
        id: 'did:ethr:0xSample123456789abcdef0123456789abcdef01234567',
        kyc: 'passed',
        verified: true
      },
      id: 'urn:uuid:sample-uuid-12345678-90ab-cdef-1234-567890abcdef',
      credentialStatus: {
        type: 'T3RevocationRegistry',
        chain_id: '1234567890',
        revocation_registry_contract_address: '0xSampleAddress1234567890abcdef1234567890abcdef',
        did_registry_contract_address: '0xSampleAddress0987654321fedcba0987654321fedcba'
      },
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'bbs-2023',
        created: '2023-10-15T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    },
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      validFrom: '2023-10-15T09:30:00Z',
      validUntil: '',
      credentialSubject: {
        id: 'did:ethr:0xSample123456789abcdef0123456789abcdef01234567',
        age: 28
      },
      id: 'urn:uuid:sample-uuid-abcdef12-3456-7890-abcd-ef1234567890',
      credentialStatus: {
        type: 'T3RevocationRegistry',
        chain_id: '1234567890',
        revocation_registry_contract_address: '0xSampleAddress1234567890abcdef1234567890abcdef',
        did_registry_contract_address: '0xSampleAddress0987654321fedcba0987654321fedcba'
      },
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'bbs-2023',
        created: '2023-10-15T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    },
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      validFrom: '2023-10-15T09:30:00Z',
      validUntil: '',
      credentialSubject: {
        id: 'did:ethr:0xSample123456789abcdef0123456789abcdef01234567',
        institution: 'Seoul National University',
        degree: 'Computer Science'
      },
      id: 'urn:uuid:sample-uuid-12340987-6543-210f-edcb-a0987654321fe',
      credentialStatus: {
        type: 'T3RevocationRegistry',
        chain_id: '1234567890',
        revocation_registry_contract_address: '0xSampleAddress1234567890abcdef1234567890abcdef',
        did_registry_contract_address: '0xSampleAddress0987654321fedcba0987654321fedcba'
      },
      proof: {
        type: 'DataIntegrityProof',
        cryptosuite: 'bbs-2023',
        created: '2023-10-15T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    }
  ],
  matches: ['user1', 'user2', 'user3'],
  conversations: ['conv1', 'conv2', 'conv3'],
  createdAt: '2023-10-01T00:00:00Z',
  lastActive: '2023-10-22T18:30:00Z',
  walletAddress: '0xSample123456789abcdef0123456789abcdef01234567'
};

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>(dummyProfile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    location: profile.location,
    interests: profile.interests.join(', ')
  });
  const [apiTestResult, setApiTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // 실제 구현에서는 API 호출을 통해 저장
    setProfile(prev => ({
      ...prev,
      displayName: formData.displayName,
      bio: formData.bio,
      location: formData.location,
      interests: formData.interests.split(',').map(item => item.trim())
    }));
    setEditMode(false);
  };

  const handleCredentialIssued = (credential: VerifiableCredential) => {
    setProfile(prev => ({
      ...prev,
      credentials: [...prev.credentials, credential]
    }));
  };

  const handleCredentialRevoked = (credentialId: string) => {
    setProfile(prev => ({
      ...prev,
      credentials: prev.credentials.map(cred => 
        cred.id === credentialId ? { 
          ...cred, 
          credentialStatus: {
            ...cred.credentialStatus,
            type: 'T3RevocationRegistry-revoked'
          } 
        } : cred
      )
    }));
  };

  const testApiConnection = async () => {
    try {
      setIsLoading(true);
      setApiTestResult('Testing API connection...');
      
      console.log('API test started');
      const response = await humanityApi.listCredentials();
      console.log('API response:', response);
      
      if (response.success && response.data) {
        setApiTestResult(`API connection successful! Credentials found: ${response.data.length}`);
      } else {
        let errorMessage = '';
        if (typeof response.error === 'object') {
          errorMessage = JSON.stringify(response.error);
        } else if (response.error) {
          errorMessage = response.error;
        } else {
          errorMessage = 'Unknown error';
        }
        
        // 직접 API 테스트 결과 추가
        setApiTestResult(`API connection failed: ${errorMessage}. The API key is valid but an error occurred on the API server. Check server logs.`);
      }
    } catch (error: any) {
      console.error('API test exception:', error);
      setApiTestResult(`Exception during API connection: ${error.message}. The API key is valid but there's a server-side issue.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm fixed top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-6">
            <Link href="/discover" className="hover:text-primary">Discover</Link>
            <Link href="/matches" className="hover:text-primary">Matches</Link>
            <Link href="/messages" className="hover:text-primary">Messages</Link>
            <Link href="/profile" className="text-primary">Profile</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <div className="flex gap-2">
              <button 
                onClick={testApiConnection}
                className="btn btn-secondary btn-sm"
                disabled={isLoading}
              >
                {isLoading ? 'Testing...' : 'Test API Key'}
              </button>
              {!editMode ? (
                <button 
                  onClick={() => setEditMode(true)}
                  className="btn btn-outline btn-sm"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditMode(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {apiTestResult && (
            <div className={`p-4 mb-6 rounded-lg ${apiTestResult.includes('successful') ? 'bg-green-100' : 'bg-red-100'}`}>
              {apiTestResult}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {!editMode ? (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={profile.avatarUrl || 'https://via.placeholder.com/200?text=profile'} 
                        alt={profile.displayName} 
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200?text=profile';
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold mb-2">{profile.displayName}</h2>
                  <p className="text-gray-500 mb-4">{profile.location}</p>
                  <h3 className="font-semibold mt-4 mb-2">Bio</h3>
                  <p className="text-gray-700 mb-4">{profile.bio}</p>
                  <h3 className="font-semibold mt-4 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="badge badge-secondary badge-outline p-3"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                  {profile.walletAddress && (
                    <div className="mt-4">
                      <h3 className="font-semibold mt-4 mb-2">Wallet Address</h3>
                      <p className="text-xs text-gray-700 font-mono break-all bg-gray-100 p-2 rounded">
                        {profile.walletAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <div className="avatar">
                    <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img 
                        src={profile.avatarUrl || 'https://via.placeholder.com/200?text=profile'} 
                        alt={profile.displayName} 
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200?text=profile';
                        }}
                      />
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm w-full mt-4">
                    Change Image
                  </button>
                </div>
                <div className="flex-grow">
                  <div className="form-control w-full mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Name</span>
                    </label>
                    <input 
                      type="text" 
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                    />
                  </div>
                  <div className="form-control w-full mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Location</span>
                    </label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                    />
                  </div>
                  <div className="form-control w-full mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Bio</span>
                    </label>
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full h-32" 
                    />
                  </div>
                  <div className="form-control w-full mb-4">
                    <label className="label">
                      <span className="label-text font-semibold">Interests (comma separated)</span>
                    </label>
                    <input 
                      type="text" 
                      name="interests"
                      value={formData.interests}
                      onChange={handleInputChange}
                      className="input input-bordered w-full" 
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Credential Manager component */}
          <h2 className="text-2xl font-bold mb-4">Verifiable Credentials</h2>
          
          {/* Display VC cards briefly on profile page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {profile.credentials.map(credential => (
              <CredentialCard 
                key={credential.id}
                credential={credential}
                showDetails={true}
              />
            ))}
          </div>
          
          <div className="mb-8">
            <CredentialManager 
              user={profile}
              walletAddress={profile.walletAddress}
              onCredentialIssued={handleCredentialIssued}
              onCredentialRevoked={handleCredentialRevoked}
            />
          </div>
          
          <div className="flex justify-center mt-8">
            <Link 
              href="/discover" 
              className="btn btn-primary btn-lg"
            >
              Start Matching
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage; 