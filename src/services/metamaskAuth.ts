import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// 메타마스크 인증 관련 함수
export const metamaskAuth = {
  // 메타마스크 연결 및 주소 반환
  connectWallet: async () => {
    try {
      // 사용자의 브라우저에 메타마스크가 설치되어 있는지 확인
      if (!window.ethereum) {
        throw new Error('메타마스크를 설치해주세요!');
      }

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      return {
        success: true,
        address,
        provider,
        signer
      };
    } catch (error) {
      console.error('메타마스크 연결 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // 메타마스크로 메시지 서명
  signMessage: async (message: string) => {
    try {
      if (!window.ethereum) {
        throw new Error('메타마스크를 설치해주세요!');
      }

      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });

      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(message);
      const address = await signer.getAddress();

      return {
        success: true,
        address,
        signature
      };
    } catch (error) {
      console.error('메시지 서명 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // 메타마스크 연결 확인
  checkConnection: async () => {
    try {
      if (!window.ethereum) {
        return { success: false, connected: false };
      }

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

      return {
        success: true,
        connected: false
      };
    } catch (error) {
      console.error('연결 확인 오류:', error);
      return {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  },

  // 메타마스크 연결 해제
  disconnectWallet: async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {},
      });
      
      web3Modal.clearCachedProvider();
      
      return { success: true };
    } catch (error) {
      console.error('연결 해제 오류:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }
}; 