import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../utils/axiosConfig';

export default function UserLogin({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/users/login', {
        ...formData,
        expectedRole: 'user', // Help backend validate role
      });

      const { token, user } = response.data;

      // Verify this is actually a user account
      if (user.role !== 'user') {
        setError(`This is a ${user.role} account. Please use the ${user.role} login page.`);
        setLoading(false);
        return;
      }

      // Store auth data (overwrite any old values)
      console.log('💾 UserLogin: Storing auth data...', { userId: user.id, role: user.role, name: user.name });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('✅ UserLogin: Auth data stored, verifying...');
      console.log('📦 Stored values:', {
        token: localStorage.getItem('token')?.substring(0, 20) + '...',
        userId: localStorage.getItem('userId'),
        userRole: localStorage.getItem('userRole'),
        userName: localStorage.getItem('userName'),
        userObject: localStorage.getItem('user')
      });

      // Call parent login handler
      if (onLogin) {
        console.log('📞 Calling onLogin handler...');
        onLogin(user);
      }

      // Navigate to dashboard
      console.log('🚀 UserLogin: About to navigate to /user-dashboard in 100ms');
      console.log('🚀 Current location before navigate:', window.location.pathname);
      setTimeout(() => {
        console.log('🚀 NAVIGATING NOW to /user-dashboard');
        navigate('/user-dashboard');
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mb-4"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Volunteer Login
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to discover causes and make an impact
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="volunteer@example.com"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Demo Account */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 font-medium mb-2">
            🎯 Demo Account:
          </p>
          <p className="text-xs text-green-700">
            Email: vismay@example.com<br />
            Password: demo123
          </p>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New volunteer?{' '}
            <Link
              to="/register"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Other Login Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            Are you an organization?
          </p>
          <div className="flex gap-3">
            <Link
              to="/login/ngo"
              className="flex-1 text-center py-2 px-4 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition text-sm font-medium"
            >
              NGO Login
            </Link>
            <Link
              to="/login/admin"
              className="flex-1 text-center py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
