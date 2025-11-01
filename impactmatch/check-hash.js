const mongoose = require('mongoose');
const User = require('./models/User');

async function checkHash() {
  await mongoose.connect('mongodb://localhost:27017/impactmatch');
  const user = await User.findOne({ email: 'vismay@example.com' });
  console.log('Password hash:', user.password);
  console.log('Hash length:', user.password.length);
  console.log('Is bcrypt hash:', user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));
  process.exit(0);
}

checkHash();
