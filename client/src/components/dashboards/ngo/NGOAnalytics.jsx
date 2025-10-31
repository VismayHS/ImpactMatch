import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrendingUp, PieChart as PieIcon, Map as MapIcon } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import 'leaflet/dist/leaflet.css';

const COLORS = ['#14B8A6', '#2563EB', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

const NGOAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [causes, setCauses] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const ngoId = user?._id || user?.id;

      // Fetch causes
      const causesRes = await api.get(`/api/causes?ngoId=${ngoId}`);
      const ngoCauses = causesRes.data.causes || [];
      setCauses(ngoCauses);

      // Fetch matches
      const matchesRes = await api.get('/api/matches');
      const allMatches = matchesRes.data.matches || [];
      
      const causeIds = ngoCauses.map(c => c._id);
      const ngoMatches = allMatches.filter(m => causeIds.includes(m.causeId));

      // Generate timeline data (last 30 days)
      const timelineMap = {};
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        timelineMap[dateStr] = 0;
      }

      ngoMatches.forEach(match => {
        const matchDate = new Date(match.createdAt || match.joinedAt);
        const dateStr = matchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (timelineMap[dateStr] !== undefined) {
          timelineMap[dateStr]++;
        }
      });

      const timeline = Object.entries(timelineMap).map(([date, volunteers]) => ({
        date,
        volunteers
      }));
      setTimelineData(timeline);

      // Generate category data
      const categoryMap = {};
      ngoCauses.forEach(cause => {
        const category = cause.category || 'other';
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });

      const categories = Object.entries(categoryMap).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value
      }));
      setCategoryData(categories);

    } catch (error) {
      console.error('Load analytics error:', error);
      // Set default data
      setTimelineData([
        { date: 'Week 1', volunteers: 5 },
        { date: 'Week 2', volunteers: 8 },
        { date: 'Week 3', volunteers: 12 },
        { date: 'Week 4', volunteers: 15 }
      ]);
      setCategoryData([
        { name: 'Education', value: 3 },
        { name: 'Health', value: 2 },
        { name: 'Environment', value: 4 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">Deep insights into your NGO's impact and reach</p>
      </div>

      {/* Volunteers Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Volunteer Growth (Last 30 Days)</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line
              type="monotone"
              dataKey="volunteers"
              stroke="#14B8A6"
              strokeWidth={3}
              dot={{ fill: '#14B8A6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <PieIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Causes by Category</h2>
        </div>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            No category data available
          </div>
        )}
      </motion.div>

      {/* Geographic Distribution Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Geographic Reach</h2>
        </div>
        {causes.length > 0 && causes.some(c => c.lat && c.lng) ? (
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {causes.map((cause) => (
                cause.lat && cause.lng ? (
                  <Marker key={cause._id} position={[cause.lat, cause.lng]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-teal-600">{cause.name}</h3>
                        <p className="text-sm text-gray-600">{cause.city}</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{cause.category}</p>
                        <p className="text-xs text-gray-700 mt-1">
                          {cause.volunteersJoined || 0}/{cause.volunteerLimit} volunteers
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ) : null
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <MapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No location data available</p>
              <p className="text-sm text-gray-500 mt-1">Causes with location data will appear here</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Most Popular Category</p>
          <p className="text-3xl font-bold">
            {categoryData.length > 0 
              ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max, categoryData[0]).name
              : 'N/A'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Total Causes Active</p>
          <p className="text-3xl font-bold">{causes.filter(c => c.status === 'active').length}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Cities Covered</p>
          <p className="text-3xl font-bold">
            {new Set(causes.map(c => c.city)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NGOAnalytics;
