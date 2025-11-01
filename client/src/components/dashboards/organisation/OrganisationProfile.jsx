import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function OrganisationProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    mission: '',
    logo: '',
    email: '',
    phone: '',
    website: '',
    officeAddress: '',
    establishedYear: '',
    employeeCount: '',
    industry: ''
  });

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setProfileData({
      name: userData.name || '',
      description: 'Leading technology company committed to social responsibility and community impact.',
      mission: 'Empowering communities through technology and volunteerism.',
      logo: '',
      email: userData.email || '',
      phone: '+91 1234567890',
      website: 'https://example.com',
      officeAddress: userData.officeAddress || '123 Tech Park, Bangalore, India',
      establishedYear: '2015',
      employeeCount: '500+',
      industry: 'Technology'
    });
  }, []);

  const handleSave = () => {
    // Save logic here
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-3xl font-black text-gray-900">🧩 Organization Profile</h3>
          <p className="text-gray-600 mt-1">Manage your organization's identity on the platform</p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
            >
              💾 Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>

      {/* Organization Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center text-6xl font-black text-blue-600 shadow-lg">
            🏢
          </div>
          
          {/* Organization Info */}
          <div className="flex-1">
            <h2 className="text-4xl font-black mb-2">{profileData.name}</h2>
            <p className="text-blue-100 text-lg mb-4">{profileData.description}</p>
            <div className="flex gap-4">
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                🏭 {profileData.industry}
              </span>
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                📅 Est. {profileData.establishedYear}
              </span>
              <span className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-semibold">
                👥 {profileData.employeeCount} Employees
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Editable Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h4 className="text-2xl font-black text-gray-900 mb-6">📝 Organization Details</h4>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Organization Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Industry *</label>
              <input
                type="text"
                value={profileData.industry}
                onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={profileData.description}
              onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none disabled:bg-gray-50 disabled:text-gray-600"
              rows="3"
              placeholder="Tell others about your organization..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mission Statement</label>
            <textarea
              value={profileData.mission}
              onChange={(e) => setProfileData({ ...profileData, mission: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none disabled:bg-gray-50 disabled:text-gray-600"
              rows="2"
              placeholder="Your organization's mission..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="https://"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Established Year</label>
              <input
                type="text"
                value={profileData.establishedYear}
                onChange={(e) => setProfileData({ ...profileData, establishedYear: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Employee Count</label>
              <input
                type="text"
                value={profileData.employeeCount}
                onChange={(e) => setProfileData({ ...profileData, employeeCount: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="e.g., 500+"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Office Address *</label>
              <input
                type="text"
                value={profileData.officeAddress}
                onChange={(e) => setProfileData({ ...profileData, officeAddress: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Impact Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h4 className="text-2xl font-black text-gray-900 mb-4">🌟 Social Impact Commitment</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl">
            <div className="text-4xl mb-2">🌱</div>
            <h5 className="font-bold text-gray-900 mb-2">Sustainability Goals</h5>
            <p className="text-sm text-gray-600">Carbon neutral by 2030</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="text-4xl mb-2">🎓</div>
            <h5 className="font-bold text-gray-900 mb-2">Education Focus</h5>
            <p className="text-sm text-gray-600">Supporting 1000+ students annually</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="text-4xl mb-2">💜</div>
            <h5 className="font-bold text-gray-900 mb-2">Community Engagement</h5>
            <p className="text-sm text-gray-600">100% employee participation</p>
          </div>
        </div>
      </motion.div>

      {/* Public Profile Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h4 className="text-2xl font-black text-gray-900 mb-4">👁️ Public Profile Preview</h4>
        <p className="text-gray-600 mb-4">This is how NGOs and other organizations will see your profile</p>
        <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-xl flex items-center justify-center text-3xl font-black">
              🏢
            </div>
            <div>
              <h5 className="text-xl font-black text-gray-900">{profileData.name}</h5>
              <p className="text-sm text-gray-600">{profileData.industry} • Est. {profileData.establishedYear}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">{profileData.description}</p>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
              🥉 Bronze Partner
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
              ✓ Verified Organization
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrganisationProfile;
