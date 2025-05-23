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
    if (!percentageChange) return 'bg-gray-200';
    
    if (percentageChange > 0) {
      // Heart rate increased - use red color scale
      if (percentageChange >= 20) {
        return 'bg-red-600'; // High increase
      } else if (percentageChange >= 10) {
        return 'bg-red-500'; // Medium increase
      } else {
        return 'bg-red-400'; // Low increase
      }
    } else {
      // Heart rate decreased - use blue color scale
      if (percentageChange <= -10) {
        return 'bg-blue-600'; // High decrease
      } else if (percentageChange <= -5) {
        return 'bg-blue-500'; // Medium decrease
      } else {
        return 'bg-blue-400'; // Low decrease
      }
    }
  };

  // Return positive message based on heart rate change
  const getInterestMessage = () => {
    if (matchPossible) {
      return "Your heart rate increased significantly! Matching is possible!";
    } else if (percentageChange && percentageChange > 0) {
      return "Your heart rate increased, but not enough for matching.";
    } else {
      return "Your heart rate didn't increase. Try viewing the profile again.";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4">
      <h3 className="text-lg font-semibold mb-2">💓 Heart Rate Matching</h3>
      
      {status === MeasurementStatus.COMPLETED ? (
        <div className="space-y-4">
          <div className={`p-3 rounded-lg text-center ${matchPossible ? 'bg-green-100 text-green-800' : percentageChange && percentageChange > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-semibold">
              {matchPossible ? 'Match Eligible!' : 'Not Eligible for Matching'}
            </p>
            <p className="text-sm">
              {matchPossible ? 'Your heart rate increased by 15% or more' : 'Your heart rate must increase by at least 15%'}
            </p>
          </div>
          
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
              <p className={`text-2xl font-bold ${percentageChange && percentageChange >= 15 ? 'text-green-500' : percentageChange && percentageChange >= 5 ? 'text-yellow-500' : percentageChange && percentageChange < 0 ? 'text-blue-500' : 'text-gray-700'}`}>
                {percentageChange && percentageChange > 0 ? '+' : ''}{percentageChange?.toFixed(1)}%
              </p>
            </div>
          </div>
          
          <div className="flex justify-center items-center my-2">
            <div className={`w-16 h-16 rounded-full ${getInterestColor()} flex items-center justify-center`}>
              <svg className={`w-10 h-10 text-white ${matchPossible ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <p className="font-medium">
              <span className={matchPossible ? 'text-green-600' : percentageChange && percentageChange > 0 ? 'text-yellow-600' : 'text-red-600'}>
                {getInterestMessage()}
              </span>
            </p>
          </div>
          
          <button 
            onClick={startMeasurement}
            disabled={isLoading}
            className={`btn w-full mt-2 ${matchPossible ? 'btn-success' : 'btn-outline'}`}
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