import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ModernIcon, FeatureIcon } from './IconSystem';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// City coordinates for mapping
const cityCoordinates = {
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Pune': { lat: 18.5204, lng: 73.8567 },
  'Hyderabad': { lat: 17.3850, lng: 78.4867 },
  'Kolkata': { lat: 22.5726, lng: 88.3639 },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
  'Jaipur': { lat: 26.9124, lng: 75.7873 },
  'Lucknow': { lat: 26.8467, lng: 80.9462 },
  'Chandigarh': { lat: 30.7333, lng: 76.7794 },
  'Kochi': { lat: 9.9312, lng: 76.2673 },
  'Indore': { lat: 22.7196, lng: 75.8577 },
  'Nagpur': { lat: 21.1458, lng: 79.0882 },
  'Bhopal': { lat: 23.2599, lng: 77.4126 },
};

// Get coordinates from city name or return default
const getCityCoordinates = (cityName) => {
  if (!cityName) return { lat: 20.5937, lng: 78.9629 }; // India center
  
  // Try exact match first
  if (cityCoordinates[cityName]) {
    return cityCoordinates[cityName];
  }
  
  // Try case-insensitive match
  const cityKey = Object.keys(cityCoordinates).find(
    key => key.toLowerCase() === cityName.toLowerCase()
  );
  
  if (cityKey) {
    return cityCoordinates[cityKey];
  }
  
  // Return India center if city not found
  return { lat: 20.5937, lng: 78.9629 };
};

