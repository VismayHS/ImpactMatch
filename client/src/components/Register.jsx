import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axiosConfig';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('user'); // 'user', 'organisation', 'ngo'
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for different user types
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
    interests: '',
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    email: '',
    password: '',
    officeAddress: '',
  });

  const [ngoForm, setNgoForm] = useState({
    name: '',
    email: '',
    password: '',
    certificate: null,
    certificatePreview: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const from = location.state?.from?.pathname || '/swipe';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or JPEG/PNG image');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setNgoForm({
        ...ngoForm,
        certificate: file,
        certificatePreview: file.name,
      });
      toast.success('Certificate uploaded successfully');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/api/users/login', {
        email: loginForm.email,
        password: loginForm.password,
      });

      if (response.data.userId && response.data.user) {
        const user = response.data.user;
        
        // Store auth data (overwrite any old values)
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', user.name || 'User');
        localStorage.setItem('userRole', user.role || 'user');
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.token);
        
        toast.success(`Welcome back, ${user.name}!`);
        
        // Role-based redirect (always use role-based routing)
        let redirectPath = '/user-dashboard'; // Default for users
        if (user.role === 'admin') {
          redirectPath = '/admin-dashboard';
        } else if (user.role === 'ngo') {
          redirectPath = '/ngo-dashboard';
        } else if (user.role === 'user' || user.role === 'organisation') {
          redirectPath = '/user-dashboard';
        }
        
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
      } else {
        toast.error('Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let registrationData = {};

      if (activeTab === 'user') {
        // Validate user form
        if (!userForm.name || !userForm.email || !userForm.password || !userForm.location || !userForm.interests) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        registrationData = {
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          city: userForm.location,
          interests: userForm.interests,
          availability: 'weekends',
          role: 'user',
        };
      } else if (activeTab === 'organisation') {
        // Validate organisation form
        if (!orgForm.name || !orgForm.email || !orgForm.password || !orgForm.officeAddress) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }

        registrationData = {
          name: orgForm.name,
          email: orgForm.email,
          password: orgForm.password,
          city: orgForm.officeAddress,
          interests: 'Corporate Social Responsibility',
          availability: 'full-time',
          role: 'organisation',
          officeAddress: orgForm.officeAddress,
        };
      } else if (activeTab === 'ngo') {
        // Validate NGO form
        if (!ngoForm.name || !ngoForm.email || !ngoForm.password || !ngoForm.certificate) {
          toast.error('Please fill in all required fields and upload a certificate');
          setLoading(false);
          return;
        }

        registrationData = {
          name: ngoForm.name,
          email: ngoForm.email,
          password: ngoForm.password,
          city: 'Multiple Cities',
          interests: 'Social Impact',
          availability: 'full-time',
          role: 'ngo',
          certificateUploaded: true,
          verified: false, // Will be verified by admin
        };
      }

      const response = await api.post('/api/users/register', registrationData);

      if (response.data.userId && response.data.user) {
        // Store auth data (overwrite any old values)
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('userName', response.data.user.name || registrationData.name);
        localStorage.setItem('userRole', registrationData.role);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // If NGO, upload certificate
        if (activeTab === 'ngo' && ngoForm.certificate) {
          const formData = new FormData();
          formData.append('certificate', ngoForm.certificate);
          formData.append('userId', response.data.userId);
          formData.append('registrationNumber', 'AUTO-' + Date.now());
          
          try {
            const uploadResponse = await api.post('/api/users/upload-certificate', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            console.log('Certificate upload successful:', uploadResponse.data);
            toast.success('Certificate uploaded successfully!');
          } catch (err) {
            console.error('Certificate upload error:', err);
            console.error('Error response:', err.response?.data);
            toast.error('Certificate upload failed: ' + (err.response?.data?.error || err.message));
          }
        }
        
        toast.success('Registration successful!');
        
        if (activeTab === 'ngo') {
          toast.info('Your NGO verification is pending. You will be notified once approved.');
        }

        // Role-based redirect after successful registration (always use role-based routing)
        let redirectPath = '/user-dashboard'; // Default for users
        if (registrationData.role === 'admin') {
          redirectPath = '/admin-dashboard';
        } else if (registrationData.role === 'ngo') {
          redirectPath = '/ngo-dashboard';
        } else if (registrationData.role === 'user' || registrationData.role === 'organisation') {
          redirectPath = '/user-dashboard';
        }
        
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1500);
      } else {
        toast.error('Registration completed but received invalid response. Please try logging in.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'user', label: 'Individual', icon: '👤', description: 'Join as a volunteer' },
    { id: 'organisation', label: 'Organisation', icon: '🏢', description: 'Corporate partnership' },
    { id: 'ngo', label: 'NGO', icon: '🤝', description: 'Register your NGO' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block text-7xl mb-4"
          >
            💚
          </motion.div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            {isLogin ? 'Welcome Back!' : 'Join ImpactMatch'}
          </h1>
          <p className="text-xl text-gray-600">
            {isLogin ? 'Login to continue making an impact' : 'Create an account and start making a difference'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
          {!isLogin && (
            <>
              {/* Tab Selection */}
              <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-1">
                <div className="bg-white rounded-t-3xl p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative p-6 rounded-2xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-102'
                        }`}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-5xl mb-3">{tab.icon}</div>
                        <div className="font-bold text-lg mb-1">{tab.label}</div>
                        <div className={`text-sm ${activeTab === tab.id ? 'text-white/90' : 'text-gray-500'}`}>
                          {tab.description}
                        </div>
                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 border-4 border-emerald-300 rounded-2xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Form Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {isLogin ? (
                // Login Form
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      'Login to ImpactMatch'
                    )}
                  </motion.button>

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-bold mb-2">🔑 Demo Credentials:</p>
                    <p className="text-sm text-blue-700">Email: vismay@example.com</p>
                    <p className="text-sm text-blue-700">Password: demo123</p>
                  </div>
                </motion.form>
              ) : activeTab === 'user' ? (
                // Individual User Registration
                <motion.form
                  key="user"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="••••••••"
                      minLength="6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location/City *</label>
                    <input
                      type="text"
                      value={userForm.location}
                      onChange={(e) => setUserForm({ ...userForm, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="Bangalore"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Interests *</label>
                    <textarea
                      value={userForm.interests}
                      onChange={(e) => setUserForm({ ...userForm, interests: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                      placeholder="E.g., Environment, Education, Healthcare, Animal Welfare"
                      rows="3"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">💡 Tell us what causes you're passionate about</p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      '🚀 Start Making Impact'
                    )}
                  </motion.button>
                </motion.form>
              ) : activeTab === 'organisation' ? (
                // Organisation Registration
                <motion.form
                  key="organisation"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Organisation Name *</label>
                    <input
                      type="text"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="Your Company Name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email *</label>
                      <input
                        type="email"
                        value={orgForm.email}
                        onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="contact@company.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        value={orgForm.password}
                        onChange={(e) => setOrgForm({ ...orgForm, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="••••••••"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Permanent Office Address *</label>
                    <textarea
                      value={orgForm.officeAddress}
                      onChange={(e) => setOrgForm({ ...orgForm, officeAddress: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                      placeholder="Full office address including city, state, and postal code"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-800">
                      <strong>🏢 Corporate Benefits:</strong> Access to verified causes, employee volunteering programs, CSR impact tracking, and detailed analytics.
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Registering Organisation...
                      </span>
                    ) : (
                      '🏢 Register Organisation'
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                // NGO Registration
                <motion.form
                  key="ngo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">NGO Name *</label>
                    <input
                      type="text"
                      value={ngoForm.name}
                      onChange={(e) => setNgoForm({ ...ngoForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                      placeholder="Your NGO Name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Official Email *</label>
                      <input
                        type="email"
                        value={ngoForm.email}
                        onChange={(e) => setNgoForm({ ...ngoForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="contact@ngo.org"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Password *</label>
                      <input
                        type="password"
                        value={ngoForm.password}
                        onChange={(e) => setNgoForm({ ...ngoForm, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                        placeholder="••••••••"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Government Certificate (PDF/JPEG) *</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="certificate-upload"
                        required
                      />
                      <label
                        htmlFor="certificate-upload"
                        className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                      >
                        {ngoForm.certificatePreview ? (
                          <div className="text-center">
                            <div className="text-5xl mb-2">✅</div>
                            <p className="text-sm font-bold text-emerald-600">{ngoForm.certificatePreview}</p>
                            <p className="text-xs text-gray-500 mt-1">Click to change file</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-5xl mb-2">📄</div>
                            <p className="text-sm font-bold text-gray-600">Click to upload certificate</p>
                            <p className="text-xs text-gray-500 mt-1">PDF, JPEG, or PNG (Max 5MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Verification Required:</strong> Your NGO registration will be reviewed by our team. You'll receive a confirmation email once verified (typically within 24-48 hours).
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting for Review...
                      </span>
                    ) : (
                      '🤝 Register NGO'
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Toggle Login/Register */}
            <div className="mt-8 text-center">
              {isLogin ? (
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
                >
                  Don't have an account? Register here
                </button>
              ) : (
                <Link
                  to="/login/user"
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
                >
                  Already have an account? Login here
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-gray-600"
        >
          <p className="text-sm">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
