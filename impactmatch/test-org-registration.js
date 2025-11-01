const axios = require('axios');

const API_URL = 'http://localhost:5173';

// Test organization registration
async function testOrgRegistration() {
  console.log('🧪 Testing Organization Registration via API\n');
  console.log('═══════════════════════════════════════════════\n');

  const testOrg = {
    name: 'Test Tech Solutions',
    email: `testorg${Date.now()}@example.com`, // Unique email
    password: 'test@2024',
    city: 'Bangalore',
    officeAddress: 'Test Park, Whitefield, Bangalore - 560066',
    interests: 'Corporate Social Responsibility',
    availability: 'full-time',
    role: 'organisation'
  };

  console.log('Registering organization with data:');
  console.log(JSON.stringify(testOrg, null, 2));
  console.log('\n' + '─'.repeat(50) + '\n');

  try {
    const response = await axios.post(`${API_URL}/api/users/register`, testOrg);

    console.log('✅ REGISTRATION SUCCESSFUL');
    console.log('Response Status:', response.status);
    console.log('\n📋 Response Data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.user) {
      console.log('\n📊 User Details:');
      console.log('  Name:', response.data.user.name);
      console.log('  Email:', response.data.user.email);
      console.log('  Role:', response.data.user.role);
      console.log('  City:', response.data.user.city);
      console.log('  ID:', response.data.user.id);
      console.log('  Verified:', response.data.user.verified);
      console.log('  Dashboard Access:', response.data.user.dashboardAccess);
      console.log('  Token:', response.data.token ? 'Generated ✓' : 'Missing ✗');
      
      if (response.data.user.role !== 'organisation') {
        console.log('⚠️  WARNING: Role is not "organisation"!');
      }
      
      if (!response.data.user.verified) {
        console.log('⚠️  WARNING: Organization should be auto-verified!');
      }
      
      if (!response.data.user.dashboardAccess) {
        console.log('⚠️  WARNING: Organization should have dashboard access!');
      }
    }
    
    console.log('\n' + '═'.repeat(50));
    console.log('✅ Organization Registration Test: PASSED');
    console.log('═'.repeat(50) + '\n');

  } catch (error) {
    console.log('❌ REGISTRATION FAILED');
    console.log('\n' + '═'.repeat(50));
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Status Text:', error.response.statusText);
      console.log('\nError Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 500) {
        console.log('\n🔍 SERVER ERROR DETAILS:');
        console.log('This is a server-side error. Check backend logs for details.');
      }
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Is the backend running on port 5173?');
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('═'.repeat(50));
    console.log('❌ Organization Registration Test: FAILED');
    console.log('═'.repeat(50) + '\n');
    
    process.exit(1);
  }
}

testOrgRegistration();
