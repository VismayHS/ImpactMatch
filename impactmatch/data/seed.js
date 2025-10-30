const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Cause = require('../models/Cause');
const Match = require('../models/Match');
const Verification = require('../models/Verification');

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/impactmatch';

async function seedDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Cause.deleteMany({});
    await Match.deleteMany({});
    await Verification.deleteMany({});
    console.log('✅ Database cleared');

    // Load causes from JSON
    console.log('📁 Loading causes data...');
    const causesPath = path.join(__dirname, 'causes.json');
    const causesData = JSON.parse(fs.readFileSync(causesPath, 'utf8'));

    // Insert causes
    console.log('💾 Inserting causes...');
    const causes = await Cause.insertMany(
      causesData.map((c) => ({
        name: c.name,
        description: c.description,
        category: c.category,
        city: c.city,
        lat: c.lat,
        lng: c.lng,
      }))
    );
    console.log(`✅ Inserted ${causes.length} causes`);

    // Create demo users
    console.log('👥 Creating demo users...');
    const demoUsers = [
      {
        name: 'Vismay Sharma',
        email: 'vismay@example.com',
        password: 'demo123',
        city: 'Bangalore',
        interests: 'environment, technology, education',
        availability: 'weekends',
        impactScore: 80,
        badges: ['BRONZE'],
        joinedCauses: [],
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'demo123',
        city: 'Mumbai',
        interests: 'health, women empowerment, children',
        availability: 'flexible',
        impactScore: 150,
        badges: ['SILVER'],
        joinedCauses: [],
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        password: 'demo123',
        city: 'Delhi',
        interests: 'sports, youth, volunteering',
        availability: 'evenings',
        impactScore: 230,
        badges: ['GOLD'],
        joinedCauses: [],
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        password: 'demo123',
        city: 'Hyderabad',
        interests: 'animals, environment, health',
        availability: 'weekends',
        impactScore: 40,
        badges: [],
        joinedCauses: [],
      },
    ];

    const users = await User.insertMany(demoUsers);
    console.log(`✅ Created ${users.length} demo users`);

    // Create sample matches and verifications
    console.log('🤝 Creating sample matches...');
    const matches = [];

    // User 0 (Vismay): 4 interested, 3 verified
    for (let i = 0; i < 7; i++) {
      const match = new Match({
        userId: users[0]._id,
        causeId: causes[i]._id,
        status: i < 3 ? 'verified' : 'interested',
        verifiedAt: i < 3 ? new Date() : null,
        txHash: i < 3 ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      });
      matches.push(match);
    }

    // User 1 (Priya): 5 interested, 5 verified
    for (let i = 10; i < 20; i++) {
      const match = new Match({
        userId: users[1]._id,
        causeId: causes[i]._id,
        status: i < 15 ? 'verified' : 'interested',
        verifiedAt: i < 15 ? new Date() : null,
        txHash: i < 15 ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      });
      matches.push(match);
    }

    // User 2 (Amit): 3 interested, 8 verified
    for (let i = 30; i < 41; i++) {
      const match = new Match({
        userId: users[2]._id,
        causeId: causes[i]._id,
        status: i < 38 ? 'verified' : 'interested',
        verifiedAt: i < 38 ? new Date() : null,
        txHash: i < 38 ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      });
      matches.push(match);
    }

    // User 3 (Sneha): 3 interested, 1 verified
    for (let i = 50; i < 54; i++) {
      const match = new Match({
        userId: users[3]._id,
        causeId: causes[i]._id,
        status: i === 50 ? 'verified' : 'interested',
        verifiedAt: i === 50 ? new Date() : null,
        txHash: i === 50 ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      });
      matches.push(match);
    }

    const savedMatches = await Match.insertMany(matches);
    console.log(`✅ Created ${savedMatches.length} matches`);

    // Update users with joinedCauses
    for (let i = 0; i < users.length; i++) {
      const userMatches = savedMatches.filter((m) => m.userId.toString() === users[i]._id.toString());
      users[i].joinedCauses = userMatches.map((m) => m._id);
      await users[i].save();
    }
    console.log('✅ Updated user joinedCauses');

    // Create verification records for verified matches
    console.log('🔐 Creating verification records...');
    const verifications = [];
    const verifiedMatches = savedMatches.filter((m) => m.status === 'verified');

    for (const match of verifiedMatches) {
      const verification = new Verification({
        matchId: match._id,
        verifierId: users[0]._id, // Demo: first user as verifier
        txHash: match.txHash,
        blockchainEventData: {
          volunteer: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
          causeId: match.causeId.toString().slice(-8),
          timestamp: Date.now(),
        },
      });
      verifications.push(verification);
    }

    await Verification.insertMany(verifications);
    console.log(`✅ Created ${verifications.length} verification records`);

    // Print summary
    console.log('\n📊 Database Seeding Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🎯 Causes: ${causes.length}`);
    console.log(`   🤝 Matches: ${savedMatches.length}`);
    console.log(`   ✅ Verified: ${verifiedMatches.length}`);
    console.log(`   🔐 Verifications: ${verifications.length}`);

    console.log('\n🎉 Database seeding complete!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('   Email: vismay@example.com | Password: demo123');
    console.log('   Email: priya@example.com | Password: demo123');
    console.log('   Email: amit@example.com | Password: demo123');
    console.log('   Email: sneha@example.com | Password: demo123');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
