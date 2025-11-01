import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function NGOVerificationBanner({ user }) {
  if (!user || user.role !== 'ngo') return null;

  // NGO is verified - show success banner
  if (user.verified) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 mb-1">
              ✅ Verified NGO
            </h3>
            <p className="text-sm text-green-800">
              Your organization has been verified by our admin team. You have full access to all NGO features including adding causes and verifying volunteers.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // NGO is pending verification - show warning banner with restricted access
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-r-lg"
    >
      <div className="flex items-start gap-3">
        <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            ⚠️ Certification Pending
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            Your NGO registration is awaiting admin verification. Some features are temporarily restricted until your organization is approved.
          </p>
          
          <div className="bg-yellow-100 rounded-lg p-3 text-sm text-yellow-900">
            <p className="font-medium mb-2">🚫 Restricted Features:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Add New Causes</li>
              <li>Verify Volunteer Contributions</li>
              <li>Issue Certificates</li>
            </ul>
          </div>

          <p className="text-sm text-yellow-800 mt-3">
            <strong>Next Steps:</strong> Our admin team will review your registration certificate and approve your account within 24-48 hours. You'll receive an email notification once approved.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Component to wrap restricted features for pending NGOs
export function NGOFeatureGate({ user, children, feature = 'This feature' }) {
  if (!user || user.role !== 'ngo') {
    return <>{children}</>;
  }

  if (!user.verified) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Feature Locked
        </h3>
        <p className="text-gray-600 mb-4">
          {feature} is only available to verified NGOs.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
          <Clock className="w-4 h-4" />
          Pending Admin Verification
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}
