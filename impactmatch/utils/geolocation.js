// Simple city-to-city distance table and nearby city logic
// In a production app, this would use real geolocation APIs

const cityCoordinates = {
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Delhi: { lat: 28.7041, lng: 77.1025 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Surat: { lat: 21.1702, lng: 72.8311 },
};

const nearbyCities = {
  Bangalore: ['Chennai', 'Hyderabad', 'Pune'],
  Mumbai: ['Pune', 'Surat'],
  Delhi: ['Lucknow', 'Jaipur'],
  Chennai: ['Bangalore', 'Hyderabad'],
  Pune: ['Mumbai', 'Bangalore'],
  Kolkata: ['Lucknow'],
  Hyderabad: ['Chennai', 'Bangalore'],
  Jaipur: ['Delhi', 'Lucknow'],
  Lucknow: ['Delhi', 'Kolkata', 'Jaipur'],
  Surat: ['Mumbai'],
};

function getNearbyCities(city) {
  return [city, ...(nearbyCities[city] || [])];
}

function getCityCoordinates(city) {
  return cityCoordinates[city] || null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = {
  getNearbyCities,
  getCityCoordinates,
  calculateDistance,
  cityCoordinates,
};
