const axios = require('axios');

const API_URL = 'http://localhost:5173';

// Test organization login
async function testOrganisationLogin() {
  console.log('🧪 Testing Organisation Login via API\n');
  console.log('═══════════════════════════════════════════════\n');

  const testCases = [
    {
      name: 'Tech Solutions Pvt Ltd',
      email: 'techsolutions@example.com',
      password: 'tech@2024'
    },
    {
      name: 'Green Earth Industries',
      email: 'greenearth@example.com',
      password: 'green@2024'
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Email: ${testCase.email}`);
    console.log(`Password: ${testCase.password}\n`);

    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email: testCase.email,
        password: testCase.password
      });

      console.log('✅ LOGIN SUCCESSFUL');
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.user) {
        console.log('\n📋 User Details:');
        console.log('  Name:', response.data.user.name);
        console.log('  Email:', response.data.user.email);
        console.log('  Role:', response.data.user.role);
        console.log('  ID:', response.data.user.id);
        console.log('  Token:', response.data.token ? 'Generated ✓' : 'Missing ✗');
        
        if (response.data.user.role !== 'organisation') {
          console.log('⚠️  WARNING: Role is not "organisation"!');
        }
      }
      
      console.log('\n' + '─'.repeat(50) + '\n');

    } catch (error) {
      console.log('❌ LOGIN FAILED');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data);
      } else if (error.request) {
        console.log('No response received from server');
        console.log('Request:', error.request);
      } else {
        console.log('Error:', error.message);
      }
      console.log('\n' + '─'.repeat(50) + '\n');
    }
  }

  // Test with wrong password
  console.log('Testing: Wrong Password (should fail)');
  try {
    await axios.post(`${API_URL}/api/users/login`, {
      email: 'techsolutions@example.com',
      password: 'wrongpassword'
    });
    console.log('❌ UNEXPECTED: Login succeeded with wrong password!\n');
  } catch (error) {
    console.log('✅ EXPECTED: Login failed with wrong password');
    console.log('Error message:', error.response?.data?.error || 'Unknown error');
    console.log('\n' + '─'.repeat(50) + '\n');
  }

  // Test with non-existent email
  console.log('Testing: Non-existent Email (should fail)');
  try {
    await axios.post(`${API_URL}/api/users/login`, {
      email: 'nonexistent@example.com',
      password: 'anypassword'
    });
    console.log('❌ UNEXPECTED: Login succeeded with non-existent email!\n');
  } catch (error) {
    console.log('✅ EXPECTED: Login failed with non-existent email');
    console.log('Error message:', error.response?.data?.error || 'Unknown error');
    console.log('\n' + '─'.repeat(50) + '\n');
  }

  console.log('═══════════════════════════════════════════════');
  console.log('✅ API Login Tests Complete\n');
}

testOrganisationLogin();
