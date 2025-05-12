import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

// Functions related to MetaMask authentication
export const metamaskAuth = {
  // Connect MetaMask and return address
  connectWallet: async () => {
    try {
      // Check if MetaMask is installed in user's browser
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
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
      console.error('MetaMask connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred.'
      };
    }
  },

  // Sign message with MetaMask
  signMessage: async (message: string) => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
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
      console.error('Message signing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred.'
      };
    }
  },

  // Check MetaMask connection
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
      console.error('Connection check error:', error);
      return {
        success: false,
        connected: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred.'
      };
    }
  },

  // Disconnect MetaMask
  disconnectWallet: async () => {
    try {
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
        error: error instanceof Error ? error.message : 'An unknown error occurred.'
      };
    }
  }
}; 