const mongoose = require('mongoose');
const User = require('./models/User');

async function testPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/impactmatch');
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'vismay@example.com' });
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', { name: user.name, email: user.email, role: user.role });
    
    // Test the password
    const password = 'demo123';
    const isValid = await user.comparePassword(password);
    console.log('\nPassword test for "demo123":', isValid ? '✅ VALID' : '❌ INVALID');

    if (!isValid) {
      console.log('\nTrying to update password to "demo123"...');
      user.password = password;
      await user.save();
      console.log('✅ Password updated successfully!');
      
      // Test again
      const userUpdated = await User.findOne({ email: 'vismay@example.com' });
      const isValidNow = await userUpdated.comparePassword(password);
      console.log('Password test after update:', isValidNow ? '✅ VALID' : '❌ INVALID');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testPassword();
