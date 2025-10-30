import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import { FileText, CheckCircle, XCircle, Eye, Clock, Download } from 'lucide-react';

const NGOVerification = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const navigate = useNavigate();

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:5173/api/admin/ngos/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNgos(response.data.ngos);
    } catch (err) {
      console.error('Failed to load NGOs:', err);
    } finally {
      setLoading(false);
    }
  };

  const openVerificationModal = (ngo, action) => {
    setSelectedNGO(ngo);
    setActionType(action);
    setVerificationNotes('');
    setShowModal(true);
  };

  const handleVerification = async () => {
    if (!verificationNotes.trim()) {
      alert('Please provide verification notes');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `http://localhost:5173/api/admin/ngos/${selectedNGO._id}/verify`,
        {
          status: actionType === 'approve' ? 'approved' : 'rejected',
          notes: verificationNotes
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setShowModal(false);
      setSelectedNGO(null);
      setVerificationNotes('');
      fetchNGOs();
    } catch (err) {
      alert('Failed to process verification');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      approved: 'bg-green-500/20 text-green-300 border-green-400/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-400/30'
    };

    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${styles[status]}`}>
        {icons[status]}
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">NGO Verification</h1>
          <p className="text-white/70">Review and verify NGO registration certificates</p>
        </div>

        {/* NGO List */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white">Loading NGO certificates...</div>
          ) : ngos.length === 0 ? (
            <div className="p-8 text-center text-white/70">No NGO certificates found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">NGO Name</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Registration #</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Submitted</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ngos.map((ngo) => (
                    <tr key={ngo._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{ngo.userId?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-white/80">{ngo.userId?.email || 'N/A'}</td>
                      <td className="px-6 py-4 text-white/80">{ngo.registrationNumber || 'N/A'}</td>
                      <td className="px-6 py-4">{getStatusBadge(ngo.status)}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">
                        {new Date(ngo.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`http://localhost:5173${ngo.certificateUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                            title="View Certificate"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                          
                          {ngo.status === 'pending' && (
                            <>
                              <button
                                onClick={() => openVerificationModal(ngo, 'approve')}
                                className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 text-green-300 transition-all"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openVerificationModal(ngo, 'reject')}
                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 transition-all"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {ngo.verificationNotes && (
                            <div className="relative group">
                              <FileText className="w-4 h-4 text-white/50 cursor-pointer" />
                              <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {ngo.verificationNotes}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verification Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 max-w-lg w-full">
              <h3 className="text-2xl font-bold text-white mb-4">
                {actionType === 'approve' ? 'Approve NGO' : 'Reject NGO'}
              </h3>
              
              <div className="mb-6">
                <p className="text-white/70 mb-2">NGO: <span className="text-white font-medium">{selectedNGO?.userId?.name}</span></p>
                <p className="text-white/70 mb-4">Registration: <span className="text-white font-medium">{selectedNGO?.registrationNumber}</span></p>
                
                <label className="block text-white/90 text-sm font-medium mb-2">
                  {actionType === 'approve' ? 'Approval Notes' : 'Rejection Reason'} *
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder={`Enter ${actionType === 'approve' ? 'approval notes' : 'reason for rejection'}...`}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerification}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    actionType === 'approve'
                      ? 'bg-green-500/20 border border-green-400/30 text-green-300 hover:bg-green-500/30'
                      : 'bg-red-500/20 border border-red-400/30 text-red-300 hover:bg-red-500/30'
                  }`}
                >
                  {actionType === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOVerification;
