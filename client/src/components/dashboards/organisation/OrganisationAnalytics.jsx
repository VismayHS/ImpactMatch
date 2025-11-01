import { motion } from 'framer-motion';
import { useState } from 'react';

function OrganisationAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');

  // Mock data
  const summaryMetrics = {
    totalCollaborations: 12,
    volunteersContributed: 45,
    hoursLogged: 450,
    causesSupported: 8,
    citiesImpacted: 5,
    ngoPartnerships: 6
  };

  const monthlyData = [
    { month: 'Jun', collaborations: 1, volunteers: 5, hours: 40 },
    { month: 'Jul', collaborations: 2, volunteers: 8, hours: 64 },
    { month: 'Aug', collaborations: 2, volunteers: 10, hours: 80 },
    { month: 'Sep', collaborations: 3, volunteers: 12, hours: 96 },
    { month: 'Oct', collaborations: 2, volunteers: 6, hours: 85 },
    { month: 'Nov', collaborations: 2, volunteers: 4, hours: 85 }
  ];

  const categoryBreakdown = [
    { category: 'Environment', count: 4, percentage: 33 },
    { category: 'Education', count: 3, percentage: 25 },
    { category: 'Health', count: 2, percentage: 17 },
    { category: 'Animal Welfare', count: 2, percentage: 17 },
    { category: 'Youth', count: 1, percentage: 8 }
  ];

  const impactLocations = [
    { city: 'Bangalore', collaborations: 4, volunteers: 18 },
    { city: 'Mumbai', collaborations: 3, volunteers: 12 },
    { city: 'Delhi', collaborations: 2, volunteers: 8 },
    { city: 'Pune', collaborations: 2, volunteers: 5 },
    { city: 'Chennai', collaborations: 1, volunteers: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-3xl font-black text-gray-900">📊 Collaboration Analytics</h3>
          <p className="text-gray-600 mt-1">Track and visualize your collective volunteering impact</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 font-semibold"
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </motion.div>

      {/* Summary Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🤝</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.totalCollaborations}</div>
          <div className="text-purple-100 text-sm font-semibold">Total Collaborations</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">👥</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.volunteersContributed}</div>
          <div className="text-blue-100 text-sm font-semibold">Volunteers Contributed</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">⏱️</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.hoursLogged}</div>
          <div className="text-orange-100 text-sm font-semibold">Hours Logged</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.causesSupported}</div>
          <div className="text-green-100 text-sm font-semibold">Causes Supported</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🏢</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.ngoPartnerships}</div>
          <div className="text-indigo-100 text-sm font-semibold">NGO Partnerships</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="text-3xl font-black mb-1">{summaryMetrics.citiesImpacted}</div>
          <div className="text-pink-100 text-sm font-semibold">Cities Impacted</div>
        </div>
      </motion.div>

      {/* Impact Over Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h4 className="text-2xl font-black text-gray-900 mb-6">📈 Impact Over Time</h4>
        
        <div className="space-y-6">
          {/* Monthly Growth Bar Chart */}
          {monthlyData.map((data, index) => (
            <div key={data.month}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 w-12">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Collaborations */}
                    <div>
                      <div className="bg-gray-100 rounded-lg h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.collaborations / 3) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-bold">{data.collaborations}</span>
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Collaborations</p>
                    </div>

                    {/* Volunteers */}
                    <div>
                      <div className="bg-gray-100 rounded-lg h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.volunteers / 12) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-bold">{data.volunteers}</span>
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Volunteers</p>
                    </div>

                    {/* Hours */}
                    <div>
                      <div className="bg-gray-100 rounded-lg h-8 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(data.hours / 96) * 100}%` }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                        >
                          <span className="text-white text-xs font-bold">{data.hours}h</span>
                        </motion.div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Category Breakdown & Impact Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h4 className="text-2xl font-black text-gray-900 mb-6">🎯 Causes by Category</h4>
          
          <div className="space-y-4">
            {categoryBreakdown.map((item, index) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{item.category}</span>
                  <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Impact Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <h4 className="text-2xl font-black text-gray-900 mb-6">🗺️ Impact Map</h4>
          
          <div className="space-y-3">
            {impactLocations.map((location, index) => (
              <motion.div
                key={location.city}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">📍 {location.city}</div>
                    <div className="text-sm text-gray-600">
                      {location.volunteers} volunteers · {location.collaborations} collaborations
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-blue-600">{location.collaborations}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Download Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-lg text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-2xl font-black mb-2">📄 Downloadable Reports</h4>
            <p className="text-blue-100">Export your impact data for CSR reporting or PR</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all">
              📊 Download CSV
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:shadow-xl transition-all">
              📄 Download PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* Badges & Recognition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <h4 className="text-2xl font-black text-gray-900 mb-6">🎖️ Organization Badges</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300">
            <div className="text-6xl mb-3">🥉</div>
            <h5 className="font-black text-xl text-gray-900 mb-2">Bronze Partner</h5>
            <p className="text-sm text-gray-600 mb-3">5+ verified collaborations</p>
            <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-xs font-bold">
              EARNED
            </span>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-300">
            <div className="text-6xl mb-3">🥈</div>
            <h5 className="font-black text-xl text-gray-900 mb-2">Silver Partner</h5>
            <p className="text-sm text-gray-600 mb-3">15+ verified collaborations</p>
            <span className="px-4 py-2 bg-gray-400 text-white rounded-full text-xs font-bold">
              IN PROGRESS (12/15)
            </span>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-300 opacity-50">
            <div className="text-6xl mb-3">🥇</div>
            <h5 className="font-black text-xl text-gray-900 mb-2">Gold Partner</h5>
            <p className="text-sm text-gray-600 mb-3">30+ verified collaborations</p>
            <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full text-xs font-bold">
              LOCKED (12/30)
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OrganisationAnalytics;
