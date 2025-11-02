// Find matching causes in Bangalore
const mongoose = require('./impactmatch/node_modules/mongoose');
const Cause = require('./impactmatch/models/Cause');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    const causes = await Cause.find({ 
      status: 'active', 
      city: 'Bangalore',
      category: { $in: ['technology', 'education', 'environment'] }
    }).lean();
    
    console.log(`Found ${causes.length} matching causes in Bangalore:\n`);
    causes.forEach(c => {
      console.log(`  - ${c.title || c.name} (${c.category})`);
    });
    
    mongoose.disconnect();
  });
