# TaskOn Integration Guide for HyperKit

This document provides comprehensive guidance for integrating TaskOn's API verification system with the HyperKit DeFi platform.

## Overview

TaskOn is a Web3 task platform that allows projects to create and verify user engagement tasks. HyperKit integrates with TaskOn to verify user transactions on-chain and distribute rewards based on completed tasks.

## Smart Contracts Integration

### Verified Contract Addresses

All smart contracts are deployed and verified on the Hyperion Testnet:

| Contract | Address | Type | Verification |
|----------|---------|------|--------------|
| **USDT** | `0x9b52D326D4866055F6c23297656002992e4293FC` | Token | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0x9b52D326D4866055F6c23297656002992e4293FC) |
| **USDC** | `0x31424DB0B7a929283C394b4DA412253Ab6D61682` | Token | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0x31424DB0B7a929283C394b4DA412253Ab6D61682) |
| **DAI** | `0xdE896235F5897EC6D13Aa5b43964F9d2d34D82Fb` | Token | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0xdE896235F5897EC6D13Aa5b43964F9d2d34D82Fb) |
| **WETH** | `0xc8BB7DB0a07d2146437cc20e1f3a133474546dD4` | Token | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0xc8BB7DB0a07d2146437cc20e1f3a133474546dD4) |
| **LiquidityPool** | `0x91C39DAA7617C5188d0427Fc82e4006803772B74` | AMM/Swap | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0x91C39DAA7617C5188d0427Fc82e4006803772B74) |
| **BuyVault** | `0x0adFd197aAbbC194e8790041290Be57F18d576a3` | Direct Purchase | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0x0adFd197aAbbC194e8790041290Be57F18d576a3#code) |
| **StakingRewards** | `0xB94d264074571A5099C458f74b526d1e4EE0314B` | Staking | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0xB94d264074571A5099C458f74b526d1e4EE0314B#code) |
| **Bridge** | `0xfF064Fd496256e84b68dAE2509eDA84a3c235550` | Cross-Chain | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0xfF064Fd496256e84b68dAE2509eDA84a3c235550#code) |
| **Faucet** | `0xE1B8C7168B0c48157A5e4B80649C5a1b83bF4cC4` | Token Distribution | [Verified](https://hyperion-testnet-explorer.metisdevops.link/address/0xE1B8C7168B0c48157A5e4B80649C5a1b83bF4cC4) |

## Task Definitions

### Available Tasks

| Task | Points | Max Completions | Total Points | Description |
|------|--------|-----------------|--------------|-------------|
| **Buy Tokens** | 10 | 1x | 10 | Purchase tokens through BuyVault |
| **Swap Tokens** | 15 | 10x | 150 | Swap tokens through LiquidityPool |
| **Bridge Assets** | 20 | 10x | 200 | Bridge assets to other chains |
| **Stake Tokens** | 25 | 3x | 75 | Stake tokens in StakingRewards |

### Task Requirements

Each task has specific requirements that must be met for verification:

- **Buy Tokens**: Minimum purchase amount of 0.001 ETH
- **Swap Tokens**: Minimum swap amount of 0.001 tokens
- **Bridge Assets**: Minimum bridge amount of 0.01 tokens
- **Stake Tokens**: Minimum stake amount of 0.1 tokens

## API Integration

### Base URL

```
https://your-domain.com/api/taskon
```

### Endpoints

#### 1. Basic Verification API

**Endpoint**: `/verify`

**Method**: `POST`

**Request Body**:
```json
{
  "userId": "user123",
  "walletAddress": "0x...",
  "taskType": "buy",
  "taskId": "buy-tokens"
}
```

**Response**:
```json
{
  "result": {
    "isValid": true,
    "message": "Task completed successfully",
    "transactionHash": "0x...",
    "amount": "0.001",
    "timestamp": 1640995200
  }
}
```

#### 2. Enhanced Verification API

**Endpoint**: `/verify-enhanced`

**Method**: `POST`

**Request Body**:
```json
{
  "userId": "user123",
  "walletAddress": "0x...",
  "taskId": "buy-tokens",
  "socialMediaId": "discord:123456",
  "timestamp": 1640995200
}
```

**Response**:
```json
{
  "result": {
    "isValid": true,
    "message": "Task completed successfully",
    "taskDetails": {
      "id": "buy-tokens",
      "name": "Buy Tokens",
      "points": 10,
      "maxCompletions": 1
    },
    "verificationData": {
      "transactionHash": "0x...",
      "amount": "0.001",
      "timestamp": 1640995200,
      "blockNumber": 12345,
      "gasUsed": "21000"
    },
    "userProgress": {
      "currentCompletions": 1,
      "remainingCompletions": 0,
      "totalPointsEarned": 10
    }
  },
  "metadata": {
    "verifiedAt": "2024-01-01T00:00:00.000Z",
    "blockchainNetwork": "Hyperion Testnet",
    "contractAddress": "0x0adFd197aAbbC194e8790041290Be57F18d576a3",
    "verificationMethod": "blockchain-event-verification"
  }
}
```

### Testing the API

#### GET Method for Testing

**Single Task Verification**:
```
GET /api/taskon/verify?walletAddress=0x...&taskType=buy&taskId=buy-tokens&userId=test-user
```

**Batch Verification**:
```
GET /api/taskon/verify-enhanced?walletAddress=0x...&taskId=buy-tokens,swap-tokens&batch=true&userId=test-user
```

## TaskOn Platform Setup

### 1. Create Task in TaskOn Dashboard

1. Log into your TaskOn admin dashboard
2. Navigate to "Create Task" section
3. Select "API Task" as the task type
4. Configure task parameters:
   - **Task Name**: "Buy Tokens on HyperKit"
   - **Description**: "Purchase tokens through the HyperKit BuyVault contract"
   - **User Identification**: Wallet Address
   - **Blockchain Network**: Hyperion Testnet
   - **Verification API URL**: `https://your-domain.com/api/taskon/verify`

### 2. Configure API Parameters

In TaskOn, set the following API configuration:

- **Request Method**: POST
- **Request Headers**: 
  ```
  Content-Type: application/json
  ```
- **Request Body Template**:
  ```json
  {
    "userId": "{{userId}}",
    "walletAddress": "{{walletAddress}}",
    "taskType": "buy",
    "taskId": "buy-tokens"
  }
  ```

### 3. Expected Response Format

TaskOn expects the response to match this format:
```json
{
  "result": {
    "isValid": true
  }
}
```

## Environment Configuration

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Hyperion Testnet RPC URL
HYPERION_RPC_URL=https://hyperion-testnet-rpc.metisdevops.link

# Optional: Custom RPC endpoint
# HYPERION_RPC_URL=https://your-custom-rpc.com
```

### RPC Endpoints

- **Public RPC**: `https://hyperion-testnet-rpc.metisdevops.link`
- **WebSocket**: `wss://hyperion-testnet-rpc.metisdevops.link`
- **Explorer**: `https://hyperion-testnet-explorer.metisdevops.link`

## Verification Process

### How It Works

1. **User Action**: User performs an action (buy, swap, bridge, stake)
2. **Transaction**: Transaction is recorded on the Hyperion blockchain
3. **TaskOn Request**: TaskOn sends verification request to your API
4. **Blockchain Query**: API queries blockchain for relevant events
5. **Verification**: API verifies task completion based on events
6. **Response**: API returns verification result to TaskOn
7. **Reward**: TaskOn distributes rewards if verification passes

### Event Monitoring

The API monitors these specific blockchain events:

- **BuyVault**: `TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)`
- **LiquidityPool**: `Swap(address indexed user, uint256 amountIn, uint256 amountOut)`
- **Bridge**: `AssetBridged(address indexed user, uint256 amount, uint256 targetChainId)`
- **StakingRewards**: `Staked(address indexed user, uint256 amount)`

## Security Considerations

### API Security

- Implement rate limiting to prevent abuse
- Use API keys for authentication if needed
- Validate all input parameters
- Log all verification attempts for monitoring

### Blockchain Security

- Verify contract addresses before deployment
- Use verified contracts only
- Monitor for suspicious transactions
- Implement proper error handling

## Monitoring and Analytics

### Logging

All verification attempts are logged with the following information:
- User ID
- Wallet address
- Task type
- Verification result
- Timestamp
- Error details (if any)

### Metrics to Track

- Verification success rate
- API response times
- Error rates by task type
- User engagement patterns
- Contract interaction volumes

## Troubleshooting

### Common Issues

1. **Invalid Wallet Address**: Ensure wallet address format is correct
2. **Task Not Found**: Verify task ID exists in configuration
3. **RPC Connection**: Check RPC endpoint availability
4. **Event Not Found**: Verify contract events match expected format

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=taskon:*
```

## Support and Resources

### Documentation

- [TaskOn API Guide](https://taskoncommunitys-organization.gitbook.io/guide-book/boost-engagement/task-system/general-tasks/api-task)
- [Hyperion Testnet Explorer](https://hyperion-testnet-explorer.metisdevops.link)
- [Ethers.js Documentation](https://docs.ethers.io/)

### Community

- TaskOn Community: [GitBook](https://taskoncommunitys-organization.gitbook.io/)
- HyperKit Discord: [Join Here]
- Technical Support: [support@hyperkit.com]

## Changelog

### Version 1.0.0 (Current)
- Initial TaskOn integration
- Support for 4 task types
- Basic and enhanced verification APIs
- Hyperion testnet integration
- Comprehensive event monitoring

### Future Enhancements
- Multi-chain support
- Advanced analytics dashboard
- Automated reward distribution
- Social media integration
- Mobile app support
