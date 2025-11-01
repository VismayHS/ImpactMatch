const mongoose = require('mongoose');
const User = require('../models/User');
const Cause = require('../models/Cause');
const Match = require('../models/Match');
const Verification = require('../models/Verification');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/impactmatch';

// Demo users with plain text passwords (will be hashed by pre-save hook)
const demoUsers = [
  {
    name: 'Vismay Demo User',
    email: 'vismay@example.com',
    password: 'demo123',
    city: 'Bangalore',
    interests: 'Environment, Education, Technology',
    availability: 'weekends',
    role: 'user',
    verified: true,
    impactScore: 80,
    badges: ['BRONZE'],
  },
  {
    name: 'Priya Volunteer',
    email: 'priya@example.com',
    password: 'demo123',
    city: 'Mumbai',
    interests: 'Health, Women Empowerment, Children',
    availability: 'flexible',
    role: 'user',
    verified: true,
    impactScore: 150,
    badges: ['SILVER'],
  },
  {
    name: 'Green Earth NGO',
    email: 'ngo@greennearth.org',
    password: 'ngo123',
    city: 'Delhi',
    interests: 'Environment, Sustainability',
    availability: 'full-time',
    role: 'ngo',
    verified: true,
    officeAddress: '123 Green Street, Delhi',
    certificateUploaded: true,
    impactScore: 0,
    badges: [],
  },
  {
    name: 'Hope Foundation',
    email: 'ngo@hopefoundation.org',
    password: 'ngo123',
    city: 'Bangalore',
    interests: 'Education, Social Welfare',
    availability: 'full-time',
    role: 'ngo',
    verified: false, // Pending admin approval
    officeAddress: '456 Hope Avenue, Bangalore',
    certificateUploaded: true,
    impactScore: 0,
    badges: [],
  },
  {
    name: 'Admin User',
    email: 'admin@impactmatch.com',
    password: 'admin123',
    city: 'Bangalore',
    interests: 'Platform Management',
    availability: 'full-time',
    role: 'admin',
    isAdmin: true,
    verified: true,
    impactScore: 0,
    badges: [],
  },
];

// Sample causes across India
const getSampleCauses = (ngoId) => [
  {
    name: 'Beach Cleanup Drive',
    description: 'Join us for monthly beach cleanup to protect marine life',
    category: 'Environment',
    city: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Teach English to Rural Kids',
    description: 'Help underprivileged children learn English and improve their future',
    category: 'Education',
    city: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Tree Plantation Campaign',
    description: 'Plant 1000 trees to combat urban pollution',
    category: 'Environment',
    city: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Food Distribution for Homeless',
    description: 'Distribute meals to homeless people every Sunday',
    category: 'Social Welfare',
    city: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Animal Shelter Support',
    description: 'Help care for rescued stray animals and find them homes',
    category: 'Animal Welfare',
    city: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Women Skill Development Workshop',
    description: 'Empower women with vocational skills for employment',
    category: 'Social Welfare',
    city: 'Hyderabad',
    lat: 17.3850,
    lng: 78.4867,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'River Cleaning Initiative',
    description: 'Clean polluted river banks and restore ecosystem',
    category: 'Environment',
    city: 'Kolkata',
    lat: 22.5726,
    lng: 88.3639,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Blood Donation Camp',
    description: 'Organize blood donation drives to save lives',
    category: 'Health',
    city: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Digital Literacy Program',
    description: 'Teach basic computer skills to senior citizens',
    category: 'Education',
    city: 'Bangalore',
    lat: 12.9352,
    lng: 77.6245,
    ngoId: ngoId,
    status: 'active',
  },
  {
    name: 'Community Garden Project',
    description: 'Create urban gardens to promote sustainable living',
    category: 'Environment',
    city: 'Mumbai',
    lat: 19.1136,
    lng: 72.9083,
    ngoId: ngoId,
    status: 'active',
  },
];

