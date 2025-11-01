const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function debugPasswordHashing() {
  console.log('🔍 Debugging Password Hashing\n');

  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/impactmatch');
    console.log('✅ Connected to MongoDB\n');

    // Find a test user
    const user = await User.findOne({ email: 'vismay@example.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User Found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password Hash: ${user.password.substring(0, 30)}...`);
    console.log(`   Hash Length: ${user.password.length}`);
    console.log('');

    // Test password comparison
    const testPassword = 'demo123';
    console.log(`🔐 Testing password: "${testPassword}"`);
    
    const isMatch = await user.comparePassword(testPassword);
    console.log(`   Result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    console.log('');

    // Test manual bcrypt comparison
    const bcrypt = require('bcrypt');
    const manualMatch = await bcrypt.compare(testPassword, user.password);
    console.log(`🔧 Manual bcrypt.compare: ${manualMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    console.log('');

    // Test with wrong password
    const wrongResult = await user.comparePassword('wrongpassword');
    console.log(`🔐 Testing wrong password: ${wrongResult ? '✅ MATCH (BAD!)' : '❌ NO MATCH (GOOD!)'}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugPasswordHashing();
