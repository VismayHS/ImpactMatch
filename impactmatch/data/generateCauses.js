const fs = require('fs');
const path = require('path');

// City coordinates
const cities = {
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Surat: { lat: 21.1702, lng: 72.8311 },
};

const categories = [
  'environment',
  'health',
  'education',
  'animals',
  'sports',
  'women empowerment',
  'technology',
  'volunteering',
  'children',
  'youth',
];

const causeTemplates = {
  environment: [
    { name: 'Tree Plantation Drive', desc: 'Plant native trees and restore green cover in urban areas.' },
    { name: 'Beach Cleanup Initiative', desc: 'Remove plastic waste from beaches and coastal areas.' },
    { name: 'Organic Farming Workshop', desc: 'Learn sustainable farming techniques and promote organic produce.' },
    { name: 'Solar Energy Awareness', desc: 'Educate communities about renewable energy and solar power.' },
    { name: 'Water Conservation Project', desc: 'Implement rainwater harvesting and reduce water wastage.' },
    { name: 'Waste Segregation Campaign', desc: 'Teach households proper waste management and recycling.' },
    { name: 'Urban Gardening Program', desc: 'Create rooftop and vertical gardens in city spaces.' },
    { name: 'River Cleaning Drive', desc: 'Clean polluted rivers and restore aquatic ecosystems.' },
    { name: 'Composting Workshop', desc: 'Convert kitchen waste into nutrient-rich compost.' },
    { name: 'Plastic-Free Streets', desc: 'Eliminate single-use plastics from local communities.' },
  ],
  health: [
    { name: 'Free Health Checkup Camp', desc: 'Provide basic health screenings for underprivileged communities.' },
    { name: 'Blood Donation Drive', desc: 'Organize blood donation camps to save lives.' },
    { name: 'Mental Health Awareness', desc: 'Reduce stigma and provide counseling support.' },
    { name: 'Yoga & Wellness Sessions', desc: 'Offer free yoga classes for physical and mental wellbeing.' },
    { name: 'COVID Vaccination Support', desc: 'Help elderly and disabled get vaccinated.' },
    { name: 'Nutrition Education Program', desc: 'Teach balanced diets and healthy eating habits.' },
    { name: 'Eye Screening Camp', desc: 'Provide free eye checkups and distribute glasses.' },
    { name: 'First Aid Training', desc: 'Teach life-saving emergency response skills.' },
    { name: 'Dental Care Initiative', desc: 'Offer free dental checkups and oral hygiene education.' },
    { name: 'Fitness for All', desc: 'Organize community fitness activities and sports.' },
  ],
  education: [
    { name: 'Evening Classes for Kids', desc: 'Teach underprivileged children after school hours.' },
    { name: 'Digital Literacy Program', desc: 'Provide computer skills training to rural communities.' },
    { name: 'Book Donation Campaign', desc: 'Collect and distribute books to libraries in need.' },
    { name: 'Career Counseling Sessions', desc: 'Guide students in making informed career choices.' },
    { name: 'English Speaking Classes', desc: 'Improve communication skills for job seekers.' },
    { name: 'Math & Science Tutoring', desc: 'Help students excel in STEM subjects.' },
    { name: 'Library Setup Project', desc: 'Build community libraries in underserved areas.' },
    { name: 'Scholarship Support Drive', desc: 'Raise funds for meritorious but poor students.' },
    { name: 'Vocational Training Center', desc: 'Teach practical skills like tailoring and carpentry.' },
    { name: 'Adult Literacy Program', desc: 'Teach reading and writing to adults who missed formal education.' },
  ],
  animals: [
    { name: 'Stray Dog Feeding Program', desc: 'Provide regular meals to street dogs in the locality.' },
    { name: 'Animal Shelter Support', desc: 'Help maintain shelters for abandoned pets.' },
    { name: 'Bird Conservation Project', desc: 'Protect local bird habitats and build nesting boxes.' },
    { name: 'Cow Rescue Initiative', desc: 'Save and rehabilitate injured or abandoned cattle.' },
    { name: 'Pet Adoption Drive', desc: 'Find loving homes for rescued animals.' },
    { name: 'Wildlife Awareness Campaign', desc: 'Educate about protecting endangered species.' },
    { name: 'Veterinary Camp', desc: 'Provide free medical care for community animals.' },
    { name: 'Cat Sterilization Program', desc: 'Control stray cat population humanely.' },
    { name: 'Elephant Corridor Protection', desc: 'Preserve natural migration routes for elephants.' },
    { name: 'Aquarium & Marine Life Care', desc: 'Maintain ethical aquatic animal habitats.' },
  ],
  sports: [
    { name: 'Cricket Coaching for Kids', desc: 'Train underprivileged children in cricket fundamentals.' },
    { name: 'Marathon for a Cause', desc: 'Organize charity runs to raise awareness and funds.' },
    { name: 'Football Academy', desc: 'Provide professional football training to aspiring players.' },
    { name: 'Badminton Training Camp', desc: 'Teach badminton skills and promote fitness.' },
    { name: 'Sports Equipment Donation', desc: 'Collect and distribute sports gear to schools.' },
    { name: 'Community Cycling Event', desc: 'Promote eco-friendly transport through group rides.' },
    { name: 'Basketball League', desc: 'Organize local tournaments for youth engagement.' },
    { name: 'Swimming Lessons', desc: 'Teach water safety and swimming to children.' },
    { name: 'Yoga & Athletics', desc: 'Combine traditional yoga with modern athletic training.' },
    { name: 'Chess Championship', desc: 'Conduct mental sports competitions for all ages.' },
  ],
  'women empowerment': [
    { name: 'Self-Defense Training', desc: 'Teach martial arts and safety techniques to women.' },
    { name: 'Entrepreneurship Workshop', desc: 'Help women start their own businesses.' },
    { name: 'Skill Development Classes', desc: 'Provide training in stitching, handicrafts, and more.' },
    { name: 'Legal Rights Awareness', desc: 'Educate women about their legal protections.' },
    { name: 'Women\'s Health Camp', desc: 'Offer specialized medical screenings for women.' },
    { name: 'Menstrual Hygiene Drive', desc: 'Distribute sanitary products and educate about menstrual health.' },
    { name: 'Financial Literacy Program', desc: 'Teach budgeting, savings, and investment basics.' },
    { name: 'Leadership Training', desc: 'Build confidence and leadership skills in young women.' },
    { name: 'Domestic Violence Support', desc: 'Provide counseling and legal aid to survivors.' },
    { name: 'Mother & Child Care', desc: 'Support maternal health and early childhood development.' },
  ],
  technology: [
    { name: 'Coding Classes for Kids', desc: 'Introduce children to programming and app development.' },
    { name: 'AI & Machine Learning Workshop', desc: 'Teach basics of artificial intelligence.' },
    { name: 'Web Development Bootcamp', desc: 'Train youth in building websites and web apps.' },
    { name: 'Robotics Club', desc: 'Engage students in hands-on robotics projects.' },
    { name: 'Cybersecurity Awareness', desc: 'Educate about online safety and data protection.' },
    { name: 'Mobile App Development', desc: 'Create Android/iOS apps for social causes.' },
    { name: 'Open Source Contribution', desc: 'Encourage participation in global tech communities.' },
    { name: 'Digital Marketing Skills', desc: 'Teach SEO, social media, and content marketing.' },
    { name: 'Tech for Seniors', desc: 'Help elderly learn smartphones and internet usage.' },
    { name: 'IoT Innovation Lab', desc: 'Build smart devices for solving local problems.' },
  ],
  volunteering: [
    { name: 'Community Kitchen Service', desc: 'Prepare and serve meals to the homeless.' },
    { name: 'Old Age Home Visits', desc: 'Spend time with elderly residents and provide companionship.' },
    { name: 'Disaster Relief Support', desc: 'Assist in rescue and rehabilitation during emergencies.' },
    { name: 'Orphanage Support Program', desc: 'Organize activities and donate supplies to orphanages.' },
    { name: 'Hospital Volunteer Program', desc: 'Help patients and support hospital staff.' },
    { name: 'Slum Beautification', desc: 'Paint murals and improve living conditions in slums.' },
    { name: 'Event Management Help', desc: 'Volunteer at NGO events and fundraisers.' },
    { name: 'Helpline Support', desc: 'Answer calls for crisis hotlines and counseling services.' },
    { name: 'Festival Celebration with Needy', desc: 'Share joy by celebrating festivals with underprivileged.' },
    { name: 'Traffic Awareness Campaign', desc: 'Educate citizens about road safety rules.' },
  ],
  children: [
    { name: 'Storytelling Sessions', desc: 'Read stories and nurture imagination in young minds.' },
    { name: 'Art & Craft Classes', desc: 'Teach painting, drawing, and creative activities.' },
    { name: 'Toy Donation Drive', desc: 'Collect and distribute toys to underprivileged children.' },
    { name: 'Child Rights Awareness', desc: 'Educate about child labor and protection laws.' },
    { name: 'Immunization Support', desc: 'Help ensure all children receive necessary vaccinations.' },
    { name: 'Music & Dance Classes', desc: 'Introduce children to performing arts.' },
    { name: 'Nutrition Supplementation', desc: 'Provide healthy meals to malnourished kids.' },
    { name: 'Child Safety Workshop', desc: 'Teach kids about stranger danger and online safety.' },
    { name: 'Science Experiment Lab', desc: 'Make learning fun through hands-on experiments.' },
    { name: 'Reading Buddies Program', desc: 'Mentor young readers to improve literacy.' },
  ],
  youth: [
    { name: 'Youth Leadership Summit', desc: 'Develop future leaders through interactive sessions.' },
    { name: 'Internship Placement Drive', desc: 'Connect students with job opportunities.' },
    { name: 'Mental Health Peer Support', desc: 'Create safe spaces for youth to discuss challenges.' },
    { name: 'Music Band Formation', desc: 'Help young musicians form bands and perform.' },
    { name: 'Public Speaking Club', desc: 'Build confidence through debate and speech training.' },
    { name: 'Environmental Youth Group', desc: 'Mobilize young people for climate action.' },
    { name: 'Creative Writing Workshop', desc: 'Encourage storytelling and poetry among youth.' },
    { name: 'Startup Incubation', desc: 'Mentor young entrepreneurs in launching startups.' },
    { name: 'Photography Club', desc: 'Teach photography skills and organize exhibitions.' },
    { name: 'Social Media Activism', desc: 'Use digital platforms for social change campaigns.' },
  ],
};

