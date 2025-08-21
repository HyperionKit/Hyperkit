# TaskOn Integration for HyperKit

This repository contains a complete TaskOn API verification system for the HyperKit DeFi platform, enabling automated task completion verification based on blockchain transactions.

## 🚀 Features

- **Automated Task Verification**: Verify user task completion through blockchain event monitoring
- **Multi-Task Support**: Support for Buy, Swap, Bridge, and Stake tasks
- **Real-time Blockchain Monitoring**: Monitor Hyperion testnet for user interactions
- **Enhanced API Endpoints**: Both basic and advanced verification APIs
- **React Demo Component**: Interactive UI for testing the verification system
- **Comprehensive Documentation**: Complete setup and integration guides

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- HyperKit smart contracts deployed on Hyperion testnet
- TaskOn account for campaign management
- Basic understanding of blockchain and API development

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # Hyperion Testnet RPC URL
   HYPERION_RPC_URL=https://hyperion-testnet-rpc.metisdevops.link
   
   # Optional: Custom RPC endpoint
   # HYPERION_RPC_URL=https://your-custom-rpc.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## 🏗️ Architecture

### File Structure

```
├── app/api/taskon/
│   ├── verify/route.ts              # Basic verification API
│   └── verify-enhanced/route.ts     # Enhanced verification API
├── lib/
│   └── taskon-config.ts             # Task configuration and utilities
├── components/
│   └── taskon-verification-demo.tsx # React demo component
├── docs/
│   └── TASKON_INTEGRATION.md        # Comprehensive integration guide
└── public/
    └── smc.md                        # Smart contract addresses
```

### Smart Contracts

The system integrates with these verified smart contracts on Hyperion testnet:

| Contract | Address | Purpose |
|----------|---------|---------|
| **BuyVault** | `0x0adFd197aAbbC194e8790041290Be57F18d576a3` | Direct token purchases |
| **LiquidityPool** | `0x91C39DAA7617C5188d0427Fc82e4006803772B74` | Token swaps and liquidity |
| **Bridge** | `0xfF064Fd496256e84b68dAE2509eDA84a3c235550` | Cross-chain asset bridging |
| **StakingRewards** | `0xB94d264074571A5099C458f74b526d1e4EE0314B` | Token staking and rewards |

## 🎯 Task System

### Available Tasks

| Task | Points | Max Completions | Total Points | Description |
|------|--------|-----------------|--------------|-------------|
| **Buy Tokens** | 10 | 1x | 10 | Purchase tokens through BuyVault |
| **Swap Tokens** | 15 | 10x | 150 | Swap tokens through LiquidityPool |
| **Bridge Assets** | 20 | 10x | 200 | Bridge assets to other chains |
| **Stake Tokens** | 25 | 3x | 75 | Stake tokens in StakingRewards |

### Task Requirements

Each task has specific verification requirements:
- **Buy Tokens**: Minimum purchase amount of 0.001 ETH
- **Swap Tokens**: Minimum swap amount of 0.001 tokens
- **Bridge Assets**: Minimum bridge amount of 0.01 tokens
- **Stake Tokens**: Minimum stake amount of 0.1 tokens

## 🔌 API Integration

### Base URL
```
https://your-domain.com/api/taskon
```

### Endpoints

#### 1. Basic Verification API
- **Endpoint**: `/verify`
- **Method**: `POST`
- **Purpose**: Simple task completion verification

#### 2. Enhanced Verification API
- **Endpoint**: `/verify-enhanced`
- **Method**: `POST`
- **Purpose**: Advanced verification with detailed user progress

### Request Format

```json
{
  "userId": "user123",
  "walletAddress": "0x...",
  "taskId": "buy-tokens",
  "socialMediaId": "discord:123456",
  "timestamp": 1640995200
}
```

### Response Format

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

## 🧪 Testing

### Manual Testing

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the demo component**
   - Open your browser to `http://localhost:3000`
   - Import and use the `TaskOnVerificationDemo` component

3. **Test API endpoints directly**
   ```bash
   # Test single task verification
   curl -X GET "http://localhost:3000/api/taskon/verify?walletAddress=0x...&taskType=buy&taskId=buy-tokens"
   
   # Test enhanced verification
   curl -X POST "http://localhost:3000/api/taskon/verify-enhanced" \
     -H "Content-Type: application/json" \
     -d '{"userId":"test","walletAddress":"0x...","taskId":"buy-tokens"}'
   ```

### Automated Testing

```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint
```

## 🔧 Configuration

### Task Configuration

Modify `lib/taskon-config.ts` to:
- Add new task types
- Change point values
- Update completion limits
- Modify verification requirements

### API Configuration

Update API endpoints in:
- `app/api/taskon/verify/route.ts`
- `app/api/taskon/verify-enhanced/route.ts`

### Blockchain Configuration

Configure blockchain settings in:
- Environment variables
- RPC endpoints
- Contract addresses

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   ```bash
   HYPERION_RPC_URL=https://hyperion-testnet-rpc.metisdevops.link
   NODE_ENV=production
   ```

3. **Deploy to your hosting platform**
   - Vercel
   - Netlify
   - AWS
   - Custom server

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HYPERION_RPC_URL` | Hyperion testnet RPC endpoint | Yes |
| `NODE_ENV` | Environment mode | No |
| `DEBUG` | Debug logging | No |

## 📊 Monitoring

### Logging

The system logs all verification attempts with:
- User ID and wallet address
- Task type and verification result
- Timestamp and error details
- Blockchain transaction information

### Metrics

Track these key metrics:
- Verification success rate
- API response times
- Error rates by task type
- User engagement patterns
- Contract interaction volumes

## 🔒 Security

### API Security

- Input validation and sanitization
- Rate limiting (implement as needed)
- Error handling without information leakage
- Secure logging practices

### Blockchain Security

- Verified contract addresses only
- Event signature validation
- Gas limit checks
- Transaction confirmation verification

## 🆘 Troubleshooting

### Common Issues

1. **RPC Connection Failed**
   - Check `HYPERION_RPC_URL` environment variable
   - Verify RPC endpoint availability
   - Check network connectivity

2. **Task Verification Fails**
   - Verify contract addresses are correct
   - Check event signatures match contracts
   - Ensure minimum amount requirements are met

3. **API Errors**
   - Check request format and parameters
   - Verify wallet address format
   - Check task ID exists in configuration

### Debug Mode

Enable debug logging:
```bash
DEBUG=taskon:* npm run dev
```

## 📚 Documentation

- **Integration Guide**: `docs/TASKON_INTEGRATION.md`
- **API Reference**: See inline code documentation
- **TaskOn Official Docs**: [TaskOn API Guide](https://taskoncommunitys-organization.gitbook.io/guide-book/boost-engagement/task-system/general-tasks/api-task)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the docs folder and inline comments
- **Issues**: Create an issue on GitHub
- **Community**: Join the HyperKit Discord
- **Email**: support@hyperkit.com

## 🔄 Changelog

### Version 1.0.0
- Initial TaskOn integration
- Support for 4 task types
- Basic and enhanced verification APIs
- Hyperion testnet integration
- React demo component
- Comprehensive documentation

### Future Enhancements
- Multi-chain support
- Advanced analytics dashboard
- Automated reward distribution
- Social media integration
- Mobile app support
- Machine learning verification
- Real-time notifications

---

**Note**: This system is designed for the Hyperion testnet. For mainnet deployment, ensure all contracts are properly audited and verified.
