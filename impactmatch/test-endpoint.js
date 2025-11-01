const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5173,
  path: '/api/partnerships',
  method: 'GET'
};

console.log('Testing GET http://localhost:5173/api/partnerships\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS! Partnership endpoint is working');
      console.log('Response:', data);
    } else if (res.statusCode === 404) {
      console.log('❌ 404 NOT FOUND - Partnership routes NOT loaded!');
      console.log('Response:', data);
    } else {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n⚠️  Backend server might not be running on port 5173');
});

req.end();
