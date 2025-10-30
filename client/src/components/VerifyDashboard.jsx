import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getUnverifiedMatches, verifyMatch } from '../api/verifyAPI';
import { formatDate } from '../utils/formatters';

export default function VerifyDashboard({ user }) {
  const [pendingMatches, setPendingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [verifiedMatch, setVerifiedMatch] = useState(null);

  useEffect(() => {
    loadPendingMatches();
  }, [user]);

  const loadPendingMatches = async () => {
    setLoading(true);
    try {
      const response = await getUnverifiedMatches(user._id || user.id);
      setPendingMatches(response.matches || []);
    } catch (error) {
      toast.error('Failed to load pending verifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (matchId) => {
    setVerifying(matchId);
    try {
      // For demo, using user as verifier
      const response = await verifyMatch(matchId, user._id || user.id);
      
      // Show confetti animation
      setShowConfetti(true);
      setVerifiedMatch(response);
      
      toast.success('Impact verified on blockchain! +20 points 🎉');
      
      // Remove from pending list
      setPendingMatches(pendingMatches.filter(m => m._id !== matchId));
      
      // Hide confetti after animation
      setTimeout(() => {
        setShowConfetti(false);
      }, 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      console.error(error);
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Loading verifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-soft p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Impact ✅
          </h1>
          <p className="text-secondary">
            Record your contributions on the blockchain for permanent proof
          </p>
        </motion.div>

        {/* Pending Matches */}
        {pendingMatches.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-soft p-12 text-center"
          >
            <div className="text-6xl mb-4">✓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-secondary">
              No pending verifications. Join more causes to earn impact points!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {pendingMatches.map((match, index) => (
              <motion.div
                key={match._id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-soft p-6 hover:shadow-soft-hover transition-shadow duration-180"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {match.cause?.name || 'Unknown Cause'}
                    </h3>
                    <p className="text-sm text-secondary mb-3">
                      {match.cause?.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-secondary">
                      <span>📍 {match.cause?.city}</span>
                      <span>🏷️ {match.cause?.category}</span>
                      <span>📅 Joined {formatDate(match.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVerify(match._id)}
                    disabled={verifying === match._id}
                    className="ml-4 px-6 py-3 btn-gradient text-white rounded-lg font-medium shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Verify impact"
                  >
                    {verifying === match._id ? (
                      <span className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </span>
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6"
        >
          <h4 className="font-semibold text-primary mb-2">
            How Verification Works
          </h4>
          <ul className="space-y-2 text-sm text-secondary">
            <li>✓ Each verified impact is recorded on the Ethereum blockchain</li>
            <li>✓ Earn +20 impact points for each verification</li>
            <li>✓ Your contribution becomes permanent and tamper-proof</li>
            <li>✓ Build your verified impact portfolio</li>
          </ul>
        </motion.div>
      </div>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="text-9xl"
          >
            🎉
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {verifiedMatch && showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Impact Verified!
            </h3>
            <p className="text-secondary mb-6">
              Your contribution has been recorded on the blockchain
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="text-xs text-secondary mb-1">Transaction Hash</p>
              <p className="font-mono text-xs break-all text-gray-700">
                {verifiedMatch.txHash}
              </p>
            </div>
            <button
              onClick={() => setVerifiedMatch(null)}
              className="w-full py-3 btn-gradient text-white rounded-lg font-medium"
            >
              Awesome!
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
