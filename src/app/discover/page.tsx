'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, Credential } from '@/types';
import ProfileCard from '@/components/ProfileCard';

// 더미 매칭 프로필 데이터
const dummyProfiles: UserProfile[] = [
  {
    id: 'user1',
    displayName: '비탈릭 부테린',
    bio: '이더리움의 창시자이자 블록체인 기술의 선구자입니다. 암호화폐와 탈중앙화 기술에 관심이 많으며 개발자 커뮤니티에 기여하고 있습니다.',
    avatarUrl: '/images/eth1.png',
    location: '싱가포르',
    interests: ['블록체인', '암호화폐', '프로그래밍', '철학', '탈중앙화'],
    credentials: [
      {
        id: 'cred1_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user1',
        issuanceDate: '2023-10-15T09:30:00Z',
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
        issuanceDate: '2023-10-15T09:30:00Z',
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
          institution: '토론토 대학교',
          degree: '컴퓨터과학'
        },
        status: 'active'
      },
      {
        id: 'cred1_4',
        type: 'employment',
        issuer: 'Ethereum Foundation',
        holder: 'user1',
        issuanceDate: '2023-09-01T09:30:00Z',
        expirationDate: '2026-09-01T09:30:00Z',
        claims: {
          company: '이더리움 재단',
          position: '창립자'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2023-10-01T12:00:00Z',
    lastActive: '2023-10-21T15:45:00Z'
  },
  {
    id: 'user2',
    displayName: '일론 머스크',
    bio: '테슬라와 스페이스X의 CEO이자 X(트위터)의 소유주입니다. 혁신적인 기술과 우주 여행, 지속 가능한 에너지에 열정을 가지고 있습니다.',
    avatarUrl: '/images/musk1.png',
    location: '텍사스 오스틴',
    interests: ['우주여행', '전기차', '인공지능', '지속가능성', '화성 이주'],
    credentials: [
      {
        id: 'cred2_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user2',
        issuanceDate: '2023-10-10T09:30:00Z',
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
        issuanceDate: '2023-10-10T09:30:00Z',
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
          institution: '펜실베니아 대학교',
          degree: '물리학 & 경제학'
        },
        status: 'active'
      },
      {
        id: 'cred2_4',
        type: 'employment',
        issuer: 'Tesla & SpaceX',
        holder: 'user2',
        issuanceDate: '2023-09-05T09:30:00Z',
        expirationDate: '2026-09-05T09:30:00Z',
        claims: {
          company: '테슬라, 스페이스X',
          position: 'CEO'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2023-10-05T12:00:00Z',
    lastActive: '2023-10-22T10:30:00Z'
  },
  {
    id: 'user3',
    displayName: '도널드 트럼프',
    bio: '미국의 전 대통령이자 사업가입니다. 부동산 개발과 정치에서 활발히 활동했으며, 소셜 미디어 플랫폼 Truth Social의 설립자입니다.',
    avatarUrl: '/images/trump1.png',
    location: '플로리다 팜비치',
    interests: ['골프', '정치', '부동산', '협상', '미디어'],
    credentials: [
      {
        id: 'cred3_1',
        type: 'identity',
        issuer: 'Humanity Protocol',
        holder: 'user3',
        issuanceDate: '2023-10-12T09:30:00Z',
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
        issuanceDate: '2023-10-12T09:30:00Z',
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
          institution: '와튼 스쿨',
          degree: '경제학'
        },
        status: 'active'
      },
      {
        id: 'cred3_4',
        type: 'employment',
        issuer: 'United States Government',
        holder: 'user3',
        issuanceDate: '2023-09-15T09:30:00Z',
        expirationDate: '2024-09-15T09:30:00Z',
        claims: {
          company: '미국 연방정부',
          position: '전 대통령'
        },
        status: 'active'
      }
    ],
    matches: [],
    conversations: [],
    createdAt: '2023-10-03T12:00:00Z',
    lastActive: '2023-10-22T14:20:00Z'
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
    // 실제 구현에서는 API를 호출하여 프로필 데이터를 가져옴
    setTimeout(() => {
      setProfiles(dummyProfiles);
      setFilteredProfiles(dummyProfiles);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMatch = (profileId: string) => {
    // 실제 구현에서는 API를 통해 매치 요청을 보냄
    // 심장 박동수 매칭이 활성화되어 있으면 실제 심장 박동수 측정 필요
    if (useHeartRateMatching) {
      // 심장 박동수 측정을 통해 매칭이 가능한지 확인
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
            alert(`${profile.displayName}님에게 관심을 표시했습니다! 심장 박동 변화: ${userData.percentageChange.toFixed(1)}%`);
          } else {
            alert(`매칭을 위해서는 ${profile.displayName}님의 큰 사진을 보면서 심장 박동수 측정이 필요합니다.`);
          }
        } else {
          alert(`매칭을 위해서는 ${profile.displayName}님의 큰 사진을 보면서 심장 박동수 측정이 필요합니다.`);
        }
      }
    } else {
      // 심장 박동수 매칭이 비활성화되어 있으면 바로 매칭
      setPendingMatches(prev => [...prev, profileId]);
      const profile = profiles.find(p => p.id === profileId);
      alert(`${profile?.displayName || profileId}님에게 관심을 표시했습니다!`);
    }
  };

  const applyFilter = () => {
    const filtered = profiles.filter(profile => {
      // 나이 필터링
      const ageCredential = profile.credentials.find(c => c.type === 'age');
      if (ageCredential) {
        const age = ageCredential.claims.age as number;
        if (age < filter.minAge || age > filter.maxAge) {
          return false;
        }
      }

      // 학력 필터링
      if (filter.education && filter.education !== '') {
        const eduCredential = profile.credentials.find(c => c.type === 'education');
        if (!eduCredential || !eduCredential.claims.institution.includes(filter.education)) {
          return false;
        }
      }

      // 관심사 필터링
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

  // 모든 프로필의 관심사를 추출
  const allInterests = Array.from(new Set(profiles.flatMap(p => p.interests)));

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white shadow-sm fixed top-0 z-10">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link href="/" className="text-2xl font-bold text-primary">TrustDate</Link>
          <nav className="flex gap-6">
            <Link href="/discover" className="text-primary">탐색</Link>
            <Link href="/matches" className="hover:text-primary">매치</Link>
            <Link href="/messages" className="hover:text-primary">메시지</Link>
            <Link href="/profile" className="hover:text-primary">프로필</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">필터</h2>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-semibold">나이 범위</span>
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
                  <span className="label-text font-semibold">학력</span>
                </label>
                <select 
                  name="education"
                  value={filter.education}
                  onChange={handleFilterChange}
                  className="select select-bordered w-full"
                >
                  <option value="">모든 학력</option>
                  <option value="토론토 대학교">토론토 대학교</option>
                  <option value="펜실베니아 대학교">펜실베니아 대학교</option>
                  <option value="와튼 스쿨">와튼 스쿨</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="label">
                  <span className="label-text font-semibold">관심사</span>
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
                  <span className="label-text font-semibold">💓 심장 박동수 매칭 사용</span>
                  <input 
                    type="checkbox" 
                    className="toggle toggle-primary" 
                    checked={useHeartRateMatching}
                    onChange={(e) => setUseHeartRateMatching(e.target.checked)}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  심장이 뛰어야 사랑입니다! 활성화하면 프로필 열람 시 심장 박동수가 15% 이상 증가해야 매칭 가능합니다.
                </p>
              </div>
              
              <button 
                onClick={applyFilter}
                className="btn btn-primary w-full mt-4"
              >
                필터 적용
              </button>
            </div>
          </div>
          
          {/* 프로필 목록 */}
          <div className="lg:w-3/4">
            <h1 className="text-3xl font-bold mb-6">추천 프로필</h1>
            
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
                <h3 className="text-xl font-semibold mb-2">조건에 맞는 프로필이 없습니다</h3>
                <p className="text-gray-600 mb-4">필터 조건을 변경해보세요.</p>
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
                  필터 초기화
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