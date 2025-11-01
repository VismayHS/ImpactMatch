import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function OrganisationOverview() {
  const [stats, setStats] = useState({
    totalPartnerships: 0,
    activeCauses: 0,
    volunteersEngaged: 0,
    impactHours: 0
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Mock stats for now
    setStats({
      totalPartnerships: 5,
      activeCauses: 12,
      volunteersEngaged: 150,
      impactHours: 450
    });
  }, []);

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
        {statCards.map((stat, index) => (
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
        ))}
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
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl">✅</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Partnership established with Green Earth NGO</p>
              <p className="text-sm text-gray-500">2 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl">👥</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">150 volunteers engaged this month</p>
              <p className="text-sm text-gray-500">5 days ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl">🎯</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Engaged with "Beach Cleanup" cause</p>
              <p className="text-sm text-gray-500">1 week ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrganisationOverview;
