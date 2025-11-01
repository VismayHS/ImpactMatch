import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle, 
  History, 
  BarChart3, 
  Settings, 
  LogOut, 
  AlertCircle,
  Building2 
} from 'lucide-react';
import { toast } from 'react-toastify';

// Import core NGO components only (3 pages)
import NGOOverview from './ngo/NGOOverview';
import VolunteerVerification from './ngo/VolunteerVerification';
import NGOSettings from './ngo/NGOSettings';
import NGOCollaborationRequests from './ngo/NGOCollaborationRequests';

const NGODashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/login/ngo');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      // Validate that parsedUser has required fields
      if (!parsedUser || !parsedUser.name || !parsedUser.role) {
        console.error('Invalid user data in localStorage');
        localStorage.clear();
        navigate('/login/ngo');
        return;
      }
      
      setUser(parsedUser);
      
      // Check if NGO is pending verification
      setIsPending(parsedUser.role === 'ngo' && !parsedUser.verified);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.clear();
      navigate('/login/ngo');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const menuItems = [
    { path: '', icon: LayoutDashboard, label: 'Home / Causes' },
    { path: 'collaborations', icon: Building2, label: 'Collaboration Requests' },
    { path: 'verify-volunteers', icon: CheckCircle, label: 'Verify Volunteers' },
    { path: 'settings', icon: Settings, label: 'Profile Settings' },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
      {/* Pending Verification Banner */}
      {isPending && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-yellow-400 text-yellow-900 px-6 py-3 flex items-center justify-center gap-2 shadow-lg"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">
            ⚠️ Your NGO certificate is under verification by the admin. Access is limited until approval.
          </span>
        </motion.div>
      )}

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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  ImpactMatch
                </h1>
                <p className="text-xs text-gray-600">NGO Dashboard</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium truncate">{user?.name || 'NGO User'}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={`/ngo-dashboard/${item.path}`}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-teal-500 hover:to-blue-600 hover:text-white transition-all duration-300 group"
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
              <Route index element={<NGOOverview />} />
              <Route path="collaborations" element={<NGOCollaborationRequests />} />
              <Route path="verify-volunteers" element={<VolunteerVerification />} />
              <Route path="settings" element={<NGOSettings />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default NGODashboard;
