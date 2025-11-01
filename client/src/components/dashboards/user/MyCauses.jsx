import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, CheckCircle, Clock, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const MyCauses = () => {
  const [joinedCauses, setJoinedCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, verified, pending

  useEffect(() => {
    loadJoinedCauses();
  }, []);

  const loadJoinedCauses = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;
      
      console.log('🔍 Loading causes for user ID:', userId);

      // Get user's matches
      const matchesResponse = await api.get('/api/matches');
      const matchesData = Array.isArray(matchesResponse.data) 
        ? matchesResponse.data 
        : matchesResponse.data.matches || [];
      
      console.log('📦 All matches from API:', matchesData.length);
      
      const userMatches = matchesData.filter(m => {
        const matchUserId = m.userId?._id || m.userId;
        return matchUserId.toString() === userId.toString();
      });
      
      console.log('✅ User matches found:', userMatches.length);
      console.log('📋 User matches:', userMatches);

      // Get verifications
      const verificationsResponse = await api.get('/api/verify');
      const verificationsData = Array.isArray(verificationsResponse.data) 
        ? verificationsResponse.data 
        : verificationsResponse.data.verifications || [];
      const userVerifications = verificationsData.filter(v => 
        v.matchId?.userId?._id === userId || v.matchId?.userId === userId
      );
      
      console.log('🔐 Verifications found:', userVerifications.length);

      // Get all causes
      const causesResponse = await api.get('/api/causes');
      const causesData = Array.isArray(causesResponse.data) 
        ? causesResponse.data 
        : causesResponse.data.causes || [];
      
      console.log('🎯 All causes available:', causesData.length);

      // Enrich matches with cause details and verification status
      const enrichedCauses = userMatches.map(match => {
        const matchCauseId = match.causeId?._id || match.causeId;
        const cause = causesData.find(c => c._id.toString() === matchCauseId.toString());
        const verification = userVerifications.find(v => {
          const vMatchId = v.matchId?._id || v.matchId;
          return vMatchId.toString() === match._id.toString();
        });
        
        if (!cause) {
          console.warn('⚠️ Cause not found for match:', match._id, 'causeId:', matchCauseId);
        }
        
        return {
          ...cause,
          matchId: match._id,
          joinedDate: match.createdAt,
          status: match.status,
          isVerified: !!verification,
          verification: verification || null
        };
      }).filter(c => c._id); // Filter out null causes
      
      console.log('🎉 Final enriched causes:', enrichedCauses.length);
      console.log('📊 Enriched causes details:', enrichedCauses);

      setJoinedCauses(enrichedCauses);
    } catch (error) {
      console.error('❌ Error loading joined causes:', error);
      toast.error('Failed to load your causes');
      setJoinedCauses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (cause) => {
    if (cause.isVerified) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Attendance Verified
        </span>
      );
    } else if (cause.status === 'joined' || cause.status === 'interested') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          <Calendar className="w-4 h-4" />
          Registered - Upcoming Event
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          <XCircle className="w-4 h-4" />
          {cause.status}
        </span>
      );
    }
  };

  const filteredCauses = joinedCauses.filter(cause => {
    if (filter === 'verified') return cause.isVerified;
    if (filter === 'pending') return !cause.isVerified;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your causes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Causes
          </h1>
          <p className="text-gray-600">Track your volunteer activities and impact</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            toast.info('Refreshing your causes...');
            loadJoinedCauses();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{joinedCauses.length}</h3>
          <p className="text-gray-600 text-sm">Total Joined</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {joinedCauses.filter(c => c.isVerified).length}
          </h3>
          <p className="text-gray-600 text-sm">Verified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {joinedCauses.filter(c => !c.isVerified).length}
          </h3>
          <p className="text-gray-600 text-sm">Pending</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'bg-white/50 text-gray-700 hover:bg-white/80'
          }`}
        >
          All ({joinedCauses.length})
        </button>
        <button
          onClick={() => setFilter('verified')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'verified'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'bg-white/50 text-gray-700 hover:bg-white/80'
          }`}
        >
          Verified ({joinedCauses.filter(c => c.isVerified).length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'pending'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
              : 'bg-white/50 text-gray-700 hover:bg-white/80'
          }`}
        >
          Pending ({joinedCauses.filter(c => !c.isVerified).length})
        </button>
      </div>

      {/* Causes List */}
      {filteredCauses.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-lg rounded-xl">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">No Causes Found</h3>
          <p className="text-gray-600">Start discovering and joining causes!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCauses.map((cause, index) => (
            <motion.div
              key={cause._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-purple-200 to-pink-200 overflow-hidden">
                  {cause.image ? (
                    <img 
                      src={`${API_BASE_URL}/${cause.image}`}
                      alt={cause.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{cause.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{cause.description}</p>
                    </div>
                    {getStatusBadge(cause)}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      {cause.city || 'Unknown'}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      Joined {new Date(cause.joinedDate).toLocaleDateString()}
                    </div>

                    {cause.category && (
                      <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        {cause.category}
                      </div>
                    )}
                  </div>

                  {cause.isVerified && cause.verification && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>🎉 Impact Verified!</strong> on {new Date(cause.verification.verifiedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1 font-mono truncate">
                        Blockchain: {cause.verification.blockchainHash?.substring(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCauses;
