import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Heart, 
  Shield, 
  AlertTriangle, 
  FileText, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { toast } from 'react-toastify';
import AdminOverview from './admin/AdminOverview';
import NGOManagement from './admin/NGOManagement';
import BlockchainTracker from './admin/BlockchainTracker';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login/admin');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const menuItems = [
    { path: '', icon: LayoutDashboard, label: 'Overview' },
    { path: 'ngo-management', icon: Building2, label: 'NGO Management' },
    { path: 'blockchain', icon: Shield, label: 'Verification Tracker' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 min-h-screen bg-white/50 backdrop-blur-lg shadow-xl p-6 flex flex-col border-r border-gray-200"
        >
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ImpactMatch
                </h1>
                <p className="text-xs text-gray-600">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                <span className="text-xs text-white font-bold">ADMIN</span>
              </div>
              <p className="text-sm text-gray-700 font-medium truncate">{user.name}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 group"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{item.label}</span>
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
              <Route index element={<AdminOverview />} />
              <Route path="ngo-management" element={<NGOManagement />} />
              <Route path="blockchain" element={<BlockchainTracker />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
