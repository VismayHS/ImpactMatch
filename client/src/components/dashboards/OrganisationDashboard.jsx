import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import OrganisationOverview from './organisation/OrganisationOverview';
import OrganisationCauses from './organisation/OrganisationCauses';
import OrganisationPartnerships from './organisation/OrganisationPartnerships';
import OrganisationSettings from './organisation/OrganisationSettings';
import OrganisationAnalytics from './organisation/OrganisationAnalytics';
import OrganisationProfile from './organisation/OrganisationProfile';

function OrganisationDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🏢 OrganisationDashboard mounted!');
    console.log('Current URL:', window.location.pathname);
    
    const userData = localStorage.getItem('user');
    
    console.log('User data in localStorage:', userData ? 'YES' : 'NO');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User loaded:', parsedUser.name, '| Role:', parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'causes', label: 'Discover Causes', icon: '🌍' },
    { id: 'partnerships', label: 'Collaborations', icon: '🤝' },
    { id: 'analytics', label: 'Impact Analytics', icon: '📈' },
    { id: 'profile', label: 'Organization Profile', icon: '🧩' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OrganisationOverview />;
      case 'causes':
        return <OrganisationCauses />;
      case 'partnerships':
        return <OrganisationPartnerships />;
      case 'analytics':
        return <OrganisationAnalytics />;
      case 'profile':
        return <OrganisationProfile />;
      case 'settings':
        return <OrganisationSettings />;
      default:
        return <OrganisationOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Organisation Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your corporate social responsibility initiatives
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white rounded-2xl shadow-lg p-2"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}

export default OrganisationDashboard;
