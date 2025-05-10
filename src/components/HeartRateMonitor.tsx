'use client';

import { useState, useEffect } from 'react';
import { heartRateService } from '@/services/heartRateService';
import { HeartRateData } from '@/types';

interface HeartRateMonitorProps {
  userId: string;
  targetUserId: string;
  onMeasurementComplete?: (data: HeartRateData) => void;
}

enum MeasurementStatus {
  IDLE = 'idle',
  MEASURING_BASELINE = 'measuring_baseline',
  MEASURING_VIEWING = 'measuring_viewing',
  COMPLETED = 'completed',
}

const HeartRateMonitor = ({ userId, targetUserId, onMeasurementComplete }: HeartRateMonitorProps) => {
  const [status, setStatus] = useState<MeasurementStatus>(MeasurementStatus.IDLE);
  const [baselineRate, setBaselineRate] = useState<number | null>(null);
  const [viewingRate, setViewingRate] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);
  const [interestLevel, setInterestLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [matchPossible, setMatchPossible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 기존 측정 데이터가 있는지 확인
  useEffect(() => {
    const existingData = heartRateService.getHeartRateDataForUserPair(userId, targetUserId);
    if (existingData) {
      setBaselineRate(existingData.baselineRate);
      setViewingRate(existingData.viewingRate);
      setPercentageChange(existingData.percentageChange);
      
      const interestResult = heartRateService.calculateInterestLevel(
        existingData.baselineRate, 
        existingData.viewingRate
      );
      setInterestLevel(interestResult.interestLevel);
      
      const threshold = 15; // 예시 threshold 값
      setMatchPossible(heartRateService.isMatchPossible(existingData.percentageChange, threshold));
      
      setStatus(MeasurementStatus.COMPLETED);
    }
  }, [userId, targetUserId]);

  // 심장 박동수 측정 시작
  const startMeasurement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus(MeasurementStatus.MEASURING_BASELINE);
      
      // 1. 기본 심장 박동수 측정
      const baseline = await heartRateService.measureBaselineHeartRate();
      setBaselineRate(baseline);
      
      // 2. 프로필 보는 중 심장 박동수 측정
      setStatus(MeasurementStatus.MEASURING_VIEWING);
      const viewing = await heartRateService.measureHeartRateWhileViewingProfile(targetUserId);
      setViewingRate(viewing);
      
      // 3. 관심도 계산
      const result = heartRateService.calculateInterestLevel(baseline, viewing);
      setPercentageChange(result.percentageChange);
      setInterestLevel(result.interestLevel);
      
      // 4. 매칭 가능 여부 확인
      const threshold = 15; // 예시 threshold 값
      const canMatch = heartRateService.isMatchPossible(result.percentageChange, threshold);
      setMatchPossible(canMatch);
      
      // 5. 결과 저장
      const measurementData: HeartRateData = {
        userId,
        targetUserId,
        timestamp: new Date().toISOString(),
        baselineRate: baseline,
        viewingRate: viewing,
        percentageChange: result.percentageChange,
      };
      
      heartRateService.saveHeartRateData(measurementData);
      
      // 6. 콜백 호출
      if (onMeasurementComplete) {
        onMeasurementComplete(measurementData);
      }
      
      setStatus(MeasurementStatus.COMPLETED);
    } catch (error) {
      console.error('심장 박동수 측정 중 오류:', error);
      setError('측정 중 오류가 발생했습니다. 다시 시도해주세요.');
      setStatus(MeasurementStatus.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  // 측정 상태에 따른 메시지 반환
  const getStatusMessage = () => {
    switch (status) {
      case MeasurementStatus.MEASURING_BASELINE:
        return '기본 심장 박동수 측정 중... 편안하게 있어주세요. (3초)';
      case MeasurementStatus.MEASURING_VIEWING:
        return '프로필을 보면서 느끼는 심장 박동수 측정 중... (2초)';
      case MeasurementStatus.COMPLETED:
        return '측정 완료!';
      default:
        return '프로필을 보면서 심장 박동수를 측정해보세요.';
    }
  };

  // 관심도에 따른 색상 반환
  const getInterestColor = () => {
    if (!interestLevel) return 'bg-gray-200';
    
    switch (interestLevel) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">💓 심장 박동수 매칭</h3>
      
      {status === MeasurementStatus.COMPLETED ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">기본 심장 박동수</p>
              <p className="text-2xl font-bold">{baselineRate} <span className="text-sm">BPM</span></p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">프로필 열람 시</p>
              <p className="text-2xl font-bold">{viewingRate} <span className="text-sm">BPM</span></p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">심장 박동 변화</p>
              <p className={`text-2xl font-bold ${percentageChange && percentageChange >= 15 ? 'text-red-500' : 'text-gray-700'}`}>
                {percentageChange?.toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="flex justify-center items-center my-2">
            <div className={`w-16 h-16 rounded-full ${getInterestColor()} flex items-center justify-center`}>
              <svg className="w-10 h-10 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-medium">
              {matchPossible 
                ? <span className="text-green-600">이 프로필에 설렘을 느끼고 있네요! 매칭 가능합니다.</span> 
                : <span className="text-gray-600">아직 충분한 설렘을 느끼지 못했습니다.</span>
              }
            </p>
          </div>
          
          <button 
            onClick={startMeasurement}
            disabled={isLoading}
            className="btn btn-outline btn-sm w-full mt-2"
          >
            다시 측정하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            {getStatusMessage()}
          </p>
          
          {status === MeasurementStatus.MEASURING_BASELINE || status === MeasurementStatus.MEASURING_VIEWING ? (
            <div className="flex justify-center my-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-red-500 rounded-full animate-ping"></div>
              </div>
            </div>
          ) : (
            <button 
              onClick={startMeasurement}
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  측정 중...
                </>
              ) : '심장 박동수 측정하기'}
            </button>
          )}
          
          {error && (
            <div className="text-error text-sm text-center">{error}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeartRateMonitor; 