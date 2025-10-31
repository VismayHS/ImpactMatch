import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Heart, 
  Trophy, 
  BarChart3, 
  Shield, 
  Share2, 
  LogOut, 
  User 
} from 'lucide-react';
import { toast } from 'react-toastify';

// Import complete User components
import UserDiscover from './user/UserDiscover';
import MyCauses from './user/MyCauses';
import ImpactScore from './user/ImpactScore';
import UserAnalytics from './user/UserAnalytics';
import BlockchainProofs from './user/BlockchainProofs';
import ShareImpact from './user/ShareImpact';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const menuItems = [
    { path: '', icon: Compass, label: 'Discover', gradient: 'from-purple-500 to-pink-500' },
    { path: 'my-causes', icon: Heart, label: 'My Causes', gradient: 'from-pink-500 to-rose-500' },
    { path: 'impact-score', icon: Trophy, label: 'Impact Score', gradient: 'from-yellow-500 to-orange-500' },
    { path: 'analytics', icon: BarChart3, label: 'Analytics', gradient: 'from-blue-500 to-cyan-500' },
    { path: 'blockchain', icon: Shield, label: 'Blockchain Proofs', gradient: 'from-green-500 to-emerald-500' },
    { path: 'share', icon: Share2, label: 'Share Impact', gradient: 'from-indigo-500 to-purple-500' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 min-h-screen bg-white/50 backdrop-blur-lg shadow-xl p-6 flex flex-col"
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ImpactMatch
                </h1>
                <p className="text-xs text-gray-600">User Dashboard</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium truncate">{user.name}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
              <Trophy className="w-3 h-3 text-white" />
              <span className="text-xs text-white font-bold">{user.impactScore || 0} pts</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/user-dashboard/${item.path}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:${item.gradient} hover:text-white transition-all duration-300 group`}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 backdrop-blur-lg rounded-2xl shadow-xl p-8 min-h-[calc(100vh-4rem)]"
          >
            <Routes>
              <Route index element={<UserDiscover />} />
              <Route path="my-causes" element={<MyCauses />} />
              <Route path="impact-score" element={<ImpactScore />} />
              <Route path="analytics" element={<UserAnalytics />} />
              <Route path="blockchain" element={<BlockchainProofs />} />
              <Route path="share" element={<ShareImpact />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
