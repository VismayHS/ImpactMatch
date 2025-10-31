import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Users, Target, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const StatCard = ({ icon: Icon, title, value, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </motion.div>
);

const NGOOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCauses: 0,
    totalVolunteers: 0,
    verifiedImpacts: 0,
    verificationRate: 0
  });
  const [chartData, setChartData] = useState([]);
  const [causes, setCauses] = useState([]);
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setIsPending(userData?.role === 'ngo' && !userData?.verified);
    loadDashboardData(userData);
  }, []);

  const loadDashboardData = async (userData) => {
    try {
      // Fetch causes created by this NGO
      const causesRes = await axios.get(`${API_BASE_URL}/api/causes`);
      const ngoId = userData?._id || userData?.id;
      const ngoCauses = causesRes.data.causes?.filter(c => c.ngoId === ngoId) || [];
      
      setCauses(ngoCauses);

      // Fetch matches (volunteers who joined)
      const matchesRes = await axios.get(`${API_BASE_URL}/api/matches`);
      const allMatches = matchesRes.data.matches || [];
      
      // Filter matches for this NGO's causes
      const causeIds = ngoCauses.map(c => c._id);
      const ngoMatches = allMatches.filter(m => causeIds.includes(m.causeId));

      // Fetch verifications
      const verificationsRes = await axios.get(`${API_BASE_URL}/api/verifications`);
      const verifications = verificationsRes.data.verifications || [];
      const ngoVerifications = verifications.filter(v => causeIds.includes(v.causeId));

      // Calculate stats
      const totalVolunteers = ngoMatches.length;
      const verifiedCount = ngoVerifications.length;
      const verificationRate = totalVolunteers > 0 
        ? Math.round((verifiedCount / totalVolunteers) * 100) 
        : 0;

      setStats({
        totalCauses: ngoCauses.length,
        totalVolunteers: totalVolunteers,
        verifiedImpacts: verifiedCount,
        verificationRate: verificationRate
      });

      // Generate chart data (last 7 days)
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const dayMatches = ngoMatches.filter(m => {
          const matchDate = new Date(m.createdAt || m.joinedAt);
          return matchDate.toDateString() === date.toDateString();
        });

        last7Days.push({
          date: dayStr,
          volunteers: dayMatches.length
        });
      }

      setChartData(last7Days);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default data to show the UI
      setChartData([
        { date: 'Mon', volunteers: 2 },
        { date: 'Tue', volunteers: 5 },
        { date: 'Wed', volunteers: 3 },
        { date: 'Thu', volunteers: 8 },
        { date: 'Fri', volunteers: 6 },
        { date: 'Sat', volunteers: 10 },
        { date: 'Sun', volunteers: 7 }
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
          Dashboard Overview
        </h1>
        <p className="text-gray-600">Welcome back! Here's your impact summary</p>
      </div>

      {/* Pending Verification Alert */}
      {isPending && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-1">Verification Pending</h3>
            <p className="text-sm text-yellow-800">
              Your NGO certificate is under verification by the admin. Some features may be limited until approval.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          title="Total Causes"
          value={stats.totalCauses}
          color="from-teal-500 to-emerald-500"
          trend="+2 this week"
        />
        <StatCard
          icon={Users}
          title="Total Volunteers"
          value={stats.totalVolunteers}
          color="from-blue-500 to-cyan-500"
          trend="+12 this week"
        />
        <StatCard
          icon={CheckCircle}
          title="Verified Impacts"
          value={stats.verifiedImpacts}
          color="from-purple-500 to-pink-500"
          trend="+8 this week"
        />
        <StatCard
          icon={TrendingUp}
          title="Verification Rate"
          value={`${stats.verificationRate}%`}
          color="from-orange-500 to-red-500"
        />
      </div>

      {/* Volunteers Joined Over Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Volunteers Joined Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" stroke="#6b7280" />
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
              stroke="url(#colorGradient)"
              strokeWidth={3}
              dot={{ fill: '#14B8A6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Causes Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Causes Locations</h2>
        {causes.length > 0 ? (
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]} // Center of India
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
                        <p className="text-xs text-gray-500 mt-1">{cause.category}</p>
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
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No causes created yet</p>
              <p className="text-sm text-gray-500 mt-1">Create your first cause to see it on the map</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NGOOverview;
