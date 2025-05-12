'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { humanityApi } from '@/services/humanityApi';
import { metamaskAuth } from '@/services/metamaskAuth';

// Registration steps
enum RegistrationStep {
  CONNECT_WALLET = 1, // Metamask connection
  PERSONAL_INFO = 2, // Personal information
  CREDENTIALS = 3, // Credential verification
  COMPLETE = 4 // Complete
}

export default function Register() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.CONNECT_WALLET);
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data state
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    profileImage: null as File | null,
    bio: '',
    location: '',
    interests: [] as string[],
    agreeTerms: false,
    agreePrivacy: false,
    age: {
      verified: false,
      verifying: false,
      value: ''
    },
    education: {
      verified: false,
      verifying: false,
      institution: '',
      degree: ''
    },
    employment: {
      verified: false,
      verifying: false,
      company: '',
      position: ''
    }
  });
  
  // Connect to Metamask
  const connectWallet = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask.');
      }
      
      // Check if MetaMask is locked
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts'
        });
        
        if (accounts.length === 0) {
          console.log('MetaMask is locked or no account is selected.');
        }
      } catch (acctError) {
        console.error('Error checking accounts:', acctError);
      }
      
      const result = await metamaskAuth.connectWallet();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to connect to MetaMask.');
      }
      
      const address = result.address || '';
      setWalletAddress(address);
      
      // Request message signature
      const nonce = Math.floor(Math.random() * 1000000).toString();
      const message = `TrustDate Registration Request: ${nonce}`;
      
      const signResult = await metamaskAuth.signMessage(message);
      
      if (!signResult.success) {
        throw new Error(signResult.error || 'Failed to sign the message.');
      }
      
      // Move to next step
      setCurrentStep(RegistrationStep.PERSONAL_INFO);
    } catch (err) {
      console.error('MetaMask connection error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update input values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev]) as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      profileImage: file
    }));
  };
  
  // Toggle interest function
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };
  
  // Request credential verification
  const requestCredential = async (type: 'age' | 'education' | 'employment') => {
    setLoading(true);
    setError('');
    
    try {
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verifying: true
        }
      }));
      
      // In actual implementation, call Humanity Protocol API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verified: true,
          verifying: false
        }
      }));
    } catch (err) {
      setFormData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          verifying: false
        }
      }));
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };
  
  // Move to next step
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1 as RegistrationStep);
  };
  
  // Submit registration
  const submitRegistration = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Here we would normally make an API call to submit registration
      // For demo purposes, we'll simulate a successful registration
      
      // Dummy credential data
      const dummyCredentials = [
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
      ];
      
      // Save user information to local storage
      const userData = {
        id: 'user' + Date.now(), // Generate temporary ID
        walletAddress,
        displayName: formData.displayName,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        interests: formData.interests,
        profileImage: formData.profileImage ? URL.createObjectURL(formData.profileImage) : '/images/default.jpg',
        credentials: dummyCredentials, // Use dummy credentials
        matches: [],
        conversations: [],
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      setTimeout(() => {
        setCurrentStep(RegistrationStep.COMPLETE);
        setTimeout(() => {
          router.push('/profile');
        }, 2000);
      }, 1500);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };
  
  // Render personal info form
  const renderPersonalInfoForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }} className="space-y-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input 
          type="text" 
          name="displayName" 
          value={formData.displayName} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Profile Image</span>
        </label>
        <input 
          type="file" 
          onChange={handleImageUpload} 
          className="file-input file-input-bordered w-full" 
          accept="image/*" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Bio</span>
        </label>
        <textarea 
          name="bio" 
          value={formData.bio} 
          onChange={handleChange} 
          className="textarea textarea-bordered h-24" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input 
          type="text" 
          name="location" 
          value={formData.location} 
          onChange={handleChange} 
          className="input input-bordered w-full" 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Interests (max 5)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {['Travel', 'Food', 'Movies', 'Reading', 'Music', 'Sports', 'Gaming', 'Dance', 'Art', 'Photography', 'Fashion', 'Cooking'].map(interest => (
            <label 
              key={interest}
              className={`badge p-3 cursor-pointer ${
                formData.interests.includes(interest) 
                  ? 'badge-primary text-white' 
                  : 'badge-outline'
              }`}
            >
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.interests.includes(interest)}
                onChange={() => toggleInterest(interest)}
                disabled={!formData.interests.includes(interest) && formData.interests.length >= 5}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.displayName || !formData.email}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : 'Next'}
        </button>
      </div>
    </form>
  );
  
  // Render credentials form
  const renderCredentialsForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); submitRegistration(); }} className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Request Credentials (Optional)</h3>
      <p className="text-gray-600 mb-4">
        Securely verify your information through Humanity Protocol to create a more trustworthy profile.
        Your personal information is protected, and only verification information is shared.
      </p>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Age Verification</h4>
            <p className="text-sm text-gray-600">Verify that you are over 18 years old</p>
          </div>
          <div>
            {formData.age.verified ? (
              <span className="badge badge-success">Verified</span>
            ) : formData.age.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                Verifying...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('age')} 
                className="btn btn-sm btn-outline"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Education Verification</h4>
            <p className="text-sm text-gray-600">Verify your education information</p>
          </div>
          <div>
            {formData.education.verified ? (
              <span className="badge badge-success">Verified</span>
            ) : formData.education.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                Verifying...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('education')} 
                className="btn btn-sm btn-outline"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-sm p-5 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-semibold">Employment Verification</h4>
            <p className="text-sm text-gray-600">Verify your employment information</p>
          </div>
          <div>
            {formData.employment.verified ? (
              <span className="badge badge-success">Verified</span>
            ) : formData.employment.verifying ? (
              <button className="btn btn-sm" disabled>
                <span className="loading loading-spinner loading-xs"></span>
                Verifying...
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => requestCredential('employment')} 
                className="btn btn-sm btn-outline"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="form-control">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="checkbox checkbox-primary" 
            required
          />
          <span className="label-text">I agree to the Terms of Service</span>
        </label>
      </div>
      
      <div className="form-control">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            name="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={handleChange}
            className="checkbox checkbox-primary" 
            required
          />
          <span className="label-text">I agree to the Privacy Policy</span>
        </label>
      </div>
      
      <div className="form-control mt-6">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !formData.agreeTerms || !formData.agreePrivacy}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Processing...
            </>
          ) : 'Next'}
        </button>
      </div>
    </form>
  );
  
  // Render connect wallet form
  const renderConnectWalletForm = () => (
    <div className="space-y-6 text-center">
      <div className="mb-8">
        <img 
          src="/metamask-fox.svg" 
          alt="Metamask Logo" 
          className="w-24 h-24 mx-auto"
          onError={(e) => {
            console.error("Error loading MetaMask logo:", e);
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg";
          }}
        />
      </div>
      
      <h3 className="text-xl font-semibold">Connect Metamask Wallet</h3>
      <p className="text-gray-600 mb-6">
        Please connect your Metamask wallet to sign up for TrustDate.<br />
        We securely protect your identity through blockchain authentication.
      </p>
      
      <button 
        onClick={connectWallet} 
        disabled={loading}
        className="btn btn-primary btn-lg"
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-sm mr-2"></span>
            Connecting...
          </>
        ) : 'Connect Metamask'}
      </button>
      
      {error && (
        <div className="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="text-sm text-gray-600 mt-4">
        <p>Don't have MetaMask installed?</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Install MetaMask
        </a>
      </div>
      
      <div className="divider">Or</div>
      
      <div>
        <p className="mb-4 text-gray-600">Already have an account?</p>
        <Link href="/login" className="btn btn-outline">Login</Link>
      </div>
    </div>
  );
  
  // Render completion view
  const renderCompletionView = () => (
    <div className="text-center py-10">
      <div className="mb-8">
        <div className="avatar">
          <div className="w-24 h-24 mx-auto rounded-full bg-success/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Complete!</h2>
      <p className="text-gray-600 mb-8">
        Welcome to TrustDate!<br />
        You can now start trusted dating.
      </p>
      
      <div className="flex justify-center gap-4">
        <div className="animate-pulse">
          <p className="text-primary">Redirecting to profile page...</p>
        </div>
      </div>
    </div>
  );
  
  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-4">
            <Link href="/login" className="btn btn-sm btn-outline">Login</Link>
            <Link href="/register" className="btn btn-sm btn-primary">Register</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register</h1>
            <p className="text-gray-600">Find your true match</p>
          </div>
          
          {/* Step progress bar */}
          {currentStep < RegistrationStep.COMPLETE && (
            <ul className="steps w-full mb-8">
              <li className={`step ${currentStep >= RegistrationStep.CONNECT_WALLET ? 'step-primary' : ''}`}>Connect Wallet</li>
              <li className={`step ${currentStep >= RegistrationStep.PERSONAL_INFO ? 'step-primary' : ''}`}>Basic Info</li>
              <li className={`step ${currentStep >= RegistrationStep.CREDENTIALS ? 'step-primary' : ''}`}>Verification</li>
              <li className={`step ${currentStep >= RegistrationStep.COMPLETE ? 'step-primary' : ''}`}>Complete</li>
            </ul>
          )}
          
          {/* Error message */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Render content based on current step */}
          {currentStep === RegistrationStep.CONNECT_WALLET && renderConnectWalletForm()}
          {currentStep === RegistrationStep.PERSONAL_INFO && renderPersonalInfoForm()}
          {currentStep === RegistrationStep.CREDENTIALS && renderCredentialsForm()}
          {currentStep === RegistrationStep.COMPLETE && renderCompletionView()}
        </div>
      </div>
    </main>
  );
} 