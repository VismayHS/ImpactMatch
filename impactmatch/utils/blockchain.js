const crypto = require('crypto');
const { ethers } = require('ethers');

// Contract ABI (minimal - only recordImpact function)
const PROOF_OF_IMPACT_ABI = [
  'function recordImpact(address volunteer, uint256 causeId, bytes32 hash) external returns (bytes32)',
  'event ImpactRecorded(address indexed volunteer, uint256 indexed causeId, bytes32 indexed hash, uint256 timestamp)',
];

// Contract address will be set after deployment
// For now, this is a placeholder - update after running deploy script
let CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Connect to local Hardhat node
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC || 'http://127.0.0.1:8545');

// Use the first Hardhat account as default signer
let signer;

async function initializeSigner() {
  if (!signer) {
    // Hardhat's default private key for account #0
    const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    signer = new ethers.Wallet(privateKey, provider);
  }
  return signer;
}

function generateHash(userId, causeId) {
  const timestamp = Date.now();
  const data = `${userId}:${causeId}:${timestamp}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function recordImpact(volunteerAddress, causeId, userId) {
  try {
    await initializeSigner();

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, PROOF_OF_IMPACT_ABI, signer);

    // Generate unique hash for this impact record
    const hash = '0x' + generateHash(userId, causeId);

    // Convert causeId to uint256
    // If causeId is a hex string (like MongoDB ObjectId), convert it properly
    let causeIdBN;
    if (typeof causeId === 'string' && /^[0-9a-fA-F]+$/.test(causeId)) {
      // It's a hex string, convert from hex to decimal
      causeIdBN = BigInt('0x' + causeId);
    } else {
      // It's already a number or decimal string
      causeIdBN = BigInt(causeId);
    }

    console.log('Recording impact on blockchain:', {
      volunteerAddress,
      causeId: causeIdBN.toString(),
      hash,
    });

    // Call smart contract
    const tx = await contract.recordImpact(volunteerAddress, causeIdBN, hash);
    const receipt = await tx.wait();

    // Parse event from receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((e) => e && e.name === 'ImpactRecorded');

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      event: event
        ? {
            volunteer: event.args.volunteer,
            causeId: event.args.causeId.toString(),
            hash: event.args.hash,
            timestamp: event.args.timestamp.toString(),
          }
        : null,
    };
  } catch (error) {
    console.error('Blockchain recording failed:', error);
    throw new Error(`Blockchain error: ${error.message}`);
  }
}

async function getBlockchainStatus() {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    return {
      connected: true,
      network: network.name,
      chainId: network.chainId.toString(),
      blockNumber,
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
    };
  }
}

function setContractAddress(address) {
  CONTRACT_ADDRESS = address;
  console.log('Contract address updated to:', address);
}

// Optional: OpenAI embeddings integration placeholder
// Uncomment and implement when scaling to semantic search
/*
async function matchWithEmbeddings(userInterests, causes) {
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const userEmbedding = await openai.embeddings.create({
  //   model: 'text-embedding-ada-002',
  //   input: userInterests
  // });
  // 
  // Calculate cosine similarity with cause embeddings
  // Return top matches with similarity scores
  throw new Error('Embeddings not implemented - using TF-IDF for now');
}
*/

module.exports = {
  recordImpact,
  getBlockchainStatus,
  setContractAddress,
  generateHash,
};
