import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';

const CATEGORY_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#6366F1', // Indigo
];

const UserAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stats, setStats] = useState({
    totalCauses: 0,
    verified: 0,
    thisMonth: 0,
    favoriteCategory: 'N/A'
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.id || user?._id;

      // Get user's matches
      const matchesResponse = await api.get('/api/matches');
      const userMatches = matchesResponse.data.filter(m => m.userId === userId);

      // Get all causes
      const causesResponse = await api.get('/api/causes');
      
      // Get verifications
      const verificationsResponse = await api.get('/api/verifications');
      const userVerifications = verificationsResponse.data.filter(v => v.userId === userId);

      // Enrich matches with cause details
      const userCauses = userMatches.map(match => {
        const cause = causesResponse.data.find(c => c._id === match.causeId);
        return {
          ...cause,
          joinedDate: match.createdAt
        };
      }).filter(c => c._id);

      // Calculate stats
      const totalCauses = userCauses.length;
      const verified = userVerifications.length;
      
      // This month joins
      const now = new Date();
      const thisMonthCauses = userCauses.filter(c => {
        const joinDate = new Date(c.joinedDate);
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
      });

      // Category distribution
      const categoryCount = {};
      userCauses.forEach(cause => {
        const category = cause.category || 'Other';
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });

      const categoryChartData = Object.entries(categoryCount).map(([name, value]) => ({
        name,
        value
      }));

      // Find favorite category
      let favoriteCategory = 'N/A';
      let maxCount = 0;
      Object.entries(categoryCount).forEach(([cat, count]) => {
        if (count > maxCount) {
          maxCount = count;
          favoriteCategory = cat;
        }
      });

      // Timeline data (last 30 days)
      const timelineMap = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        timelineMap[dateStr] = 0;
      }

      userCauses.forEach(cause => {
        const dateStr = new Date(cause.joinedDate).toISOString().split('T')[0];
        if (timelineMap.hasOwnProperty(dateStr)) {
          timelineMap[dateStr]++;
        }
      });

      const timelineChartData = Object.entries(timelineMap).map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        causes: count
      }));

      setStats({
        totalCauses,
        verified,
        thisMonth: thisMonthCauses.length,
        favoriteCategory
      });

      setTimelineData(timelineChartData);
      setCategoryData(categoryChartData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          My Analytics
        </h1>
        <p className="text-gray-600">Visualize your volunteer journey and impact trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.totalCauses}</h3>
          <p className="text-gray-600 text-sm">Total Causes</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.verified}</h3>
          <p className="text-gray-600 text-sm">Verified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.thisMonth}</h3>
          <p className="text-gray-600 text-sm">This Month</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{stats.favoriteCategory}</h3>
          <p className="text-gray-600 text-sm">Favorite Category</p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Timeline (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="causes" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Category Distribution</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-1">Most Active Category</h3>
            <p className="text-gray-700">{stats.favoriteCategory}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-1">Verification Rate</h3>
            <p className="text-gray-700">
              {stats.totalCauses > 0 ? Math.round((stats.verified / stats.totalCauses) * 100) : 0}%
            </p>
          </div>
          <div className="bg-white/60 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-1">Average Per Month</h3>
            <p className="text-gray-700">{stats.thisMonth} causes</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserAnalytics;
