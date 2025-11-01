import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Calendar, Save, Shield } from 'lucide-react';
import api from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    interests: '',
    availability: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          city: userData.city || '',
          interests: userData.interests || '',
          availability: userData.availability || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const response = await api.put(`/api/users/${userId}`, formData);

      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl shadow-xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
              placeholder="your.email@example.com"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* City */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Bangalore, Mumbai, Delhi..."
            />
          </div>

          {/* Interests */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Shield className="w-4 h-4" />
              Interests
            </label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="Environment, Education, Health..."
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of interests</p>
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              Availability
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-purple-500 focus:outline-none transition-colors"
            >
              <option value="weekends">Weekends Only</option>
              <option value="evenings">Evenings</option>
              <option value="flexible">Flexible</option>
              <option value="full-time">Full Time</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </form>

        {/* Account Info */}
        <div className="mt-8 pt-8 border-t border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Account Type</p>
              <p className="font-semibold text-purple-600 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Impact Score</p>
              <p className="font-semibold text-green-600">{user.impactScore || 0} points</p>
            </div>
            <div>
              <p className="text-gray-600">Badges Earned</p>
              <p className="font-semibold text-yellow-600">
                {user.badges?.length > 0 ? user.badges.join(', ') : 'None yet'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Verification Status</p>
              <p className={`font-semibold ${user.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user.verified ? '✓ Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSettings;
