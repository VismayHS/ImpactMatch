const mongoose = require('mongoose');
const User = require('./models/User');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Find the AkshayaPatra NGO
    const ngo = await User.findOne({ name: /AkshayaPatra/i, role: 'ngo' });
    
    if (!ngo) {
      console.log('❌ NGO not found');
      process.exit(1);
    }
    
    console.log('Found NGO:', ngo.name, '| Current score:', ngo.aiTrustScore);
    
    try {
      // Call AI service
      const response = await axios.post('http://localhost:8000/verify_ngo', {
        ngo_name: ngo.name.trim()
      }, { timeout: 30000 });
      
      const trustScore = response.data.trust_score || 70;
      console.log('\n📊 AI Response:');
      console.log('  - Trust Score:', trustScore);
      console.log('  - Trust Level:', response.data.trust_level);
      console.log('  - Notes:', response.data.notes);
      
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
      
      console.log('\n✅ Updated trust score to:', trustScore);
      console.log('✅ Dashboard access:', trustScore >= 75);
      
      // Verify the update
      const updated = await User.findById(ngo._id).select('name aiTrustScore dashboardAccess');
      console.log('\n✓ Verified:', updated.name, '| Score:', updated.aiTrustScore, '| Access:', updated.dashboardAccess);
      
    } catch (error) {
      console.error('❌ AI service error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
