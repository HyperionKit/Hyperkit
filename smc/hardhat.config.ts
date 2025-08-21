import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28", 
  networks: {
    'hyperion': {
      url: 'https://hyperion-testnet.metisdevops.link',
      accounts: [process.env.PRIVATE_KEY || ''],
      chainId: 133717,
    },
    'metisSepolia': {
      url: "https://metis-sepolia-rpc.publicnode.com",
      chainId: 59902,
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  etherscan: {
    apiKey: {
      'hyperion': 'empty',
      'metisSepolia': 'empty'
    },
    customChains: [
      {
        network: "hyperion",
        chainId: 133717,
        urls: {
          apiURL: "https://hyperion-testnet-explorer-api.metisdevops.link/api",
          browserURL: "https://hyperion-testnet-explorer.metisdevops.link"
        }
      },
      {
        network: "metisSepolia",
        chainId: 59902,
        urls: {
          apiURL: "https://metis-sepolia-explorer-api.publicnode.com/api",
          browserURL: "https://metis-sepolia-explorer.publicnode.com"
        }
      }
    ]
  }
};

export default config;
