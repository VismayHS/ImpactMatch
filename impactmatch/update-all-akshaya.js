const mongoose = require('mongoose');
const User = require('./models/User');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Find all NGOs with AI scores (the ones we registered for testing)
    const ngos = await User.find({ 
      role: 'ngo',
      email: { $in: ['Akshayapatra@ngo.org', 'contact@akshayapatra.org'] }
    });
    
    console.log(`Found ${ngos.length} Akshaya Patra NGOs to update\n`);
    
    for (const ngo of ngos) {
      console.log('─'.repeat(60));
      console.log(`Updating: ${ngo.name}`);
      console.log(`Email: ${ngo.email}`);
      console.log(`Current Score: ${ngo.aiTrustScore}\n`);
      
      try {
        // Call AI service
        const response = await axios.post('http://localhost:8000/verify_ngo', {
          ngo_name: ngo.name.trim()
        }, { timeout: 30000 });
        
        const trustScore = response.data.trust_score || 70;
        
        console.log('📊 AI Response:');
        console.log(`  Trust Score: ${trustScore}/100`);
        console.log(`  Trust Level: ${response.data.trust_level}`);
        console.log(`  Links Found: ${response.data.num_links}`);
        console.log(`  Notes:`, response.data.notes);
        
        // Update in database
        await User.updateOne(
          { _id: ngo._id },
          { 
            $set: { 
              aiTrustScore: trustScore,
              dashboardAccess: trustScore >= 75
            }
          }
        );
        
        console.log(`\n✅ Updated! New score: ${trustScore}/100`);
        console.log(`✅ Dashboard access: ${trustScore >= 75 ? '🔓 UNLOCKED' : '🔒 LOCKED'}\n`);
        
      } catch (error) {
        console.error('❌ AI service error:', error.message);
      }
    }
    
    console.log('═'.repeat(60));
    console.log('\n✅ All updates complete!\n');
    
    // Show final status
    const updated = await User.find({ 
      role: 'ngo',
      email: { $in: ['Akshayapatra@ngo.org', 'contact@akshayapatra.org'] }
    }).select('name aiTrustScore dashboardAccess');
    
    console.log('📋 Final Status:');
    updated.forEach(ngo => {
      console.log(`  - ${ngo.name}: ${ngo.aiTrustScore}/100 | Dashboard: ${ngo.dashboardAccess ? '🔓' : '🔒'}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
