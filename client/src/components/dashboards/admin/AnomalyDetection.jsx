import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Shield, Activity, TrendingUp } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const AnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ critical: 0, warning: 0, info: 0 });

  useEffect(() => {
    detectAnomalies();
  }, []);

  const detectAnomalies = async () => {
    try {
      setLoading(true);
      const [usersRes, causesRes, matchesRes, verificationsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/causes'),
        api.get('/api/matches'),
        api.get('/api/verifications')
      ]);

      const detected = [];
      const users = usersRes.data.users || usersRes.data || [];
      const causes = causesRes.data || [];
      const matches = matchesRes.data || [];
      const verifications = verificationsRes.data || [];

      // Rule 1: User joined too many causes in short time (>5 in 1 hour)
      const recentMatches = matches.filter(m => new Date(m.joinDate) > new Date(Date.now() - 60 * 60 * 1000));
      const userJoinCounts = {};
      recentMatches.forEach(m => {
        userJoinCounts[m.userId] = (userJoinCounts[m.userId] || 0) + 1;
      });
      
      Object.entries(userJoinCounts).forEach(([userId, count]) => {
        if (count > 5) {
          const user = users.find(u => u._id === userId);
          detected.push({
            type: 'critical',
            title: 'Suspicious Join Activity',
            description: `User "${user?.name || 'Unknown'}" joined ${count} causes in the last hour`,
            userId,
            timestamp: new Date(),
            action: 'Review user account for potential abuse'
          });
        }
      });

      // Rule 2: Multiple verifications for same user in short time (>3 in 1 day)
      const recentVerifications = verifications.filter(v => new Date(v.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
      const userVerifCounts = {};
      recentVerifications.forEach(v => {
        userVerifCounts[v.userId] = (userVerifCounts[v.userId] || 0) + 1;
      });

      Object.entries(userVerifCounts).forEach(([userId, count]) => {
        if (count > 3) {
          const user = users.find(u => u._id === userId);
          detected.push({
            type: 'warning',
            title: 'High Verification Rate',
            description: `User "${user?.name || 'Unknown'}" received ${count} verifications in 24 hours`,
            userId,
            timestamp: new Date(),
            action: 'Verify legitimacy of verifications'
          });
        }
      });

      // Rule 3: NGO with no active causes (registered >7 days ago)
      const ngoUsers = users.filter(u => u.role === 'organisation');
      ngoUsers.forEach(ngo => {
        const ngoCauses = causes.filter(c => c.ngoId?._id === ngo._id || c.ngoId === ngo._id);
        const activeCauses = ngoCauses.filter(c => c.status === 'active');
        const daysSinceRegistration = (Date.now() - new Date(ngo.createdAt)) / (1000 * 60 * 60 * 24);
        
        if (activeCauses.length === 0 && daysSinceRegistration > 7) {
          detected.push({
            type: 'info',
            title: 'Inactive NGO',
            description: `NGO "${ngo.name}" has no active causes (registered ${Math.floor(daysSinceRegistration)} days ago)`,
            userId: ngo._id,
            timestamp: new Date(),
            action: 'Reach out to encourage cause creation'
          });
        }
      });

      // Rule 4: Cause with unusual volunteer count (>50 in 1 week)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      causes.forEach(cause => {
        const recentJoins = matches.filter(m => 
          m.causeId === cause._id && new Date(m.joinDate) > weekAgo
        );
        
        if (recentJoins.length > 50) {
          detected.push({
            type: 'warning',
            title: 'Unusual Volunteer Growth',
            description: `Cause "${cause.title}" gained ${recentJoins.length} volunteers in the last week`,
            causeId: cause._id,
            timestamp: new Date(),
            action: 'Verify cause legitimacy and volunteer authenticity'
          });
        }
      });

      // Rule 5: User account created and immediately joined multiple causes (<1 hour)
      users.forEach(user => {
        if (user.role !== 'user') return;
        const userMatches = matches.filter(m => m.userId === user._id);
        const accountAge = (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60);
        
        if (accountAge < 1 && userMatches.length > 3) {
          detected.push({
            type: 'critical',
            title: 'Suspicious New Account',
            description: `User "${user.name}" joined ${userMatches.length} causes within 1 hour of registration`,
            userId: user._id,
            timestamp: new Date(),
            action: 'Flag for manual review - potential bot or spam'
          });
        }
      });

      setAnomalies(detected.sort((a, b) => {
        const order = { critical: 0, warning: 1, info: 2 };
        return order[a.type] - order[b.type];
      }));

      setStats({
        critical: detected.filter(a => a.type === 'critical').length,
        warning: detected.filter(a => a.type === 'warning').length,
        info: detected.filter(a => a.type === 'info').length
      });
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      toast.error('Failed to analyze activity');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96"><div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Anomaly Detection
        </h1>
        <p className="text-gray-600">AI-powered suspicious activity monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-red-600">{stats.critical}</h3>
              <p className="text-gray-600 text-sm">Critical Alerts</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-yellow-600">{stats.warning}</h3>
              <p className="text-gray-600 text-sm">Warnings</p>
            </div>
            <Shield className="w-12 h-12 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-blue-600">{stats.info}</h3>
              <p className="text-gray-600 text-sm">Info</p>
            </div>
            <Activity className="w-12 h-12 text-blue-400" />
          </div>
        </div>
      </div>

      {anomalies.length === 0 ? (
        <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-12 text-center border border-white/20">
          <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">All Clear</h3>
          <p className="text-gray-600">No suspicious activity detected</p>
        </div>
      ) : (
        <div className="space-y-4">
          {anomalies.map((anomaly, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border-l-4 ${
                anomaly.type === 'critical' ? 'border-red-500' :
                anomaly.type === 'warning' ? 'border-yellow-500' :
                'border-blue-500'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  anomaly.type === 'critical' ? 'bg-red-100' :
                  anomaly.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <AlertTriangle className={`w-6 h-6 ${
                    anomaly.type === 'critical' ? 'text-red-600' :
                    anomaly.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{anomaly.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                      anomaly.type === 'critical' ? 'bg-red-100 text-red-700' :
                      anomaly.type === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {anomaly.type}
                    </span>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="text-gray-500">Recommended Action:</span> {anomaly.action}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Detected: {new Date(anomaly.timestamp).toLocaleString()}</span>
                    {anomaly.userId && <span>User ID: {anomaly.userId.substring(0, 8)}</span>}
                    {anomaly.causeId && <span>Cause ID: {anomaly.causeId.substring(0, 8)}</span>}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={detectAnomalies}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Re-scan for Anomalies
      </button>
    </div>
  );
};

export default AnomalyDetection;
