<div align="center">
  <p>
    <a href="https://hyperionkit.xyz">
      <img src="https://github.com/HyperionKit/assets/raw/main/hyperkit-banner.png" width="20%" height="20%" alt="HyperKit logo vibes"/>
    </a>
  </p>

  <h1 style="font-size: 3em; margin-bottom: 20px;">
    HyperKit
  </h1>

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

## 🚀 Dual-Mode DEX Compatibility

HyperKit supports both official team DEX contracts (for hackathon/demo speed) and your own custom DEX deployments (for production, control, and reliability).

- **Switch modes** using the `DEX_MODE` environment variable or the `--dex-mode` CLI flag (`team` or `custom`).
- **Configure contract addresses and ABIs** in `be/dex.config.json`.
- All CLI/SDK flows (swap, add/remove liquidity, etc.) work in both modes.

### Example: Running CLI in Team Mode
```bash
DEX_MODE=team npx ts-node be/cli/cli/index.ts swap
# or
npx ts-node be/cli/cli/index.ts swap --dex-mode team
```

### Example: Running CLI in Custom Mode
```bash
DEX_MODE=custom npx ts-node be/cli/cli/index.ts add-liquidity
# or
npx ts-node be/cli/cli/index.ts add-liquidity --dex-mode custom
```

Update `be/dex.config.json` with your contract addresses and ABI paths for each mode.

## 📚 Full Documentation

- [Architecture Overview](smc/docs/architecture.md)
- [Onboarding Guide](smc/docs/onboarding.md)
- [Step-by-Step Tutorials](smc/docs/tutorials.md)
- [Docs Index](smc/docs/README.md)

For more documentation and guides, visit [hyperionkit.xyz](https://hyperkitdev.vercel.app/).

## 🛠️ Contributing

### Overview

This project is organized as a modular monorepo with CLI, SDKs, smart contracts, and dashboard.

### Requirements

- Node.js v18+
- pnpm v10 (or npm/yarn)

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/HyperionKit/Hyperkit.git
```

2. Install dependencies

```bash
pnpm install
```

### Running packages

To run a script in a single package, use:

```bash
pnpm --filter <package-name> <script-name>
```

To run a script in all packages:

```bash
pnpm run <script-name>
```

### Development

For local development, use the CLI and SDKs in watch mode. See the docs for more details.

## 🌁 Team and Community

- **HyperKit** ([X](https://x.com/HyperionKit), [Discord](https://discord.gg/invite/hyperionkit), [iDAO Forum](https://forum.ceg.vote/invites/nHJVeCMHSP))
- [ArhonJay](https://github.com/Tristan-T-Dev)
- [Tristan-T-Dev](https://github.com/ArhonJay)
- [JustineDevs](https://github.com/JustineDevs)

## 💫 Contributors

<a href="https://github.com/HyperionKit/Hyperkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HyperionKit/Hyperkit" />
</a>

## 🌊 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details
