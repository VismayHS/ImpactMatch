const hre = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('🔍 Verifying contract on blockchain explorer...\n');

  const network = hre.network.name;
  const deploymentPath = path.join(__dirname, '../deployments', `${network}.json`);

  if (!fs.existsSync(deploymentPath)) {
    console.error('❌ No deployment found for network:', network);
    console.log('   Run deployment first: npm run deploy:mumbai');
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deployment.contractAddress;

  console.log('📡 Network:', network);
  console.log('📍 Contract:', contractAddress);

  if (network === 'mumbai' || network === 'polygon') {
    console.log('\n📝 Verifying on PolygonScan...');
    
    try {
      await hre.run('verify:verify', {
        address: contractAddress,
        constructorArguments: [],
      });
      
      console.log('✅ Contract verified successfully!');
      
      if (network === 'mumbai') {
        console.log(`🔗 https://mumbai.polygonscan.com/address/${contractAddress}#code`);
      } else {
        console.log(`🔗 https://polygonscan.com/address/${contractAddress}#code`);
      }
    } catch (error) {
      if (error.message.includes('Already Verified')) {
        console.log('✅ Contract already verified!');
      } else {
        console.error('❌ Verification failed:', error.message);
      }
    }
  } else {
    console.log('⚠️  Verification only available for Mumbai/Polygon networks');
    console.log('   Current network:', network);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
