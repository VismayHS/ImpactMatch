import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

function OrganisationSettings() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    officeAddress: '',
    phone: '',
    website: ''
  });

  useEffect(() => {
    // Load user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setFormData({
      name: userData.name || '',
      email: userData.email || '',
      officeAddress: userData.officeAddress || '',
      phone: userData.phone || '',
      website: userData.website || ''
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle save logic
    console.log('Saving settings:', formData);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6">Organisation Settings</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Organisation Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Office Address</label>
            <textarea
              value={formData.officeAddress}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                placeholder="https://"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            💾 Save Changes
          </motion.button>
        </form>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-8"
      >
        <h4 className="text-xl font-black text-red-900 mb-4">⚠️ Danger Zone</h4>
        <p className="text-red-700 mb-4">
          Once you delete your organisation account, there is no going back. Please be certain.
        </p>
        <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">
          Delete Organisation Account
        </button>
      </motion.div>
    </div>
  );
}

export default OrganisationSettings;
