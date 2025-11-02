// Test script to verify match scores are being calculated
const matchingService = require('./impactmatch/services/matchingService');

// Sample volunteer profile
const volunteer = {
  name: "Test Volunteer",
  interests: ["education", "teaching", "children"],
  skills: ["teaching", "mentoring"],
  city: "Bangalore",
  availability: "weekends"
};

// Sample NGO profile
const ngo = {
  name: "Education NGO",
  interests: "education",
  skills: ["teaching"],
  city: "Bangalore",
  availability: "weekends"
};

console.log('🧪 Testing Match Score Calculation\n');
console.log('Volunteer Profile:', volunteer);
console.log('\nNGO Profile:', ngo);

const result = matchingService.calculateMatch(volunteer, ngo);

console.log('\n✅ Match Result:');
console.log('  Score:', result.matchScore);
console.log('  Level:', result.matchLevel);
console.log('  Reasons:', result.reasons);
console.log('  Breakdown:', result.breakdown);

console.log('\n' + '='.repeat(50));

// Test with different NGO
const ngo2 = {
  name: "Healthcare NGO",
  interests: "healthcare",
  skills: ["medical"],
  city: "Mumbai",
  availability: "weekdays"
};

console.log('\nTesting with different NGO:', ngo2.name);
const result2 = matchingService.calculateMatch(volunteer, ngo2);

console.log('\n❌ Match Result (should be lower):');
console.log('  Score:', result2.matchScore);
console.log('  Level:', result2.matchLevel);
console.log('  Reasons:', result2.reasons);
