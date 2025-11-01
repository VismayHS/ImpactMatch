const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/impactmatch';

// Organization accounts with credentials
const organisations = [
  {
    name: 'Tech Solutions Pvt Ltd',
    email: 'techsolutions@example.com',
    password: 'tech@2024',
    city: 'Bangalore',
    interests: 'Education, Technology, Youth Development',
    officeAddress: 'Tech Park, Whitefield, Bangalore - 560066',
    role: 'organisation',
    verified: true,
    description: 'Leading technology company focused on digital transformation and CSR initiatives'
  },
  {
    name: 'Green Earth Industries',
    email: 'greenearth@example.com',
    password: 'green@2024',
    city: 'Mumbai',
    interests: 'Environment, Sustainability, Climate Action',
    officeAddress: 'Eco Tower, Andheri East, Mumbai - 400069',
    role: 'organisation',
    verified: true,
    description: 'Manufacturing company committed to sustainable practices and environmental conservation'
  },
  {
    name: 'Global Education Foundation',
    email: 'globaledu@example.com',
    password: 'edu@2024',
    city: 'Delhi',
    interests: 'Education, Child Welfare, Women Empowerment',
    officeAddress: 'Knowledge Hub, Connaught Place, New Delhi - 110001',
    role: 'organisation',
    verified: true,
    description: 'Non-profit organization dedicated to providing quality education to underprivileged communities'
  },
  {
    name: 'HealthCare Plus Corporation',
    email: 'healthcareplus@example.com',
    password: 'health@2024',
    city: 'Hyderabad',
    interests: 'Healthcare, Public Health, Community Wellness',
    officeAddress: 'Medical Complex, Gachibowli, Hyderabad - 500032',
    role: 'organisation',
    verified: true,
    description: 'Healthcare provider with strong commitment to community health and medical outreach programs'
  }
];

async function createOrganisations() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB successfully\n');

    console.log('📊 Creating organization accounts...\n');
    
    let createdCount = 0;
    let existingCount = 0;

    for (const org of organisations) {
      // Check if organization already exists
      const existingOrg = await User.findOne({ email: org.email });
      
      if (existingOrg) {
        console.log(`⚠️  Organization already exists: ${org.name}`);
        console.log(`   Email: ${org.email}`);
        console.log(`   ID: ${existingOrg._id}\n`);
        existingCount++;
        continue;
      }

      // Create new organization
      const newOrg = new User({
        name: org.name,
        email: org.email,
        password: org.password, // Will be hashed by pre-save hook
        city: org.city,
        interests: org.interests,
        officeAddress: org.officeAddress,
        role: 'organisation',
        verified: true,
        dashboardAccess: true,
      });

      await newOrg.save();
      createdCount++;

      console.log(`✅ Created: ${org.name}`);
      console.log(`   Email: ${org.email}`);
      console.log(`   Password: ${org.password}`);
      console.log(`   ID: ${newOrg._id}`);
      console.log(`   City: ${org.city}\n`);
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📈 Summary:`);
    console.log(`   ✅ Created: ${createdCount} organizations`);
    console.log(`   ⚠️  Already existed: ${existingCount} organizations`);
    console.log(`   📊 Total organizations in DB: ${createdCount + existingCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Verify all organizations in database
    console.log('🔍 Verifying organizations in database...\n');
    const allOrgs = await User.find({ role: 'organisation' });
    
    console.log(`📋 All Organizations in Database (${allOrgs.length} total):\n`);
    allOrgs.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name}`);
      console.log(`   Email: ${org.email}`);
      console.log(`   ID: ${org._id}`);
      console.log(`   City: ${org.city}`);
      console.log(`   Verified: ${org.verified ? '✓' : '✗'}`);
      console.log(`   Created: ${org.createdAt}\n`);
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Login Credentials for Testing:\n');
    
    organisations.forEach((org, index) => {
      console.log(`${index + 1}. ${org.name}`);
      console.log(`   URL: http://localhost:3000/login/organisation`);
      console.log(`   Email: ${org.email}`);
      console.log(`   Password: ${org.password}\n`);
    });

    console.log('✅ Organization setup complete!');
    console.log('\n🚀 Next steps:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Navigate to: http://localhost:3000/login/organisation');
    console.log('   3. Login with any of the credentials above');
    console.log('   4. Access dashboard at: http://localhost:3000/organisation-dashboard\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating organizations:', error);
    process.exit(1);
  }
}

createOrganisations();
