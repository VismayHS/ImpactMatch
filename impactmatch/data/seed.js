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

    // Create demo NGOs (8 total)
    console.log('🏢 Creating 8 demo NGOs...');
    const ngo1 = await User.create({
      name: 'ImpactMatch Foundation',
      email: 'ngo@impactmatch.org',
      password: 'demo123',
      role: 'ngo',
      city: 'Bangalore',
      interests: 'all social causes',
      availability: 'always',
      verified: true,
      officeAddress: '123 Tech Park, Bangalore',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO123456',
        description: 'Leading social impact organization in India',
        website: 'https://impactmatch.org',
        contactPerson: 'Admin',
        contactPhone: '+91-1234567890',
        yearEstablished: 2020,
      },
    });

    const ngo2 = await User.create({
      name: 'Green Earth NGO',
      email: 'ngo@greennearth.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Delhi',
      interests: 'Environment, Sustainability',
      availability: 'full-time',
      verified: true,
      officeAddress: '123 Green Street, Delhi',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO789012',
        description: 'Environmental conservation and sustainability initiatives',
        website: 'https://greennearth.org',
        contactPerson: 'Environmental Director',
        contactPhone: '+91-9876543210',
        yearEstablished: 2018,
      },
    });

    const ngo3 = await User.create({
      name: 'Hope Foundation',
      email: 'ngo@hopefoundation.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Mumbai',
      interests: 'Education, Social Welfare',
      availability: 'full-time',
      verified: true,
      officeAddress: '456 Hope Avenue, Mumbai',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO345678',
        description: 'Providing education and social welfare to underprivileged communities',
        website: 'https://hopefoundation.org',
        contactPerson: 'Education Coordinator',
        contactPhone: '+91-8765432109',
        yearEstablished: 2015,
      },
    });

    const ngo4 = await User.create({
      name: 'Health for All',
      email: 'ngo@healthforall.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Chennai',
      interests: 'Health, Medical Care, Wellness',
      availability: 'full-time',
      verified: true,
      officeAddress: '789 Medical Complex, Chennai',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO456789',
        description: 'Healthcare services and medical support for rural and urban poor',
        website: 'https://healthforall.org',
        contactPerson: 'Medical Director',
        contactPhone: '+91-7654321098',
        yearEstablished: 2017,
      },
    });

    const ngo5 = await User.create({
      name: 'Animal Rescue Society',
      email: 'ngo@animalrescue.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Pune',
      interests: 'Animal Welfare, Wildlife Protection',
      availability: 'full-time',
      verified: true,
      officeAddress: '321 Animal Shelter Road, Pune',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO567890',
        description: 'Rescuing and rehabilitating stray and injured animals',
        website: 'https://animalrescue.org',
        contactPerson: 'Wildlife Coordinator',
        contactPhone: '+91-6543210987',
        yearEstablished: 2019,
      },
    });

    const ngo6 = await User.create({
      name: 'Tech for Good',
      email: 'ngo@techforgood.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Hyderabad',
      interests: 'Technology, Digital Literacy, Innovation',
      availability: 'full-time',
      verified: true,
      officeAddress: '654 Innovation Hub, Hyderabad',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO678901',
        description: 'Bridging the digital divide through technology education',
        website: 'https://techforgood.org',
        contactPerson: 'Tech Director',
        contactPhone: '+91-5432109876',
        yearEstablished: 2021,
      },
    });

    const ngo7 = await User.create({
      name: 'Arts & Culture Foundation',
      email: 'ngo@artsculture.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Kolkata',
      interests: 'Arts, Culture, Heritage Preservation',
      availability: 'full-time',
      verified: true,
      officeAddress: '987 Cultural Center, Kolkata',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO789012',
        description: 'Promoting arts, culture, and heritage preservation',
        website: 'https://artsculture.org',
        contactPerson: 'Cultural Director',
        contactPhone: '+91-4321098765',
        yearEstablished: 2016,
      },
    });

    const ngo8 = await User.create({
      name: 'Community Sports League',
      email: 'ngo@communitysports.org',
      password: 'ngo123',
      role: 'ngo',
      city: 'Ahmedabad',
      interests: 'Sports, Youth Development, Fitness',
      availability: 'full-time',
      verified: true,
      officeAddress: '159 Sports Complex, Ahmedabad',
      certificateUploaded: true,
      ngoDetails: {
        registrationNumber: 'NGO890123',
        description: 'Empowering youth through sports and fitness programs',
        website: 'https://communitysports.org',
        contactPerson: 'Sports Coordinator',
        contactPhone: '+91-3210987654',
        yearEstablished: 2020,
      },
    });

    const allNGOs = [ngo1, ngo2, ngo3, ngo4, ngo5, ngo6, ngo7, ngo8];
    console.log(`✅ Created 8 NGOs (all verified)`);

    // Load causes from JSON and distribute across all 8 NGOs
    console.log('📁 Loading causes data...');
    const causesPath = path.join(__dirname, 'causes.json');
    const causesData = JSON.parse(fs.readFileSync(causesPath, 'utf8'));

    // Distribute causes evenly across all 8 NGOs (~25 each)
    console.log('💾 Distributing causes across 8 NGOs...');
    const causesPerNGO = Math.ceil(causesData.length / allNGOs.length);
    const causesWithNGOs = causesData.map((c, index) => {
      const ngoIndex = Math.floor(index / causesPerNGO) % allNGOs.length;
      return {
        name: c.name,
        description: c.description,
        category: c.category,
        city: c.city,
        lat: c.lat,
        lng: c.lng,
        ngoId: allNGOs[ngoIndex]._id,
      };
    });

    const causes = await Cause.insertMany(causesWithNGOs);
    console.log(`✅ Inserted ${causes.length} causes distributed across 8 NGOs`);
    
    // Log distribution
    for (let i = 0; i < allNGOs.length; i++) {
      const ngoId = allNGOs[i]._id;
      const count = causes.filter(c => c.ngoId.toString() === ngoId.toString()).length;
      console.log(`   📌 ${allNGOs[i].name}: ${count} causes`);
    }

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

    // Create users one by one to trigger pre-save hook for password hashing
    const users = [];
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      users.push(user);
    }
    
    // Create admin user
    const adminUser = await User.create({
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
    });
    users.push(adminUser);
    
    console.log(`✅ Created ${users.length} demo users + 1 admin`);

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
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETE!');
    console.log('═══════════════════════════════════════════════════════');
    
    console.log('\n📊 Summary:');
    console.log(`   👥 Total Users: ${users.length + allNGOs.length} (4 volunteers + 8 NGOs + 1 admin)`);
    console.log(`   🎯 Causes: ${causes.length} (distributed across 8 NGOs)`);
    console.log(`   🤝 Matches: ${savedMatches.length}`);
    console.log(`   ✅ Verified: ${verifiedMatches.length}`);
    console.log(`   🔐 Verifications: ${verifications.length}`);

    console.log('\n🔑 DEMO CREDENTIALS:\n');
    
    console.log('� VOLUNTEER ACCOUNTS:');
    console.log('   Email: vismay@example.com | Password: demo123');
    console.log('   Email: priya@example.com | Password: demo123');
    console.log('   Email: amit@example.com | Password: demo123');
    console.log('   Email: sneha@example.com | Password: demo123');
    
    console.log('\n🏢 NGO ACCOUNTS (All Verified):');
    console.log('   Email: ngo@impactmatch.org | Password: demo123 | ImpactMatch Foundation (Bangalore)');
    console.log('   Email: ngo@greennearth.org | Password: ngo123 | Green Earth NGO (Delhi)');
    console.log('   Email: ngo@hopefoundation.org | Password: ngo123 | Hope Foundation (Mumbai)');
    console.log('   Email: ngo@healthforall.org | Password: ngo123 | Health for All (Chennai)');
    console.log('   Email: ngo@animalrescue.org | Password: ngo123 | Animal Rescue Society (Pune)');
    console.log('   Email: ngo@techforgood.org | Password: ngo123 | Tech for Good (Hyderabad)');
    console.log('   Email: ngo@artsculture.org | Password: ngo123 | Arts & Culture Foundation (Kolkata)');
    console.log('   Email: ngo@communitysports.org | Password: ngo123 | Community Sports League (Ahmedabad)');
    
    console.log('\n🛠️  ADMIN ACCOUNT:');
    console.log('   Email: admin@impactmatch.com | Password: admin123');
    
    console.log('\n═══════════════════════════════════════════════════════');

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
