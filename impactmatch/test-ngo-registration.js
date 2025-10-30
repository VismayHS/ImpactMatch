/**
 * NGO Registration Test Script
 * 
 * This script tests the complete NGO registration flow to identify any issues.
 * Run this with: node test-ngo-registration.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'localhost';
const API_PORT = 5173;

console.log('🧪 Testing NGO Registration Flow\n');
console.log('================================\n');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data: response, status: res.statusCode });
          } else {
            reject({ success: false, data: response, status: res.statusCode });
          }
        } catch (e) {
          reject({ success: false, error: 'Invalid JSON response', body });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testBackendHealth() {
  try {
    console.log('1️⃣ Testing backend health...');
    const response = await makeRequest('GET', '/health');
    console.log('   ✅ Backend is running:', response.data);
    return true;
  } catch (error) {
    console.error('   ❌ Backend not responding:', error.error || error.data?.error);
    console.error('   💡 Solution: Start backend with "npm start" in impactmatch folder');
    return false;
  }
}

async function testNGORegistration() {
  try {
    console.log('\n2️⃣ Testing NGO user registration...');
    const email = 'testngo' + Date.now() + '@example.com';
    
    const registerData = {
      name: 'Test NGO Organization',
      email: email,
      password: 'test123',
      city: 'Multiple Cities',
      interests: 'Social Impact',
      availability: 'full-time',
      role: 'ngo',
      certificateUploaded: true,
      verified: false,
    };

    const response = await makeRequest('POST', '/api/users/register', registerData);
    
    console.log('   ✅ NGO registered successfully');
    console.log('   📝 User ID:', response.data.userId);
    console.log('   📧 Email:', email);
    console.log('   🔑 Password: test123');
    
    return {
      success: true,
      userId: response.data.userId,
      email: email,
    };
  } catch (error) {
    console.error('   ❌ Registration failed:', error.data?.error || error.error);
    
    if (error.data?.error === 'Email already registered') {
      console.log('   💡 Email already exists, trying with different email...');
    } else if (error.error?.includes('ECONNREFUSED')) {
      console.error('   💡 Backend not running. Start it with: cd impactmatch && npm start');
    }
    
    return { success: false };
  }
}

async function testLogin(email, password) {
  try {
    console.log('\n3️⃣ Testing login with created NGO account...');
    
    const response = await makeRequest('POST', '/api/users/login', {
      email: email,
      password: password,
    });

    console.log('   ✅ Login successful');
    console.log('   👤 User:', response.data.user.name);
    console.log('   🎭 Role:', response.data.user.role);
    console.log('   ✔️ Verified:', response.data.user.verified);
    console.log('   🔑 Token:', response.data.token ? 'Generated' : 'Missing');
    
    return { success: true };
  } catch (error) {
    console.error('   ❌ Login failed:', error.data?.error || error.error);
    return { success: false };
  }
}

async function checkUploadDirectory() {
  console.log('\n4️⃣ Checking upload directory...');
  
  const uploadDir = path.join(__dirname, 'uploads', 'certificates');
  
  if (fs.existsSync(uploadDir)) {
    console.log('   ✅ Upload directory exists:', uploadDir);
    
    const files = fs.readdirSync(uploadDir);
    console.log('   📁 Files in directory:', files.length);
    
    if (files.length > 0) {
      console.log('   📄 Latest files:');
      files.slice(-3).forEach(file => {
        const stats = fs.statSync(path.join(uploadDir, file));
        console.log(`      - ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      });
    }
  } else {
    console.error('   ❌ Upload directory does not exist!');
    console.log('   💡 Creating directory...');
    
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('   ✅ Directory created successfully');
    } catch (err) {
      console.error('   ❌ Failed to create directory:', err.message);
    }
  }
}

async function runAllTests() {
  console.log('Starting comprehensive NGO registration tests...\n');
  
  // Test 1: Backend health
  const backendOk = await testBackendHealth();
  if (!backendOk) {
    console.log('\n❌ Cannot proceed without backend running');
    console.log('\n🔧 To fix:');
    console.log('   1. Open a terminal');
    console.log('   2. cd impactmatch');
    console.log('   3. npm start');
    console.log('   4. Wait for "ImpactMatch server running" message');
    console.log('   5. Run this test again\n');
    process.exit(1);
  }

  // Test 2: NGO registration
  const registration = await testNGORegistration();
  if (!registration.success) {
    console.log('\n❌ Registration failed - cannot proceed with further tests');
    process.exit(1);
  }

  // Test 3: Login
  const login = await testLogin(registration.email, 'test123');
  
  // Test 4: Upload directory
  await checkUploadDirectory();

  // Final summary
  console.log('\n================================');
  console.log('📊 Test Summary');
  console.log('================================');
  console.log('✅ Backend:       Running');
  console.log(`${registration.success ? '✅' : '❌'} Registration: ${registration.success ? 'Working' : 'Failed'}`);
  console.log(`${login.success ? '✅' : '❌'} Login:        ${login.success ? 'Working' : 'Failed'}`);
  console.log('⚠️  Upload:       Skipped (requires multipart/form-data)');
  console.log('================================\n');

  if (registration.success && login.success) {
    console.log('🎉 NGO registration is working correctly!\n');
    console.log('📝 Test NGO account created:');
    console.log(`   Email: ${registration.email}`);
    console.log('   Password: test123');
    console.log('\n💡 Next steps:');
    console.log('   1. Go to http://localhost:3000/register');
    console.log('   2. Click "NGO" tab');
    console.log('   3. Fill in the form and upload a PDF certificate');
    console.log('   4. Register and test the complete flow\n');
    console.log('📌 NOTE: Certificate upload works from the frontend (browser)');
    console.log('   but requires multipart/form-data which is complex to test via Node.js\n');
  } else {
    console.log('⚠️ Some tests failed. See errors above for details.\n');
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
