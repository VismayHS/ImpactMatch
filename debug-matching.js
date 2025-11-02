// Debug script to check why match scores are low
const mongoose = require('./impactmatch/node_modules/mongoose');
const User = require('./impactmatch/models/User');
const Cause = require('./impactmatch/models/Cause');
const matchingService = require('./impactmatch/services/matchingService');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    console.log('🔍 Debugging Match Scores\n');
    
    // Get the volunteer
    const user = await User.findOne({ email: 'vismay@example.com' }).lean();
    console.log('👤 VOLUNTEER PROFILE:');
    console.log('   Name:', user.name);
    console.log('   Interests:', user.interests);
    console.log('   Skills:', user.skills);
    console.log('   City:', user.city);
    console.log('   Availability:', user.availability);
    console.log('');
    
    // Get some causes - prioritize matching interests
    const causes = await Cause.find({ 
      status: 'active', 
      city: 'Bangalore',
      category: { $in: ['technology', 'education', 'environment'] }
    })
      .populate('ngoId')
      .limit(5)
      .lean();
    
    console.log('📋 TESTING MATCHES:\n');
    
    causes.forEach((cause, i) => {
      console.log(`${i + 1}. ${cause.title || cause.name}`);
      console.log('   Category:', cause.category);
      console.log('   City:', cause.city || cause.ngoId?.city);
      console.log('   NGO:', cause.ngoId?.name);
      console.log('   NGO Interests:', cause.ngoId?.interests);
      
      // Calculate match
      const ngoProfile = {
        ...cause.ngoId,
        interests: cause.category, // Use cause category
        city: cause.city || cause.ngoId?.city
      };
      
      const matchResult = matchingService.calculateMatch(user, ngoProfile);
      
      console.log('   ✅ Match Score:', matchResult.matchScore + '%', `(${matchResult.matchLevel})`);
      console.log('   Reasons:', matchResult.reasons);
      console.log('   Breakdown:', matchResult.breakdown);
      console.log('');
    });
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
