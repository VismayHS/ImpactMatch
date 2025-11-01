import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../utils/axiosConfig';

function NGOCollaborationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseForm, setResponseForm] = useState({
    status: 'approved',
    responseMessage: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!userData.id) {
        toast.error('Please log in to view requests');
        return;
      }

      const response = await api.get('/api/partnerships', {
        params: { ngoId: userData.id }
      });

      if (response.data && response.data.partnerships) {
        setRequests(response.data.partnerships);
      }
    } catch (error) {
      console.error('Failed to fetch collaboration requests:', error);
      toast.error('Failed to load collaboration requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (request) => {
    setSelectedRequest(request);
    setShowResponseModal(true);
    setResponseForm({
      status: 'approved',
      responseMessage: `Thank you for your interest in collaborating on "${request.causeId?.name}". We're excited to work together!`
    });
  };

  const submitResponse = async () => {
    try {
      if (!selectedRequest) return;

      const response = await api.patch(`/api/partnerships/${selectedRequest._id}`, {
        status: responseForm.status,
        responseMessage: responseForm.responseMessage
      });

      if (response.data) {
        toast.success(`Request ${responseForm.status} successfully!`);
        setShowResponseModal(false);
        setResponseForm({ status: 'approved', responseMessage: '' });
        fetchRequests(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to respond to request:', error);
      toast.error('Failed to update request');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'Pending' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Rejected' },
      'in-discussion': { bg: 'bg-blue-100', text: 'text-blue-800', icon: '💬', label: 'In Discussion' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-bold`}>
        {badge.icon} {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading collaboration requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-4xl font-black text-gray-900 mb-2">🤝 Collaboration Requests</h2>
        <p className="text-gray-600">Manage partnership requests from organizations</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="text-3xl font-black">{requests.filter(r => r.status === 'pending').length}</div>
          <div className="text-yellow-100 font-semibold">Pending Requests</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-black">{requests.filter(r => r.status === 'approved').length}</div>
          <div className="text-green-100 font-semibold">Approved</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-black">{requests.filter(r => r.status === 'in-discussion').length}</div>
          <div className="text-blue-100 font-semibold">In Discussion</div>
        </div>
        <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-black">{requests.length}</div>
          <div className="text-purple-100 font-semibold">Total Requests</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'in-discussion', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              filter === status
                ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} ({
              status === 'all' ? requests.length : requests.filter(r => r.status === status).length
            })
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No Requests Found</h3>
          <p className="text-gray-500">You don't have any {filter !== 'all' ? filter : ''} collaboration requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black text-gray-900">
                      {request.organisationId?.name || 'Organization'}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-gray-600 mb-1">
                    📍 {request.organisationId?.city || 'Unknown City'}
                  </p>
                  <p className="text-gray-600">
                    ✉️ {request.organisationId?.email || 'No email'}
                  </p>
                </div>
              </div>

              {/* Cause Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                <h4 className="font-bold text-gray-900 mb-2">🎯 Cause: {request.causeId?.name || 'Unknown Cause'}</h4>
                <p className="text-sm text-gray-700 mb-2">{request.causeId?.description}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>📂 {request.causeId?.category}</span>
                  <span>📍 {request.causeId?.city}</span>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-gray-600">Volunteers Offered:</span>
                    <div className="text-xl font-bold text-gray-900">👥 {request.volunteersOffered || 0}</div>
                  </div>
                  {request.proposedDate && (
                    <div>
                      <span className="text-sm text-gray-600">Proposed Date:</span>
                      <div className="text-xl font-bold text-gray-900">📅 {request.proposedDate}</div>
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-semibold">Message:</span>
                  <p className="text-gray-800 mt-1">{request.message}</p>
                </div>
              </div>

              {/* Response Message (if exists) */}
              {request.responseMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 mb-4">
                  <span className="text-sm text-green-700 font-semibold">Your Response:</span>
                  <p className="text-green-900 mt-1">{request.responseMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRespond(request)}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    ✅ Respond to Request
                  </button>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-4">
                Received: {new Date(request.createdAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-3xl font-black text-gray-900 mb-6">
              Respond to Collaboration Request
            </h3>

            {/* Organization Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">
                {selectedRequest.organisationId?.name}
              </h4>
              <p className="text-sm text-gray-700">
                Requesting {selectedRequest.volunteersOffered} volunteers for "{selectedRequest.causeId?.name}"
              </p>
            </div>

            {/* Status Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Decision</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setResponseForm({ ...responseForm, status: 'approved' })}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    responseForm.status === 'approved'
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ✅ Approve
                </button>
                <button
                  onClick={() => setResponseForm({ ...responseForm, status: 'in-discussion' })}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    responseForm.status === 'in-discussion'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  💬 Discuss
                </button>
                <button
                  onClick={() => setResponseForm({ ...responseForm, status: 'rejected' })}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    responseForm.status === 'rejected'
                      ? 'bg-red-500 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ❌ Reject
                </button>
              </div>
            </div>

            {/* Response Message */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Response Message
              </label>
              <textarea
                value={responseForm.responseMessage}
                onChange={(e) => setResponseForm({ ...responseForm, responseMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-teal-500 focus:outline-none"
                rows="4"
                placeholder="Write your response to the organization..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitResponse}
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Send Response
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default NGOCollaborationRequests;
