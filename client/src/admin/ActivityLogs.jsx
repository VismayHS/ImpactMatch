import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import { Activity, Filter, Download, Calendar, User, Building2, Shield } from 'lucide-react';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter, userTypeFilter, startDate, endDate]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: 50
      });

      if (actionFilter !== 'all') params.append('action', actionFilter);
      if (userTypeFilter !== 'all') params.append('userType', userTypeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`http://localhost:5173/api/admin/logs?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setLogs(response.data.logs);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (actionFilter !== 'all') params.append('action', actionFilter);
      if (userTypeFilter !== 'all') params.append('userType', userTypeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`http://localhost:5173/api/admin/logs/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `activity_logs_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export logs');
    }
  };

  const getActionBadge = (action) => {
    const colors = {
      user_login: 'bg-blue-500/20 text-blue-300',
      user_logout: 'bg-gray-500/20 text-gray-300',
      user_register: 'bg-green-500/20 text-green-300',
      ngo_register: 'bg-violet-500/20 text-violet-300',
      ngo_certificate_upload: 'bg-teal-500/20 text-teal-300',
      ngo_verified: 'bg-green-500/20 text-green-300',
      ngo_rejected: 'bg-red-500/20 text-red-300',
      user_deactivated: 'bg-red-500/20 text-red-300',
      admin_action: 'bg-orange-500/20 text-orange-300'
    };

    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${colors[action] || 'bg-white/20 text-white'}`}>
        {action.replace(/_/g, ' ').toUpperCase()}
      </span>
    );
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'ngo': return <Shield className="w-4 h-4" />;
      case 'organisation': return <Building2 className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4 text-orange-300" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Activity Logs</h1>
            <p className="text-white/70">Monitor all system activities and user actions</p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="all">All Actions</option>
                <option value="user_login">User Login</option>
                <option value="user_register">User Register</option>
                <option value="ngo_register">NGO Register</option>
                <option value="ngo_certificate_upload">Certificate Upload</option>
                <option value="ngo_verified">NGO Verified</option>
                <option value="ngo_rejected">NGO Rejected</option>
                <option value="admin_action">Admin Action</option>
              </select>
            </div>

            {/* User Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="all">All User Types</option>
                <option value="user">Individual</option>
                <option value="organisation">Organization</option>
                <option value="ngo">NGO</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* End Date */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white">Loading activity logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-white/70">No activity logs found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Timestamp</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Action</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Details</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white/80 text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">{getActionBadge(log.action)}</td>
                        <td className="px-6 py-4 text-white">{log.userId?.email || 'System'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-white/80">
                            {getUserTypeIcon(log.userType)}
                            <span className="capitalize">{log.userType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm max-w-xs truncate">
                          {log.details || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {log.ipAddress || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 flex items-center justify-between border-t border-white/20">
                <p className="text-white/70 text-sm">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