function generateCauses() {
  const causes = [];
  let id = 1;

  const cityNames = Object.keys(cities);

  // Generate 20 causes per category (10 categories = 200 total)
  categories.forEach((category) => {
    const templates = causeTemplates[category];

    for (let i = 0; i < 20; i++) {
      const template = templates[i % templates.length];
      const city = cityNames[Math.floor(Math.random() * cityNames.length)];
      const coords = cities[city];

      // Add slight random offset to coordinates for variety
      const lat = coords.lat + (Math.random() - 0.5) * 0.1;
      const lng = coords.lng + (Math.random() - 0.5) * 0.1;

      causes.push({
        id: id++,
        name: `${template.name} - ${city}`,
        description: template.desc,
        category: category,
        city: city,
        lat: parseFloat(lat.toFixed(4)),
        lng: parseFloat(lng.toFixed(4)),
      });
    }
  });

  return causes;
}

// Generate and save causes
const causes = generateCauses();
const outputPath = path.join(__dirname, 'causes.json');
fs.writeFileSync(outputPath, JSON.stringify(causes, null, 2));

console.log(`✅ Generated ${causes.length} causes`);
console.log(`📄 Saved to: ${outputPath}`);
console.log(`📊 Categories: ${categories.join(', ')}`);
console.log(`🌍 Cities: ${Object.keys(cities).join(', ')}`);
