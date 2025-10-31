import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Search, Filter, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import crypto from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

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

      // Fetch causes by this NGO
      const causesRes = await axios.get(`${API_BASE_URL}/api/causes?ngoId=${ngoId}`);
      const causes = causesRes.data.causes || [];
      const causeIds = causes.map(c => c._id);

      // Fetch all matches
      const matchesRes = await axios.get(`${API_BASE_URL}/api/matches`);
      const allMatches = matchesRes.data.matches || [];

      // Filter matches for this NGO's causes
      const ngoMatches = allMatches.filter(m => causeIds.includes(m.causeId));

      // Fetch verifications to check status
      const verificationsRes = await axios.get(`${API_BASE_URL}/api/verifications`);
      const verifications = verificationsRes.data.verifications || [];

      // Fetch user details for each match
      const volunteersData = await Promise.all(
        ngoMatches.map(async (match) => {
          try {
            const userRes = await axios.get(`${API_BASE_URL}/api/users/${match.userId}`);
            const cause = causes.find(c => c._id === match.causeId);
            const verification = verifications.find(v => 
              v.userId === match.userId && v.causeId === match.causeId
            );

            return {
              id: match._id,
              userId: match.userId,
              userName: userRes.data.user?.name || 'Unknown',
              userEmail: userRes.data.user?.email || '',
              causeId: match.causeId,
              causeName: cause?.name || 'Unknown Cause',
              joinedAt: match.createdAt || match.joinedAt || new Date(),
              status: verification ? 'verified' : 'pending',
              txHash: verification?.txHash || null
            };
          } catch (err) {
            return null;
          }
        })
      );

      setVolunteers(volunteersData.filter(v => v !== null));
    } catch (error) {
      console.error('Load volunteers error:', error);
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
      // Generate blockchain hash
      const txHash = generateBlockchainHash(volunteer.userId, volunteer.causeId);

      // Save verification
      await axios.post(`${API_BASE_URL}/api/verify`, {
        userId: volunteer.userId,
        causeId: volunteer.causeId,
        ngoId: JSON.parse(localStorage.getItem('user'))._id,
        txHash,
        timestamp: new Date()
      });

      toast.success(`✅ ${volunteer.userName} verified successfully! Impact recorded on blockchain.`, {
        autoClose: 4000
      });

      // Reload volunteers
      await loadVolunteers();
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify volunteer');
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
      const user = JSON.parse(localStorage.getItem('user'));
      const ngoId = user._id || user.id;

      let successCount = 0;
      for (const volunteerId of selectedVolunteers) {
        const volunteer = volunteers.find(v => v.id === volunteerId);
        if (volunteer && volunteer.status === 'pending') {
          const txHash = generateBlockchainHash(volunteer.userId, volunteer.causeId);

          await axios.post(`${API_BASE_URL}/api/verify`, {
            userId: volunteer.userId,
            causeId: volunteer.causeId,
            ngoId,
            txHash,
            timestamp: new Date()
          });
          successCount++;
        }
      }

      toast.success(`✅ ${successCount} volunteers verified successfully!`);
      setSelectedVolunteers([]);
      await loadVolunteers();
    } catch (error) {
      console.error('Batch verification error:', error);
      toast.error('Batch verification failed');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Volunteer Verification
          </h1>
          <p className="text-gray-600">Verify volunteers and record their impact on blockchain</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {volunteer.status === 'pending' ? (
                        <button
                          onClick={() => verifyVolunteer(volunteer)}
                          disabled={verifying}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {verifying ? 'Verifying...' : 'Verify'}
                        </button>
                      ) : (
                        <span className="text-green-600 font-medium">✓ Completed</span>
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
