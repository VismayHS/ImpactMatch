import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getDashboard } from '../api/matchAPI';
import ProgressBar from './ProgressBar';
import BadgeDisplay from './BadgeDisplay';
import { formatDate } from '../utils/formatters';
import { toast } from 'react-toastify';

// Admin Dashboard Component
import AdminDashboard  from './dashboards/AdminDashboard';

const COLORS = ['#16A34A', '#34D399', '#6B7280', '#F59E0B', '#EF4444', '#8B5CF6'];

function RegularDashboard({ user, setUser }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Personalization state
  const [showCustomization, setShowCustomization] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadFilterOptions();
    loadUserPreferences();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await getDashboard(user._id || user.id);
      setDashboardData(response);
      // Update user object with latest data
      if (response.user && setUser) {
        setUser(response.user);
      }
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/causes/filters/options`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCategories(data.categories || []);
      setCities(data.cities || []);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = user._id || user.id;
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setSelectedInterests(data.selectedInterests || []);
      setSelectedCities(data.selectedCities || []);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  };

  const savePreferences = async () => {
    setSavingPreferences(true);
    try {
      const token = localStorage.getItem('token');
      const userId = user._id || user.id;
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedInterests,
          selectedCities
        })
      });
      toast.success('Preferences saved! Your cause feed will now be personalized.');
      setShowCustomization(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSavingPreferences(false);
    }
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleCity = (city) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading your impact...</p>
        </div>
      </div>
    );
  }

  const { user: userData, joined = [], verified = [], analytics = [] } = dashboardData || {};

  // Prepare chart data
  const chartData = analytics.map((item, index) => ({
    name: item.category,
    value: item.count,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-bg-soft p-4 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.name || user.name}! 👋
          </h1>
          <p className="text-secondary">Track your impact journey</p>
        </motion.div>

        {/* Customization Banner (Only for regular users) */}
        {user.role === 'user' && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-soft p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">🎯 Customize Your Cause Feed</h3>
                  <p className="text-green-50">
                    {selectedInterests.length > 0 || selectedCities.length > 0
                      ? `Personalized for ${selectedInterests.length} interests${selectedCities.length > 0 ? ` in ${selectedCities.length} cities` : ''}`
                      : 'Select your interests and cities to see the most relevant causes'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCustomization(!showCustomization)}
                  className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors ml-4"
                >
                  {showCustomization ? 'Hide' : 'Customize'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Customization Panel (Only for regular users) */}
        {user.role === 'user' && showCustomization && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 bg-white rounded-xl shadow-soft p-6"
          >
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Your Preferences</h4>
            
            {/* Interests */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-3">🎨 Interests (Categories)</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleInterest(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedInterests.includes(category)
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div className="mb-6">
              <h5 className="font-medium text-gray-700 mb-3">📍 Preferred Cities</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCities.includes(city)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCustomization(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                disabled={savingPreferences}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPreferences ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Impact Score */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <ProgressBar score={userData?.impactScore || 0} />
          </motion.div>

          {/* Joined Causes */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {joined.length}
              </div>
              <div className="text-sm text-secondary">Causes Joined</div>
            </div>
          </motion.div>

          {/* Verified Impacts */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-light mb-2">
                {verified.length}
              </div>
              <div className="text-sm text-secondary">Verified Impacts</div>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <BadgeDisplay
            badges={userData?.badges || []}
            impactScore={userData?.impactScore || 0}
          />
        </motion.div>

        {/* Category Analytics */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-soft p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Impact by Category
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Joined Causes List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Joined Causes
          </h3>
          {joined.length === 0 ? (
            <p className="text-secondary text-center py-8">
              No causes joined yet. Start swiping!
            </p>
          ) : (
            <div className="space-y-3">
              {joined.map((match) => (
                <div
                  key={match._id}
                  className="flex items-center justify-between p-4 bg-bg-soft rounded-lg hover:bg-gray-100 transition-colors duration-150"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {match.cause?.name || 'Unknown Cause'}
                    </h4>
                    <p className="text-xs text-secondary mt-1">
                      Joined {formatDate(match.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'verified'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Verified Impacts */}
        {verified.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-soft p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Verified Impacts 🎉
            </h3>
            <div className="space-y-3">
              {verified.map((match) => (
                <div
                  key={match._id}
                  onClick={() => setSelectedMatch(match)}
                  className="flex items-center justify-between p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-150 cursor-pointer"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {match.cause?.name || 'Unknown Cause'}
                    </h4>
                    <p className="text-xs text-secondary mt-1">
                      Verified {formatDate(match.verifiedAt)}
                    </p>
                  </div>
                  <span className="text-primary text-sm">View →</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal for verified match details */}
      {selectedMatch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedMatch(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              🎉 Verified Impact
            </h3>
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-secondary">Cause:</span>
                <p className="font-semibold">{selectedMatch.cause?.name}</p>
              </div>
              <div>
                <span className="text-sm text-secondary">Transaction Hash:</span>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1 break-all">
                  {selectedMatch.txHash}
                </p>
              </div>
              <div>
                <span className="text-sm text-secondary">Verified On:</span>
                <p className="font-semibold">{formatDate(selectedMatch.verifiedAt)}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMatch(null)}
              className="w-full py-3 btn-gradient text-white rounded-lg font-medium"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Main Dashboard component with routing
export default function Dashboard({ user, setUser }) {
  const userRole = localStorage.getItem('userRole');
  
  // If admin, show full admin dashboard (it has its own nested Routes)
  if (userRole === 'admin') {
    return <AdminDashboard />;
  }
  
  // Regular user/NGO dashboard
  return <RegularDashboard user={user} setUser={setUser} />;
}
