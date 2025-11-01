import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic - for demo, we'll check if user exists in database
      try {
        // In production, this would be a proper login endpoint
        const response = await api.post('/api/users/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.userId && response.data.user) {
          const user = response.data.user;
          
          // Store auth data (overwrite any old values)
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', response.data.token);
          
          toast.success(`Welcome back, ${user.name}!`);
          
          // Role-based redirect
          let redirectPath = from;
          if (user.role === 'admin') {
            redirectPath = '/admin-dashboard';
          } else if (user.role === 'ngo') {
            redirectPath = '/ngo-dashboard';
          } else if (user.role === 'user' || user.role === 'organisation') {
            redirectPath = '/user-dashboard';
          }
          
          navigate(redirectPath, { replace: true });
        }
      } catch (error) {
        // Fallback: Try to find user by email (demo only)
        toast.error('Login failed. Try demo credentials: vismay@example.com / demo123');
      }
    } else {
      // Signup logic
      try {
        const response = await axios.post('/api/users/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          city: 'Bangalore',
          interests: 'general',
          availability: 'weekends',
          role: 'user',
        });

        if (response.data.userId && response.data.user) {
          const user = response.data.user;
          
          // Store auth data (overwrite any old values)
          localStorage.setItem('userId', response.data.userId);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', response.data.token);
          
          toast.success('Registration successful!');
          
          // Role-based redirect (same as login)
          let redirectPath = from;
          if (user.role === 'admin') {
            redirectPath = '/admin-dashboard';
          } else if (user.role === 'ngo') {
            redirectPath = '/ngo-dashboard';
          } else if (user.role === 'user' || user.role === 'organisation') {
            redirectPath = '/user-dashboard';
          }
          
          navigate(redirectPath, { replace: true });
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            {isLogin ? 'Welcome Back!' : 'Join ImpactMatch'}
          </h2>
          <p className="text-secondary text-center mb-8">
            {isLogin ? 'Login to continue making an impact' : 'Create an account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-light text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Demo Credentials:</p>
              <p className="text-sm text-blue-600">Email: vismay@example.com</p>
              <p className="text-sm text-blue-600">Password: demo123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
