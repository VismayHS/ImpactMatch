const User = require('./models/User');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    const ngos = await User.find({ role: 'ngo' });
    
    console.log('\n📊 ALL NGOs IN DATABASE:\n');
    ngos.forEach((ngo, i) => {
      console.log(`${i+1}. ${ngo.name}`);
      console.log(`   Email: ${ngo.email}`);
      console.log(`   Verified: ${ngo.verified ? '✅ YES' : '⏳ PENDING'}`);
      console.log(`   Certificate: ${ngo.certificateUploaded ? '✓' : '✗'}`);
      console.log(`   ID: ${ngo._id}\n`);
    });
    
    console.log(`\nTotal NGOs: ${ngos.length}`);
    console.log(`Verified: ${ngos.filter(n => n.verified).length}`);
    console.log(`Pending: ${ngos.filter(n => !n.verified).length}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
