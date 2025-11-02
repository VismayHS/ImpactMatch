import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../utils/axiosConfig';

// Fixed cities list from database enum
const AVAILABLE_CITIES = [
  'Bangalore', 'Mumbai', 'Jaipur', 'Delhi', 'Kolkata', 
  'Surat', 'Chennai', 'Pune', 'Lucknow', 'Hyderabad'
];

function OrganisationCauses() {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  
  // Filters
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNGO, setSelectedNGO] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cities] = useState(AVAILABLE_CITIES); // Use fixed cities list
  
  // Collaboration Modal
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [selectedCause, setSelectedCause] = useState(null);
  const [collabForm, setCollabForm] = useState({
    volunteers: '',
    message: '',
    proposedDate: ''
  });

  useEffect(() => {
    fetchCauses();
  }, []); // Removed fetchFilters since we use fixed cities

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/causes');
      if (response.data && response.data.causes) {
        setCauses(response.data.causes);
      }
    } catch (error) {
      console.error('Failed to fetch causes:', error);
      toast.error('Failed to load causes');
    } finally {
      setLoading(false);
    }
  };

  // Removed fetchFilters - using fixed AVAILABLE_CITIES instead

  // Filter causes
  const filteredCauses = causes.filter(cause => {
    const cityMatch = selectedCity === 'all' || cause.city === selectedCity;
    const categoryMatch = selectedCategory === 'all' || cause.category === selectedCategory;
    const ngoMatch = selectedNGO === 'all' || cause.ngoId?.name === selectedNGO;
    const searchMatch = searchQuery === '' || 
      cause.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cause.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return cityMatch && categoryMatch && ngoMatch && searchMatch;
  });

  // Get unique NGOs
  const uniqueNGOs = [...new Set(causes.map(c => c.ngoId?.name).filter(Boolean))];

  const handleCollaborate = (cause) => {
    setSelectedCause(cause);
    setShowCollabModal(true);
    // Auto-fill organization info
    const orgData = JSON.parse(localStorage.getItem('user') || '{}');
    setCollabForm({
      volunteers: '10',
      message: `Hi, we're interested in collaborating on "${cause.name}". We'd like to contribute volunteers to support this initiative.`,
      proposedDate: ''
    });
  };

  const submitCollaboration = async () => {
    try {
      const orgData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!orgData.id) {
        toast.error('Please log in to send collaboration requests');
        return;
      }

      if (!selectedCause?.ngoId?._id) {
        toast.error('NGO information not available');
        return;
      }

      const requestData = {
        organisationId: orgData.id,
        ngoId: selectedCause.ngoId._id,
        causeId: selectedCause._id,
        volunteersOffered: parseInt(collabForm.volunteers) || 0,
        message: collabForm.message,
        proposedDate: collabForm.proposedDate
      };

      console.log('Sending collaboration request:', requestData);

      const response = await api.post('/api/partnerships', requestData);

      if (response.data) {
        toast.success(`Collaboration request sent to ${selectedCause.ngoId?.name || 'NGO'}!`);
        setShowCollabModal(false);
        setCollabForm({ volunteers: '', message: '', proposedDate: '' });
      }
    } catch (error) {
      console.error('Failed to send collaboration request:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to send request');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading causes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900">🌍 Cause Discovery Panel</h3>
            <p className="text-gray-600 mt-1">Browse and discover causes from verified NGOs</p>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              📋 Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 Calendar View
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search causes by name or description..."
              className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-medium"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📍 Filter by City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-semibold"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🎯 Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-semibold"
            >
              <option value="all">All Categories</option>
              <option value="environment">🌱 Environment</option>
              <option value="education">📚 Education</option>
              <option value="health">❤️ Health</option>
              <option value="animal welfare">🐾 Animal Welfare</option>
              <option value="social welfare">🤲 Social Welfare</option>
              <option value="youth">👦 Youth</option>
            </select>
          </div>

          {/* NGO Filter */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">🏢 Filter by NGO</label>
            <select
              value={selectedNGO}
              onChange={(e) => setSelectedNGO(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-semibold"
            >
              <option value="all">All NGOs</option>
              {uniqueNGOs.map(ngo => (
                <option key={ngo} value={ngo}>{ngo}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Showing {filteredCauses.length} causes</strong>
            {selectedCity !== 'all' && ` in ${selectedCity}`}
            {selectedCategory !== 'all' && ` (${selectedCategory})`}
            {selectedNGO !== 'all' && ` from ${selectedNGO}`}
          </p>
        </div>
      </motion.div>

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Cause Name</th>
                  <th className="px-6 py-4 text-left font-bold">NGO Name</th>
                  <th className="px-6 py-4 text-left font-bold">Category</th>
                  <th className="px-6 py-4 text-left font-bold">Location</th>
                  <th className="px-6 py-4 text-left font-bold">Status</th>
                  <th className="px-6 py-4 text-left font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCauses.map((cause, index) => (
                  <motion.tr
                    key={cause._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{cause.name}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">{cause.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏢</span>
                        <span className="font-semibold text-gray-700">{cause.ngoId?.name || 'NGO'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
                        {cause.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>📍</span>
                        <span className="font-medium">{cause.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCollaborate(cause)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                      >
                        🤝 Collaborate
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCauses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No causes found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h3 className="text-2xl font-black text-gray-900 mb-6">📅 Upcoming Causes Timeline</h3>
          <div className="space-y-4">
            {filteredCauses.slice(0, 10).map((cause, index) => (
              <motion.div
                key={cause._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="text-3xl font-black text-blue-600">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">Nov 2024</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-900 text-lg mb-1">{cause.name}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <span>🏢</span> {cause.ngoId?.name || 'NGO'}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <span>📍</span> {cause.city}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                      {cause.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCollaborate(cause)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                >
                  🤝 Collaborate
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Collaboration Modal */}
      {showCollabModal && selectedCause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-black text-gray-900">🤝 Collaboration Request</h3>
              <button
                onClick={() => setShowCollabModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-2">{selectedCause.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{selectedCause.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span>🏢</span> {selectedCause.ngoId?.name || 'NGO'}
                </span>
                <span className="flex items-center gap-1">
                  <span>📍</span> {selectedCause.city}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Number of Volunteers
                </label>
                <input
                  type="number"
                  value={collabForm.volunteers}
                  onChange={(e) => setCollabForm({ ...collabForm, volunteers: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  placeholder="e.g., 20"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Proposed Date (Optional)
                </label>
                <input
                  type="date"
                  value={collabForm.proposedDate}
                  onChange={(e) => setCollabForm({ ...collabForm, proposedDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Message to NGO
                </label>
                <textarea
                  value={collabForm.message}
                  onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                  rows="4"
                  placeholder="Tell the NGO about your interest..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={submitCollaboration}
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                ✉️ Send Collaboration Request
              </button>
              <button
                onClick={() => setShowCollabModal(false)}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default OrganisationCauses;
