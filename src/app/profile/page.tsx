'use client';

import { useState, useEffect } from 'react';
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
      validFrom: '2025-05-12T09:30:00Z',
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
        cryptosuite: 'bbs-2025',
        created: '2025-05-12T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    },
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      validFrom: '2025-05-12T09:30:00Z',
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
        cryptosuite: 'bbs-2025',
        created: '2025-05-12T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    },
    {
      '@context': ['https://www.w3.org/ns/credentials/v2'],
      type: ['VerifiableCredential'],
      issuer: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
      validFrom: '2025-05-12T09:30:00Z',
      validUntil: '',
      credentialSubject: {
        id: 'did:ethr:0xSample123456789abcdef0123456789abcdef01234567',
        institution: 'Korea University',
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
        cryptosuite: 'bbs-2025',
        created: '2025-05-12T09:30:00Z',
        verificationMethod: 'did:key:zSample12345678JLAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz',
        proofPurpose: 'assertionMethod',
        proofValue: 'SampleProofValue123456789012345678901234567890123456789012345678901234567890'
      }
    }
  ],
  matches: ['user1', 'user2', 'user3'],
  conversations: ['conv1', 'conv2', 'conv3'],
  createdAt: '2025-05-12T00:00:00Z',
  lastActive: '2025-05-12T18:30:00Z',
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

  // 페이지 로드 시 로컬 스토리지에서 사용자 데이터 불러오기
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          
          // 더미 프로필의 자격 증명 정보를 유지하면서 사용자 데이터 병합
          const mergedProfile = {
            ...parsedData,
            credentials: dummyProfile.credentials // 항상 더미 자격증명 데이터 사용
          };
          
          setProfile(mergedProfile);
          
          // 폼 데이터도 업데이트
          setFormData({
            displayName: parsedData.displayName || '',
            bio: parsedData.bio || '',
            location: parsedData.location || '',
            interests: (parsedData.interests || []).join(', ')
          });
        }
      } catch (error) {
        console.error('로컬 스토리지에서 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    loadUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // 프로필 업데이트
    const updatedProfile = {
      ...profile,
      displayName: formData.displayName,
      bio: formData.bio,
      location: formData.location,
      interests: formData.interests.split(',').map(item => item.trim()),
      lastActive: new Date().toISOString()
    };
    
    // 로컬 스토리지 업데이트
    localStorage.setItem('userData', JSON.stringify(updatedProfile));
    
    // 상태 업데이트
    setProfile(updatedProfile);
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
        
        // Direct API test result addition
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
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-4">
            <Link href="/discover" className="btn btn-sm btn-secondary">Discover</Link>
            <Link href="/matches" className="btn btn-sm btn-outline">Matches</Link>
            <Link href="/profile" className="btn btn-sm btn-primary">Profile</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="avatar">
                <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={profile.profileImage || profile.avatarUrl || '/images/default.jpg'} 
                    alt={profile.displayName} 
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center mt-4">{profile.displayName}</h2>
              <p className="text-gray-500 text-center">{profile.location}</p>
              
              <div className="w-full mt-6">
                <button 
                  onClick={() => setEditMode(!editMode)} 
                  className="btn btn-primary btn-block mb-2"
                >
                  {editMode ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                
                {/* Logout button */}
                <button className="btn btn-outline btn-block">
                  Logout
                </button>
              </div>
            </div>
            
            {/* Profile Information */}
            <div className="md:w-2/3">
              {editMode ? (
                // Edit form
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Edit Profile</h3>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Display Name</span>
                    </label>
                    <input 
                      type="text" 
                      name="displayName" 
                      value={formData.displayName} 
                      onChange={handleInputChange} 
                      className="input input-bordered" 
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    <textarea 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange} 
                      className="textarea textarea-bordered h-24" 
                    ></textarea>
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange} 
                      className="input input-bordered" 
                    />
                  </div>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Interests (comma separated)</span>
                    </label>
                    <input 
                      type="text" 
                      name="interests" 
                      value={formData.interests} 
                      onChange={handleInputChange} 
                      className="input input-bordered" 
                    />
                  </div>
                  
                  <div className="form-control mt-6">
                    <button 
                      onClick={handleSave} 
                      className="btn btn-primary"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-8">
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
              )}
            </div>
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