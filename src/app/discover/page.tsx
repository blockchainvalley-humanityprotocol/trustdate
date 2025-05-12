'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Credential } from '@/types';
import ProfileCard from '@/components/ProfileCard';

// 더미 매칭 프로필 데이터
const dummyProfiles: UserProfile[] = [
  {
    id: 'user1',
    displayName: 'Vitalik Buterin',
    bio: 'Founder of Ethereum and pioneer in blockchain technology. Interested in cryptocurrency and decentralized technology, and contributing to the developer community.',
    avatarUrl: '/images/eth1.png',
    location: 'Singapore',
    interests: ['Blockchain', 'Cryptocurrency', 'Programming', 'Philosophy', 'Decentralization'],
    credentials: [
      {
        id: 'cred1_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user1',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-15T09:30:00Z',
        claims: {
          verified: true
        },
        status: 'active'
      },
      {
        id: 'cred1_2',
        type: 'age',
        issuer: 'Humanity Protocol',
        holder: 'user1',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-15T09:30:00Z',
        claims: {
          age: 30
        },
        status: 'active'
      },
      {
        id: 'cred1_3',
        type: 'education',
        issuer: 'University of Waterloo',
        holder: 'user1',
        issuanceDate: '2023-09-01T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          institution: 'University of Toronto',
          degree: 'Computer Science'
        },
        status: 'active'
      },
      {
        id: 'cred1_4',
        type: 'employment',
        issuer: 'Ethereum Foundation',
        holder: 'user1',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          company: 'Ethereum Foundation',
          position: 'Founder'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T15:45:00Z'
  },
  {
    id: 'user2',
    displayName: 'Elon Musk',
    bio: 'CEO of Tesla and SpaceX, and owner of X (Twitter). Passionate about innovative technology, space travel, and sustainable energy.',
    avatarUrl: '/images/musk1.png',
    location: 'Austin, Texas',
    interests: ['Space Travel', 'Electric Vehicles', 'AI', 'Sustainability', 'Mars Colonization'],
    credentials: [
      {
        id: 'cred2_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user2',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-10T09:30:00Z',
        claims: {
          verified: true
        },
        status: 'active'
      },
      {
        id: 'cred2_2',
        type: 'age',
        issuer: 'Humanity Protocol',
        holder: 'user2',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-10T09:30:00Z',
        claims: {
          age: 52
        },
        status: 'active'
      },
      {
        id: 'cred2_3',
        type: 'education',
        issuer: 'University of Pennsylvania',
        holder: 'user2',
        issuanceDate: '2023-09-05T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          institution: 'University of Pennsylvania',
          degree: 'Physics & Economics'
        },
        status: 'active'
      },
      {
        id: 'cred2_4',
        type: 'employment',
        issuer: 'Tesla & SpaceX',
        holder: 'user2',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          company: 'Tesla, SpaceX',
          position: 'CEO'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T10:30:00Z'
  },
  {
    id: 'user3',
    displayName: 'Donald Trump',
    bio: 'Former U.S. President and businessman. Active in real estate development and politics, and founder of the social media platform Truth Social.',
    avatarUrl: '/images/trump1.png',
    location: 'Palm Beach, Florida',
    interests: ['Golf', 'Politics', 'Real Estate', 'Negotiation', 'Media'],
    credentials: [
      {
        id: 'cred3_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user3',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-12T09:30:00Z',
        claims: {
          verified: true
        },
        status: 'active'
      },
      {
        id: 'cred3_2',
        type: 'age',
        issuer: 'Humanity Protocol',
        holder: 'user3',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-10-12T09:30:00Z',
        claims: {
          age: 77
        },
        status: 'active'
      },
      {
        id: 'cred3_3',
        type: 'education',
        issuer: 'Wharton School of Business',
        holder: 'user3',
        issuanceDate: '2023-09-10T09:30:00Z',
        expirationDate: '2026-09-10T09:30:00Z',
        claims: {
          institution: 'Wharton School',
          degree: 'Economics'
        },
        status: 'active'
      },
      {
        id: 'cred3_4',
        type: 'employment',
        issuer: 'United States Government',
        holder: 'user3',
        issuanceDate: '2025-05-12T09:30:00Z',
        expirationDate: '2024-09-15T09:30:00Z',
        claims: {
          company: 'U.S. Federal Government',
          position: 'Former President'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2025-05-12T12:00:00Z',
    lastActive: '2025-05-12T14:20:00Z'
  }
];

const DiscoverPage = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    minAge: 18,
    maxAge: 40,
    education: '',
    interests: [] as string[]
  });
  const [pendingMatches, setPendingMatches] = useState<string[]>([]);
  const [useHeartRateMatching, setUseHeartRateMatching] = useState(true);

  useEffect(() => {
    // In actual implementation, call API to get profile data
    setTimeout(() => {
      setProfiles(dummyProfiles);
      setFilteredProfiles(dummyProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMatch = (profileId: string) => {
    // In actual implementation, send match request through API
    // If heart rate matching is enabled, actual heart rate measurement is required
    if (useHeartRateMatching) {
      // Check if matching is possible through heart rate measurement
      const profile = profiles.find(p => p.id === profileId);
      if (profile) {
        const heartRateData = localStorage.getItem('heartRateData');
        if (heartRateData) {
          const parsedData = JSON.parse(heartRateData);
          const userData = parsedData.find(
            (data: any) => data.userId === 'user123' && data.targetUserId === profileId
          );
          
          if (userData && userData.percentageChange >= 15) {
            setPendingMatches(prev => [...prev, profileId]);
            alert(`You've shown interest in ${profile.displayName}! Heart rate change: ${userData.percentageChange.toFixed(1)}%`);
          } else {
            alert(`Heart rate measurement with ${profile.displayName}'s full photo is required for matching.`);
          }
        } else {
          alert(`Heart rate measurement with ${profile.displayName}'s full photo is required for matching.`);
        }
      }
    } else {
      // If heart rate matching is disabled, match immediately
      setPendingMatches(prev => [...prev, profileId]);
      const profile = profiles.find(p => p.id === profileId);
      alert(`You've shown interest in ${profile?.displayName || profileId}!`);
    }
  };

  const applyFilter = () => {
    const filtered = profiles.filter(profile => {
      // Age filtering
      const ageCredential = profile.credentials.find(c => c.type === 'age');
      if (ageCredential) {
        const age = ageCredential.claims.age as number;
        if (age < filter.minAge || age > filter.maxAge) {
          return false;
        }
      }

      // Education filtering
      if (filter.education && filter.education !== '') {
        const eduCredential = profile.credentials.find(c => c.type === 'education');
        if (!eduCredential || !eduCredential.claims.institution.includes(filter.education)) {
          return false;
        }
      }

      // Interest filtering
      if (filter.interests.length > 0) {
        const hasMatchingInterest = profile.interests.some(interest => 
          filter.interests.includes(interest)
        );
        if (!hasMatchingInterest) {
          return false;
        }
      }

      return true;
    });

    setFilteredProfiles(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFilter(prev => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  // Extract all interests from profiles
  const allInterests = Array.from(new Set(profiles.flatMap(p => p.interests)));

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm fixed top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-6">
            <Link href="/discover" className="text-primary">Discover</Link>
            <Link href="/matches" className="hover:text-primary">Matches</Link>
            <Link href="/messages" className="hover:text-primary">Messages</Link>
            <Link href="/profile" className="hover:text-primary">Profile</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Age Range</span>
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    name="minAge"
                    value={filter.minAge}
                    onChange={handleFilterChange}
                    className="input input-bordered w-full" 
                    min="18"
                    max="100"
                  />
                  <span>~</span>
                  <input 
                    type="number" 
                    name="maxAge"
                    value={filter.maxAge}
                    onChange={handleFilterChange}
                    className="input input-bordered w-full" 
                    min="18"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Education</span>
                </label>
                <select 
                  name="education"
                  value={filter.education}
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
                >
                  <option value="">All Education</option>
                  <option value="University of Toronto">University of Toronto</option>
                  <option value="University of Pennsylvania">University of Pennsylvania</option>
                  <option value="Wharton School">Wharton School</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Interests</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest, index) => (
                    <label 
                      key={index} 
                      className={`badge p-3 cursor-pointer ${
                        filter.interests.includes(interest) 
                          ? 'badge-primary text-white' 
                          : 'badge-outline'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={filter.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                      />
                      {interest}
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-control mb-4">
                <label className="label cursor-pointer">
                  <span className="label-text font-semibold">💓 Use Heart Rate Matching</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={useHeartRateMatching}
                    onChange={(e) => setUseHeartRateMatching(e.target.checked)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Your heart must beat for true love! When enabled, your heart rate must increase by 15% or more when viewing a profile to enable matching.
                </p>
              </div>
              
              <button 
                onClick={applyFilter}
                className="btn btn-primary w-full mt-4"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Profile list */}
          <div className="lg:w-3/4">
            <h1 className="text-3xl font-bold mb-6">Recommended Profiles</h1>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg text-primary"></div>
              </div>
            ) : filteredProfiles.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredProfiles.map(profile => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile}
                    onMatch={() => handleMatch(profile.id)}
                    isPending={pendingMatches.includes(profile.id)}
                    showHeartRateMonitor={useHeartRateMatching}
                    currentUserId="user123"
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No profiles match your criteria</h3>
                <p className="text-gray-600 mb-4">Try changing your filter settings.</p>
                <button 
                  onClick={() => {
                    setFilter({
                      minAge: 18,
                      maxAge: 40,
                      education: '',
                      interests: []
                    });
                    setFilteredProfiles(profiles);
                  }}
                  className="btn btn-outline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DiscoverPage; 