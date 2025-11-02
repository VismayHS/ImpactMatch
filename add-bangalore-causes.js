// Check and add Bangalore causes for better matching
const mongoose = require('./impactmatch/node_modules/mongoose');
const Cause = require('./impactmatch/models/Cause');
const User = require('./impactmatch/models/User');

mongoose.connect('mongodb://localhost:27017/impactmatch')
  .then(async () => {
    console.log('🔍 Checking Bangalore causes...\n');
    
    // Check existing Bangalore causes
    const bangaloreCauses = await Cause.find({ city: 'Bangalore' }).lean();
    console.log(`Found ${bangaloreCauses.length} causes in Bangalore`);
    
    if (bangaloreCauses.length > 0) {
      bangaloreCauses.forEach(c => {
        console.log(`  - ${c.title || c.name} (${c.category})`);
      });
    }
    
    // Get NGO to link causes
    const ngo = await User.findOne({ role: 'ngo' });
    
    if (bangaloreCauses.length < 3) {
      console.log('\n📝 Adding more Bangalore causes for better matching...\n');
      
      const newCauses = [
        {
          name: 'Coding Workshop for Kids',
          title: 'Coding Workshop for Kids',
          description: 'Teach programming basics to underprivileged children in Bangalore. Help bridge the digital divide!',
          category: 'education',
          city: 'Bangalore',
          address: 'MG Road, Bangalore',
          ngoId: ngo._id,
          eventDate: new Date('2025-11-10'),
          eventTime: '10:00 AM - 2:00 PM',
          volunteerLimit: 15,
          volunteersJoined: 3,
          status: 'active'
        },
        {
          name: 'Tech Mentorship Program',
          title: 'Tech Mentorship Program',
          description: 'Mentor young students in web development and technology. Share your skills and inspire the next generation!',
          category: 'technology',
          city: 'Bangalore',
          address: 'Koramangala, Bangalore',
          ngoId: ngo._id,
          eventDate: new Date('2025-11-15'),
          eventTime: '2:00 PM - 5:00 PM',
          volunteerLimit: 10,
          volunteersJoined: 2,
          status: 'active'
        },
        {
          name: 'Environmental Awareness in Schools',
          title: 'Environmental Awareness in Schools',
          description: 'Conduct environmental awareness sessions in schools. Teach students about sustainability and climate action.',
          category: 'environment',
          city: 'Bangalore',
          address: 'Whitefield, Bangalore',
          ngoId: ngo._id,
          eventDate: new Date('2025-11-12'),
          eventTime: '9:00 AM - 12:00 PM',
          volunteerLimit: 20,
          volunteersJoined: 5,
          status: 'active'
        }
      ];
      
      await Cause.insertMany(newCauses);
      console.log(`✅ Added ${newCauses.length} new Bangalore causes!`);
      newCauses.forEach(c => {
        console.log(`  - ${c.title} (${c.category})`);
      });
    }
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
