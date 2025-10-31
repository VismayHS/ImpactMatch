import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, TrendingUp, Zap, Heart, Target } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import confetti from 'canvas-confetti';

const BADGES = [
  { id: 'newcomer', name: 'Newcomer', icon: Star, color: 'from-gray-400 to-gray-600', requirement: 1, description: 'Join your first cause' },
  { id: 'contributor', name: 'Contributor', icon: Heart, color: 'from-blue-400 to-blue-600', requirement: 3, description: 'Join 3 causes' },
  { id: 'dedicated', name: 'Dedicated', icon: Zap, color: 'from-purple-400 to-purple-600', requirement: 5, description: 'Join 5 causes' },
  { id: 'champion', name: 'Champion', icon: Trophy, color: 'from-yellow-400 to-yellow-600', requirement: 10, description: 'Join 10 causes' },
  { id: 'hero', name: 'Impact Hero', icon: Award, color: 'from-pink-400 to-pink-600', requirement: 20, description: 'Join 20 causes' },
  { id: 'legend', name: 'Legend', icon: Target, color: 'from-red-400 to-red-600', requirement: 50, description: 'Join 50 causes' },
];

const ImpactScore = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    impactScore: 0,
    causesJoined: 0,
    impactsVerified: 0,
    hoursVolunteered: 0,
    level: 1
  });
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadImpactData(userData);
  }, []);

  const loadImpactData = async (userData) => {
    try {
      setLoading(true);
      const userId = userData?.id || userData?._id;

      // Get user's matches (causes joined)
      const matchesResponse = await api.get('/api/matches');
      const userMatches = matchesResponse.data.filter(m => m.userId === userId);

      // Get verifications
      const verificationsResponse = await api.get('/api/verifications');
      const userVerifications = verificationsResponse.data.filter(v => v.userId === userId);

      // Calculate impact score
      const causesJoined = userMatches.length;
      const impactsVerified = userVerifications.length;
      const hoursVolunteered = causesJoined * 4; // Assume 4 hours per cause
      const impactScore = (causesJoined * 10) + (impactsVerified * 25) + hoursVolunteered;
      const level = Math.floor(impactScore / 100) + 1;

      setStats({
        impactScore,
        causesJoined,
        impactsVerified,
        hoursVolunteered,
        level
      });

      // Determine earned badges
      const earned = BADGES.filter(badge => causesJoined >= badge.requirement);
      setEarnedBadges(earned);

      // Trigger confetti if high score
      if (impactScore > 100) {
        triggerConfetti();
      }
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);
  };

  const nextLevelScore = stats.level * 100;
  const currentLevelProgress = ((stats.impactScore % 100) / 100) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Calculating your impact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Impact Score
        </h1>
        <p className="text-gray-600">Track your volunteer achievements and level up!</p>
      </div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl shadow-2xl p-8 text-white overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Level {stats.level}</span>
          </div>
          
          <h2 className="text-6xl font-bold mb-2">{stats.impactScore}</h2>
          <p className="text-xl text-white/80 mb-6">Impact Points</p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {stats.level}</span>
              <span>Level {stats.level + 1}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentLevelProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-sm text-white/80 mt-2">
              {100 - (stats.impactScore % 100)} points to next level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.causesJoined}</h3>
          <p className="text-gray-600 text-sm">Causes Joined</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-3">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.impactsVerified}</h3>
          <p className="text-gray-600 text-sm">Impacts Verified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-white/20"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.hoursVolunteered}</h3>
          <p className="text-gray-600 text-sm">Hours Volunteered</p>
        </motion.div>
      </div>

      {/* Badges Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BADGES.map((badge, index) => {
            const earned = earnedBadges.find(b => b.id === badge.id);
            const Icon = badge.icon;
            
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-4 border-2 text-center ${
                  earned ? 'border-purple-400' : 'border-gray-200 opacity-50'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                <p className="text-xs text-gray-500">
                  {earned ? '✓ Earned!' : `${badge.requirement} causes`}
                </p>
                
                {earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 text-center"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {stats.impactScore < 50 && "You're just getting started! 🌱"}
          {stats.impactScore >= 50 && stats.impactScore < 200 && "Great progress! Keep going! 🚀"}
          {stats.impactScore >= 200 && stats.impactScore < 500 && "You're making a real difference! ⭐"}
          {stats.impactScore >= 500 && "You're an Impact Legend! 🏆"}
        </h3>
        <p className="text-gray-700">
          Join more causes to level up and unlock exclusive badges!
        </p>
      </motion.div>
    </div>
  );
};

export default ImpactScore;
