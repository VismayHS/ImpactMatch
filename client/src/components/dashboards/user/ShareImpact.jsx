import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Twitter, Facebook, Linkedin, Instagram, Link as LinkIcon, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173';

const ShareImpact = () => {
  const [stats, setStats] = useState({
    causesJoined: 0,
    impactsVerified: 0,
    hoursVolunteered: 0,
    impactScore: 0
  });
  const [user, setUser] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('gradient');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadStats(userData);
  }, []);

  const loadStats = async (userData) => {
    try {
      setLoading(true);
      const userId = userData?.id || userData?._id;

      // Get user's matches
      const matchesResponse = await axios.get(`${API_BASE_URL}/api/matches`);
      const userMatches = matchesResponse.data.filter(m => m.userId === userId);

      // Get verifications
      const verificationsResponse = await axios.get(`${API_BASE_URL}/api/verifications`);
      const userVerifications = verificationsResponse.data.filter(v => v.userId === userId);

      const causesJoined = userMatches.length;
      const impactsVerified = userVerifications.length;
      const hoursVolunteered = causesJoined * 4;
      const impactScore = (causesJoined * 10) + (impactsVerified * 25) + hoursVolunteered;

      setStats({
        causesJoined,
        impactsVerified,
        hoursVolunteered,
        impactScore
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const templates = {
    gradient: {
      name: 'Gradient',
      bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600',
      text: 'text-white'
    },
    ocean: {
      name: 'Ocean',
      bg: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600',
      text: 'text-white'
    },
    sunset: {
      name: 'Sunset',
      bg: 'bg-gradient-to-br from-orange-500 via-red-500 to-pink-600',
      text: 'text-white'
    },
    forest: {
      name: 'Forest',
      bg: 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600',
      text: 'text-white'
    }
  };

  const shareText = `I've made an impact! 🌟\n${stats.causesJoined} causes joined | ${stats.impactsVerified} impacts verified | ${stats.hoursVolunteered} hours volunteered\n\nJoin me on ImpactMatch and make a difference! 💚`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://impactmatch.com')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://impactmatch.com')}`,
  };

  const downloadImage = () => {
    // In a real app, you'd use html2canvas or similar library
    toast.success('Feature coming soon! Use screenshot for now.');
  };

  const copyLink = () => {
    const profileLink = `https://impactmatch.com/profile/${user?.id || user?._id}`;
    navigator.clipboard.writeText(profileLink);
    toast.success('Profile link copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your impact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Share Your Impact
        </h1>
        <p className="text-gray-600">Inspire others by sharing your volunteer achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Impact Card Preview</h2>
          
          <motion.div
            key={selectedTemplate}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            id="impact-card"
            className={`${templates[selectedTemplate].bg} ${templates[selectedTemplate].text} rounded-2xl p-8 shadow-2xl relative overflow-hidden`}
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{user?.name || 'Volunteer'}</h3>
                  <p className="text-white/80">ImpactMatch Volunteer</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.causesJoined}</p>
                  <p className="text-white/80 text-sm">Causes Joined</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.impactsVerified}</p>
                  <p className="text-white/80 text-sm">Verified</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.hoursVolunteered}</p>
                  <p className="text-white/80 text-sm">Hours</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-3xl font-bold">{stats.impactScore}</p>
                  <p className="text-white/80 text-sm">Impact Score</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <p className="text-lg font-semibold mb-1">Making a Difference 🌍</p>
                <p className="text-white/80 text-sm">Join me on ImpactMatch</p>
              </div>
            </div>
          </motion.div>

          {/* Template Selector */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Choose Template</h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`relative h-20 rounded-lg ${template.bg} transition-all ${
                    selectedTemplate === key ? 'ring-4 ring-purple-500 scale-105' : 'hover:scale-105'
                  }`}
                >
                  {selectedTemplate === key && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadImage}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Download Image
          </button>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Share On</h2>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl transition-all hover:shadow-lg"
            >
              <Twitter className="w-6 h-6" fill="white" />
              <div className="flex-1">
                <h3 className="font-semibold">Share on Twitter</h3>
                <p className="text-sm text-white/80">Tweet your impact story</p>
              </div>
            </a>

            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl transition-all hover:shadow-lg"
            >
              <Facebook className="w-6 h-6" fill="white" />
              <div className="flex-1">
                <h3 className="font-semibold">Share on Facebook</h3>
                <p className="text-sm text-white/80">Post to your timeline</p>
              </div>
            </a>

            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-xl transition-all hover:shadow-lg"
            >
              <Linkedin className="w-6 h-6" fill="white" />
              <div className="flex-1">
                <h3 className="font-semibold">Share on LinkedIn</h3>
                <p className="text-sm text-white/80">Add to your profile</p>
              </div>
            </a>

            <button
              onClick={() => {
                const url = `instagram://library?AssetPath=${encodeURIComponent('impact-card')}`;
                window.location.href = url;
                setTimeout(() => {
                  toast.info('Please screenshot the card and share on Instagram!');
                }, 1000);
              }}
              className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] hover:opacity-90 text-white rounded-xl transition-all hover:shadow-lg"
            >
              <Instagram className="w-6 h-6" />
              <div className="flex-1 text-left">
                <h3 className="font-semibold">Share on Instagram</h3>
                <p className="text-sm text-white/80">Post to your story</p>
              </div>
            </button>
          </div>

          {/* Copy Link */}
          <div className="bg-white/50 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/20">
            <h3 className="font-semibold text-gray-800 mb-3">Share Profile Link</h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`impactmatch.com/profile/${user?.id || user?._id}`}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 font-mono"
              />
              <button
                onClick={copyLink}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6"
          >
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-600" />
              Sharing Tips
            </h3>
            <ul className="text-gray-700 text-sm space-y-1">
              <li>• Share your achievements to inspire others to volunteer</li>
              <li>• Use hashtags like #ImpactMatch #VolunteerWork #MakingADifference</li>
              <li>• Tag the NGOs you've worked with to boost visibility</li>
              <li>• Update your profile regularly as you join new causes</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShareImpact;
