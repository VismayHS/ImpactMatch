const { ethers } = require('ethers');
require('dotenv').config({ path: '../impactmatch/.env' });

const PROOF_OF_IMPACT_ABI = [
  'function recordImpact(address volunteer, uint256 causeId, bytes32 hash) external returns (bytes32)',
  'function getVolunteerImpactCount(address volunteer) external view returns (uint256)',
  'function totalImpacts() external view returns (uint256)',
  'event ImpactRecorded(address indexed volunteer, uint256 indexed causeId, bytes32 indexed hash, uint256 timestamp)',
];

async function testBlockchainIntegration() {
  console.log('🧪 Testing Blockchain Integration\n');

  try {
    // Connect to local Hardhat node
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC);
    const privateKey = process.env.PRIVATE_KEY;
    const signer = new ethers.Wallet(privateKey, provider);
    const contractAddress = process.env.CONTRACT_ADDRESS;

    console.log('📡 RPC URL:', process.env.BLOCKCHAIN_RPC);
    console.log('📝 Contract Address:', contractAddress);
    console.log('👤 Signer Address:', signer.address);

    // Check network connection
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    console.log('🌐 Network:', network.name);
    console.log('🔗 Chain ID:', network.chainId.toString());
    console.log('📦 Current Block:', blockNumber);
    console.log('');

    // Connect to contract
    const contract = new ethers.Contract(contractAddress, PROOF_OF_IMPACT_ABI, signer);

    // Check total impacts
    const totalImpacts = await contract.totalImpacts();
    console.log('📊 Total Impacts Recorded:', totalImpacts.toString());

    // Record a test impact
    console.log('\n📝 Recording test impact...');
    const testVolunteer = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Hardhat account #1
    const testCauseId = 42;
    const testHash = ethers.id('test-impact-' + Date.now());

    const tx = await contract.recordImpact(testVolunteer, testCauseId, testHash);
    console.log('⏳ Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);

    // Parse event
    const event = receipt.logs
      .map((log) => {
        try {
          return contract.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((e) => e && e.name === 'ImpactRecorded');

    if (event) {
      console.log('🎉 Impact Event Emitted:');
      console.log('   Volunteer:', event.args.volunteer);
      console.log('   Cause ID:', event.args.causeId.toString());
      console.log('   Hash:', event.args.hash);
      console.log('   Timestamp:', new Date(Number(event.args.timestamp) * 1000).toISOString());
    }

    // Check volunteer impact count
    const impactCount = await contract.getVolunteerImpactCount(testVolunteer);
    console.log('\n📊 Volunteer Impact Count:', impactCount.toString());

    // Check updated total
    const newTotal = await contract.totalImpacts();
    console.log('📊 New Total Impacts:', newTotal.toString());

    console.log('\n✅ Blockchain integration is working perfectly! ✅');
    console.log('\n💡 Your backend can now record verified impacts on the blockchain.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testBlockchainIntegration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