export default function MapView({ user }) {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center

  useEffect(() => {
    loadMapData();
  }, [user]);

  const loadMapData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Fetch all causes from database
      const response = await axios.get(`${API_BASE_URL}/api/match/causes`);
      
      if (response.data && response.data.length > 0) {
        // Transform causes with coordinates
        const causesWithCoords = response.data.map((cause, index) => {
          let coords;
          
          // Use existing lat/lng if available
          if (cause.lat && cause.lng) {
            coords = { lat: cause.lat, lng: cause.lng };
          } else {
            // Get coordinates from city name
            coords = getCityCoordinates(cause.city);
            
            // Add slight offset to prevent exact overlap (0.01 to 0.05 degrees)
            const offset = (index % 5) * 0.015;
            coords = {
              lat: coords.lat + offset * (index % 2 === 0 ? 1 : -1),
              lng: coords.lng + offset * (index % 3 === 0 ? 1 : -1)
            };
          }
          
          return {
            id: cause._id,
            name: cause.name,
            description: cause.description,
            category: cause.category,
            city: cause.city,
            lat: coords.lat,
            lng: coords.lng,
            verified: Math.random() > 0.5, // Random verification for demo
          };
        });
        
        setMapData(causesWithCoords);
        
        // Set center to first cause
        if (causesWithCoords.length > 0) {
          setCenter([causesWithCoords[0].lat, causesWithCoords[0].lng]);
        }
        
        toast.success(`Loaded ${causesWithCoords.length} causes from database`);
      } else {
        setError(true);
        toast.info('No causes found in database');
      }
    } catch (err) {
      console.error('Map data loading error:', err);
      setError(true);
      toast.error('Failed to load causes from database');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <motion.div
            className="relative mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full"></div>
          </motion.div>
          <p className="text-xl font-semibold text-gray-700">Loading map...</p>
          <p className="text-sm text-gray-500 mt-2">Discovering impact locations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <h1 className="text-5xl font-black text-gray-900 mb-3 flex items-center gap-3">
            <FeatureIcon name="map" gradient="teal" animated={true} />
            <span className="bg-gradient-to-r from-[#00C6A7] to-[#007CF0] bg-clip-text text-transparent">
              Impact Map
            </span>
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            See where you're making a difference across the country
          </p>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-4 py-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-xl flex items-center gap-2"
            >
              <ModernIcon name="causes" size="sm" gradient="blue" animated={false} glow={false} />
              <span className="font-semibold">Showing sample locations for demonstration</span>
            </motion.div>
          )}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap items-center justify-center gap-6 border border-emerald-100"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-emerald-500 animate-pulse shadow-lg"></div>
              <div className="absolute inset-0 w-6 h-6 rounded-full bg-emerald-400 animate-ping opacity-50"></div>
            </div>
            <span className="text-base font-bold text-gray-800">Verified Causes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-500 shadow-lg"></div>
            <span className="text-base font-bold text-gray-800">Active Causes</span>
          </div>
          <div className="flex items-center gap-3">
            <ModernIcon name="location" size="sm" gradient="teal" animated={false} glow={false} />
            <span className="text-base font-bold text-gray-800">Your Impact Zones</span>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-emerald-100"
          style={{ height: '650px' }}
        >
          {mapData.length === 0 ? (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="text-center p-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6 flex justify-center"
                >
                  <FeatureIcon name="map" gradient="teal" animated={true} />
                </motion.div>
                <h3 className="text-3xl font-black text-gray-800 mb-3">No Locations Yet</h3>
                <p className="text-xl text-gray-600 mb-6">
                  Join causes to see them appear on the map!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg"
                  onClick={() => window.location.href = '/swipe'}
                >
                  Explore Causes →
                </motion.button>
              </div>
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {mapData.map((cause) => {
                if (!cause.lat || !cause.lng) return null;
                
                const isVerified = cause.verified;
                
                return isVerified ? (
                  <CircleMarker
                    key={cause.id}
                    center={[cause.lat, cause.lng]}
                    radius={15}
                    pathOptions={{
                      color: '#10b981',
                      fillColor: '#10b981',
                      fillOpacity: 0.7,
                      weight: 3,
                    }}
                    className="marker-pulse"
                  >
                    <Popup>
                      <div className="p-3 min-w-[250px]">
                        <div className="flex items-start gap-2 mb-3">
                          <ModernIcon 
                            name={cause.category === 'Environment' ? 'local-discovery' : cause.category === 'Education' ? 'ai-matching' : cause.category === 'Social Welfare' ? 'dashboard' : 'transparent-tracking'}
                            size="lg"
                            gradient={cause.category === 'Environment' ? 'teal' : cause.category === 'Education' ? 'blue' : 'violet'}
                            animated={false}
                            glow={false}
                          />
                          <div>
                            <h3 className="font-black text-lg text-gray-900 mb-1">
                              {cause.name}
                            </h3>
                            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-2">
                              {cause.category || 'Social Impact'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {cause.description}
                        </p>
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg">
                          <ModernIcon name="transparent-tracking" size="xs" gradient="teal" animated={false} glow={false} />
                          <span>Verified Impact Zone</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ) : (
                  <Marker
                    key={cause.id}
                    position={[cause.lat, cause.lng]}
                  >
                    <Popup>
                      <div className="p-3 min-w-[250px]">
                        <div className="flex items-start gap-2 mb-3">
                          <ModernIcon 
                            name={cause.category === 'Animal Welfare' ? 'impact-scoring' : cause.category === 'Education' ? 'ai-matching' : 'transparent-tracking'}
                            size="lg"
                            gradient={cause.category === 'Animal Welfare' ? 'tealBlue' : cause.category === 'Education' ? 'blue' : 'violet'}
                            animated={false}
                            glow={false}
                          />
                          <div>
                            <h3 className="font-black text-lg text-gray-900 mb-1">
                              {cause.name}
                            </h3>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full mb-2">
                              {cause.category || 'Community'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {cause.description}
                        </p>
                        <div className="px-3 py-2 bg-blue-500 text-white text-sm font-bold rounded-lg">
                          Active Cause
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-emerald-100">
            <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              {mapData.filter(c => c.verified).length}
            </div>
            <div className="text-base font-bold text-gray-700">Verified Locations</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-blue-100">
            <div className="text-5xl font-black text-blue-600 mb-2">
              {mapData.filter(c => !c.verified).length}
            </div>
            <div className="text-base font-bold text-gray-700">Active Causes</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center border border-purple-100">
            <div className="text-5xl font-black text-purple-600 mb-2">
              {mapData.length}
            </div>
            <div className="text-base font-bold text-gray-700">Total Impact Zones</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
