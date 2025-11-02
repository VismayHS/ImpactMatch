import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

function OrganisationOverview() {
  const [stats, setStats] = useState({
    totalPartnerships: 0,
    activeCauses: 0,
    volunteersEngaged: 0,
    impactHours: 0
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    // Fetch real stats from database
    fetchOrganisationStats(userData.id);
  }, []);

  const fetchOrganisationStats = async (orgId) => {
    try {
      setLoading(true);
      
      // Fetch partnerships for this organization
      const partnershipsResponse = await api.get(`/api/partnerships?organisationId=${orgId}`);
      const partnerships = partnershipsResponse.data.partnerships || [];
      
      // Calculate stats from partnerships
      const totalPartnerships = partnerships.length;
      const activeCauses = partnerships.filter(p => p.status === 'approved').length;
      const volunteersEngaged = partnerships
        .filter(p => p.status === 'approved')
        .reduce((sum, p) => sum + (p.volunteersOffered || 0), 0);
      
      // Impact hours would need to be tracked separately - for now estimate 3 hours per volunteer
      const impactHours = volunteersEngaged * 3;
      
      setStats({
        totalPartnerships,
        activeCauses,
        volunteersEngaged,
        impactHours
      });

      // Set recent activity from latest partnerships
      const activity = partnerships
        .slice(0, 3)
        .map(p => ({
          icon: p.status === 'approved' ? '✅' : p.status === 'pending' ? '⏳' : '💬',
          message: p.status === 'approved' 
            ? `Partnership approved with ${p.ngoId?.name || 'NGO'}`
            : p.status === 'pending'
            ? `Collaboration request sent to ${p.ngoId?.name || 'NGO'}`
            : `In discussion with ${p.ngoId?.name || 'NGO'}`,
          time: new Date(p.createdAt).toLocaleDateString(),
          cause: p.causeId?.name || p.causeId?.title || 'Unknown Cause'
        }));
      
      setRecentActivity(activity);
      
    } catch (error) {
      console.error('Error fetching organization stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Active Partnerships', value: stats.totalPartnerships, icon: '🤝', color: 'from-blue-500 to-cyan-500' },
    { label: 'Engaged Causes', value: stats.activeCauses, icon: '🎯', color: 'from-purple-500 to-pink-500' },
    { label: 'Volunteers Engaged', value: stats.volunteersEngaged, icon: '👥', color: 'from-green-500 to-teal-500' },
    { label: 'Impact Hours', value: stats.impactHours, icon: '⏱️', color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl"
      >
        <h2 className="text-3xl font-black mb-2">
          Welcome back, {user?.name || 'Organisation'}! 🏢
        </h2>
        <p className="text-blue-100 text-lg">
          Your corporate social responsibility hub
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                </div>
              </div>
              <p className="text-gray-600 font-semibold">{stat.label}</p>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all text-left">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-bold text-gray-900 mb-1">Browse Causes</h4>
            <p className="text-sm text-gray-600">Discover new impact opportunities</p>
          </button>

          <button className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all text-left">
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-bold text-gray-900 mb-1">View Reports</h4>
            <p className="text-sm text-gray-600">Track your CSR impact</p>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h3 className="text-2xl font-black text-gray-900 mb-6">Recent Activity</h3>
        {loading ? (
          // Loading skeleton for activity
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">{activity.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{activity.text}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-600 font-semibold mb-2">No recent activity yet</p>
            <p className="text-sm text-gray-500">Start by browsing causes to make your first impact!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrganisationOverview;
