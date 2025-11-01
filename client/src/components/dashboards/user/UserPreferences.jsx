import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Save, RefreshCw } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

// City-based preferences component (interests removed)
const UserPreferences = () => {
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilterOptions();
    loadUserPreferences();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await api.get('/api/causes/filters/options');
      setCities(response.data.cities || []);
    } catch (error) {
      console.error('Error loading filter options:', error);
      toast.error('Failed to load filter options');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id || userData?._id;
      if (userId) {
        // First try to load from localStorage (faster and shows immediately after save)
        if (userData.selectedCities) {
          const cities = userData.selectedCities || [];
          
          setSelectedCities(cities);
          
          console.log('📋 Loaded city preferences from localStorage:', {
            cities: cities.length,
            citiesList: cities
          });
        } else {
          // Fallback to database if not in localStorage
          const response = await api.get(`/api/users/${userId}`);
          const cities = response.data.selectedCities || [];
          
          setSelectedCities(cities);
          
          console.log('📋 Loaded city preferences from database:', {
            cities: cities.length,
            citiesList: cities
          });
        }
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      setSavingPreferences(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const userId = userData?.id || userData?._id;
      
      await api.put(`/api/users/${userId}`, {
        selectedCities
      });
      
      // ✅ UPDATE LOCALSTORAGE TO PERSIST PREFERENCES
      const updatedUser = {
        ...userData,
        selectedCities
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ City preferences saved and localStorage updated:', { 
        selectedCities 
      });
      
      toast.success('✅ City preferences saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSavingPreferences(false);
    }
  };

  const toggleCity = (city) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const clearAll = () => {
    setSelectedCities([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          My City Preferences
        </h1>
        <p className="text-gray-600">Select your preferred cities to see relevant causes in your area</p>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">How it works</h3>
            <p className="text-sm text-gray-600">
              Select your preferred cities below. When you visit the "Discover Causes" page, 
              we'll show you ONLY causes from the cities you've selected, ranked by relevance.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preferences Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-6">
        {/* Cities Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Select Your Cities
            </h2>
            <span className="text-sm text-gray-500">
              {selectedCities.length} selected
            </span>
          </div>
          
          {cities.length === 0 ? (
            <p className="text-gray-500 text-sm">No cities available</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {cities.map(city => (
                <motion.button
                  key={city}
                  onClick={() => toggleCity(city)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    selectedCities.includes(city)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedCities.includes(city) && '✓ '}
                  {city}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <motion.button
            onClick={savePreferences}
            disabled={savingPreferences}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {savingPreferences ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={clearAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            Clear All
          </motion.button>
        </div>

        {/* Preview */}
        {selectedCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Your City Preferences Summary</h3>
            <div className="space-y-2 text-sm">
              {selectedCities.length > 0 && (
                <p className="text-gray-700">
                  <span className="font-semibold">Cities:</span> {selectedCities.join(', ')}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;
