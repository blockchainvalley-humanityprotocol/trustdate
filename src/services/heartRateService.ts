'use client';

import { HeartRateData } from '@/types';

// User camera-based heart rate measurement (PPG technique)

// Measure baseline heart rate (30 seconds)
export const heartRateService = {
  measureBaselineHeartRate: async (): Promise<number> => {
    try {
      // Actual implementation: Detect user's face with camera and measure heart rate using PPG technique
      // Simulation: Return random baseline heart rate between 65-80 BPM
      const baselineRate = Math.floor(Math.random() * 16) + 65;
      console.log(`Baseline heart rate: ${baselineRate}`);
      return baselineRate;
    } catch (error) {
      console.error('Error measuring baseline heart rate:', error);
      throw error;
    }
  },

  // Measure heart rate while viewing profile (15 seconds)
  measureHeartRateWhileViewingProfile: async (targetUserId: string): Promise<number> => {
    try {
      // Actual implementation: Measure user's heart rate while viewing profile
      // Simulation: Increase heart rate based on profile attractiveness
      
      // Simulate random increases by target user ID
      let increasePercentage = 0;
      
      // Use the last character of the ID to determine random range for simulation
      const lastChar = targetUserId[targetUserId.length - 1];
      const lastDigit = parseInt(lastChar, 16) || 5;
      
      if (lastDigit >= 8) {
        // High attractiveness: 15-40% increase
        increasePercentage = 15 + Math.random() * 25;
      } else if (lastDigit >= 5) {
        // Medium attractiveness: 5-20% increase
        increasePercentage = 5 + Math.random() * 15;
      } else {
        // Low attractiveness: 1-10% increase
        increasePercentage = 1 + Math.random() * 9;
      }
      
      // Apply increase to baseline heart rate of 70
      const increasedRate = Math.floor(70 * (1 + increasePercentage / 100));
      console.log(`Heart rate while viewing profile: ${increasedRate} (${increasePercentage.toFixed(1)}% increase)`);
      return increasedRate;
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