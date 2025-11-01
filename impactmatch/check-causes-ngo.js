const mongoose = require('mongoose');
const User = require('./models/User');
const Cause = require('./models/Cause');

async function checkCauses() {
  try {
    await mongoose.connect('mongodb://localhost:27017/impactmatch');
    console.log('✓ Connected to MongoDB\n');

    const causes = await Cause.find().populate('ngoId', 'name email role').limit(5);

    console.log(`📊 Total Causes: ${await Cause.countDocuments()}`);
    console.log(`\nSample Causes (first 5):\n`);

    causes.forEach((cause, index) => {
      console.log(`${index + 1}. ${cause.name}`);
      console.log(`   Category: ${cause.category}`);
      console.log(`   City: ${cause.city}`);
      console.log(`   NGO ID: ${cause.ngoId ? cause.ngoId._id : 'NULL'}`);
      console.log(`   NGO Name: ${cause.ngoId ? cause.ngoId.name : 'NOT ASSIGNED'}`);
      console.log(`   NGO Email: ${cause.ngoId ? cause.ngoId.email : 'N/A'}`);
      console.log(`   NGO Role: ${cause.ngoId ? cause.ngoId.role : 'N/A'}`);
      console.log('');
    });

    const causesWithoutNGO = await Cause.countDocuments({ ngoId: null });
    const causesWithNGO = await Cause.countDocuments({ ngoId: { $ne: null } });

    console.log(`\n📈 Statistics:`);
    console.log(`   Causes WITH NGO assigned: ${causesWithNGO}`);
    console.log(`   Causes WITHOUT NGO: ${causesWithoutNGO}`);

    if (causesWithoutNGO > 0) {
      console.log(`\n⚠️  WARNING: ${causesWithoutNGO} causes don't have an NGO assigned!`);
      console.log(`   This means organizations cannot send collaboration requests for these causes.`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkCauses();
