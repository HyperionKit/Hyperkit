'use client';

import React, { useState, useEffect } from 'react';
import { TASKON_TASKS, TaskOnTask, calculateUserScore } from '@/lib/taskon-config';

interface VerificationResult {
  isValid: boolean;
  message: string;
  taskDetails?: any;
  verificationData?: any;
  userProgress?: any;
}

interface TaskCompletion {
  taskId: string;
  completed: boolean;
  completions: number;
  lastVerified: string;
}

export default function TaskOnVerificationDemo() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userCompletions, setUserCompletions] = useState<TaskCompletion[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // Hyperion Testnet Chain ID
  const HYPERION_CHAIN_ID = 1337; // Update with actual Hyperion testnet chain ID

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Try to detect if MetaMask or another wallet is connected
      const checkWalletConnection = async () => {
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts && accounts.length > 0) {
              setIsConnected(true);
              setAddress(accounts[0]);
            }

            // Get current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainId, 16));
          }
        } catch (error) {
          console.log('Wallet not connected or not available');
        }
      };

      checkWalletConnection();

      // Listen for account changes
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            setIsConnected(true);
            setAddress(accounts[0]);
          } else {
            setIsConnected(false);
            setAddress(null);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          setChainId(parseInt(chainId, 16));
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      // Initialize user completions
      const initialCompletions = TASKON_TASKS.map(task => ({
        taskId: task.id,
        completed: false,
        completions: 0,
        lastVerified: ''
      }));
      setUserCompletions(initialCompletions);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (userCompletions.length > 0) {
      const score = calculateUserScore(
        userCompletions.map(comp => ({
          taskId: comp.taskId,
          completions: comp.completions
        }))
      );
      setTotalScore(score);
    }
  }, [userCompletions]);

  const handleVerifyTask = async () => {
    if (!selectedTask || !address) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/taskon/verify-enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: `wallet:${address}`,
          walletAddress: address,
          taskId: selectedTask,
          timestamp: Date.now()
        })
      });

      const result = await response.json();
      setVerificationResult(result);

      // Update user completions if verification was successful
      if (result.result.isValid) {
        setUserCompletions(prev => prev.map(comp => {
          if (comp.taskId === selectedTask) {
            return {
              ...comp,
              completed: true,
              completions: comp.completions + 1,
              lastVerified: new Date().toISOString()
            };
          }
          return comp;
        }));
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        isValid: false,
        message: 'Verification failed. Please try again.',
        taskDetails: null,
        verificationData: null,
        userProgress: null
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBatchVerification = async () => {
    if (!address) return;

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const taskIds = TASKON_TASKS.map(task => task.id).join(',');
      const response = await fetch(
        `/api/taskon/verify-enhanced?walletAddress=${address}&taskId=${taskIds}&batch=true&userId=wallet:${address}`
      );

      const result = await response.json();
      setVerificationResult(result);

      // Update all completions based on batch results
      if (result.results) {
        setUserCompletions(prev => prev.map(comp => {
          const batchResult = result.results.find((r: any) => r.result.taskDetails?.id === comp.taskId);
          if (batchResult && batchResult.result.isValid) {
            return {
              ...comp,
              completed: true,
              completions: comp.completions + 1,
              lastVerified: new Date().toISOString()
            };
          }
          return comp;
        }));
      }
    } catch (error) {
      console.error('Batch verification error:', error);
      setVerificationResult({
        isValid: false,
        message: 'Batch verification failed. Please try again.',
        taskDetails: null,
        verificationData: null,
        userProgress: null
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setIsConnected(true);
          setAddress(accounts[0]);
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${HYPERION_CHAIN_ID.toString(16)}` }],
        });
      } catch (error: any) {
        // If the chain doesn't exist, add it
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${HYPERION_CHAIN_ID.toString(16)}`,
                chainName: 'Hyperion Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://hyperion-testnet.rpc.com'], // Update with actual RPC URL
                blockExplorerUrls: ['https://hyperion-testnet.explorer.com'] // Update with actual explorer URL
              }]
            });
          } catch (addError) {
            console.error('Failed to add network:', addError);
          }
        }
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Wallet Not Connected
        </h2>
        <p className="text-yellow-700 mb-4">
          Please connect your wallet to use the TaskOn verification demo.
        </p>
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (chainId !== HYPERION_CHAIN_ID) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Wrong Network
        </h2>
        <p className="text-blue-700 mb-4">
          Please switch to Hyperion Testnet to use the TaskOn verification demo.
        </p>
        <button
          onClick={switchNetwork}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Switch to Hyperion Testnet
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Verification Demo</h2>
        <p className="text-gray-600">
          Test the TaskOn verification system with your wallet
        </p>
      </div>

      {/* Wallet Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Connected Wallet:</p>
            <p className="font-mono text-sm text-gray-900">{address}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Score:</p>
            <p className="text-lg font-bold text-blue-600">{totalScore} pts</p>
          </div>
        </div>
      </div>

      {/* Task Selection */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Task to Verify</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-select" className="block text-sm font-medium text-gray-700 mb-2">
              Task Type
            </label>
            <select
              id="task-select"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a task...</option>
              {TASKON_TASKS.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name} ({task.points} pts)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleVerifyTask}
              disabled={!selectedTask || isVerifying}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify Task'}
            </button>
          </div>
        </div>
      </div>

      {/* Batch Verification */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Batch Verification</h3>
            <p className="text-sm text-gray-600">
              Verify all tasks at once to check your complete progress
            </p>
          </div>
          <button
            onClick={handleBatchVerification}
            disabled={isVerifying}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isVerifying ? 'Verifying...' : 'Verify All Tasks'}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Result</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${verificationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {verificationResult.isValid ? '✅' : '❌'}
              </span>
              <span className={`font-medium ${verificationResult.isValid ? 'text-green-600' : 'text-red-600'}`}>
                {verificationResult.message}
              </span>
            </div>

            {verificationResult.taskDetails && (
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-gray-900 mb-2">Task Details:</h4>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(verificationResult.taskDetails, null, 2)}
                </pre>
              </div>
            )}

            {verificationResult.verificationData && (
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-gray-900 mb-2">Verification Data:</h4>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(verificationResult.verificationData, null, 2)}
                </pre>
              </div>
            )}

            {verificationResult.userProgress && (
              <div className="bg-gray-50 rounded p-3">
                <h4 className="font-medium text-gray-900 mb-2">User Progress:</h4>
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(verificationResult.userProgress, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Progress */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
        <div className="space-y-3">
          {userCompletions.map((completion) => {
            const task = TASKON_TASKS.find(t => t.id === completion.taskId);
            if (!task) return null;
            
            return (
              <div key={completion.taskId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{task.name}</h4>
                  <p className="text-sm text-gray-600">
                    {task.points} points • {completion.completions}/{task.maxCompletions} completions
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-blue-600">
                    {Math.min(completion.completions, task.maxCompletions) * task.points} pts
                  </div>
                  {completion.lastVerified && (
                    <div className="text-xs text-gray-500">
                      Last: {new Date(completion.lastVerified).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