async function seedTestData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Cause.deleteMany({});
    await Match.deleteMany({});
    await Verification.deleteMany({});
    console.log('✅ Database cleared\n');

    // Create users (passwords will be auto-hashed)
    console.log('👥 Creating demo users...');
    const users = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save(); // This triggers the pre-save hook to hash password
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users\n`);

    // Create causes (all created by Green Earth NGO)
    console.log('🎯 Creating sample causes...');
    const ngoUser = users.find(u => u.role === 'ngo' && u.verified === true);
    const causes = await Cause.insertMany(getSampleCauses(ngoUser._id));
    console.log(`✅ Created ${causes.length} causes\n`);

    // Create some matches for demo users
    console.log('🤝 Creating sample matches...');
    const matches = [];

    // Vismay has 3 interested, 2 verified
    for (let i = 0; i < 5; i++) {
      matches.push({
        userId: users[0]._id,
        causeId: causes[i]._id,
        status: i < 2 ? 'verified' : 'interested',
        verifiedAt: i < 2 ? new Date() : null,
        txHash: i < 2 ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      });
    }

    // Priya has 5 verified
    for (let i = 0; i < 5; i++) {
      matches.push({
        userId: users[1]._id,
        causeId: causes[i + 2]._id,
        status: 'verified',
        verifiedAt: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      });
    }

    const savedMatches = await Match.insertMany(matches);
    console.log(`✅ Created ${savedMatches.length} matches\n`);

    // Update users with joinedCauses
    for (const user of users) {
      const userMatches = savedMatches.filter(
        m => m.userId.toString() === user._id.toString()
      );
      user.joinedCauses = userMatches.map(m => m._id);
      await user.save();
    }
    console.log('✅ Updated user joinedCauses\n');

    // Create verification records for verified matches
    console.log('🔐 Creating verification records...');
    const verifications = [];
    const verifiedMatches = savedMatches.filter(m => m.status === 'verified');

    for (const match of verifiedMatches) {
      verifications.push({
        matchId: match._id,
        verifierId: users[2]._id, // Green Earth NGO
        txHash: match.txHash,
        blockchainEventData: {
          volunteer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          causeId: match.causeId.toString().slice(-8),
          timestamp: Date.now(),
        },
      });
    }

    await Verification.insertMany(verifications);
    console.log(`✅ Created ${verifications.length} verification records\n`);

    // Print summary
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎉 TEST DATA SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🎯 Causes: ${causes.length}`);
    console.log(`   🤝 Matches: ${savedMatches.length}`);
    console.log(`   ✅ Verifications: ${verifications.length}\n`);

    console.log('🔑 DEMO CREDENTIALS:\n');
    
    console.log('👤 User Account #1:');
    console.log('   Email: vismay@example.com');
    console.log('   Password: demo123');
    console.log('   Role: User');
    console.log('   Score: 80 points (Bronze Badge)');
    console.log('   Matches: 5 (2 verified, 3 pending)\n');

    console.log('👤 User Account #2:');
    console.log('   Email: priya@example.com');
    console.log('   Password: demo123');
    console.log('   Role: User');
    console.log('   Score: 150 points (Silver Badge)');
    console.log('   Matches: 5 (all verified)\n');

    console.log('🏢 NGO Account #1 (Verified):');
    console.log('   Email: ngo@greennearth.org');
    console.log('   Password: ngo123');
    console.log('   Role: NGO');
    console.log('   Status: ✅ Verified by Admin\n');

    console.log('🏢 NGO Account #2 (Pending):');
    console.log('   Email: ngo@hopefoundation.org');
    console.log('   Password: ngo123');
    console.log('   Role: NGO');
    console.log('   Status: ⏳ Pending Admin Approval\n');

    console.log('🛠️  Admin Account:');
    console.log('   Email: admin@impactmatch.com');
    console.log('   Password: admin123');
    console.log('   Role: Admin');
    console.log('   Access: Full platform management\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 NEXT STEPS:\n');
    console.log('1. Start backend: cd impactmatch && npm start');
    console.log('2. Start frontend: cd client && npm run dev');
    console.log('3. Login with any account above');
    console.log('4. Test verification flow (NGO → User verification)');
    console.log('═══════════════════════════════════════════════════════\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedTestData();
