const axios = require('axios');
const { ethers } = require('ethers');

const API_URL = 'http://localhost:5173/api';
const BLOCKCHAIN_RPC = 'http://127.0.0.1:8545';

async function fullSystemCheck() {
  console.log('🔍 ImpactMatch - Full System Check\n');
  console.log('═══════════════════════════════════════════════════════\n');

  let passed = 0;
  let failed = 0;

  // 1. Check Backend API
  console.log('1️⃣  Testing Backend API...');
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`);
    if (response.status === 200) {
      console.log('   ✅ Backend API is running');
      console.log(`   📍 URL: ${API_URL}`);
      passed++;
    }
  } catch (error) {
    console.log('   ❌ Backend API is NOT responding');
    console.log(`   Error: ${error.message}`);
    failed++;
  }

  // 2. Check User Login
  console.log('\n2️⃣  Testing User Login...');
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: 'vismay@example.com',
      password: 'demo123',
    });
    if (response.status === 200 && response.data.token) {
      console.log('   ✅ User login working');
      console.log(`   👤 ${response.data.user.name} (${response.data.user.role})`);
      console.log(`   🎯 Impact Score: ${response.data.user.impactScore}`);
      passed++;
    }
  } catch (error) {
    console.log('   ❌ User login failed');
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    failed++;
  }

  // 3. Check NGO Login
  console.log('\n3️⃣  Testing NGO Login...');
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: 'ngo@greennearth.org',
      password: 'ngo123',
    });
    if (response.status === 200 && response.data.token) {
      console.log('   ✅ NGO login working');
      console.log(`   🏢 ${response.data.user.name}`);
      console.log(`   ✔️  Verified: ${response.data.user.verified}`);
      passed++;
    }
  } catch (error) {
    console.log('   ❌ NGO login failed');
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    failed++;
  }

  // 4. Check Admin Login
  console.log('\n4️⃣  Testing Admin Login...');
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: 'admin@impactmatch.com',
      password: 'admin123',
    });
    if (response.status === 200 && response.data.token) {
      console.log('   ✅ Admin login working');
      console.log(`   🛠️  ${response.data.user.name}`);
      passed++;
    }
  } catch (error) {
    console.log('   ❌ Admin login failed');
    console.log(`   Error: ${error.response?.data?.error || error.message}`);
    failed++;
  }

  // 5. Check Blockchain Connection
  console.log('\n5️⃣  Testing Blockchain Connection...');
  try {
    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC);
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    console.log('   ✅ Blockchain connected');
    console.log(`   🔗 Chain ID: ${network.chainId}`);
    console.log(`   📦 Current Block: ${blockNumber}`);
    passed++;
  } catch (error) {
    console.log('   ❌ Blockchain NOT connected');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Make sure Hardhat node is running: cd blockchain && npx hardhat node');
    failed++;
  }

  // 6. Check Smart Contract
  console.log('\n6️⃣  Testing Smart Contract...');
  try {
    require('dotenv').config();
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      throw new Error('CONTRACT_ADDRESS not set in .env');
    }

    const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC);
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      throw new Error('No contract deployed at this address');
    }

    console.log('   ✅ Smart contract deployed');
    console.log(`   📝 Address: ${contractAddress}`);
    passed++;
  } catch (error) {
    console.log('   ❌ Smart contract issue');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Run: cd blockchain && npx hardhat run scripts/deploy.js --network localhost');
    failed++;
  }

  // 7. Check Database Data
  console.log('\n7️⃣  Testing Database Data...');
  try {
    const mongoose = require('mongoose');
    require('dotenv').config();
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/impactmatch');
    
    const User = require('./models/User');
    const Cause = require('./models/Cause');
    const Match = require('./models/Match');
    
    const userCount = await User.countDocuments();
    const causeCount = await Cause.countDocuments();
    const matchCount = await Match.countDocuments();
    
    console.log('   ✅ Database connected');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🎯 Causes: ${causeCount}`);
    console.log(`   🤝 Matches: ${matchCount}`);
    
    if (userCount >= 5 && causeCount >= 10 && matchCount >= 10) {
      console.log('   ✅ Demo data is seeded');
      passed++;
    } else {
      console.log('   ⚠️  Demo data may need re-seeding');
      console.log('   💡 Run: cd impactmatch && node data/seedTestData.js');
      failed++;
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.log('   ❌ Database issue');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Make sure MongoDB is running');
    failed++;
  }

  // Final Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n📊 SYSTEM CHECK SUMMARY:\n');
  console.log(`   ✅ Passed: ${passed}/7`);
  console.log(`   ❌ Failed: ${failed}/7`);
  console.log('');

  if (failed === 0) {
    console.log('🎉 PERFECT! All systems are GO! 🚀');
    console.log('   You are ready to demo ImpactMatch!\n');
    console.log('📋 Quick Start:');
    console.log('   1. Backend: Already running ✅');
    console.log('   2. Frontend: cd client && npm run dev');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. Login: vismay@example.com / demo123\n');
  } else {
    console.log('⚠️  Some systems need attention.');
    console.log('   Check the errors above and fix them before demo.\n');
  }

  console.log('═══════════════════════════════════════════════════════\n');
}

fullSystemCheck().catch(error => {
  console.error('System check failed:', error);
  process.exit(1);
});
