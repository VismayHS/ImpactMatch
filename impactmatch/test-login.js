const axios = require('axios');

const API_URL = 'http://localhost:5173/api';

const testAccounts = [
  {
    name: 'User Account #1 (Vismay)',
    email: 'vismay@example.com',
    password: 'demo123',
    expectedRole: 'user',
  },
  {
    name: 'User Account #2 (Priya)',
    email: 'priya@example.com',
    password: 'demo123',
    expectedRole: 'user',
  },
  {
    name: 'NGO Account (Verified)',
    email: 'ngo@greennearth.org',
    password: 'ngo123',
    expectedRole: 'ngo',
  },
  {
    name: 'NGO Account (Pending)',
    email: 'ngo@hopefoundation.org',
    password: 'ngo123',
    expectedRole: 'ngo',
  },
  {
    name: 'Admin Account',
    email: 'admin@impactmatch.com',
    password: 'admin123',
    expectedRole: 'admin',
  },
];

async function testLogin() {
  console.log('🧪 Testing Login Functionality\n');
  console.log('═══════════════════════════════════════════════════════');

  let passCount = 0;
  let failCount = 0;

  for (const account of testAccounts) {
    try {
      console.log(`\n🔐 Testing: ${account.name}`);
      console.log(`   Email: ${account.email}`);
      console.log(`   Password: ${account.password}`);

      const response = await axios.post(`${API_URL}/users/login`, {
        email: account.email,
        password: account.password,
      });

      if (response.status === 200 && response.data.token) {
        console.log(`   ✅ LOGIN SUCCESS`);
        console.log(`   👤 Name: ${response.data.user.name}`);
        console.log(`   🏷️  Role: ${response.data.user.role}`);
        console.log(`   ✔️  Verified: ${response.data.user.verified}`);
        console.log(`   🎯 Impact Score: ${response.data.user.impactScore}`);
        console.log(`   🏆 Badges: ${response.data.user.badges.join(', ') || 'None'}`);
        console.log(`   🔑 Token: ${response.data.token.substring(0, 20)}...`);
        
        if (response.data.user.role === account.expectedRole) {
          console.log(`   ✅ Role matches expected: ${account.expectedRole}`);
        } else {
          console.log(`   ⚠️  Role mismatch! Expected: ${account.expectedRole}, Got: ${response.data.user.role}`);
        }
        
        passCount++;
      } else {
        console.log(`   ❌ LOGIN FAILED - Unexpected response`);
        failCount++;
      }
    } catch (error) {
      console.log(`   ❌ LOGIN FAILED`);
      if (error.response) {
        console.log(`   Error: ${error.response.data.error || error.response.statusText}`);
        console.log(`   Status: ${error.response.status}`);
      } else if (error.code) {
        console.log(`   Error Code: ${error.code}`);
        console.log(`   Error Message: ${error.message}`);
      } else {
        console.log(`   Error: ${error.message}`);
        console.log(`   Full Error:`, error);
      }
      failCount++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('\n📊 TEST SUMMARY:');
  console.log(`   ✅ Passed: ${passCount}/${testAccounts.length}`);
  console.log(`   ❌ Failed: ${failCount}/${testAccounts.length}`);
  
  if (failCount === 0) {
    console.log('\n🎉 All login tests passed! Authentication is working perfectly! 🎉\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  }

  // Test invalid login
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n🧪 Testing Invalid Login (should fail):\n');
  
  try {
    await axios.post(`${API_URL}/users/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    console.log('❌ SECURITY ISSUE: Invalid login was accepted!');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Invalid login correctly rejected');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.error}`);
    } else {
      console.log('⚠️  Unexpected error:', error.message);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════\n');
}

testLogin().catch(console.error);
