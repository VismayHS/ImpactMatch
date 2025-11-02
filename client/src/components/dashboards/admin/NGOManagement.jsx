import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, XCircle, FileText, Mail, MapPin, Calendar, ExternalLink, Award, Lock, Unlock, Eye, Download } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const NGOManagement = () => {
  const [ngos, setNgos] = useState([]);
  const [ngoDetails, setNgoDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, verified
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    loadNGOs();
  }, []);

  const loadNGOs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/ngos/pending');
      const pendingNGOs = response.data.pendingNGOs || [];
      
      // Also get verified NGOs
      const allUsersResponse = await api.get('/api/admin/users?role=ngo');
      const allNGOs = allUsersResponse.data.users || [];
      
      // Merge pending NGOs with their details and all NGOs
      const mergedNGOs = allNGOs.map(ngo => {
        const pending = pendingNGOs.find(p => p._id === ngo._id);
        return {
          ...ngo,
          ngoDetails: pending?.ngoDetails || null,
          requiresUrgentReview: pending?.requiresUrgentReview || false
        };
      });
      
      setNgos(mergedNGOs);
      
      // Store NGO details separately for quick access
      const detailsMap = {};
      mergedNGOs.forEach(ngo => {
        if (ngo.ngoDetails) {
          detailsMap[ngo._id] = ngo.ngoDetails;
        }
      });
      setNgoDetails(detailsMap);
    } catch (error) {
      console.error('Error loading NGOs:', error);
      toast.error('Failed to load NGOs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (ngo) => {
    try {
      // Use the new certificate verification endpoint
      await api.post(`/api/admin/ngos/verify-certificate/${ngo._id}`, {
        approved: true,
        grantDashboardAccess: true,
        notes: 'Approved by admin'
      });
      toast.success('NGO certificate approved successfully!');
      loadNGOs();
    } catch (error) {
      console.error('Error approving NGO:', error);
      toast.error('Failed to approve NGO');
    }
  };

  const handleReject = async (ngo) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (!reason) return;
    
    try {
      await api.post(`/api/admin/ngos/verify-certificate/${ngo._id}`, {
        approved: false,
        rejectionReason: reason,
        grantDashboardAccess: false
      });
      toast.success('NGO certificate rejected');
      loadNGOs();
    } catch (error) {
      console.error('Error rejecting NGO:', error);
      toast.error('Failed to reject NGO');
    }
  };

  const handleGrantAccess = async (ngo) => {
    try {
      await api.post(`/api/admin/ngos/verify-certificate/${ngo._id}`, {
        approved: false, // Don't fully verify yet
        grantDashboardAccess: true, // But grant access
        notes: 'Dashboard access granted pending full verification'
      });
      toast.success('Dashboard access granted');
      loadNGOs();
    } catch (error) {
      console.error('Error granting access:', error);
      toast.error('Failed to grant access');
    }
  };

  const viewCertificate = (ngo) => {
    const details = ngoDetails[ngo._id];
    if (details?.certificateUrl) {
      window.open(`${API_BASE_URL}${details.certificateUrl}`, '_blank');
    } else {
      toast.error('Certificate not available');
    }
  };

  const getTrustScoreColor = (score) => {
    if (score === null || score === undefined) return 'gray';
    if (score >= 75) return 'green';
    if (score >= 50) return 'yellow';
    return 'red';
  };

  const getTrustScoreLabel = (score) => {
    if (score === null || score === undefined) return 'Not Scored';
    if (score >= 75) return 'High Trust';
    if (score >= 50) return 'Medium Trust';
    return 'Low Trust';
  };

  const filteredNGOs = ngos.filter(ngo => {
    if (filter === 'pending') return !ngo.certificateVerified;
    if (filter === 'verified') return ngo.certificateVerified;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800">{ngos.length}</h3>
          <p className="text-gray-600 text-sm">Total NGOs</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">{ngos.filter(n => n.certificateVerified).length}</h3>
          <p className="text-gray-600 text-sm">Verified</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-yellow-600">{ngos.filter(n => !n.certificateVerified).length}</h3>
          <p className="text-gray-600 text-sm">Pending Review</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-red-600">{ngos.filter(n => !n.dashboardAccess).length}</h3>
          <p className="text-gray-600 text-sm">Locked (Low Trust)</p>
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
            {f} ({f === 'all' ? ngos.length : f === 'pending' ? ngos.filter(n => !n.certificateVerified).length : ngos.filter(n => n.certificateVerified).length})
          </button>
        ))}
      </div>

      {/* NGO List */}
      <div className="space-y-4">
        {filteredNGOs.map((ngo, index) => {
          const details = ngoDetails[ngo._id];
          const trustScoreColor = getTrustScoreColor(ngo.aiTrustScore);
          const trustScoreLabel = getTrustScoreLabel(ngo.aiTrustScore);
          
          return (
            <motion.div
              key={ngo._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border-2 ${
                ngo.requiresUrgentReview 
                  ? 'border-red-300 bg-red-50/50' 
                  : 'border-white/20'
              }`}
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
                    <div className="flex flex-col gap-2 items-end">
                      {ngo.certificateVerified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <Calendar className="w-4 h-4" />
                          Pending Review
                        </span>
                      )}
                      {ngo.dashboardAccess ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          <Unlock className="w-4 h-4" />
                          Dashboard Access
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          <Lock className="w-4 h-4" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Trust Score */}
                  {ngo.aiTrustScore !== null && ngo.aiTrustScore !== undefined && (
                    <div className="mb-3">
                      <div className="flex items-center gap-3">
                        <Award className={`w-5 h-5 text-${trustScoreColor}-600`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">AI Trust Score</span>
                            <span className={`text-sm font-bold text-${trustScoreColor}-600`}>
                              {ngo.aiTrustScore}/100 - {trustScoreLabel}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${
                                trustScoreColor === 'green'
                                  ? 'from-green-400 to-green-600'
                                  : trustScoreColor === 'yellow'
                                  ? 'from-yellow-400 to-yellow-600'
                                  : 'from-red-400 to-red-600'
                              }`}
                              style={{ width: `${ngo.aiTrustScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      {ngo.aiTrustScore < 75 && !ngo.dashboardAccess && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-xs text-red-700">
                            ⚠️ Low trust score - Dashboard access locked. Manual verification required.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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
                    {details?.registrationNumber && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Reg: {details.registrationNumber}
                      </div>
                    )}
                  </div>

                  {/* Certificate Section */}
                  {details?.certificateUrl && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">Certificate Uploaded</p>
                            <p className="text-xs text-gray-600">{details.certificateFileName || 'certificate.pdf'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewCertificate(ngo)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <a
                            href={`${API_BASE_URL}${details.certificateUrl}`}
                            download
                            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions */}
                  {!ngo.certificateVerified && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApprove(ngo)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Certificate
                      </button>
                      <button
                        onClick={() => handleReject(ngo)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      {!ngo.dashboardAccess && (
                        <button
                          onClick={() => handleGrantAccess(ngo)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                          <Unlock className="w-4 h-4" />
                          Grant Dashboard Access
                        </button>
                      )}
                    </div>
                  )}

                  {/* Verification Info */}
                  {ngo.certificateVerified && details?.verifiedAt && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700">
                        ✅ Verified on {new Date(details.verifiedAt).toLocaleDateString()}
                        {details.verificationNotes && ` - ${details.verificationNotes}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredNGOs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>No NGOs found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NGOManagement;
