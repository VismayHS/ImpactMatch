const mongoose = require('mongoose');
const User = require('./models/User');

async function checkOrganizations() {
  try {
    await mongoose.connect('mongodb://localhost:27017/impactmatch');
    console.log('✓ Connected to MongoDB\n');

    const orgs = await User.find({ role: 'organisation' });
    
    console.log(`📊 Organizations in database: ${orgs.length}\n`);
    
    if (orgs.length === 0) {
      console.log('❌ NO ORGANIZATIONS FOUND!');
      console.log('\nThe organization accounts need to be created.');
      console.log('Run: node data/createOrganisations.js\n');
    } else {
      console.log('Organization accounts:');
      orgs.forEach((org, index) => {
        console.log(`\n${index + 1}. ${org.name}`);
        console.log(`   Email: ${org.email}`);
        console.log(`   City: ${org.city}`);
        console.log(`   Verified: ${org.verified}`);
        console.log(`   ID: ${org._id}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkOrganizations();
