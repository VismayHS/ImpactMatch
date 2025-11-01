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

// Role-Based Authentication
import UserLogin from './components/auth/UserLogin';
import NGOLogin from './components/auth/NGOLogin';
import AdminLogin from './components/auth/AdminLogin';
import ForgotPassword from './components/auth/ForgotPassword';

// Premium Dashboards
import NGODashboard from './components/dashboards/NGODashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        const userData = JSON.parse(savedUser);
        if (userData && (userData.id || userData._id)) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to parse user data:', err);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Store complete user object and ensure all required fields are set
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userId', userData._id || userData.id);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userName', userData.name);
  };

  const handleLogout = () => {
    setUser(null);
    // Clear all auth data
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userVerified');
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
          
          {/* Role-Based Login Routes */}
          <Route path="/login/user" element={<UserLogin onLogin={handleLogin} />} />
          <Route path="/login/ngo" element={<NGOLogin onLogin={handleLogin} />} />
          <Route path="/login/admin" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard/*"
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

          {/* Role-Based Dashboards */}
          <Route 
            path="/dashboard/user" 
            element={
              <PrivateRoute requiredRole="user">
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/ngo" 
            element={
              <PrivateRoute requiredRole="ngo">
                <NGODashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/dashboard/admin/*" 
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Legacy Premium Dashboards (for backward compatibility) */}
          <Route path="/ngo-dashboard/*" element={<NGODashboard />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
