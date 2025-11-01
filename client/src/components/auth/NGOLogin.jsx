import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../../utils/axiosConfig';

export default function NGOLogin({ onLogin }) {
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
        expectedRole: 'ngo',
      });

      const { token, user } = response.data;

      // Verify this is actually an NGO account
      if (user.role !== 'ngo') {
        setError(`This is a ${user.role} account. Please use the ${user.role} login page.`);
        setLoading(false);
        return;
      }

      // Store auth data in localStorage (overwrite any old values)
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userVerified', user.verified);
      localStorage.setItem('user', JSON.stringify(user));

      // Call parent login handler if provided
      if (onLogin) {
        onLogin(user);
      }

      // Small delay to ensure localStorage is set before navigation
      setTimeout(() => {
        navigate('/ngo-dashboard');
      }, 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-500 rounded-full mb-4"
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
            NGO Login
          </h1>
          <p className="text-gray-600 mt-2">
            Access your organization dashboard
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
              Organization Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@organization.org"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
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
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
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
            className="w-full bg-gradient-to-r from-orange-500 to-purple-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800 font-medium mb-2">
            🏢 Demo Accounts:
          </p>
          <div className="text-xs text-orange-700 space-y-2">
            <div>
              <p className="font-medium">Verified NGO:</p>
              <p>Email: ngo@greennearth.org</p>
              <p>Password: ngo123</p>
            </div>
            <div className="pt-2 border-t border-orange-200">
              <p className="font-medium">Pending Approval:</p>
              <p>Email: ngo@hopefoundation.org</p>
              <p>Password: ngo123</p>
            </div>
          </div>
        </div>

        {/* Register Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            New organization?{' '}
            <Link
              to="/register/ngo"
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Register your NGO
            </Link>
          </p>
        </div>

        {/* Other Login Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            Different account type?
          </p>
          <div className="flex gap-3">
            <Link
              to="/login/user"
              className="flex-1 text-center py-2 px-4 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition text-sm font-medium"
            >
              Volunteer Login
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
