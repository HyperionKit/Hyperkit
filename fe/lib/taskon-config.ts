// TaskOn Configuration for HyperKit DeFi Platform
// This file defines all tasks, verification requirements, and scoring system

export interface TaskOnTask {
  id: string;
  name: string;
  description: string;
  type: 'buy' | 'swap' | 'bridge' | 'stake';
  points: number;
  maxCompletions: number;
  totalPoints: number;
  verificationEndpoint: string;
  requirements: {
    minAmount?: string;
    tokenAddress?: string;
    contractAddress: string;
  };
  rewards?: {
    tokens?: string[];
    nfts?: string[];
    specialAccess?: string[];
  };
}

export interface TaskOnCampaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: string[];
  totalRewardPool: number;
  participants: number;
  status: 'active' | 'completed' | 'upcoming';
}

// Smart contract addresses from smc.md
export const CONTRACT_ADDRESSES = {
  USDT: '0x9b52D326D4866055F6c23297656002992e4293FC',
  USDC: '0x31424DB0B7a929283C394b4DA412253Ab6D61682',
  DAI: '0xdE896235F5897EC6D13Aa5b43964F9d2d34D82Fb',
  WETH: '0xc8BB7DB0a07d2146437cc20e1f3a133474546dD4',
  LIQUIDITY_POOL: '0x91C39DAA7617C5188d0427Fc82e4006803772B74',
  BUY_VAULT: '0x0adFd197aAbbC194e8790041290Be57F18d576a3',
  STAKING_REWARDS: '0xB94d264074571A5099C458f74b526d1e4EE0314B',
  BRIDGE: '0xfF064Fd496256e84b68dAE2509eDA84a3c235550',
  FAUCET: '0xE1B8C7168B0c48157A5e4B80649C5a1b83bF4cC4'
} as const;

// Task definitions based on your scoring system
export const TASKON_TASKS: TaskOnTask[] = [
  {
    id: 'buy-tokens',
    name: 'Buy Tokens',
    description: 'Purchase tokens through the BuyVault contract',
    type: 'buy',
    points: 10,
    maxCompletions: 1,
    totalPoints: 10,
    verificationEndpoint: '/api/taskon/verify',
    requirements: {
      contractAddress: CONTRACT_ADDRESSES.BUY_VAULT,
      minAmount: '0.001' // Minimum purchase amount
    },
    rewards: {
      tokens: ['USDT', 'USDC'],
      specialAccess: ['Early access to new features']
    }
  },
  {
    id: 'swap-tokens',
    name: 'Swap Tokens',
    description: 'Swap tokens through the LiquidityPool contract (can be done 10x)',
    type: 'swap',
    points: 15,
    maxCompletions: 10,
    totalPoints: 150,
    verificationEndpoint: '/api/taskon/verify',
    requirements: {
      contractAddress: CONTRACT_ADDRESSES.LIQUIDITY_POOL,
      minAmount: '0.001'
    },
    rewards: {
      tokens: ['WETH', 'DAI'],
      specialAccess: ['VIP trading fees']
    }
  },
  {
    id: 'bridge-assets',
    name: 'Bridge Assets',
    description: 'Bridge assets to other chains through the Bridge contract (can be done 10x)',
    type: 'bridge',
    points: 20,
    maxCompletions: 10,
    totalPoints: 200,
    verificationEndpoint: '/api/taskon/verify',
    requirements: {
      contractAddress: CONTRACT_ADDRESSES.BRIDGE,
      minAmount: '0.01'
    },
    rewards: {
      tokens: ['Cross-chain tokens'],
      specialAccess: ['Multi-chain features access']
    }
  },
  {
    id: 'stake-tokens',
    name: 'Stake Tokens',
    description: 'Stake tokens in the StakingRewards contract (can be done 3x)',
    type: 'stake',
    points: 25,
    maxCompletions: 3,
    totalPoints: 75,
    verificationEndpoint: '/api/taskon/verify',
    requirements: {
      contractAddress: CONTRACT_ADDRESSES.STAKING_REWARDS,
      minAmount: '0.1'
    },
    rewards: {
      tokens: ['Staking rewards'],
      specialAccess: ['Governance voting rights']
    }
  }
];

// Campaign definitions
export const TASKON_CAMPAIGNS: TaskOnCampaign[] = [
  {
    id: 'hyperkit-launch-campaign',
    name: 'HyperKit Launch Campaign',
    description: 'Complete tasks to earn points and unlock rewards in the HyperKit ecosystem',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T23:59:59Z',
    tasks: ['buy-tokens', 'swap-tokens', 'bridge-assets', 'stake-tokens'],
    totalRewardPool: 1000000, // Total points available
    participants: 0,
    status: 'active'
  }
];

// Task verification helper functions
export function getTaskById(taskId: string): TaskOnTask | undefined {
  return TASKON_TASKS.find(task => task.id === taskId);
}

export function getCampaignById(campaignId: string): TaskOnCampaign | undefined {
  return TASKON_CAMPAIGNS.find(campaign => campaign.id === campaignId);
}

export function calculateUserScore(completedTasks: Array<{ taskId: string; completions: number }>): number {
  let totalScore = 0;
  
  completedTasks.forEach(({ taskId, completions }) => {
    const task = getTaskById(taskId);
    if (task) {
      const actualCompletions = Math.min(completions, task.maxCompletions);
      totalScore += task.points * actualCompletions;
    }
  });
  
  return totalScore;
}

export function getAvailableTasks(): TaskOnTask[] {
  return TASKON_TASKS.filter(task => task.status !== 'disabled');
}

// API response templates for TaskOn integration
export const TASKON_API_RESPONSES = {
  SUCCESS: {
    result: {
      isValid: true
    }
  },
  FAILURE: {
    result: {
      isValid: false
    }
  },
  ERROR: {
    error: 'Verification failed'
  }
};

// Task completion tracking
export interface TaskCompletion {
  userId: string;
  walletAddress: string;
  taskId: string;
  completedAt: string;
  transactionHash: string;
  amount: string;
  points: number;
}

// Export types for use in other files
export type TaskType = TaskOnTask['type'];
export type TaskStatus = 'pending' | 'completed' | 'failed';
