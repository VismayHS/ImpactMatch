import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Ban, UserCheck, Mail, MapPin, Calendar } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/users');
      // Handle response format - admin/users returns { users: [...] }
      const allUsers = response.data.users || response.data || [];
      const regularUsers = allUsers.filter(u => u.role === 'user' || u.role === 'organisation');
      setUsers(regularUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId) => {
    if (!window.confirm('Suspend this user?')) return;
    
    try {
      await api.put(`/api/users/${userId}`, {
        suspended: true
      });
      toast.success('User suspended');
      loadUsers();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'active') return !u.suspended;
    if (filter === 'suspended') return u.suspended;
    return true;
  });

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          User Management
        </h1>
        <p className="text-gray-600">Manage platform users and their access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-gray-800">{users.length}</h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-green-600">{users.filter(u => !u.suspended).length}</h3>
          <p className="text-gray-600 text-sm">Active</p>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20">
          <h3 className="text-3xl font-bold text-red-600">{users.filter(u => u.suspended).length}</h3>
          <p className="text-gray-600 text-sm">Suspended</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'suspended'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              filter === f ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 'bg-white/50 text-gray-700 hover:bg-white/80'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-white/20">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-800">{user.name}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{user.city || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-700 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {user.suspended ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Suspended</span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {!user.suspended && (
                    <button
                      onClick={() => handleSuspend(user._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Ban className="w-4 h-4" />
                      Suspend
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
