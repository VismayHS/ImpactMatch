// Test parseSkills function
const matchingService = require('./impactmatch/services/matchingService');

console.log('Testing parseSkills function:\n');

const skills1 = 'teaching, programming, web development, mentoring, project management';
const skills2 = ['teaching', 'programming', 'web development', 'mentoring', 'project management'];
const interests = 'Technology, Digital Literacy, Innovation';

console.log('Input 1 (string, isSkillField=true):', skills1);
const parsed1 = matchingService.parseSkills(skills1, true);
console.log('Parsed:', parsed1);
console.log('');

console.log('Input 2 (array, isSkillField=true):', skills2);
const parsed2 = matchingService.parseSkills(skills2, true);
console.log('Parsed:', parsed2);
console.log('');

console.log('NGO interests (isSkillField=false):', interests);
const parsedNgo = matchingService.parseSkills(interests, false);
console.log('Parsed:', parsedNgo);
