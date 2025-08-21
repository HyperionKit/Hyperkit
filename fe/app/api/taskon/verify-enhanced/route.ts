import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { TASKON_TASKS, getTaskById, CONTRACT_ADDRESSES } from '@/lib/taskon-config';

// Enhanced TaskOn verification API with advanced blockchain monitoring
// This endpoint provides more sophisticated verification logic and event filtering

interface EnhancedVerificationRequest {
  userId: string;
  walletAddress: string;
  taskId: string;
  socialMediaId?: string;
  timestamp?: number;
}

interface EnhancedVerificationResponse {
  result: {
    isValid: boolean;
    message: string;
    taskDetails?: {
      id: string;
      name: string;
      points: number;
      maxCompletions: number;
    };
    verificationData?: {
      transactionHash: string;
      amount: string;
      timestamp: number;
      blockNumber: number;
      gasUsed: string;
    };
    userProgress?: {
      currentCompletions: number;
      remainingCompletions: number;
      totalPointsEarned: number;
    };
  };
  metadata: {
    verifiedAt: string;
    blockchainNetwork: string;
    contractAddress: string;
    verificationMethod: string;
  };
}

// Enhanced verification logic with multiple validation methods
async function verifyTaskCompletionEnhanced(
  walletAddress: string,
  taskId: string,
  userId: string
): Promise<EnhancedVerificationResponse> {
  try {
    const task = getTaskById(taskId);
    if (!task) {
      return {
        result: {
          isValid: false,
          message: 'Invalid task ID'
        },
        metadata: {
          verifiedAt: new Date().toISOString(),
          blockchainNetwork: 'Hyperion Testnet',
          contractAddress: '',
          verificationMethod: 'task-validation'
        }
      };
    }

    // Initialize provider
    const rpcUrl = process.env.HYPERION_RPC_URL || 'https://hyperion-testnet-rpc.metisdevops.link';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Verify wallet address format
    if (!ethers.utils.isAddress(walletAddress)) {
      return {
        result: {
          isValid: false,
          message: 'Invalid wallet address format'
        },
        metadata: {
          verifiedAt: new Date().toISOString(),
          blockchainNetwork: 'Hyperion Testnet',
          contractAddress: task.requirements.contractAddress,
          verificationMethod: 'address-validation'
        }
      };
    }

    // Get current block and set search range
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = currentBlock - 50000; // Check last 50k blocks for better coverage
    
    let isValid = false;
    let verificationData: any = {};
    let currentCompletions = 0;

    // Enhanced event definitions for better verification
    const eventDefinitions = {
      buy: {
        contract: CONTRACT_ADDRESSES.BUY_VAULT,
        events: [
          'event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost, uint256 timestamp)',
          'event PurchaseCompleted(address indexed buyer, uint256 tokenAmount, uint256 ethAmount)'
        ],
        filter: (address: string) => ({ buyer: address })
      },
      swap: {
        contract: CONTRACT_ADDRESSES.LIQUIDITY_POOL,
        events: [
          'event Swap(address indexed user, uint256 amountIn, uint256 amountOut, uint256 fee)',
          'event LiquidityAdded(address indexed user, uint256 amount0, uint256 amount1)'
        ],
        filter: (address: string) => ({ user: address })
      },
      bridge: {
        contract: CONTRACT_ADDRESSES.BRIDGE,
        events: [
          'event AssetBridged(address indexed user, uint256 amount, uint256 targetChainId, uint256 timestamp)',
          'event BridgeInitiated(address indexed user, uint256 amount, string targetChain)'
        ],
        filter: (address: string) => ({ user: address })
      },
      stake: {
        contract: CONTRACT_ADDRESSES.STAKING_REWARDS,
        events: [
          'event Staked(address indexed user, uint256 amount, uint256 timestamp)',
          'event StakingRewardClaimed(address indexed user, uint256 reward, uint256 timestamp)'
        ],
        filter: (address: string) => ({ user: address })
      }
    };

    const taskType = task.type;
    const eventDef = eventDefinitions[taskType];

    if (eventDef) {
      // Create contract instance with multiple event definitions
      const contract = new ethers.Contract(
        eventDef.contract,
        eventDef.events,
        provider
      );

      // Query for events with the user's address
      const filter = eventDef.filter(walletAddress);
      const events = await contract.queryFilter(filter as any, fromBlock, currentBlock);

      if (events.length > 0) {
        // Sort events by block number to get the most recent
        events.sort((a, b) => b.blockNumber - a.blockNumber);
        
        const latestEvent = events[0];
        const block = await latestEvent.getBlock();
        
        // Check if the event meets minimum amount requirements
        let amount = '0';
        if (latestEvent.args && latestEvent.args.amount) {
          amount = ethers.utils.formatEther(latestEvent.args.amount);
        } else if (latestEvent.args && latestEvent.args.amountIn) {
          amount = ethers.utils.formatEther(latestEvent.args.amountIn);
        }

        // Validate minimum amount if specified
        if (task.requirements.minAmount) {
          const minAmount = parseFloat(task.requirements.minAmount);
          const eventAmount = parseFloat(amount);
          if (eventAmount >= minAmount) {
            isValid = true;
          }
        } else {
          isValid = true;
        }

        if (isValid) {
          verificationData = {
            transactionHash: latestEvent.transactionHash,
            amount: amount,
            timestamp: block.timestamp,
            blockNumber: latestEvent.blockNumber,
            gasUsed: latestEvent.gasLimit?.toString() || '0'
          };

          // Count total completions for this task type
          currentCompletions = events.length;
        }
      }
    }

    // Calculate user progress
    const remainingCompletions = Math.max(0, task.maxCompletions - currentCompletions);
    const totalPointsEarned = Math.min(currentCompletions, task.maxCompletions) * task.points;

    return {
      result: {
        isValid,
        message: isValid ? 'Task completed successfully' : 'Task not completed or requirements not met',
        taskDetails: {
          id: task.id,
          name: task.name,
          points: task.points,
          maxCompletions: task.maxCompletions
        },
        verificationData: isValid ? verificationData : undefined,
        userProgress: {
          currentCompletions,
          remainingCompletions,
          totalPointsEarned
        }
      },
      metadata: {
        verifiedAt: new Date().toISOString(),
        blockchainNetwork: 'Hyperion Testnet',
        contractAddress: task.requirements.contractAddress,
        verificationMethod: 'blockchain-event-verification'
      }
    };

  } catch (error) {
    console.error('Error in enhanced task verification:', error);
    return {
      result: {
        isValid: false,
        message: 'Error during verification process'
      },
      metadata: {
        verifiedAt: new Date().toISOString(),
        blockchainNetwork: 'Hyperion Testnet',
        contractAddress: '',
        verificationMethod: 'error-handling'
      }
    };
  }
}

