require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '../impactmatch/.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Local Hardhat Network (for development)
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 10,
        accountsBalance: '10000000000000000000000', // 10000 ETH
      },
    },
    
    // Local Hardhat Node (standalone)
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
    },

    // Polygon Mumbai Testnet (FREE - recommended for demo)
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || 'https://rpc-mumbai.maticvigil.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80001,
      gasPrice: 'auto',
    },

    // Polygon Mainnet (if you want production deployment)
    polygon: {
      url: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
