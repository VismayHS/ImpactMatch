import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Flag, CheckCircle, XCircle, MapPin, Building2 } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const CauseManagement = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/causes');
      setCauses(response.data);
    } catch (error) {
      console.error('Error loading causes:', error);
      toast.error('Failed to load causes');
    } finally {
      setLoading(false);
    }
  };

  const handleFlag = async (causeId) => {
    if (!window.confirm('Flag this cause for review?')) return;
    
    try {
      await api.put(`/api/causes/${causeId}`, {
        status: 'flagged'
      });
      toast.success('Cause flagged');
      loadCauses();
    } catch (error) {
      toast.error('Failed to flag cause');
    }
  };

  const handleRemove = async (causeId) => {
    if (!window.confirm('Remove this cause permanently?')) return;
    
    try {
      await api.delete(`/api/causes/${causeId}`);
      toast.success('Cause removed');
      loadCauses();
    } catch (error) {
      toast.error('Failed to remove cause');
    }
  };

  const filteredCauses = causes.filter(c => {
    if (filter === 'active') return c.status === 'active';
    if (filter === 'flagged') return c.status === 'flagged';
    if (filter === 'pending') return c.status === 'pending_approval';
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Cause Management
        </h1>
        <p className="text-gray-600">Monitor and moderate platform causes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800">{causes.length}</h3>
          <p className="text-gray-600 text-sm">Total Causes</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">{causes.filter(c => c.status === 'active').length}</h3>
          <p className="text-gray-600 text-sm">Active</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-yellow-600">{causes.filter(c => c.status === 'pending_approval').length}</h3>
          <p className="text-gray-600 text-sm">Pending</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-red-600">{causes.filter(c => c.status === 'flagged').length}</h3>
          <p className="text-gray-600 text-sm">Flagged</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'pending', 'flagged'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === f ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredCauses.map((cause, index) => (
          <motion.div
            key={cause._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-pink-200 to-purple-200 flex-shrink-0 overflow-hidden">
                {cause.image ? (
                  <img src={`${API_BASE_URL}/${cause.image}`} alt={cause.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cause.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{cause.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    cause.status === 'active' ? 'bg-green-100 text-green-700' :
                    cause.status === 'flagged' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cause.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {cause.ngoId?.name || 'Unknown NGO'}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {cause.city || 'N/A'}
                  </div>
                  {cause.category && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">{cause.category}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {cause.status === 'active' && (
                    <button
                      onClick={() => handleFlag(cause._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Flag className="w-4 h-4" />
                      Flag
                    </button>
                  )}
                  <button
                    onClick={() => handleRemove(cause._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CauseManagement;
