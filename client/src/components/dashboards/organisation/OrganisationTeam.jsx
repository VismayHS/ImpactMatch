import { motion } from 'framer-motion';
import { useState } from 'react';

function OrganisationTeam() {
  const [members] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Team Lead', causes: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', role: 'Volunteer', causes: 2 },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', role: 'Volunteer', causes: 1 }
  ]);

  return (
    <div className="space-y-6">
      {/* Add Member Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h3 className="text-2xl font-black text-gray-900">Team Members</h3>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition">
          ➕ Add Member
        </button>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-lg"
      >
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-900">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Causes</p>
                  <p className="font-semibold text-gray-900">{member.causes}</p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default OrganisationTeam;
