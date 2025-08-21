'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TaskOnWidgetProps {
  compact?: boolean;
  showPoints?: boolean;
  showBadge?: boolean;
}

// Mock data for when Wagmi is not available
const MOCK_TASKS = [
  { id: 'buy-tokens', maxCompletions: 1 },
  { id: 'swap-tokens', maxCompletions: 1 },
  { id: 'bridge-assets', maxCompletions: 1 },
  { id: 'stake-tokens', maxCompletions: 1 }
];

const calculateMockScore = (completions: Array<{ taskId: string; completions: number }>) => {
  return completions.reduce((total, comp) => {
    const task = MOCK_TASKS.find(t => t.id === comp.taskId);
    if (task) {
      return total + (comp.completions * 10); // 10 points per completion
    }
    return total;
  }, 0);
};

export default function TaskOnWidget({ 
  compact = false, 
  showPoints = true, 
  showBadge = true 
}: TaskOnWidgetProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

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
      }
    }

    // Simulate loading user data
    const mockCompletions = MOCK_TASKS.map(task => ({
      taskId: task.id,
      completions: Math.floor(Math.random() * (task.maxCompletions + 1))
    }));
    
    const score = calculateMockScore(mockCompletions);
    const completed = mockCompletions.filter(comp => comp.completions > 0).length;
    
    setTotalPoints(score);
    setCompletedTasks(completed);
  }, []);

  const getBadge = (points: number) => {
    if (points >= 500) return { name: 'HyperDeveloper', icon: '🥇', color: 'text-purple-600' };
    if (points >= 200) return { name: 'HyperCoder', icon: '🥈', color: 'text-blue-600' };
    if (points >= 50) return { name: 'HyperContributor', icon: '🥉', color: 'text-yellow-600' };
    return { name: 'Newcomer', icon: '⭐', color: 'text-gray-600' };
  };

  const badge = getBadge(totalPoints);

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Join HyperKit TaskOn</h3>
          <p className="text-sm text-blue-700 mb-3">
            Connect your wallet to start earning points and badges
          </p>
          <Link 
            href="/taskon"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium text-gray-700">TaskOn</span>
          </div>
          <Link 
            href="/taskon"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View →
          </Link>
        </div>
        {showPoints && (
          <div className="mt-2 text-center">
            <div className="text-xl font-bold text-blue-600">{totalPoints}</div>
            <div className="text-xs text-gray-500">Points</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-blue-900">Your TaskOn Progress</h3>
        <Link 
          href="/taskon"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Full Dashboard →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        {showPoints && (
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
            <div className="text-xs text-gray-500">Total Points</div>
          </div>
        )}
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-xs text-gray-500">Tasks Done</div>
        </div>
      </div>
      
      {showBadge && (
        <div className="text-center">
          <div className={`text-lg font-semibold ${badge.color}`}>
            {badge.icon} {badge.name}
          </div>
          <div className="text-xs text-gray-500">Current Badge</div>
        </div>
      )}
      
      <div className="mt-3 text-center">
        <Link 
          href="/taskon"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          Complete More Tasks
        </Link>
      </div>
    </div>
  );
}
