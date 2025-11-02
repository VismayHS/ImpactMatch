// Fix user profile - add skills and convert interests to array
const mongoose = require('./impactmatch/node_modules/mongoose');
const User = require('./impactmatch/models/User');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    console.log('🔧 Fixing User Profile...\n');
    
    const user = await User.findOne({ email: 'vismay@example.com' });
    
    console.log('BEFORE:');
    console.log('  Interests:', user.interests);
    console.log('  Skills:', user.skills);
    
    // Keep interests as string (that's the schema format)
    // Just add skills that match the interests
    user.skills = 'teaching, programming, web development, mentoring, project management';
    
    await user.save();
    
    console.log('\nAFTER:');
    console.log('  Interests:', user.interests);
    console.log('  Skills:', user.skills);
    console.log('\n✅ User profile updated!');
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
