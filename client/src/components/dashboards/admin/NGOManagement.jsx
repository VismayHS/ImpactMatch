import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, FileText, Mail, MapPin, Calendar, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const NGOManagement = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      const ngoUsers = response.data.filter(u => u.role === 'ngo');
      setNgos(ngoUsers);
    } catch (error) {
      console.error('Error loading NGOs:', error);
      toast.error('Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ngoId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/users/${ngoId}`, {
        verified: true
      });
      toast.success('NGO approved successfully!');
      loadNGOs();
    } catch (error) {
      console.error('Error approving NGO:', error);
      toast.error('Failed to approve NGO');
    }
  };

  const handleReject = async (ngoId) => {
    if (!window.confirm('Are you sure you want to reject this NGO?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${ngoId}`);
      toast.success('NGO rejected and removed');
      loadNGOs();
    } catch (error) {
      console.error('Error rejecting NGO:', error);
      toast.error('Failed to reject NGO');
    }
  };

  const filteredNGOs = ngos.filter(ngo => {
    if (filter === 'pending') return !ngo.verified;
    if (filter === 'verified') return ngo.verified;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          NGO Management
        </h1>
        <p className="text-gray-600">Review and manage NGO registrations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800">{ngos.length}</h3>
          <p className="text-gray-600 text-sm">Total NGOs</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">{ngos.filter(n => n.verified).length}</h3>
          <p className="text-gray-600 text-sm">Verified</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-yellow-600">{ngos.filter(n => !n.verified).length}</h3>
          <p className="text-gray-600 text-sm">Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'pending', 'verified'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === f
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'bg-white/50 text-gray-700 hover:bg-white/80'
            }`}
          >
            {f} ({f === 'all' ? ngos.length : f === 'pending' ? ngos.filter(n => !n.verified).length : ngos.filter(n => n.verified).length})
          </button>
        ))}
      </div>

      {/* NGO List */}
      <div className="space-y-4">
        {filteredNGOs.map((ngo, index) => (
          <motion.div
            key={ngo._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{ngo.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{ngo.email}</span>
                    </div>
                  </div>
                  {ngo.verified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {ngo.city && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {ngo.city}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Registered {new Date(ngo.createdAt).toLocaleDateString()}
                  </div>
                  {ngo.certificatePath && (
                    <a
                      href={`${API_BASE_URL}/${ngo.certificatePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <FileText className="w-4 h-4" />
                      View Certificate
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {!ngo.verified && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(ngo._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(ngo._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NGOManagement;
