const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    const ngos = await User.find({ name: /akshaya/i, role: 'ngo' })
      .select('name aiTrustScore dashboardAccess');
    
    console.log('\n📊 Current Database Values:\n');
    ngos.forEach(ngo => {
      console.log(`  ${ngo.name.padEnd(30)}: ${ngo.aiTrustScore}/100 | Dashboard: ${ngo.dashboardAccess ? '🔓' : '🔒'}`);
    });
    console.log('');
    
    process.exit(0);
  });
