const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/impactmatch';

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@impactmatch.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      
      // Update to ensure admin role
      existingAdmin.role = 'admin';
      existingAdmin.isAdmin = true;
      existingAdmin.verified = true;
      await existingAdmin.save();
      console.log('✅ Admin role updated');
    } else {
      // Create new admin user
      const admin = new User({
        name: 'Admin User',
        email: 'admin@impactmatch.com',
        password: 'admin123', // CHANGE IN PRODUCTION!
        city: 'Mumbai',
        interests: 'platform management, verification',
        availability: 'always',
        role: 'admin',
        isAdmin: true,
        verified: true,
        impactScore: 0,
        badges: ['ADMIN'],
        joinedCauses: [],
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log('   Email: admin@impactmatch.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the admin password in production!');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();
