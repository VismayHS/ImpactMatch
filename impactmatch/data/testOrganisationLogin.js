const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/impactmatch';

// Test credentials
const testOrganisations = [
  { email: 'techsolutions@example.com', password: 'tech@2024' },
  { email: 'greenearth@example.com', password: 'green@2024' },
  { email: 'globaledu@example.com', password: 'edu@2024' },
  { email: 'healthcareplus@example.com', password: 'health@2024' }
];

async function testOrganisationLogin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🧪 Testing Organization Login Functionality\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let passCount = 0;
    let failCount = 0;

    for (let i = 0; i < testOrganisations.length; i++) {
      const testCred = testOrganisations[i];
      console.log(`Test ${i + 1}/${testOrganisations.length}: ${testCred.email}`);
      console.log(`${'─'.repeat(50)}`);

      // Step 1: Find user by email
      const user = await User.findOne({ email: testCred.email });
      
      if (!user) {
        console.log('❌ FAIL: User not found in database');
        console.log(`   Email: ${testCred.email}\n`);
        failCount++;
        continue;
      }

      console.log('✓ User found in database');
      console.log(`   ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   City: ${user.city}`);
      console.log(`   Verified: ${user.verified}`);

      // Step 2: Check role
      if (user.role !== 'organisation') {
        console.log(`❌ FAIL: User role is '${user.role}', expected 'organisation'\n`);
        failCount++;
        continue;
      }
      console.log('✓ Role is correct: organisation');

      // Step 3: Verify password
      const isPasswordCorrect = await user.comparePassword(testCred.password);
      
      if (!isPasswordCorrect) {
        console.log('❌ FAIL: Password verification failed');
        console.log(`   Attempted password: ${testCred.password}\n`);
        failCount++;
        continue;
      }

      console.log('✓ Password verification successful');

      // Step 4: Check dashboard access
      if (!user.dashboardAccess) {
        console.log('⚠️  WARNING: Dashboard access is disabled\n');
      } else {
        console.log('✓ Dashboard access: Enabled');
      }

      console.log('✅ LOGIN TEST PASSED\n');
      passCount++;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Test Results Summary:\n');
    console.log(`   ✅ Passed: ${passCount}/${testOrganisations.length}`);
    console.log(`   ❌ Failed: ${failCount}/${testOrganisations.length}`);
    console.log(`   Success Rate: ${((passCount / testOrganisations.length) * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (passCount === testOrganisations.length) {
      console.log('🎉 All login tests passed successfully!');
      console.log('\n✅ Database is properly configured for organization logins');
      console.log('\n🔑 You can now login with:');
      console.log('   • URL: http://localhost:3000/login/organisation');
      console.log('   • Use any of the organization credentials listed above\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the errors above.\n');
    }

    // Additional verification - Check all organization users
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 All Organizations in Database:\n');
    
    const allOrgs = await User.find({ role: 'organisation' }).select('-password');
    console.log(`Total organizations: ${allOrgs.length}\n`);
    
    allOrgs.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name}`);
      console.log(`   Email: ${org.email}`);
      console.log(`   ID: ${org._id}`);
      console.log(`   City: ${org.city}`);
      console.log(`   Verified: ${org.verified ? '✓' : '✗'}`);
      console.log(`   Dashboard Access: ${org.dashboardAccess ? '✓' : '✗'}`);
      console.log(`   Created: ${org.createdAt.toLocaleString()}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
}

testOrganisationLogin();
