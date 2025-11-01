const mongoose = require('mongoose');
const Match = require('./models/Match');
const Cause = require('./models/Cause');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/impactmatch').then(async () => {
  console.log('Connected to MongoDB\n');
  
  const ngo = await User.findOne({ email: 'ngo@impactmatch.org' });
  const vismay = await User.findOne({ email: 'vismay@example.com' });
  
  console.log('ImpactMatch NGO ID:', ngo._id.toString());
  console.log('Vismay User ID:', vismay._id.toString());
  console.log('');
  
  const causes = await Cause.find({ ngoId: ngo._id });
  const causeIds = causes.map(c => c._id.toString());
  
  console.log('ImpactMatch NGO has', causes.length, 'causes');
  console.log('First 3 cause IDs:', causeIds.slice(0, 3));
  console.log('');
  
  const allMatches = await Match.find().lean();
  console.log('Total matches in database:', allMatches.length);
  
  const vismayMatches = allMatches.filter(m => m.userId.toString() === vismay._id.toString());
  console.log('Vismay total matches:', vismayMatches.length);
  
  const vismayMatchCauseIds = vismayMatches.map(m => m.causeId.toString());
  console.log('Vismay first 3 match cause IDs:', vismayMatchCauseIds.slice(0, 3));
  console.log('');
  
  const ngoMatches = vismayMatches.filter(m => causeIds.includes(m.causeId.toString()));
  
  console.log('✅ Vismay matches for ImpactMatch NGO:', ngoMatches.length);
  console.log('');
  
  if (ngoMatches.length > 0) {
    console.log('List of matches:');
    ngoMatches.forEach((m, i) => {
      const cause = causes.find(c => c._id.toString() === m.causeId.toString());
      console.log(`  ${i+1}. ${cause?.name || 'Unknown'} (${cause?.city || 'Unknown city'})`);
    });
  } else {
    console.log('❌ No matches found! Debugging...');
    console.log('Sample NGO cause ID:', causeIds[0]);
    console.log('Sample Vismay match cause ID:', vismayMatchCauseIds[0]);
    console.log('Are they equal?', causeIds[0] === vismayMatchCauseIds[0]);
  }
  
  process.exit(0);
});
