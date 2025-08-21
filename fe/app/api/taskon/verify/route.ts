import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// TaskOn API verification endpoint
// This endpoint verifies user task completion based on blockchain transactions

interface VerificationRequest {
  userId: string;
  walletAddress: string;
  taskType: 'buy' | 'swap' | 'bridge' | 'stake';
  taskId: string;
}

interface VerificationResponse {
  result: {
    isValid: boolean;
    message?: string;
    transactionHash?: string;
    amount?: string;
    timestamp?: number;
  };
}

// Smart contract addresses from your smc.md
const CONTRACTS = {
  USDT: '0x9b52D326D4866055F6c23297656002992e4293FC',
  USDC: '0x31424DB0B7a929283C394b4DA412253Ab6D61682',
  DAI: '0xdE896235F5897EC6D13Aa5b43964F9d2d34D82Fb',
  WETH: '0xc8BB7DB0a07d2146437cc20e1f3a133474546dD4',
  LIQUIDITY_POOL: '0x91C39DAA7617C5188d0427Fc82e4006803772B74',
  BUY_VAULT: '0x0adFd197aAbbC194e8790041290Be57F18d576a3',
  STAKING_REWARDS: '0xB94d264074571A5099C458f74b526d1e4EE0314B',
  BRIDGE: '0xfF064Fd496256e84b68dAE2509eDA84a3c235550',
  FAUCET: '0xE1B8C7168B0c48157A5e4B80649C5a1b83bF4cC4'
};

// TaskOn verification logic
async function verifyTaskCompletion(
  walletAddress: string,
  taskType: string,
  taskId: string
): Promise<VerificationResponse> {
  try {
    // Initialize provider (you'll need to set RPC_URL in your environment)
    const rpcUrl = process.env.HYPERION_RPC_URL || 'https://hyperion-testnet-rpc.metisdevops.link';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Verify wallet address format
    if (!ethers.utils.isAddress(walletAddress)) {
      return {
        result: {
          isValid: false,
          message: 'Invalid wallet address format'
        }
      };
    }

    // Get user's transaction history
    const currentBlock = await provider.getBlockNumber();
    const fromBlock = currentBlock - 10000; // Check last 10k blocks
    
    let isValid = false;
    let transactionHash = '';
    let amount = '';
    let timestamp = 0;

    switch (taskType) {
      case 'buy':
        // Verify BuyVault contract interaction
        const buyVaultContract = new ethers.Contract(
          CONTRACTS.BUY_VAULT,
          ['event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)'],
          provider
        );
        
        const buyEvents = await buyVaultContract.queryFilter(
          buyVaultContract.filters.TokensPurchased(walletAddress),
          fromBlock,
          currentBlock
        );
        
        if (buyEvents.length > 0) {
          isValid = true;
          transactionHash = buyEvents[0].transactionHash;
          amount = ethers.utils.formatEther(buyEvents[0].args.amount);
          timestamp = (await buyEvents[0].getBlock()).timestamp;
        }
        break;

      case 'swap':
        // Verify LiquidityPool contract interaction
        const liquidityPoolContract = new ethers.Contract(
          CONTRACTS.LIQUIDITY_POOL,
          ['event Swap(address indexed user, uint256 amountIn, uint256 amountOut)'],
          provider
        );
        
        const swapEvents = await liquidityPoolContract.queryFilter(
          liquidityPoolContract.filters.Swap(walletAddress),
          fromBlock,
          currentBlock
        );
        
        if (swapEvents.length > 0) {
          isValid = true;
          transactionHash = swapEvents[0].transactionHash;
          amount = ethers.utils.formatEther(swapEvents[0].args.amountIn);
          timestamp = (await swapEvents[0].getBlock()).timestamp;
        }
        break;

      case 'bridge':
        // Verify Bridge contract interaction
        const bridgeContract = new ethers.Contract(
          CONTRACTS.BRIDGE,
          ['event AssetBridged(address indexed user, uint256 amount, uint256 targetChainId)'],
          provider
        );
        
        const bridgeEvents = await bridgeContract.queryFilter(
          bridgeContract.filters.AssetBridged(walletAddress),
          fromBlock,
          currentBlock
        );
        
        if (bridgeEvents.length > 0) {
          isValid = true;
          transactionHash = bridgeEvents[0].transactionHash;
          amount = ethers.utils.formatEther(bridgeEvents[0].args.amount);
          timestamp = (await bridgeEvents[0].getBlock()).timestamp;
        }
        break;

      case 'stake':
        // Verify StakingRewards contract interaction
        const stakingContract = new ethers.Contract(
          CONTRACTS.STAKING_REWARDS,
          ['event Staked(address indexed user, uint256 amount)'],
          provider
        );
        
        const stakeEvents = await stakingContract.queryFilter(
          stakingContract.filters.Staked(walletAddress),
          fromBlock,
          currentBlock
        );
        
        if (stakeEvents.length > 0) {
          isValid = true;
          transactionHash = stakeEvents[0].transactionHash;
          amount = ethers.utils.formatEther(stakeEvents[0].args.amount);
          timestamp = (await stakeEvents[0].getBlock()).timestamp;
        }
        break;

      default:
        return {
          result: {
            isValid: false,
            message: 'Unsupported task type'
          }
        };
    }

    return {
      result: {
        isValid,
        message: isValid ? 'Task completed successfully' : 'Task not completed',
        transactionHash,
        amount,
        timestamp
      }
    };

  } catch (error) {
    console.error('Error verifying task completion:', error);
    return {
      result: {
        isValid: false,
        message: 'Error during verification'
      }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();
    const { userId, walletAddress, taskType, taskId } = body;

    // Validate required fields
    if (!userId || !walletAddress || !taskType || !taskId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, walletAddress, taskType, taskId' },
        { status: 400 }
      );
    }

    // Verify task completion
    const verificationResult = await verifyTaskCompletion(walletAddress, taskType, taskId);

    // Log verification attempt for monitoring
    console.log(`TaskOn verification: User ${userId}, Task ${taskType}, Result: ${verificationResult.result.isValid}`);

    return NextResponse.json(verificationResult);

  } catch (error) {
    console.error('Error in TaskOn verification API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method for testing the API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');
  const taskType = searchParams.get('taskType') as any;
  const taskId = searchParams.get('taskId') || 'test-task';
  const userId = searchParams.get('userId') || 'test-user';

  if (!walletAddress || !taskType) {
    return NextResponse.json(
      { error: 'Missing required query parameters: walletAddress, taskType' },
      { status: 400 }
    );
  }

  const verificationResult = await verifyTaskCompletion(walletAddress, taskType, taskId);
  return NextResponse.json(verificationResult);
}
