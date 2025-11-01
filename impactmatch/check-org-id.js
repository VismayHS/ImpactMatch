const mongoose = require('mongoose');
const User = require('./models/User');

async function checkOrganization() {
  try {
    await mongoose.connect('mongodb://localhost:27017/impactmatch');
    console.log('✓ Connected to MongoDB\n');

    // The org ID from the error
    const orgId = '690601c1165dfac956f04ac9';
    
    console.log(`Looking for organization with ID: ${orgId}\n`);
    
    const org = await User.findById(orgId);
    
    if (org) {
      console.log('✅ FOUND!');
      console.log(`   Name: ${org.name}`);
      console.log(`   Email: ${org.email}`);
      console.log(`   Role: ${org.role}`);
      console.log(`   City: ${org.city}`);
    } else {
      console.log('❌ NOT FOUND!');
      console.log('\nThis organization ID does not exist in the database.');
      console.log('The user data in localStorage might be outdated or from a different database.\n');
      
      console.log('Available organizations in database:');
      const orgs = await User.find({ role: 'organisation' });
      orgs.forEach(o => {
        console.log(`   - ${o.name} (${o.email}) - ID: ${o._id}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkOrganization();
