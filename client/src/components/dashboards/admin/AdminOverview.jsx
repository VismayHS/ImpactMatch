import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, Building2, Heart, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import 'leaflet/dist/leaflet.css';

const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNGOs: 0,
    totalCauses: 0,
    totalVerifications: 0,
    pendingNGOs: 0,
    activeCauses: 0
  });
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data using authenticated API
      const [usersRes, causesRes, matchesRes, verificationsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/causes'),
        api.get('/api/matches'),
        api.get('/api/verifications')
      ]);

      // Handle response format - admin/users returns { users: [...] }
      const users = usersRes.data.users || usersRes.data || [];
      const causes = causesRes.data || [];
      const matches = matchesRes.data || [];
      const verifications = verificationsRes.data || [];

      // Calculate stats
      const totalUsers = users.filter(u => u.role === 'user' || u.role === 'organisation').length;
      const ngos = users.filter(u => u.role === 'ngo');
      const totalNGOs = ngos.length;
      const pendingNGOs = ngos.filter(n => !n.verified).length;
      const activeCauses = causes.filter(c => c.status === 'active').length;

      setStats({
        totalUsers,
        totalNGOs,
        totalCauses: causes.length,
        totalVerifications: verifications.length,
        pendingNGOs,
        activeCauses
      });

      // Generate 7-day chart data
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayMatches = matches.filter(m => 
          m.createdAt && new Date(m.createdAt).toISOString().split('T')[0] === dateStr
        ).length;

        last7Days.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          matches: dayMatches
        });
      }
      setChartData(last7Days);

      // Recent activity (last 10 matches)
      const recent = matches
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(match => {
          const user = users.find(u => u._id === match.userId);
          const cause = causes.find(c => c._id === match.causeId);
          return {
            id: match._id,
            userName: user?.name || 'Unknown User',
            causeName: cause?.title || 'Unknown Cause',
            timestamp: match.createdAt
          };
        });

      setRecentActivity(recent);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Platform Overview
        </h1>
        <p className="text-gray-600">Monitor and manage the ImpactMatch ecosystem</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalNGOs}</h3>
          <p className="text-gray-600 text-sm">Registered NGOs</p>
          {stats.pendingNGOs > 0 && (
            <p className="text-yellow-600 text-xs mt-1">
              {stats.pendingNGOs} pending verification
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalCauses}</h3>
          <p className="text-gray-600 text-sm">Total Causes</p>
          <p className="text-green-600 text-xs mt-1">
            {stats.activeCauses} active
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalVerifications}</h3>
          <p className="text-gray-600 text-sm">Total Verifications</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            User Activity (7 Days)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="matches" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div 
                  key={activity.id || index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {activity.userName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      Joined: {activity.causeName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Alerts */}
      {stats.pendingNGOs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Action Required</h3>
            <p className="text-sm text-yellow-800">
              {stats.pendingNGOs} NGO{stats.pendingNGOs > 1 ? 's' : ''} awaiting verification. 
              Review and approve them in NGO Management.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminOverview;
