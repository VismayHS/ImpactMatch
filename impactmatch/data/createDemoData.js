const mongoose = require('mongoose');
const User = require('../models/User');
const Cause = require('../models/Cause');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/impactmatch';

// Sample causes for demonstration
const sampleCauses = [
  {
    name: 'Beach Cleanup Drive',
    description: 'Help clean our beaches and protect marine life from plastic pollution',
    category: 'Environment',
    city: 'Mumbai',
    verified: true,
  },
  {
    name: 'Tree Plantation Initiative',
    description: 'Plant 1000 trees to combat climate change and improve air quality',
    category: 'Environment',
    city: 'Bangalore',
    verified: true,
  },
  {
    name: 'Digital Literacy Program',
    description: 'Teach basic computer skills to underprivileged children',
    category: 'Education',
    city: 'Delhi',
    verified: true,
  },
  {
    name: 'Food Distribution Drive',
    description: 'Distribute meals to homeless people in the city',
    category: 'Social Welfare',
    city: 'Chennai',
    verified: false,
  },
  {
    name: 'Animal Shelter Support',
    description: 'Help care for rescued stray animals and find them homes',
    category: 'Animal Welfare',
    city: 'Pune',
    verified: false,
  },
  {
    name: 'Rural Education Support',
    description: 'Provide educational resources to rural schools',
    category: 'Education',
    city: 'Jaipur',
    verified: true,
  },
  {
    name: 'Women Empowerment Workshop',
    description: 'Skill development workshops for women entrepreneurs',
    category: 'Social Welfare',
    city: 'Hyderabad',
    verified: true,
  },
  {
    name: 'River Cleaning Campaign',
    description: 'Clean and restore polluted river banks',
    category: 'Environment',
    city: 'Kolkata',
    verified: false,
  },
];

async function createDemoData() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if demo user exists
    let demoUser = await User.findOne({ email: 'vismay@example.com' });
    
    if (!demoUser) {
      console.log('Creating demo user...');
      demoUser = new User({
        name: 'Vismay Demo',
        email: 'vismay@example.com',
        password: 'demo123', // Will be hashed by pre-save hook
        city: 'Bangalore',
        interests: 'Environment, Education, Social Welfare',
        availability: 'weekends',
        role: 'user',
        verified: true,
      });
      await demoUser.save();
      console.log('✅ Demo user created successfully');
    } else {
      console.log('✓ Demo user already exists');
    }

    console.log('\nDemo User Credentials:');
    console.log('Email: vismay@example.com');
    console.log('Password: demo123');
    console.log('User ID:', demoUser._id);

    // Check if causes exist
    const existingCauses = await Cause.countDocuments();
    
    if (existingCauses === 0) {
      console.log('\nCreating sample causes...');
      const createdCauses = await Cause.insertMany(sampleCauses);
      console.log(`✅ Created ${createdCauses.length} sample causes`);
    } else {
      console.log(`\n✓ Database already has ${existingCauses} causes`);
    }

    // List all causes
    const allCauses = await Cause.find();
    console.log('\n📍 Available Causes:');
    allCauses.forEach((cause, index) => {
      console.log(`${index + 1}. ${cause.name} (${cause.city}) - ${cause.verified ? 'Verified' : 'Active'}`);
    });

    console.log('\n✅ Demo data setup complete!');
    console.log('\nYou can now:');
    console.log('1. Login with vismay@example.com / demo123');
    console.log('2. View causes on the map at /map');
    console.log('3. Swipe through causes at /swipe');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
    process.exit(1);
  }
}

createDemoData();
