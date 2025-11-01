# 🔗 ImpactMatch Blockchain

**Proof of Impact Smart Contracts** - Immutable verification of volunteer work on Polygon blockchain.

---

## 📦 Quick Setup

### 1. Install Dependencies
```bash
cd blockchain
npm install
```

### 2. Configure Environment
Add to `impactmatch/.env`:
```env
# Blockchain Configuration
BLOCKCHAIN_RPC=http://127.0.0.1:8545
CONTRACT_ADDRESS=<will be set after deployment>

# For Mumbai Testnet (optional)
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=<your-wallet-private-key>
```

---

## 🚀 Deployment Options

### Option 1: Local Development (Hardhat Network)
**Best for:** Quick testing, no gas fees, instant transactions

```bash
# Terminal 1: Start local blockchain
npm run node

# Terminal 2: Deploy contract
npm run deploy:local
```

✅ **Instant setup, no crypto needed**  
❌ **Not verifiable on public explorer**

---

### Option 2: Polygon Mumbai Testnet (FREE)
**Best for:** Demo/hackathon with real blockchain explorer

#### Step 1: Get Test MATIC
1. Create MetaMask wallet: https://metamask.io
2. Add Mumbai network to MetaMask
3. Get free test MATIC: https://faucet.polygon.technology
4. Copy your private key from MetaMask

#### Step 2: Configure `.env`
```env
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=0x<your-private-key-here>
```

#### Step 3: Deploy
```bash
npm run deploy:mumbai
```

#### Step 4: View on Explorer
```
https://mumbai.polygonscan.com/address/<CONTRACT_ADDRESS>
```

✅ **Public verification, real blockchain**  
✅ **Free testnet MATIC**  
✅ **Perfect for demos**

---

## 📜 Smart Contract Overview

### ProofOfImpact.sol

**Purpose:** Records immutable proof of volunteer impact verification

**Key Functions:**

```solidity
// Record new impact (called by NGO when verifying)
function recordImpact(
    address volunteer,
    uint256 causeId,
    bytes32 impactHash
) external returns (bytes32)

// Get all impacts for a volunteer
function getVolunteerImpacts(address volunteer) 
    external view returns (ImpactRecord[] memory)

// Get verification count for a cause
function getCauseVerificationCount(uint256 causeId) 
    external view returns (uint256)

// Verify an impact record exists
function verifyImpact(
    address volunteer,
    uint256 causeId,
    bytes32 impactHash
) external view returns (bool)
```

**Events:**
```solidity
event ImpactRecorded(
    address indexed volunteer,
    uint256 indexed causeId,
    bytes32 indexed impactHash,
    uint256 timestamp,
    address verifier
)
```

---

## 🧪 Testing

### Test Contract Functions
```bash
npm test
```

### Manual Testing via Console
```bash
npx hardhat console --network localhost

# In console:
const ProofOfImpact = await ethers.getContractFactory('ProofOfImpact');
const contract = await ProofOfImpact.attach('<CONTRACT_ADDRESS>');

// Record test impact
const tx = await contract.recordImpact(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    12345,
    ethers.id('test-hash')
);
await tx.wait();

// Check stats
const total = await contract.totalImpacts();
console.log('Total impacts:', total.toString());
```

---

## 🔧 Backend Integration

The backend (`utils/blockchain.js`) automatically uses the deployed contract:

```javascript
// When NGO verifies volunteer
const result = await recordImpact(volunteerAddress, causeId, userId);

// Returns:
{
  txHash: '0x123...abc',
  blockNumber: 12345,
  event: {
    volunteer: '0x...',
    causeId: '12345',
    timestamp: '1234567890'
  }
}
```

**Frontend displays:**
- Transaction hash with PolygonScan link
- Verification timestamp
- Blockchain proof badge

---

## 🌐 Network Details

| Network | ChainId | RPC URL | Explorer | Gas Token |
|---------|---------|---------|----------|-----------|
| Hardhat Local | 31337 | http://127.0.0.1:8545 | N/A | ETH (fake) |
| Mumbai Testnet | 80001 | https://rpc-mumbai.maticvigil.com | mumbai.polygonscan.com | MATIC (test) |
| Polygon Mainnet | 137 | https://polygon-rpc.com | polygonscan.com | MATIC (real) |

---

## 📊 Gas Costs (Mumbai Testnet)

| Operation | Gas Used | Cost (MATIC) | Cost (USD) |
|-----------|----------|--------------|------------|
| Deploy Contract | ~1,200,000 | ~0.001 MATIC | ~$0.001 |
| Record Impact | ~100,000 | ~0.0001 MATIC | ~$0.0001 |
| Get Impact Count | 0 (read) | FREE | FREE |

**Total demo cost:** Less than $0.01 for 100 verifications! 🎉

---

## 🛠️ Troubleshooting

### "Insufficient funds" Error
- **Cause:** No MATIC in deployer wallet
- **Fix:** Get test MATIC from faucet (Mumbai) or use local network

### "Contract not deployed" Error
- **Cause:** Backend can't find contract
- **Fix:** Check `CONTRACT_ADDRESS` in `.env` matches deployment

### "Network timeout" Error
- **Cause:** Can't connect to blockchain RPC
- **Fix:** Check `BLOCKCHAIN_RPC` URL, or use `http://127.0.0.1:8545` for local

### Hardhat Node Not Starting
```bash
# Kill existing process
taskkill /F /IM node.exe

# Restart
npm run node
```

---

## 🎯 For Hackathon Demo

### Recommended Setup: **Mumbai Testnet**

**Why?**
- ✅ Judges can verify on public explorer
- ✅ Real blockchain proof
- ✅ FREE (test MATIC)
- ✅ Fast transactions (2-3 seconds)

**Demo Script:**
1. User joins cause → Show in dashboard
2. NGO verifies → Click "Verify Impact"
3. **Show transaction on PolygonScan** ✨
4. Proof appears in user's Impact Dashboard with blockchain badge

**Judge Questions:**
- **"Is this real blockchain?"** → YES! Show PolygonScan link
- **"How much does it cost?"** → FREE on testnet, ~$0.0001/verification on mainnet
- **"Why Polygon?"** → Low fees, fast, Ethereum-compatible

---

## 📚 Additional Resources

- **Hardhat Docs:** https://hardhat.org/docs
- **Polygon Docs:** https://wiki.polygon.technology
- **Mumbai Faucet:** https://faucet.polygon.technology
- **PolygonScan:** https://mumbai.polygonscan.com

---

## 🔐 Security Notes

- ⚠️ **NEVER commit private keys to Git**
- ⚠️ Use `.env` for sensitive data
- ⚠️ Test on Mumbai before mainnet
- ⚠️ For production, use hardware wallet or MPC

---

**Contract deployed? Backend updated? Ready to verify!** 🚀
