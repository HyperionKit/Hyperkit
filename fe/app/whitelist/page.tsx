"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WalletInfo {
  address: string;
  type: 'metamask' | 'okx';
}

export default function WhitelistPage() {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is already whitelisted on component mount
  useEffect(() => {
    if (walletInfo?.address) {
      checkWhitelistStatus(walletInfo.address);
    }
  }, [walletInfo]);

  const checkWhitelistStatus = async (address: string) => {
    try {
      const response = await fetch('/api/whitelist/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });
      
      const data = await response.json();
      if (data.isWhitelisted) {
        setIsJoined(true);
        setSuccess('You are already whitelisted!');
      }
    } catch (err) {
      console.error('Error checking whitelist status:', err);
    }
  };

  const connectMetamask = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
        if (accounts.length > 0) {
          setWalletInfo({
            address: accounts[0],
            type: 'metamask'
          });
          setSuccess('Metamask wallet connected successfully!');
        }
      } else {
        setError('Metamask is not installed. Please install Metamask first.');
      }
    } catch (err) {
      setError('Failed to connect Metamask wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOKX = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof (window as any).okxwallet !== 'undefined') {
        const accounts = await (window as any).okxwallet.request({ method: 'eth_requestAccounts' }) as string[];
        if (accounts.length > 0) {
          setWalletInfo({
            address: accounts[0],
            type: 'okx'
          });
          setSuccess('OKX wallet connected successfully!');
        }
      } else {
        setError('OKX wallet is not installed. Please install OKX wallet first.');
      }
    } catch (err) {
      setError('Failed to connect OKX wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const joinWhitelist = async () => {
    if (!walletInfo) return;
    
    setIsJoining(true);
    setError(null);
    
    try {
      const response = await fetch('/api/whitelist/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: walletInfo.address,
          walletType: walletInfo.type,
          timestamp: new Date().toISOString()
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsJoined(true);
        setSuccess('Successfully joined the whitelist!');
      } else {
        setError(data.error || 'Failed to join whitelist');
      }
    } catch (err) {
      setError('Failed to join whitelist. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const disconnectWallet = () => {
    setWalletInfo(null);
    setIsJoined(false);
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Join Whitelist
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect your wallet to join our exclusive whitelist and get early access to Hyperkit features.
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8"
        >
          {!walletInfo ? (
            /* Wallet Connection Section */
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-8">
                Choose your preferred wallet to continue
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                 {/* Metamask Button */}
                 <button
                   onClick={connectMetamask}
                   disabled={isConnecting}
                   className="flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                 >
                   <img 
                     src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                     alt="Metamask" 
                     className="w-6 h-6"
                   />
                   {isConnecting ? 'Connecting...' : 'Connect Metamask'}
                 </button>

                 {/* OKX Wallet Button */}
                 <button
                   onClick={connectOKX}
                   disabled={isConnecting}
                   className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                 >
                   <img 
                     src="https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo-black-and-white-300x300.webp" 
                     alt="OKX Wallet" 
                     className="w-6 h-6 rounded-full"
                   />
                   {isConnecting ? 'Connecting...' : 'Connect OKX Wallet'}
                 </button>
              </div>
            </div>
          ) : (
            /* Wallet Connected Section */
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-semibold">Wallet Connected</span>
                </div>
                <p className="text-green-700 text-sm">
                  {walletInfo.type === 'metamask' ? 'Metamask' : 'OKX Wallet'} • {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                </p>
              </div>

              {!isJoined ? (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Join the Whitelist
                  </h2>
                  <p className="text-gray-600 mb-8">
                    You're all set! Click the button below to join our whitelist.
                  </p>
                  
                  <button
                    onClick={joinWhitelist}
                    disabled={isJoining}
                    className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-6"
                  >
                    {isJoining ? 'Joining...' : 'Join Whitelist'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-violet-50 border border-violet-200 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold text-violet-800 mb-2">
                      🎉 Welcome to the Whitelist!
                    </h2>
                    <p className="text-violet-700">
                      You're now part of our exclusive community. Stay tuned for updates!
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={disconnectWallet}
                className="text-gray-500 hover:text-gray-700 underline text-sm"
              >
                Disconnect Wallet
              </button>
            </div>
          )}

          {/* Status Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <p className="text-red-700 text-center">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4"
            >
              <p className="text-green-700 text-center">{success}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            What happens next?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 text-xl font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Connect Wallet</h4>
              <p className="text-gray-600 text-sm">Connect your Metamask or OKX wallet securely</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 text-xl font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Join Whitelist</h4>
              <p className="text-gray-600 text-sm">Submit your wallet address to our whitelist</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-violet-600 text-xl font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Get Access</h4>
              <p className="text-gray-600 text-sm">Receive early access to exclusive features</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
