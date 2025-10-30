import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import { Users, Building2, FileCheck, Clock, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:5173/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-300 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 50%, #8E2DE2 100%)' }}>
      <Sidebar />
      
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-white/70">Welcome back! Here's what's happening with ImpactMatch today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatsCard
            icon={Building2}
            label="Organizations"
            value={stats.totalOrganisations}
            color="teal"
          />
          <StatsCard
            icon={FileCheck}
            label="NGOs"
            value={stats.totalNGOs}
            color="violet"
          />
          <StatsCard
            icon={Clock}
            label="Pending Verifications"
            value={stats.pendingNGOs}
            color="orange"
          />
        </div>

        {/* User Growth Chart */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">User Growth</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="_id" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line type="monotone" dataKey="count" stroke="#00C6A7" strokeWidth={3} dot={{ fill: '#00C6A7', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-left transition-all"
              >
                View All Users
              </button>
              <button
                onClick={() => navigate('/admin/ngos')}
                className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-left transition-all"
              >
                Review Pending NGOs
              </button>
              <button
                onClick={() => navigate('/admin/logs')}
                className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-left transition-all"
              >
                View Activity Logs
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Database</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">API Server</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">File Storage</span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                  Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
