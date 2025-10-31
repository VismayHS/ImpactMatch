import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Copy, Download, Search, ExternalLink, Filter } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const BlockchainTracker = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const [verificationsRes, usersRes, causesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/verifications`),
        axios.get(`${API_BASE_URL}/api/users`),
        axios.get(`${API_BASE_URL}/api/causes`)
      ]);

      const enrichedData = verificationsRes.data.map(v => ({
        ...v,
        userName: usersRes.data.find(u => u._id === v.userId)?.name || 'Unknown',
        causeName: causesRes.data.find(c => c._id === v.causeId)?.title || 'Unknown',
        ngoName: causesRes.data.find(c => c._id === v.causeId)?.ngoId?.name || 'Unknown'
      }));

      setVerifications(enrichedData);
    } catch (error) {
      console.error('Error loading verifications:', error);
      toast.error('Failed to load blockchain verifications');
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    toast.success('Hash copied to clipboard');
  };

  const downloadProof = (verification) => {
    const proof = {
      transactionHash: verification.blockchainHash,
      userId: verification.userId,
      userName: verification.userName,
      causeId: verification.causeId,
      causeName: verification.causeName,
      ngoName: verification.ngoName,
      timestamp: verification.timestamp,
      verifiedAt: new Date(verification.timestamp).toISOString()
    };

    const blob = new Blob([JSON.stringify(proof, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proof-${verification.blockchainHash.substring(0, 8)}.json`;
    a.click();
    toast.success('Proof downloaded');
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = v.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.causeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.blockchainHash.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'recent') {
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(v.timestamp) > dayAgo;
    }
    
    return matchesSearch;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Blockchain Tracker
        </h1>
        <p className="text-gray-600">Immutable verification records across the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800">{verifications.length}</h3>
          <p className="text-gray-600 text-sm">Total Verifications</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">
            {verifications.filter(v => new Date(v.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
          </h3>
          <p className="text-gray-600 text-sm">Last 24 Hours</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-purple-600">
            {new Set(verifications.map(v => v.userId)).size}
          </h3>
          <p className="text-gray-600 text-sm">Unique Users</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by user, cause, NGO, or hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-lg border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'recent'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filterType === f ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Cause</th>
                <th className="px-6 py-3 text-left text-sm font-medium">NGO</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Blockchain Hash</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVerifications.map((verification, index) => (
                <motion.tr
                  key={verification._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-white/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800">{verification.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{verification.causeName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{verification.ngoName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {verification.blockchainHash.substring(0, 12)}...{verification.blockchainHash.slice(-8)}
                      </code>
                      <button
                        onClick={() => copyHash(verification.blockchainHash)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(verification.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadProof(verification)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`https://blockchain-explorer.example.com/tx/${verification.blockchainHash}`)}
                        className="text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlockchainTracker;
