import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Users, Search, Filter, Loader } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';
import crypto from 'crypto-js';

const VolunteerVerification = () => {
  const [loading, setLoading] = useState(true);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    loadVolunteers();
  }, []);

  useEffect(() => {
    filterVolunteers();
  }, [searchTerm, filterStatus, volunteers]);

  const loadVolunteers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const ngoId = user?._id || user?.id;

      console.log('🏢 NGO Dashboard - Loading volunteers for NGO ID:', ngoId);

      // Fetch causes by this NGO
      const causesRes = await api.get(`/api/causes?ngoId=${ngoId}`);
      const causes = causesRes.data.causes || [];
      const causeIds = causes.map(c => c._id);

      console.log('📋 NGO Causes found:', causes.length);
      console.log('📋 Cause IDs:', causeIds.slice(0, 5));
      console.log('📋 First cause:', causes[0]);

      // Fetch all matches
      const matchesRes = await api.get('/api/matches');
      const allMatches = matchesRes.data.matches || [];

      console.log('🔍 Total matches from API:', allMatches.length);
      console.log('🔍 First match structure:', allMatches[0]);

      // Filter matches for this NGO's causes
      // Handle both populated (object) and unpopulated (string) causeId
      const ngoMatches = allMatches.filter(m => {
        const matchCauseId = m.causeId?._id || m.causeId;
        const matchCauseIdStr = matchCauseId?.toString() || matchCauseId;
        const isMatch = causeIds.some(cId => cId.toString() === matchCauseIdStr);
        if (isMatch) {
          console.log('✅ Match found - Cause:', m.causeId?.name || matchCauseId);
        }
        return isMatch;
      });

      console.log('🎯 Matches for this NGO after filtering:', ngoMatches.length);

      // Fetch verifications to check status
      const verificationsRes = await api.get('/api/verifications');
      const verifications = verificationsRes.data.verifications || [];

      console.log('🔐 Total verifications:', verifications.length);

      // Process matches - user data is already populated!
      const volunteersData = ngoMatches.map((match) => {
        const matchUserId = match.userId?._id || match.userId;
        const matchCauseId = match.causeId?._id || match.causeId;
        
        // User data is already populated from the API
        const userName = match.userId?.name || 'Unknown';
        const userEmail = match.userId?.email || '';
        
        const cause = causes.find(c => c._id.toString() === matchCauseId.toString());
        
        // Find verification by matchId (not userId/causeId)
        const verification = verifications.find(v => {
          const vMatchId = v.matchId?._id || v.matchId;
          if (!vMatchId) return false;
          return vMatchId.toString() === match._id.toString();
        });

        // Determine status from match object itself (it has the status field from DB)
        let volunteerStatus = 'pending';
        if (match.status === 'verified') {
          volunteerStatus = 'verified';
        } else if (match.status === 'rejected') {
          volunteerStatus = 'rejected';
        } else if (match.status === 'interested') {
          volunteerStatus = 'pending';
        }

        console.log('✅ Processing volunteer:', userName, 'for cause:', cause?.name, 'status:', volunteerStatus, 'match.status:', match.status);

        return {
          id: match._id,
          userId: matchUserId,
          userName,
          userEmail,
          causeId: matchCauseId,
          causeName: cause?.name || match.causeId?.name || 'Unknown Cause',
          joinedAt: match.createdAt || match.joinedAt || new Date(),
          status: volunteerStatus,
          txHash: verification?.txHash || match.txHash || null
        };
      });

      console.log('👥 Final volunteers list:', volunteersData.length);
      
      setVolunteers(volunteersData);
    } catch (error) {
      console.error('❌ Load volunteers error:', error);
      toast.error('Failed to load volunteers');
    } finally {
      setLoading(false);
    }
  };

  const filterVolunteers = () => {
    let filtered = volunteers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.causeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(v => v.status === filterStatus);
    }

    setFilteredVolunteers(filtered);
  };

  const generateBlockchainHash = (userId, causeId) => {
    const timestamp = Date.now();
    const data = `${userId}-${causeId}-${timestamp}`;
    return crypto.SHA256(data).toString();
  };

  const verifyVolunteer = async (volunteer) => {
    setVerifying(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      console.log('🔍 Verifying volunteer:', {
        volunteerId: volunteer.id,
        volunteerName: volunteer.userName,
        matchId: volunteer.id,
        verifierId: currentUser._id,
        currentUserRole: currentUser.role,
        fullVolunteerObject: volunteer,
        fullCurrentUser: currentUser
      });
      
      const payload = {
        matchId: volunteer.id,
        verifierId: currentUser._id || currentUser.id // Try both _id and id
      };
      
      console.log('📤 Sending payload to /api/verify:', payload);
      console.log('📤 Payload values:', {
        matchIdType: typeof payload.matchId,
        matchIdValue: payload.matchId,
        verifierIdType: typeof payload.verifierId,
        verifierIdValue: payload.verifierId
      });
      
      // Save verification - backend expects matchId and verifierId
      const response = await api.post('/api/verify', payload);

      console.log('✅ Verification response:', response.data);

      toast.success(`✅ ${volunteer.userName} verified successfully! Impact recorded on blockchain.`, {
        autoClose: 4000
      });

      // Reload volunteers
      await loadVolunteers();
    } catch (error) {
      console.error('❌ Verification error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMsg = error.response?.data?.error || 'Failed to verify volunteer';
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  const denyVolunteer = async (volunteer) => {
    if (!window.confirm(`Are you sure you want to deny attendance for ${volunteer.userName}?`)) {
      return;
    }

    setVerifying(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      
      await api.post('/api/verify/deny', {
        matchId: volunteer.id,
        verifierId: currentUser._id || currentUser.id,
        reason: 'Did not attend'
      });

      toast.success(`❌ ${volunteer.userName}'s attendance denied`, {
        autoClose: 3000
      });

      // Reload volunteers
      await loadVolunteers();
    } catch (error) {
      console.error('❌ Deny error:', error);
      console.error('❌ Deny error response:', error.response?.data);
      console.error('❌ Deny error status:', error.response?.status);
      const errorMsg = error.response?.data?.error || 'Failed to deny attendance';
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  const batchVerify = async () => {
    if (selectedVolunteers.length === 0) {
      toast.warning('Please select volunteers to verify');
      return;
    }

    setVerifying(true);
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));

      let successCount = 0;
      for (const volunteerId of selectedVolunteers) {
        const volunteer = volunteers.find(v => v.id === volunteerId);
        if (volunteer && volunteer.status === 'pending') {
          await api.post('/api/verify', {
            matchId: volunteer.id,
            verifierId: currentUser._id
          });
          successCount++;
        }
      }

      toast.success(`✅ ${successCount} volunteers verified successfully!`);
      setSelectedVolunteers([]);
      await loadVolunteers();
    } catch (error) {
      console.error('Batch verification error:', error);
      const errorMsg = error.response?.data?.error || 'Batch verification failed';
      toast.error(errorMsg);
    } finally {
      setVerifying(false);
    }
  };

  const toggleSelectVolunteer = (volunteerId) => {
    setSelectedVolunteers(prev =>
      prev.includes(volunteerId)
        ? prev.filter(id => id !== volunteerId)
        : [...prev, volunteerId]
    );
  };

  const toggleSelectAll = () => {
    const pendingVolunteers = filteredVolunteers.filter(v => v.status === 'pending');
    if (selectedVolunteers.length === pendingVolunteers.length) {
      setSelectedVolunteers([]);
    } else {
      setSelectedVolunteers(pendingVolunteers.map(v => v.id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  const pendingCount = volunteers.filter(v => v.status === 'pending').length;
  const verifiedCount = volunteers.filter(v => v.status === 'verified').length;
  const rejectedCount = volunteers.filter(v => v.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Volunteer Verification
          </h1>
          <p className="text-gray-600">Verify attendance and record impact on blockchain</p>
        </div>
        {selectedVolunteers.length > 0 && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={batchVerify}
            disabled={verifying}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {verifying ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
            Batch Verify ({selectedVolunteers.length})
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{volunteers.length}</p>
              <p className="text-sm text-gray-600">Total Volunteers</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              <p className="text-sm text-gray-600">Pending Verification</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{verifiedCount}</p>
              <p className="text-sm text-gray-600">Verified</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{rejectedCount}</p>
              <p className="text-sm text-gray-600">Denied</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by volunteer or cause name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Denied</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedVolunteers.length === filteredVolunteers.filter(v => v.status === 'pending').length && filteredVolunteers.filter(v => v.status === 'pending').length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left">Volunteer Name</th>
                <th className="px-6 py-4 text-left">Cause</th>
                <th className="px-6 py-4 text-left">Joined Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No volunteers found
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((volunteer, index) => (
                  <motion.tr
                    key={volunteer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      {volunteer.status === 'pending' && (
                        <input
                          type="checkbox"
                          checked={selectedVolunteers.includes(volunteer.id)}
                          onChange={() => toggleSelectVolunteer(volunteer.id)}
                          className="w-4 h-4 rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{volunteer.userName}</p>
                        <p className="text-sm text-gray-500">{volunteer.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{volunteer.causeName}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(volunteer.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {volunteer.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : volunteer.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                          <XCircle className="w-4 h-4" />
                          Denied
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {volunteer.status === 'pending' ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => verifyVolunteer(volunteer)}
                            disabled={verifying}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            {verifying ? 'Processing...' : 'Verify'}
                          </button>
                          <button
                            onClick={() => denyVolunteer(volunteer)}
                            disabled={verifying}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                          >
                            Deny
                          </button>
                        </div>
                      ) : volunteer.status === 'verified' ? (
                        <span className="text-green-600 font-medium">✓ Attended</span>
                      ) : (
                        <span className="text-red-600 font-medium">✗ Not Attended</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerVerification;
