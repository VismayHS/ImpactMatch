const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('🧪 Testing NGO Registration for: Akshaya Patra Foundation\n');
    
    const registrationData = {
      name: 'Akshaya Patra Foundation',
      email: 'contact@akshayapatra.org',
      password: 'Test@123456',
      role: 'ngo',
      city: 'Bengaluru',
      interests: 'Hunger Relief, Education, Child Welfare',
      officeAddress: 'Akshaya Patra Bhawan, Bengaluru, Karnataka, India',
      registrationNumber: 'REG-80G-12A-2024',
      certificateUploaded: true
    };

    console.log('📝 Registration Data:');
    console.log('  Name:', registrationData.name);
    console.log('  Email:', registrationData.email);
    console.log('  City:', registrationData.city);
    console.log('  Interests:', registrationData.interests);
    console.log('\n🔄 Sending registration request...\n');

    const response = await axios.post('http://localhost:5173/api/users/register', registrationData);

    console.log('✅ Registration Response:');
    console.log('  Status:', response.status);
    console.log('  User ID:', response.data.user?._id);
    console.log('  Name:', response.data.user?.name);
    console.log('  AI Trust Score:', response.data.user?.aiTrustScore);
    console.log('  Dashboard Access:', response.data.user?.dashboardAccess);
    console.log('  Certificate Verified:', response.data.user?.certificateVerified);
    
    if (response.data.user?.aiTrustScore) {
      const score = response.data.user.aiTrustScore;
      let level = '';
      if (score >= 80) level = 'VERY HIGH';
      else if (score >= 70) level = 'HIGH';
      else if (score >= 55) level = 'MEDIUM';
      else if (score >= 40) level = 'LOW';
      else level = 'VERY LOW';
      
      console.log('  Trust Level:', level);
      console.log('\n📊 Score Breakdown:');
      console.log('    Score:', score, '/100');
      console.log('    Status:', score >= 75 ? '✅ Passed (Dashboard unlocked)' : '⚠️ Below threshold (Dashboard locked)');
    }

    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Registration failed:');
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Message:', error.response.data.message || error.response.data);
      if (error.response.data.aiError) {
        console.error('  AI Error:', error.response.data.aiError);
      }
    } else {
      console.error('  Error:', error.message);
    }
  }
};

testRegistration();
