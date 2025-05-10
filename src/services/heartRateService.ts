'use client';

import { HeartRateData } from '@/types';

// 사용자의 카메라를 이용한 심장 박동수 측정 (PPG 기법)
// 실제 구현에서는 WebRTC와 컴퓨터 비전 알고리즘을 사용해야 합니다
export const heartRateService = {
  // 기본 심장 박동수 측정 (30초 동안)
  measureBaselineHeartRate: async (): Promise<number> => {
    try {
      // 실제 구현: 사용자의 얼굴을 카메라로 감지하고 PPG 기법으로 심장 박동수 측정
      // 여기서는 시뮬레이션을 위해 60-80 사이의 무작위 값 반환
      return new Promise((resolve) => {
        setTimeout(() => {
          const baselineRate = Math.floor(60 + Math.random() * 20);
          console.log(`기본 심장 박동수: ${baselineRate}`);
          resolve(baselineRate);
        }, 3000); // 실제로는 30초가 필요하지만 데모는 3초로 단축
      });
    } catch (error) {
      console.error('기본 심장 박동수 측정 중 오류:', error);
      // 오류 발생 시 기본값 반환
      return 70;
    }
  },

  // 프로필 확인 시 심장 박동수 측정 (15초 동안)
  measureHeartRateWhileViewingProfile: async (targetUserId: string): Promise<number> => {
    try {
      // 실제 구현: 프로필을 보는 동안 사용자의 심장 박동수 측정
      // 시뮬레이션을 위해 프로필 매력도에 따라 심장 박동수 증가 시뮬레이션
      return new Promise((resolve) => {
        setTimeout(() => {
          // targetUserId에 따라 다른 반응을 시뮬레이션
          // user1: 매우 높은 관심, user2: 보통 관심, user3: 낮은 관심
          let increasePercentage = 0;
          
          if (targetUserId === 'user1') {
            increasePercentage = 15 + Math.random() * 15; // 15-30% 증가
          } else if (targetUserId === 'user2') {
            increasePercentage = 5 + Math.random() * 10; // 5-15% 증가
          } else if (targetUserId === 'user3') {
            increasePercentage = Math.random() * 5; // 0-5% 증가
          } else {
            increasePercentage = Math.random() * 20; // 다른 사용자: 0-20% 증가
          }
          
          // 기본 심장 박동수 70에 증가율 적용
          const baseRate = 70;
          const increasedRate = Math.floor(baseRate * (1 + increasePercentage / 100));
          console.log(`프로필 열람 심장 박동수: ${increasedRate} (${increasePercentage.toFixed(1)}% 증가)`);
          resolve(increasedRate);
        }, 2000); // 실제로는 15초가 필요하지만 데모는 2초로 단축
      });
    } catch (error) {
      console.error('프로필 열람 심장 박동수 측정 중 오류:', error);
      // 오류 발생 시 기본값 반환
      return 75;
    }
  },

  // 측정 데이터 저장
  saveHeartRateData: (data: HeartRateData): void => {
    try {
      // 로컬 스토리지에 데이터 저장
      const key = `heartRate_${data.userId}_${data.targetUserId}`;
      const existingDataStr = localStorage.getItem('heartRateData');
      const existingData: HeartRateData[] = existingDataStr ? JSON.parse(existingDataStr) : [];
      
      // 새 데이터 추가
      existingData.push(data);
      
      // 저장
      localStorage.setItem('heartRateData', JSON.stringify(existingData));
      console.log('심장 박동수 데이터 저장됨:', data);
    } catch (error) {
      console.error('심장 박동수 데이터 저장 중 오류:', error);
    }
  },

  // 사용자별 심장 박동수 데이터 가져오기
  getHeartRateDataForUser: (userId: string): HeartRateData[] => {
    try {
      const existingDataStr = localStorage.getItem('heartRateData');
      if (!existingDataStr) return [];
      
      const allData: HeartRateData[] = JSON.parse(existingDataStr);
      return allData.filter(data => data.userId === userId);
    } catch (error) {
      console.error('심장 박동수 데이터 조회 중 오류:', error);
      return [];
    }
  },

  // 특정 사용자 쌍에 대한 심장 박동수 데이터 가져오기
  getHeartRateDataForUserPair: (userId: string, targetUserId: string): HeartRateData | null => {
    try {
      const existingDataStr = localStorage.getItem('heartRateData');
      if (!existingDataStr) return null;
      
      const allData: HeartRateData[] = JSON.parse(existingDataStr);
      const pairData = allData.find(data => 
        data.userId === userId && data.targetUserId === targetUserId
      );
      
      return pairData || null;
    } catch (error) {
      console.error('사용자 쌍 심장 박동수 데이터 조회 중 오류:', error);
      return null;
    }
  },

  // 관심도 측정 (심장 박동수 변화율 기준)
  calculateInterestLevel: (baselineRate: number, viewingRate: number): {
    percentageChange: number;
    interestLevel: 'low' | 'medium' | 'high';
  } => {
    const percentageChange = ((viewingRate - baselineRate) / baselineRate) * 100;
    
    let interestLevel: 'low' | 'medium' | 'high';
    if (percentageChange >= 15) {
      interestLevel = 'high';
    } else if (percentageChange >= 5) {
      interestLevel = 'medium';
    } else {
      interestLevel = 'low';
    }
    
    return {
      percentageChange,
      interestLevel
    };
  },

  // 매칭 가능 여부 확인 (심장 박동수 변화율이 threshold 이상인지)
  isMatchPossible: (percentageChange: number, threshold: number = 15): boolean => {
    return percentageChange >= threshold;
  }
}; 