// Batch verification for multiple tasks
async function verifyMultipleTasks(
  walletAddress: string,
  taskIds: string[],
  userId: string
): Promise<EnhancedVerificationResponse[]> {
  const results: EnhancedVerificationResponse[] = [];
  
  for (const taskId of taskIds) {
    const result = await verifyTaskCompletionEnhanced(walletAddress, taskId, userId);
    results.push(result);
  }
  
  return results;
}

export async function POST(request: NextRequest) {
  try {
    const body: EnhancedVerificationRequest = await request.json();
    const { userId, walletAddress, taskId, socialMediaId, timestamp } = body;

    // Validate required fields
    if (!userId || !walletAddress || !taskId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, walletAddress, taskId' },
        { status: 400 }
      );
    }

    // Verify task completion
    const verificationResult = await verifyTaskCompletionEnhanced(walletAddress, taskId, userId);

    // Log verification attempt for monitoring
    console.log(`Enhanced TaskOn verification: User ${userId}, Task ${taskId}, Result: ${verificationResult.result.isValid}`);

    return NextResponse.json(verificationResult);

  } catch (error) {
    console.error('Error in enhanced TaskOn verification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing and single task verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  const taskId = searchParams.get('taskId');
  const userId = searchParams.get('userId') || 'test-user';
  const batch = searchParams.get('batch');

  if (!walletAddress || !taskId) {
    return NextResponse.json(
      { error: 'Missing required query parameters: walletAddress, taskId' },
      { status: 400 }
    );
  }

  if (batch === 'true') {
    // Batch verification for multiple tasks
    const taskIds = taskId.split(',');
    const verificationResults = await verifyMultipleTasks(walletAddress, taskIds, userId);
    return NextResponse.json({ results: verificationResults });
  } else {
    // Single task verification
    const verificationResult = await verifyTaskCompletionEnhanced(walletAddress, taskId, userId);
    return NextResponse.json(verificationResult);
  }
}
