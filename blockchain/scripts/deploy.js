const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🚀 Starting ProofOfImpact contract deployment...\n');

  // Get network info
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();
  
  console.log('📡 Network:', network);
  console.log('👤 Deployer address:', deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log('💰 Deployer balance:', hre.ethers.formatEther(balance), 'ETH\n');

  // Deploy contract
  console.log('📝 Deploying ProofOfImpact contract...');
  const ProofOfImpact = await hre.ethers.getContractFactory('ProofOfImpact');
  const contract = await ProofOfImpact.deploy();
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log('✅ ProofOfImpact deployed to:', contractAddress);
  console.log('🔗 Transaction hash:', contract.deploymentTransaction().hash);

  // Get block info
  const deploymentBlock = contract.deploymentTransaction().blockNumber;
  console.log('📦 Deployed at block:', deploymentBlock);

  // Save deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    blockNumber: deploymentBlock,
    txHash: contract.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
  };

  // Save to JSON file
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentPath = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('💾 Deployment info saved to:', deploymentPath);

  // Update backend .env file
  const envPath = path.join(__dirname, '../../impactmatch/.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update or add CONTRACT_ADDRESS
  if (envContent.includes('CONTRACT_ADDRESS=')) {
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${contractAddress}`
    );
  } else {
    envContent += `\n# Blockchain Configuration\nCONTRACT_ADDRESS=${contractAddress}\n`;
  }

  // Add RPC URL if not present
  if (network === 'localhost' && !envContent.includes('BLOCKCHAIN_RPC=')) {
    envContent += `BLOCKCHAIN_RPC=http://127.0.0.1:8545\n`;
  } else if (network === 'mumbai' && !envContent.includes('BLOCKCHAIN_RPC=')) {
    envContent += `BLOCKCHAIN_RPC=https://rpc-mumbai.maticvigil.com\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Backend .env updated with contract address\n');

  // Print explorer links
  if (network === 'mumbai') {
    console.log('🔍 View on PolygonScan:');
    console.log(`   https://mumbai.polygonscan.com/address/${contractAddress}`);
    console.log(`   https://mumbai.polygonscan.com/tx/${contract.deploymentTransaction().hash}\n`);
  } else if (network === 'polygon') {
    console.log('🔍 View on PolygonScan:');
    console.log(`   https://polygonscan.com/address/${contractAddress}`);
    console.log(`   https://polygonscan.com/tx/${contract.deploymentTransaction().hash}\n`);
  } else {
    console.log('🔍 Local deployment - no explorer available\n');
  }

  // Test the contract
  console.log('🧪 Testing contract functions...');
  
  const testVolunteer = deployer.address;
  const testCauseId = 12345;
  const testHash = hre.ethers.id('test-impact-hash');

  console.log('📝 Recording test impact...');
  const tx = await contract.recordImpact(testVolunteer, testCauseId, testHash);
  await tx.wait();
  console.log('✅ Test impact recorded! TX:', tx.hash);

  const impactCount = await contract.getVolunteerImpactCount(testVolunteer);
  console.log('✅ Volunteer impact count:', impactCount.toString());

  const totalImpacts = await contract.totalImpacts();
  console.log('✅ Total impacts:', totalImpacts.toString());

  console.log('\n🎉 Deployment completed successfully!\n');
  console.log('📋 Next steps:');
  console.log('   1. Backend .env has been updated with CONTRACT_ADDRESS');
  console.log('   2. Restart your backend server: cd impactmatch && npm start');
  console.log('   3. Test verification flow in the app');
  
  if (network === 'mumbai') {
    console.log('\n💡 To get Mumbai testnet MATIC:');
    console.log('   https://faucet.polygon.technology/');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
