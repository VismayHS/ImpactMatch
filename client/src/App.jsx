import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Register from './components/Register';
import SwipePage from './components/SwipePage';
import Dashboard from './components/Dashboard';
import VerifyDashboard from './components/VerifyDashboard';
import MapView from './components/MapView';
import IconShowcase from './components/IconShowcase';
import PrivateRoute from './components/PrivateRoute';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import UserManagement from './admin/UserManagement';
import NGOVerification from './admin/NGOVerification';
import ActivityLogs from './admin/ActivityLogs';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      // Fetch user data with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      fetch(`/api/users/${savedUserId}`, { signal: controller.signal })
        .then(res => {
          clearTimeout(timeoutId);
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then(data => {
          if (data.user) setUser(data.user);
        })
        .catch(err => {
          console.error('Failed to load user:', err);
          // Clear invalid user ID
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('userId', userData._id || userData.id);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  };

  // Show minimal loading only if checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💚</div>
          <p className="text-gray-600">Loading ImpactMatch...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar user={user} onLogout={handleLogout} />
        <ToastContainer
          position="bottom-center"
          autoClose={3500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Onboarding onLogin={handleLogin} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/swipe" element={<SwipePage user={user} />} />
          <Route path="/icons" element={<IconShowcase />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard user={user} setUser={setUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <PrivateRoute>
                <VerifyDashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/map"
            element={
              <PrivateRoute>
                <MapView user={user} />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/ngos" element={<NGOVerification />} />
          <Route path="/admin/logs" element={<ActivityLogs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
