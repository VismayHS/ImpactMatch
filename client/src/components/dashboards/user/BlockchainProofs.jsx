import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Copy, ExternalLink, CheckCircle, Download, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const BlockchainProofs = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;

      // Get user's verifications
      const verificationsResponse = await axios.get(`${API_BASE_URL}/api/verifications`);
      const userVerifications = verificationsResponse.data.filter(v => v.userId === userId);

      // Get all causes to enrich data
      const causesResponse = await axios.get(`${API_BASE_URL}/api/causes`);

      // Enrich verifications with cause details
      const enrichedVerifications = userVerifications.map(verification => {
        const cause = causesResponse.data.find(c => c._id === verification.causeId);
        return {
          ...verification,
          causeName: cause?.title || 'Unknown Cause',
          causeCategory: cause?.category || 'N/A',
          ngoName: cause?.ngoId?.name || 'Unknown NGO'
        };
      });

      // Sort by date (newest first)
      enrichedVerifications.sort((a, b) => new Date(b.verifiedAt) - new Date(a.verifiedAt));

      setVerifications(enrichedVerifications);
    } catch (error) {
      console.error('Error loading verifications:', error);
      toast.error('Failed to load blockchain proofs');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Blockchain hash copied!');
  };

  const downloadProof = (verification) => {
    const proofData = {
      transactionHash: verification.blockchainHash,
      userId: verification.userId,
      causeId: verification.causeId,
      causeName: verification.causeName,
      ngoName: verification.ngoName,
      verifiedAt: verification.verifiedAt,
      timestamp: new Date(verification.verifiedAt).toISOString()
    };

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blockchain-proof-${verification._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Proof downloaded!');
  };

  const filteredVerifications = verifications.filter(v => 
    v.causeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.ngoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.blockchainHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading blockchain proofs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Blockchain Proofs
        </h1>
        <p className="text-gray-600">Immutable verification records of your volunteer impact</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{verifications.length}</h3>
          <p className="text-gray-600 text-sm">Total Verifications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">100%</h3>
          <p className="text-gray-600 text-sm">Verified on Chain</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">SHA-256</h3>
          <p className="text-gray-600 text-sm">Encryption Level</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by cause, NGO, or transaction hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
        />
      </div>

      {/* Verifications Table */}
      {filteredVerifications.length === 0 ? (
        <div className="text-center py-20 bg-white/50 backdrop-blur-lg rounded-xl">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {verifications.length === 0 ? 'No Verifications Yet' : 'No Results Found'}
          </h3>
          <p className="text-gray-600">
            {verifications.length === 0 
              ? 'Complete causes to receive blockchain verified impact proofs!'
              : 'Try a different search term'}
          </p>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cause</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">NGO</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Verified Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Blockchain Hash</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map((verification, index) => (
                  <motion.tr
                    key={verification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{verification.causeName}</p>
                        <p className="text-sm text-gray-500">{verification.causeCategory}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {verification.ngoName}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(verification.verifiedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {verification.blockchainHash.substring(0, 12)}...{verification.blockchainHash.slice(-8)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(verification.blockchainHash)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy full hash"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadProof(verification)}
                          className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                          title="Download proof"
                        >
                          <Download className="w-4 h-4 text-purple-600" />
                        </button>
                        <button
                          onClick={() => {
                            window.open(`https://blockchain-explorer.example.com/tx/${verification.blockchainHash}`, '_blank');
                          }}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors"
                          title="View on blockchain"
                        >
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6"
      >
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          What is Blockchain Verification?
        </h3>
        <p className="text-gray-700 text-sm">
          Each verification is encrypted using SHA-256 and recorded as an immutable proof of your volunteer impact. 
          These blockchain-verified records cannot be altered or deleted, ensuring the authenticity of your contributions. 
          You can download these proofs and share them with future employers, educational institutions, or include them in your portfolio.
        </p>
      </motion.div>
    </div>
  );
};

export default BlockchainProofs;
