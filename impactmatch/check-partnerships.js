const mongoose = require('mongoose');
const Partnership = require('./models/Partnership');

async function checkPartnerships() {
  try {
    await mongoose.connect('mongodb://localhost:27017/impactmatch');
    console.log('✓ Connected to MongoDB\n');

    const partnerships = await Partnership.find()
      .populate('organisationId', 'name email')
      .populate('ngoId', 'name email')
      .populate('causeId', 'name title');

    console.log(`📊 Total Partnerships in Database: ${partnerships.length}\n`);

    if (partnerships.length === 0) {
      console.log('❌ No partnerships found in database');
      console.log('This is a fresh database - no collaboration requests sent yet.\n');
    } else {
      partnerships.forEach((p, index) => {
        console.log(`${index + 1}. Partnership:`);
        console.log(`   Organization: ${p.organisationId?.name || 'Unknown'}`);
        console.log(`   NGO: ${p.ngoId?.name || 'Unknown'}`);
        console.log(`   Cause: ${p.causeId?.name || 'Unknown'}`);
        console.log(`   Status: ${p.status}`);
        console.log(`   Volunteers Offered: ${p.volunteersOffered}`);
        console.log(`   Created: ${p.createdAt}`);
        console.log('');
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkPartnerships();
