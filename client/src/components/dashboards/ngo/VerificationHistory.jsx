import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Download, Search, ExternalLink, CheckCircle } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const VerificationHistory = () => {
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState([]);
  const [filteredVerifications, setFilteredVerifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadVerificationHistory();
  }, []);

  useEffect(() => {
    filterVerifications();
  }, [searchTerm, verifications]);

  const loadVerificationHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const ngoId = user?._id || user?.id;

      // Fetch causes by this NGO
      const causesRes = await api.get(`/api/causes?ngoId=${ngoId}`);
      const causes = causesRes.data.causes || [];
      const causeIds = causes.map(c => c._id);

      // Fetch all verifications
      const verificationsRes = await api.get('/api/verifications');
      const allVerifications = verificationsRes.data.verifications || [];

      // Filter verifications for this NGO's causes
      const ngoVerifications = allVerifications.filter(v => causeIds.includes(v.causeId));

      // Fetch user details and cause names
      const enrichedVerifications = await Promise.all(
        ngoVerifications.map(async (verification) => {
          try {
            const userRes = await api.get(`/api/users/${verification.userId}`);
            const cause = causes.find(c => c._id === verification.causeId);

            return {
              id: verification._id,
              userName: userRes.data.user?.name || 'Unknown',
              userEmail: userRes.data.user?.email || '',
              causeName: cause?.name || 'Unknown Cause',
              txHash: verification.txHash,
              verifiedAt: verification.createdAt || verification.timestamp || new Date(),
              status: 'verified'
            };
          } catch (err) {
            return null;
          }
        })
      );

      setVerifications(enrichedVerifications.filter(v => v !== null).sort((a, b) => 
        new Date(b.verifiedAt) - new Date(a.verifiedAt)
      ));
    } catch (error) {
      console.error('Load verification history error:', error);
      toast.error('Failed to load verification history');
    } finally {
      setLoading(false);
    }
  };

  const filterVerifications = () => {
    if (!searchTerm) {
      setFilteredVerifications(verifications);
      return;
    }

    const filtered = verifications.filter(v =>
      v.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.causeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.txHash.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredVerifications(filtered);
  };

  const exportToCSV = () => {
    if (verifications.length === 0) {
      toast.warning('No verifications to export');
      return;
    }

    // Create CSV content
    const headers = ['Volunteer Name', 'Email', 'Cause', 'Verification Date', 'Blockchain Hash'];
    const rows = verifications.map(v => [
      v.userName,
      v.userEmail,
      v.causeName,
      new Date(v.verifiedAt).toLocaleString(),
      v.txHash
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `verification_history_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV exported successfully!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Verification History
          </h1>
          <p className="text-gray-600">View all verified impacts recorded on blockchain</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats Card */}
      <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-800">{verifications.length}</p>
            <p className="text-gray-600">Total Verified Impacts</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by volunteer, cause, or transaction hash..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Volunteer Name</th>
                <th className="px-6 py-4 text-left">Cause</th>
                <th className="px-6 py-4 text-left">Verification Date</th>
                <th className="px-6 py-4 text-left">Blockchain Hash</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No matching verifications found' : 'No verifications yet'}
                  </td>
                </tr>
              ) : (
                filteredVerifications.map((verification, index) => (
                  <motion.tr
                    key={verification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-white/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{verification.userName}</p>
                        <p className="text-sm text-gray-500">{verification.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{verification.causeName}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(verification.verifiedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                          {verification.txHash.substring(0, 12)}...{verification.txHash.substring(verification.txHash.length - 8)}
                        </code>
                        <button
                          onClick={() => copyToClipboard(verification.txHash)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Copy full hash"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Verified
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Note */}
      {verifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>Blockchain Proof:</strong> Each verification is recorded with a unique SHA-256 hash 
            that serves as cryptographic proof of the volunteer's verified impact. This ensures transparency 
            and prevents tampering with verification records.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationHistory;
