const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    const ngos = await User.find({ role: 'ngo' })
      .select('name email aiTrustScore dashboardAccess certificateVerified createdAt')
      .sort({ createdAt: -1 });
    
    console.log('📋 All NGOs in Database:\n');
    console.log('=' .repeat(70));
    
    ngos.forEach((ngo, i) => {
      let level = '';
      const score = ngo.aiTrustScore || 0;
      
      if (score >= 80) level = 'VERY HIGH ⭐';
      else if (score >= 70) level = 'HIGH ✅';
      else if (score >= 55) level = 'MEDIUM ⚠️';
      else if (score >= 40) level = 'LOW ⚠️';
      else if (score > 0) level = 'VERY LOW ❌';
      else level = 'NO SCORE 🔘';
      
      console.log(`\n${i+1}. ${ngo.name}`);
      console.log(`   Email: ${ngo.email}`);
      console.log(`   AI Score: ${ngo.aiTrustScore || 'null'}/100 - ${level}`);
      console.log(`   Dashboard: ${ngo.dashboardAccess ? '🔓 UNLOCKED' : '🔒 LOCKED'}`);
      console.log(`   Certificate: ${ngo.certificateVerified ? '✅ Verified' : '⏳ Pending'}`);
      console.log(`   Registered: ${ngo.createdAt.toLocaleDateString()}`);
    });
    
    console.log('\n' + '='.repeat(70));
    console.log(`\nTotal NGOs: ${ngos.length}`);
    console.log(`With AI Scores: ${ngos.filter(n => n.aiTrustScore).length}`);
    console.log(`Dashboard Unlocked: ${ngos.filter(n => n.dashboardAccess).length}`);
    console.log(`Certificate Verified: ${ngos.filter(n => n.certificateVerified).length}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
