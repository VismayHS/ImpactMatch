const natural = require('natural');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const causesPath = path.join(__dirname, '../data/causes.json');

const citiesNearby = {
  Bangalore: ['Bangalore', 'Chennai', 'Hyderabad', 'Pune'],
  Mumbai: ['Mumbai', 'Pune', 'Surat'],
  Delhi: ['Delhi', 'Lucknow', 'Jaipur'],
  Chennai: ['Chennai', 'Bangalore', 'Hyderabad'],
  Pune: ['Pune', 'Mumbai', 'Bangalore'],
  Kolkata: ['Kolkata', 'Lucknow'],
  Hyderabad: ['Hyderabad', 'Chennai', 'Bangalore'],
  Jaipur: ['Jaipur', 'Delhi', 'Lucknow'],
  Lucknow: ['Lucknow', 'Delhi', 'Kolkata', 'Jaipur'],
  Surat: ['Surat', 'Mumbai']
};

function getUserById(userId) {
  const users = JSON.parse(fs.readFileSync(usersPath));
  return users.find(u => u.id === userId);
}

function getCausesByCities(cities) {
  const causes = JSON.parse(fs.readFileSync(causesPath));
  return causes.filter(c => cities.includes(c.city));
}

function matchCauses(userId) {
  const user = getUserById(userId);
  if (!user) return null;
  const cities = citiesNearby[user.city] || [user.city];
  let causes = getCausesByCities(cities);
  if (causes.length === 0) {
    causes = JSON.parse(fs.readFileSync(causesPath)); // fallback to all
  }
  const tfidf = new natural.TfIdf();
  causes.forEach(cause => tfidf.addDocument(cause.description));
  const interestText = user.interests.join(' ');
  const scores = causes.map((cause, idx) => {
    const score = tfidf.tfidf(interestText, idx);
    return { ...cause, similarity: Math.round(score * 1000) / 1000 };
  });
  scores.sort((a, b) => b.similarity - a.similarity);
  return scores.slice(0, 5).map(c => ({
    name: c.name,
    similarity: c.similarity,
    category: c.category
  }));
}

module.exports = { matchCauses, getUserById };
