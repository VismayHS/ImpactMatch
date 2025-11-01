import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

function OrganisationPartnerships() {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Fetch partnerships from API
  useEffect(() => {
    fetchPartnerships();
  }, []);

  const fetchPartnerships = async () => {
    try {
      setLoading(true);
      const orgData = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.log('🔍 Fetching partnerships for organisation:', orgData.id);
      
      const response = await api.get(`/api/partnerships?organisationId=${orgData.id}`);
      
      console.log('📦 Partnerships response:', response.data);
      
      // Extract partnerships array from response
      const partnershipData = response.data.partnerships || [];
      
      // Transform data for display
      const transformedData = partnershipData.map(p => ({
        id: p._id,
        ngoName: p.ngoId?.name || 'Unknown NGO',
        causeName: p.causeId?.name || p.causeId?.title || 'Unknown Cause',
        status: p.status === 'pending' ? 'Pending' : 
                p.status === 'approved' ? 'Approved' : 
                p.status === 'in-discussion' ? 'In Discussion' : 
                p.status === 'rejected' ? 'Rejected' : 'Pending',
        startDate: p.proposedDate || null,
        volunteersOffered: p.volunteersOffered || 0,
        message: p.message,
        responseMessage: p.responseMessage,
        lastUpdate: new Date(p.updatedAt).toLocaleDateString(),
        createdAt: p.createdAt,
        rawStatus: p.status
      }));
      
      console.log('✅ Transformed partnerships:', transformedData);
      
      setPartnerships(transformedData);
    } catch (error) {
      console.error('❌ Error fetching partnerships:', error);
      toast.error('Failed to load collaborations');
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'In Discussion': 'bg-blue-100 text-blue-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Confirmed': 'bg-purple-100 text-purple-800',
    'Completed': 'bg-gray-100 text-gray-800'
  };

  const filteredPartnerships = filter === 'all' 
    ? partnerships 
    : partnerships.filter(p => p.status === filter);

  const handleCancelRequest = async (partnershipId) => {
    try {
      await api.delete(`/api/partnerships/${partnershipId}`);
      toast.success('Request cancelled successfully');
      fetchPartnerships(); // Refresh the list
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl font-black mb-2">{partnerships.length}</div>
          <div className="text-purple-100 font-semibold">Total Requests</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl font-black mb-2">
            {partnerships.filter(p => p.rawStatus === 'approved').length}
          </div>
          <div className="text-green-100 font-semibold">Approved</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl font-black mb-2">
            {partnerships.filter(p => p.rawStatus === 'pending').length}
          </div>
          <div className="text-blue-100 font-semibold">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl font-black mb-2">
            {partnerships.filter(p => p.rawStatus === 'in-discussion').length}
          </div>
          <div className="text-orange-100 font-semibold">In Discussion</div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-4 shadow-lg"
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({partnerships.length})
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'Pending'
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ⏳ Pending ({partnerships.filter(p => p.status === 'Pending').length})
          </button>
          <button
            onClick={() => setFilter('Approved')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'Approved'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✅ Approved ({partnerships.filter(p => p.status === 'Approved').length})
          </button>
          <button
            onClick={() => setFilter('In Discussion')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'In Discussion'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            💬 In Discussion ({partnerships.filter(p => p.status === 'In Discussion').length})
          </button>
          <button
            onClick={() => setFilter('Confirmed')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              filter === 'Confirmed'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎉 Confirmed ({partnerships.filter(p => p.status === 'Confirmed').length})
          </button>
        </div>
      </motion.div>

      {/* Partnerships List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6">🤝 Collaboration Requests</h3>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading collaborations...</p>
          </div>
        ) : filteredPartnerships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {filter === 'all' 
                ? '📭 No collaboration requests yet. Browse causes to send your first request!' 
                : `No ${filter.toLowerCase()} requests found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPartnerships.map((partnership, index) => (
              <motion.div
                key={partnership.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{partnership.causeName}</h4>
                      <span className={`px-4 py-1 rounded-full text-xs font-bold ${statusColors[partnership.status]}`}>
                        {partnership.status === 'Pending' && '⏳ '}
                        {partnership.status === 'Approved' && '✅ '}
                        {partnership.status === 'In Discussion' && '💬 '}
                        {partnership.status === 'Rejected' && '❌ '}
                        {partnership.status}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      with <strong className="text-blue-600">{partnership.ngoName}</strong>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Submitted: {partnership.lastUpdate}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Proposed Date</p>
                    <p className="font-semibold text-gray-900">{partnership.startDate || 'Not specified'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Volunteers Offered</p>
                    <p className="font-semibold text-gray-900">{partnership.volunteersOffered}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="font-semibold text-gray-900">{partnership.status}</p>
                  </div>
                </div>

                {partnership.message && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-700 font-semibold mb-1">📝 Your Message</p>
                    <p className="text-sm text-blue-900">{partnership.message}</p>
                  </div>
                )}

                {partnership.responseMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-green-700 font-semibold mb-1">💬 NGO Response</p>
                    <p className="text-sm text-green-900">{partnership.responseMessage}</p>
                  </div>
                )}
                
                <div className="flex gap-3 justify-end">
                  {partnership.rawStatus === 'pending' && (
                    <button 
                      onClick={() => {
                        if (confirm('Are you sure you want to cancel this request?')) {
                          handleCancelRequest(partnership.id);
                        }
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Notification Center - REMOVED old static content */}
    </div>
  );
}

export default OrganisationPartnerships;
