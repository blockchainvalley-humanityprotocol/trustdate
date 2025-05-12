import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// Functions related to MetaMask authentication
export const metamaskAuth = {
  // Connect MetaMask and return address
  connectWallet: async () => {
    try {
      // Check if MetaMask is installed in user's browser
      if (typeof window === 'undefined') {
        throw new Error('Cannot connect on server side');
      }
      
      if (!window.ethereum) {
        throw new Error('메타마스크가 설치되어 있지 않습니다. 메타마스크를 설치해주세요!');
      }

      // Request account access if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (requestError) {
        console.error('User denied account access:', requestError);
        throw new Error('메타마스크 계정 접근이 거부되었습니다. 메타마스크에서 계정 접근을 허용해주세요.');
      }

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      let address;
      
      try {
        address = await signer.getAddress();
      } catch (addressError) {
        console.error('Failed to get address:', addressError);
        throw new Error('메타마스크 계정 주소를 불러오지 못했습니다. 메타마스크가 올바르게 설정되어 있는지 확인해주세요.');
      }

      return {
        success: true,
        address,
        provider,
        signer
      };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // Sign message with MetaMask
  signMessage: async (message: string) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Cannot sign on server side');
      }
      
      if (!window.ethereum) {
        throw new Error('메타마스크가 설치되어 있지 않습니다. 메타마스크를 설치해주세요!');
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (requestError) {
        console.error('User denied account access:', requestError);
        throw new Error('메타마스크 계정 접근이 거부되었습니다. 메타마스크에서 계정 접근을 허용해주세요.');
      }

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      
      let signature;
      try {
        signature = await signer.signMessage(message);
      } catch (signError) {
        console.error('User denied message signature:', signError);
        throw new Error('메시지 서명이 거부되었습니다. 메타마스크에서 메시지 서명을 확인해주세요.');
      }
      
      const address = await signer.getAddress();

      return {
        success: true,
        address,
        signature
      };
    } catch (error) {
      console.error('Message signing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // Check MetaMask connection
  checkConnection: async () => {
    try {
      if (typeof window === 'undefined') {
        return { success: false, connected: false };
      }
      
      if (!window.ethereum) {
        return { success: false, connected: false, error: '메타마스크가 설치되어 있지 않습니다.' };
      }

      // Check if already connected to an account
      let accounts;
      try {
        accounts = await window.ethereum.request({ method: 'eth_accounts' });
      } catch (error) {
        console.error('Failed to get accounts:', error);
        return { success: false, connected: false, error: '메타마스크 계정 정보를 가져오지 못했습니다.' };
      }

      if (accounts && accounts.length > 0) {
        const web3Modal = new Web3Modal({
          cacheProvider: true,
          providerOptions: {},
        });

        if (web3Modal.cachedProvider) {
          const instance = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(instance);
          const signer = provider.getSigner();
          const address = await signer.getAddress();

          return {
            success: true,
            connected: true,
            address
          };
        }
      }

      return {
        success: true,
        connected: false
      };
    } catch (error) {
      console.error('Connection check error:', error);
      return {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // Disconnect MetaMask
  disconnectWallet: async () => {
    try {
      if (typeof window === 'undefined') {
        return { success: false, error: 'Cannot disconnect on server side' };
      }
      
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });
      
      web3Modal.clearCachedProvider();
      
      return { success: true };
    } catch (error) {
      console.error('Disconnection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }
}; 