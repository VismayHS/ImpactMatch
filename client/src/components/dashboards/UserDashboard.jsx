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
  User,
  MapPin,
  Settings
} from 'lucide-react';
import { toast } from 'react-toastify';

// Import core User components (5 pages now)
import UserDiscover from './user/UserDiscover';
import MyCauses from "./user/MyCauses";
import UserSettings from "./user/UserSettings";
import UserPreferences from "./user/UserPreferences";
import MapView from "../MapView";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('🔍 UserDashboard: Component mounted, checking authentication...');
    console.log('🔍 Current URL:', window.location.pathname);
    
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    console.log('📦 UserDashboard - localStorage FULL check:', {
      hasUser: !!userData,
      hasToken: !!token,
      hasRole: !!userRole,
      hasUserId: !!userId,
      token: token?.substring(0, 20) + '...',
      userRole: userRole,
      userId: userId,
      rawUserData: userData
    });
    
    if (!userData || !token) {
      console.log('❌ UserDashboard: Missing data, redirecting to login');
      console.log('❌ Missing:', { userData: !userData, token: !token });
      navigate('/login/user');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('✅ UserDashboard: User authenticated successfully!');
      console.log('✅ User details:', { 
        name: parsedUser.name, 
        email: parsedUser.email, 
        role: parsedUser.role,
        id: parsedUser.id,
        _id: parsedUser._id
      });
      setUser(parsedUser);
    } catch (err) {
      console.error('❌ Failed to parse user data:', err);
      localStorage.clear();
      navigate('/login/user');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const menuItems = [
    { path: '', icon: Compass, label: 'Discover Causes', gradient: 'from-purple-500 to-pink-500' },
    { path: 'my-causes', icon: Heart, label: 'Impact Dashboard', gradient: 'from-pink-500 to-rose-500' },
    { path: 'preferences', icon: Settings, label: 'My Preferences', gradient: 'from-indigo-500 to-purple-500' },
    { path: 'map', icon: MapPin, label: 'Cause Map', gradient: 'from-green-500 to-emerald-500' },
    { path: 'settings', icon: User, label: 'Profile Settings', gradient: 'from-blue-500 to-cyan-500' },
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
              <Route path="preferences" element={<UserPreferences />} />
              <Route path="map" element={<MapView user={user} />} />
              <Route path="settings" element={<UserSettings />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
