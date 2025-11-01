const axios = require('axios');

async function testPartnershipEndpoint() {
  try {
    console.log('Testing GET /api/partnerships...\n');
    const response = await axios.get('http://localhost:5173/api/partnerships');
    console.log('✅ SUCCESS! Partnership endpoint is working');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ ERROR:', error.response?.status, error.response?.statusText);
    console.log('Error details:', error.message);
    if (error.response?.status === 404) {
      console.log('\n⚠️  Partnership routes are NOT loaded in the backend!');
      console.log('The server needs to be restarted after adding partnership routes.');
    }
  }
}

testPartnershipEndpoint();
