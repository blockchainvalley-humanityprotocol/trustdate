'use client';

import { HeartRateData } from '@/types';

// User camera-based heart rate measurement (PPG technique)

// Helper function to simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Measure baseline heart rate (30 seconds)
export const heartRateService = {
  measureBaselineHeartRate: async (): Promise<number> => {
    try {
      // Simulate 3 second delay for measurement
      await delay(3000);
      
      // 현재 시간 기반 시드값 생성 (일관성을 위해)
      const seed = new Date().getHours() + new Date().getMinutes() / 100;
      
      // 사용자 연령대와 건강 상태에 따른 기준 심박수 생성
      // 평균적인 성인: 60-100 BPM, 대부분 60-80 BPM 범위
      let baseHeartRate: number;
      
      // 시간대에 따라 심박수 변화 (아침-활동적, 저녁-휴식)
      const hourOfDay = new Date().getHours();
      
      if (hourOfDay >= 7 && hourOfDay <= 11) {
        // 아침: 약간 높은 심박수 (70-85 BPM)
        baseHeartRate = 70 + (seed * 15) % 16;
      } else if (hourOfDay >= 13 && hourOfDay <= 18) {
        // 오후: 보통 심박수 (65-80 BPM)
        baseHeartRate = 65 + (seed * 15) % 16;
      } else {
        // 밤/이른 아침: 낮은 심박수 (60-75 BPM)
        baseHeartRate = 60 + (seed * 15) % 16;
      }
      
      // 소수점 제거
      baseHeartRate = Math.floor(baseHeartRate);
      
      console.log(`기준 심장 박동수: ${baseHeartRate} BPM`);
      return baseHeartRate;
    } catch (error) {
      console.error('Error measuring baseline heart rate:', error);
      throw error;
    }
  },

  // Measure heart rate while viewing profile (15 seconds)
  measureHeartRateWhileViewingProfile: async (targetUserId: string): Promise<number> => {
    try {
      // Simulate 2 second delay for measurement
      await delay(2000);
      
      // 저장된 측정값이 있는지 확인
      const existingData = heartRateService.getHeartRateDataForUserPair('user123', targetUserId);
      
      // 이전에 측정한 기준 심박수 가져오기
      let baselineRate: number;
      if (existingData && existingData.baselineRate) {
        baselineRate = existingData.baselineRate;
      } else {
        // 기준값 없으면 65-80 BPM 사이로 설정
        baselineRate = Math.floor(Math.random() * 16) + 65;
      }
      
      // Vitalik Buterin 프로필 확인 (displayName에 "Vitalik" 또는 "Buterin" 포함 여부)
      let isVitalik = false;
      try {
        // 로컬 스토리지에서 프로필 데이터 확인
        const profilesData = localStorage.getItem('profilesData');
        if (profilesData) {
          const profiles = JSON.parse(profilesData);
          const profile = profiles.find((p: any) => p.id === targetUserId);
          if (profile && profile.displayName) {
            isVitalik = profile.displayName.includes('Vitalik') || profile.displayName.includes('Buterin');
          }
        }
        
        // Discover 페이지의 더미 데이터에서 user1이 Vitalik인 경우
        if (targetUserId === 'user1') {
          isVitalik = true;
        }
      } catch (error) {
        console.error('Error checking profile data:', error);
      }
      
      // Vitalik Buterin인 경우 항상 높은 증가율 (15-30%) 적용
      if (isVitalik) {
        const increasePercentage = 15 + (Math.random() * 15); // 15-30% 사이 증가
        const increasedRate = Math.floor(baselineRate * (1 + increasePercentage / 100));
        console.log(`Vitalik에 대한 심장 박동수 변화: ${increasedRate} (${increasePercentage.toFixed(1)}% 증가)`);
        return increasedRate;
      }
      
      // 현재 시간을 시드로 사용하여 같은 프로필에 대해 일관된 반응 제공
      const seedValue = parseInt(targetUserId.substring(targetUserId.length - 4), 16) || 1000;
      const randomSeed = seedValue / 10000;
      
      // 심장 박동수 증가 결정 (75% 확률로 증가)
      const willIncrease = randomSeed < 0.75;
      
      if (willIncrease) {
        // 심장 박동수 증가 - 더 흔한 경우 (75% 확률)
        let increasePercentage = 0;
        
        // 프로필 ID에 따라 증가율 결정
        const profileAttractiveness = seedValue % 10; // 0-9 사이 값
        
        if (profileAttractiveness >= 7) {
          // 높은 매력도: 15-30% 증가
          increasePercentage = 15 + (randomSeed * 15);
        } else if (profileAttractiveness >= 4) {
          // 중간 매력도: 8-16% 증가
          increasePercentage = 8 + (randomSeed * 8);
        } else {
          // 낮은 매력도: 1-9% 증가
          increasePercentage = 1 + (randomSeed * 8);
        }
        
        // 심장 박동수에 증가율 적용
        const increasedRate = Math.floor(baselineRate * (1 + increasePercentage / 100));
        console.log(`심장 박동수 변화: ${increasedRate} (${increasePercentage.toFixed(1)}% 증가)`);
        return increasedRate;
      } else {
        // 심장 박동수 감소 - 덜 흔한 경우 (25% 확률)
        // 1-5% 감소율 시뮬레이션
        const decreasePercentage = 1 + (randomSeed * 4);
        
        // 심장 박동수에 감소율 적용
        const decreasedRate = Math.floor(baselineRate * (1 - decreasePercentage / 100));
        console.log(`심장 박동수 변화: ${decreasedRate} (${decreasePercentage.toFixed(1)}% 감소)`);
        return decreasedRate;
      }
    } catch (error) {
      console.error('Error measuring heart rate while viewing profile:', error);
      throw error;
    }
  },

  // Save heart rate data
  saveHeartRateData: (data: HeartRateData): void => {
    try {
      // In actual implementation, this would send data to server
      // For simulation, store in localStorage
      const existingDataStr = localStorage.getItem('heartRateData');
      let existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
      
      // Add new data
      existingData.push(data);
      localStorage.setItem('heartRateData', JSON.stringify(existingData));
      console.log('Heart rate data saved:', data);
    } catch (error) {
      console.error('Error saving heart rate data:', error);
    }
  },

  // Get heart rate data for user
  getHeartRateDataForUser: (userId: string): HeartRateData[] => {
    try {
      const existingDataStr = localStorage.getItem('heartRateData');
      if (!existingDataStr) return [];
      
      const existingData = JSON.parse(existingDataStr);
      return existingData.filter((data: HeartRateData) => data.userId === userId);
    } catch (error) {
      console.error('Error retrieving heart rate data:', error);
      return [];
    }
  },

  // Get heart rate data for specific user pair
  getHeartRateDataForUserPair: (userId: string, targetUserId: string): HeartRateData | null => {
    try {
      const existingDataStr = localStorage.getItem('heartRateData');
      if (!existingDataStr) return null;
      
      const existingData = JSON.parse(existingDataStr);
      return existingData.find(
        (data: HeartRateData) => 
          data.userId === userId && data.targetUserId === targetUserId
      ) || null;
    } catch (error) {
      console.error('Error retrieving heart rate data for user pair:', error);
      return null;
    }
  },

  // Calculate interest level (based on heart rate change)
  calculateInterestLevel: (baselineRate: number, viewingRate: number): {
    percentageChange: number;
    interestLevel: 'low' | 'medium' | 'high';
  } => {
    const percentageChange = ((viewingRate - baselineRate) / baselineRate) * 100;
    
    let interestLevel: 'low' | 'medium' | 'high' = 'low';
    
    if (percentageChange >= 20) {
      interestLevel = 'high';
    } else if (percentageChange >= 10) {
      interestLevel = 'medium';
    }
    
    return { percentageChange, interestLevel };
  },

  // Check if matching is possible (heart rate change rate exceeds threshold)
  isMatchPossible: (percentageChange: number, threshold: number = 15): boolean => {
    return percentageChange >= threshold;
  }
}; 