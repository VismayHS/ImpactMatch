import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import { Search, Filter, Eye, Trash2, CheckCircle, XCircle, User, Building2, Shield } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, verifiedFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });

      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (verifiedFilter !== 'all') params.append('verified', verifiedFilter);
      if (searchTerm) params.append('search', searchTerm);

      const response = await axios.get(`http://localhost:5173/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5173/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ngo': return <Shield className="w-4 h-4" />;
      case 'organisation': return <Building2 className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      user: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      organisation: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      ngo: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
      admin: 'bg-orange-500/20 text-orange-300 border-orange-400/30'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${colors[role]}`}>
        {getRoleIcon(role)}
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/70">Manage all registered users, organizations, and NGOs</p>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="all">All Roles</option>
                <option value="user">Individual Users</option>
                <option value="organisation">Organizations</option>
                <option value="ngo">NGOs</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Verified Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-white">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-white/70">No users found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">User</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Role</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Joined</th>
                      <th className="px-6 py-4 text-right text-white font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white">{user.name}</td>
                        <td className="px-6 py-4 text-white/80">{user.email}</td>
                        <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                        <td className="px-6 py-4">
                          {user.verified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-300">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-300">
                              <XCircle className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-white/70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/admin/users/${user._id}`)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-300 transition-all"
                              title="Deactivate User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

export default UserManagement;
