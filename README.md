<div align="center">

  <p style="font-size: 1.2em; max-width: 600px; margin: 0 auto 20px;">
    Comprehensive DeFi infrastructure for the Hyperion ecosystem, enabling seamless development, dual DEX compatibility (team/custom), and cross-chain interoperability with Andromeda via the Metis SDK.
  </p>

<p>
  <a href="https://www.npmjs.com/package/hyperionkit" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/v/hyperionkit?style=flat-square&color=0052FF" alt="Version" />
  </a>
  <a href="https://github.com/HyperionKit/Hyperkit">
    <img src="https://img.shields.io/github/last-commit/HyperionKit/Hyperkit?color=0052FF&style=flat-square" alt="last update" />
  </a>
  <a href="https://www.npmjs.com/package/hyperionkit" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/dm/hyperionkit?style=flat-square&color=0052FF" alt="Downloads per month" />
  </a>
  <a href="https://github.com/HyperionKit/Hyperkit/blob/master/LICENSE.md" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/npm/l/hyperionkit?style=flat-square&color=0052FF" alt="MIT License" />
  </a>
</p>

<p>
  <a href="https://x.com/HyperionKit">
    <img src="https://img.shields.io/twitter/follow/HyperionKit.svg?style=social" alt="Follow @HyperionKit" />
  </a>
  <a href="https://discord.gg/invite/hyperionkit">
      <img src="https://img.shields.io/badge/Chat%20on-Discord-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Chat on Discord" />
  </a>
  <a href="https://forum.ceg.vote/invites/nHJVeCMHSP">
      <img src="https://img.shields.io/badge/iDAO%20Forum-FF6B6B?style=flat-square&logo=discourse&logoColor=white" alt="iDAO Forum" />
  </a>
  <a href="https://github.com/HyperionKit/Hyperkit/stargazers">
    <img src="https://img.shields.io/github/stars/HyperionKit/Hyperkit" alt="stars" />
  </a>
  <a href="https://github.com/HyperionKit/Hyperkit/network/members">
    <img src="https://img.shields.io/github/forks/HyperionKit/Hyperkit" alt="forks" />
  </a>
</p>
</div>

<br />

## 🏗️ Architecture Overview

HyperKit is organized as a comprehensive monorepo containing five main modules:

### 🤖 [`ai/`](./ai) - AI-Powered Web3 Project Generator
Next.js application that generates complete Web3 applications using natural language prompts. Powered by Alith AI for seamless AI model integration, featuring live preview, blockchain integration with HyperionKit components, and multi-AI model support.

**Key Features:**
- AI-powered code generation with Alith AI wrapper supporting GPT-4/GPT-3.5
- Real-time project preview with iframe rendering
- Automatic integration of HyperionKit blockchain components
- File management and project publishing capabilities
- Multi-model AI support through Alith AI architecture

### 🔗 [`be/`](./be) - Backend API Server
NestJS-based backend service providing API endpoints and AI agent functionality for the HyperKit ecosystem.

**Key Features:**
- RESTful API with NestJS framework
- AI agent service integration with Alith AI
- Scalable TypeScript backend architecture
- Development and production deployment support

### 🌐 [`fe/`](./fe) - Frontend Dashboard
Main Next.js frontend application serving as the primary user interface for HyperKit, featuring wallet connectivity, DeFi operations, and project management.

**Key Features:**
- Wallet integration with RainbowKit and Wagmi
- DeFi operations (swap, bridge, staking, faucet)
- Google Sheets integration for data management
- TaskOn API integration for verification systems
- Responsive design with Tailwind CSS

### 📦 [`npm/`](./npm) - HyperionKit React Component Library
Published React component library (`hyperionkit` on npm) providing reusable blockchain components for rapid Web3 development.

**Key Features:**
- Pre-built React components (ConnectWallet, Swap, Bridge, Staking, Faucet)
- Ethers.js integration for blockchain interactions
- TypeScript support with full type definitions
- Rollup-based build system for optimized bundles

### ⚡ [`smc/`](./smc) - Smart Contracts
Hardhat-based smart contract development environment with OpenZeppelin integration for secure DeFi protocols.

**Key Features:**
- Hardhat development framework
- OpenZeppelin contract library integration
- TypeScript support for contract interactions
- Comprehensive testing and deployment scripts

## 📚 Documentation

For comprehensive documentation and guides, visit [hyperionkit.xyz](https://hyperkitdev.vercel.app/).

## � Quick Start

### Prerequisites
- Node.js v18+ 
- pnpm v10+ (recommended) or npm/yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HyperionKit/Hyperkit.git
   cd Hyperkit
   ```

2. **Install dependencies for all modules**
   ```bash
   pnpm install
   ```

3. **Set up individual modules** (optional, for specific development)
   ```bash
   # AI Generator
   cd ai && pnpm install && pnpm dev
   
   # Backend API
   cd be && pnpm install && pnpm start:dev
   
   # Frontend Dashboard  
   cd fe && pnpm install && pnpm dev
   
   # Smart Contracts
   cd smc && pnpm install && npx hardhat compile
   ```

### Development Workflow

**Run specific modules:**
```bash
# Run AI project generator
pnpm --filter ai dev

# Run backend API server
pnpm --filter be start:dev

# Run frontend dashboard
pnpm --filter fe dev

# Build npm package
pnpm --filter hyperionkit build
```

**Run all development servers:**
```bash
pnpm run dev
```

## 🛠️ Contributing

### Project Structure
```
Hyperkit/
├── ai/          # AI-powered Web3 project generator
├── be/          # NestJS backend API server  
├── fe/          # Next.js frontend dashboard
├── npm/         # HyperionKit React component library
└── smc/         # Hardhat smart contracts
```

### Development Guidelines

1. **Branch Naming**: Use descriptive branches (`feature/ai-generator-enhancement`, `fix/wallet-connection`)
2. **Commits**: Follow conventional commits (`feat:`, `fix:`, `docs:`, etc.)
3. **Testing**: Ensure all tests pass before submitting PRs
4. **Documentation**: Update relevant documentation for new features

### Module-Specific Development

**AI Generator (`ai/`):**
- Built with Next.js 15 and TypeScript
- Uses Zustand for state management
- Integrates with multiple AI models (GPT-4, GPT-3.5)

**Backend API (`be/`):**
- NestJS framework with TypeScript
- Alith AI integration for agent services
- RESTful API design patterns

**Frontend Dashboard (`fe/`):**
- Next.js 15 with App Router
- RainbowKit + Wagmi for wallet connectivity
- Tailwind CSS for styling

**Component Library (`npm/`):**
- React components with TypeScript
- Ethers.js for blockchain interactions
- Rollup for optimized bundling

**Smart Contracts (`smc/`):**
- Hardhat development environment
- OpenZeppelin security standards
- Comprehensive testing suite

## 🌁 Team and Community

- **HyperKit** ([X](https://x.com/HyperionKit), [Discord](https://discord.gg/invite/hyperionkit), [iDAO Forum](https://forum.ceg.vote/invites/nHJVeCMHSP))
- [ArhonJay](https://github.com/ArhonJay) 
- [Tristan-T-Dev](https://github.com/Tristan-T-Dev)
- [JustineDevs](https://github.com/JustineDevs)

## 💫 Contributors

<a href="https://github.com/HyperionKit/Hyperkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HyperionKit/Hyperkit" />
</a>

## 🌊 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details
