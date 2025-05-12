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

  // Check if existing measurement data exists
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
      
      const threshold = 15; // Example threshold value
      setMatchPossible(heartRateService.isMatchPossible(existingData.percentageChange, threshold));
      
      setStatus(MeasurementStatus.COMPLETED);
    }
  }, [userId, targetUserId]);

  // Start heart rate measurement
  const startMeasurement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus(MeasurementStatus.MEASURING_BASELINE);
      
      // 1. Measure baseline heart rate
      const baseline = await heartRateService.measureBaselineHeartRate();
      setBaselineRate(baseline);
      
      // 2. Measure heart rate while viewing profile
      setStatus(MeasurementStatus.MEASURING_VIEWING);
      const viewing = await heartRateService.measureHeartRateWhileViewingProfile(targetUserId);
      setViewingRate(viewing);
      
      // 3. Calculate interest level
      const result = heartRateService.calculateInterestLevel(baseline, viewing);
      setPercentageChange(result.percentageChange);
      setInterestLevel(result.interestLevel);
      
      // 4. Check if matching is possible
      const threshold = 15; // Example threshold value
      const canMatch = heartRateService.isMatchPossible(result.percentageChange, threshold);
      setMatchPossible(canMatch);
      
      // 5. Save results
      const measurementData: HeartRateData = {
        userId,
        targetUserId,
        timestamp: new Date().toISOString(),
        baselineRate: baseline,
        viewingRate: viewing,
        percentageChange: result.percentageChange,
      };
      
      heartRateService.saveHeartRateData(measurementData);
      
      // 6. Call callback
      if (onMeasurementComplete) {
        onMeasurementComplete(measurementData);
      }
      
      setStatus(MeasurementStatus.COMPLETED);
    } catch (error) {
      console.error('Error while measuring heart rate:', error);
      setError('An error occurred during measurement. Please try again.');
      setStatus(MeasurementStatus.IDLE);
    } finally {
      setIsLoading(false);
    }
  };

  // Return message based on measurement status
  const getStatusMessage = () => {
    switch (status) {
      case MeasurementStatus.MEASURING_BASELINE:
        return 'Measuring baseline heart rate... Please relax. (3 sec)';
      case MeasurementStatus.MEASURING_VIEWING:
        return 'Measuring heart rate while viewing profile... (2 sec)';
      case MeasurementStatus.COMPLETED:
        return 'Measurement complete!';
      default:
        return 'Measure your heart rate while viewing this profile.';
    }
  };

  // Return color based on interest level
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

  // Return positive message based on heart rate change
  const getInterestMessage = () => {
    if (matchPossible) {
      return "You're feeling excitement for this profile! Matching is possible.";
    } else if (percentageChange && percentageChange > 0) {
      return "There's a spark of interest! Keep exploring their profile.";
    } else {
      return "Take your time to explore more and see if interest grows.";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">💓 Heart Rate Matching</h3>
      
      {status === MeasurementStatus.COMPLETED ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Baseline Heart Rate</p>
              <p className="text-2xl font-bold">{baselineRate} <span className="text-sm">BPM</span></p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">While Viewing Profile</p>
              <p className="text-2xl font-bold">{viewingRate} <span className="text-sm">BPM</span></p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-500">Heart Rate Change</p>
              <p className={`text-2xl font-bold ${percentageChange && percentageChange >= 5 ? 'text-red-500' : percentageChange && percentageChange < 0 ? 'text-blue-500' : 'text-gray-700'}`}>
                {percentageChange && percentageChange > 0 ? '+' : ''}{percentageChange?.toFixed(1)}%
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
              <span className={matchPossible ? 'text-green-600' : percentageChange && percentageChange > 0 ? 'text-yellow-600' : 'text-gray-600'}>
                {getInterestMessage()}
              </span>
            </p>
          </div>
          
          <button 
            onClick={startMeasurement}
            disabled={isLoading}
            className="btn btn-outline btn-sm w-full mt-2"
          >
            Measure Again
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
                  Measuring...
                </>
              ) : 'Measure Heart Rate'}
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