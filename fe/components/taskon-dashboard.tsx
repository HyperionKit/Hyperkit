'use client';

import React, { useState, useEffect } from 'react';
import { TASKON_TASKS, calculateUserScore, getTaskById } from '@/lib/taskon-config';

interface TaskCompletion {
  taskId: string;
  completed: boolean;
  completions: number;
  lastVerified: string;
  points: number;
}

interface UserStats {
  totalPoints: number;
  completedTasks: number;
  totalTasks: number;
  badge: 'HyperContributor' | 'HyperCoder' | 'HyperDeveloper' | 'None';
  nextMilestone: number;
}

export default function TaskOnDashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [userCompletions, setUserCompletions] = useState<TaskCompletion[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    completedTasks: 0,
    totalTasks: 0,
    badge: 'None',
    nextMilestone: 0
  });
  const [isLoading, setIsLoading] = useState(false);

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
      initializeUserProgress();
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (userCompletions.length > 0) {
      calculateStats();
    }
  }, [userCompletions]);

  const initializeUserProgress = () => {
    const initialCompletions = TASKON_TASKS.map(task => ({
      taskId: task.id,
      completed: false,
      completions: 0,
      lastVerified: '',
      points: 0
    }));
    setUserCompletions(initialCompletions);
  };

  const calculateStats = () => {
    const totalPoints = calculateUserScore(
      userCompletions.map(comp => ({
        taskId: comp.taskId,
        completions: comp.completions
      }))
    );

    const completedTasks = userCompletions.filter(comp => comp.completions > 0).length;
    const totalTasks = TASKON_TASKS.length;

    // Determine badge based on points
    let badge: UserStats['badge'] = 'None';
    let nextMilestone = 0;

    if (totalPoints >= 500) {
      badge = 'HyperDeveloper';
      nextMilestone = 0; // Max level
    } else if (totalPoints >= 200) {
      badge = 'HyperCoder';
      nextMilestone = 500;
    } else if (totalPoints >= 50) {
      badge = 'HyperContributor';
      nextMilestone = 200;
    } else {
      nextMilestone = 50;
    }

    setUserStats({
      totalPoints,
      completedTasks,
      totalTasks,
      badge,
      nextMilestone
    });
  };

  const handleVerifyAllTasks = async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const taskIds = TASKON_TASKS.map(task => task.id).join(',');
      const response = await fetch(
        `/api/taskon/verify-enhanced?walletAddress=${address}&taskId=${taskIds}&batch=true&userId=wallet:${address}`
      );

      const result = await response.json();
      
      if (result.results) {
        // Update all completions based on batch results
        setUserCompletions(prev => prev.map(comp => {
          const batchResult = result.results.find((r: any) => r.result.taskDetails?.id === comp.taskId);
          if (batchResult && batchResult.result.isValid) {
            const task = getTaskById(comp.taskId);
            return {
              ...comp,
              completed: true,
              completions: Math.min(comp.completions + 1, task?.maxCompletions || 1),
              lastVerified: new Date().toISOString(),
              points: task?.points || 0
            };
          }
          return comp;
        }));
      }
    } catch (error) {
      console.error('Batch verification error:', error);
    } finally {
      setIsLoading(false);
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

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'HyperDeveloper':
        return '🥇';
      case 'HyperCoder':
        return '🥈';
      case 'HyperContributor':
        return '🥉';
      default:
        return '⭐';
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'HyperDeveloper':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'HyperCoder':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'HyperContributor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Wallet Not Connected
        </h2>
        <p className="text-yellow-700">
          Please connect your wallet to view your TaskOn dashboard.
        </p>
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
          Please switch to Hyperion Testnet to view your TaskOn dashboard.
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
      {/* User Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.completedTasks}</div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{userStats.totalTasks}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{userStats.nextMilestone}</div>
          <div className="text-sm text-gray-600">Next Milestone</div>
        </div>
      </div>

      {/* Badge Display */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Badge</h3>
        <div className="flex items-center justify-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full border-2 ${getBadgeColor(userStats.badge)}`}>
            <span className="text-3xl mr-3">{getBadgeIcon(userStats.badge)}</span>
            <div>
              <div className="font-semibold text-lg">{userStats.badge}</div>
              {userStats.badge !== 'None' && (
                <div className="text-xs opacity-75">
                  {userStats.badge === 'HyperDeveloper' ? 'Elite Developer' :
                   userStats.badge === 'HyperCoder' ? 'Active Developer' :
                   'Entry Level Contributor'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {userStats.badge !== 'HyperDeveloper' && userStats.nextMilestone > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>🎯 {userStats.nextMilestone - userStats.totalPoints} more points to reach next badge!</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress to Next Badge</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>HyperContributor (50 pts)</span>
            <span>{userStats.totalPoints >= 50 ? '✅' : '⏳'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((userStats.totalPoints / 50) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>HyperCoder (200 pts)</span>
            <span>{userStats.totalPoints >= 200 ? '✅' : '⏳'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((userStats.totalPoints / 200) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>HyperDeveloper (500 pts)</span>
            <span>{userStats.totalPoints >= 500 ? '✅' : '⏳'}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((userStats.totalPoints / 500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Task Completion Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Task Completion Status</h3>
          <button
            onClick={handleVerifyAllTasks}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify All Tasks'}
          </button>
        </div>
        
        <div className="space-y-3">
          {userCompletions.map((completion) => {
            const task = getTaskById(completion.taskId);
            if (!task) return null;
            
            const progressPercentage = (completion.completions / task.maxCompletions) * 100;
            
            return (
              <div key={completion.taskId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
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
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Progress: {progressPercentage.toFixed(1)}% • 
                  {completion.completions >= task.maxCompletions ? ' ✅ Complete' : ' ⏳ In Progress'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleVerifyAllTasks}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Verifying...' : 'Verify All Tasks'}
          </button>
          
          <button
            onClick={() => window.open('https://hyperionkit.xyz/', '_blank')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Visit HyperKit
          </button>
        </div>
      </div>
    </div>
  );
}
