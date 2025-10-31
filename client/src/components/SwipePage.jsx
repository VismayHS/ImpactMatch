import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import api, { API_BASE_URL } from '../utils/axiosConfig';
import { toast } from 'react-toastify';
import { ModernIcon } from './IconSystem';

export default function SwipePage({ user }) {
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  const categoryIcons = {
    'Environment': { name: 'local-discovery', gradient: 'teal' },
    'Education': { name: 'ai-matching', gradient: 'blue' },
    'Health': { name: 'transparent-tracking', gradient: 'violet' },
    'Animal Welfare': { name: 'impact-scoring', gradient: 'tealBlue' },
    'Community': { name: 'dashboard', gradient: 'blue' },
    'Arts': { name: 'causes', gradient: 'violet' },
    'Technology': { name: 'ai-matching', gradient: 'teal' },
    'Sports': { name: 'impact-scoring', gradient: 'blue' },
  };

  const categoryGradients = {
    'Environment': 'from-green-400 to-emerald-500',
    'Education': 'from-blue-400 to-indigo-500',
    'Health': 'from-red-400 to-pink-500',
    'Animal Welfare': 'from-orange-400 to-amber-500',
    'Community': 'from-purple-400 to-pink-500',
    'Arts': 'from-pink-400 to-rose-500',
    'Technology': 'from-cyan-400 to-blue-500',
    'Sports': 'from-yellow-400 to-orange-500',
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/causes');
      
      if (response.data && response.data.causes && response.data.causes.length > 0) {
        // Take first 20 causes for swipe deck
        const swipeDeck = response.data.causes.slice(0, 20);
        setCauses(swipeDeck);
        setCurrentIndex(swipeDeck.length - 1);
        currentIndexRef.current = swipeDeck.length - 1;
      } else {
        // Fallback mock data
        const mockCauses = generateMockCauses();
        setCauses(mockCauses);
        setCurrentIndex(mockCauses.length - 1);
        currentIndexRef.current = mockCauses.length - 1;
      }
    } catch (error) {
      console.error('Failed to fetch causes:', error);
      toast.info('Using demo causes for preview');
      const mockCauses = generateMockCauses();
      setCauses(mockCauses);
      setCurrentIndex(mockCauses.length - 1);
      currentIndexRef.current = mockCauses.length - 1;
    } finally {
      setLoading(false);
    }
  };

  const generateMockCauses = () => {
    const categories = Object.keys(categoryIcons);
    const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];
    
    return Array.from({ length: 15 }, (_, i) => ({
      _id: `mock-${i}`,
      title: [
        'Tree Plantation Drive',
        'Teach Underprivileged Kids',
        'Food Distribution Program',
        'Beach Cleanup Initiative',
        'Animal Shelter Support',
        'Community Library Setup',
        'Health Camp Organization',
        'Digital Literacy Workshop',
      ][i % 8] + ` - ${locations[i % locations.length]}`,
      organization: ['Green Earth NGO', 'Education First', 'Hope Foundation', 'Care & Share', 'Wildlife Rescue'][i % 5],
      location: locations[i % locations.length],
      description: 'Join us in making a real difference in our community. Your time and effort can transform lives and create lasting impact.',
      category: categories[i % categories.length],
      volunteers: Math.floor(Math.random() * 50) + 10,
      impactScore: Math.floor(Math.random() * 100) + 1,
    }));
  };

  const onSwipe = async (direction, cause) => {
    if (direction === 'right') {
      // User liked the cause - check if logged in
      if (!user) {
        setShowLoginPrompt(true);
        toast.info('Please login or register to join causes');
        return;
      }

      try {
        await api.post('/api/match', {
          userId: user._id || user.id,
          causeId: cause._id,
          action: 'like',
        });
        toast.success(`Matched with ${cause.title}!`);
      } catch (error) {
        console.error('Match failed:', error);
        toast.info(`Interested in ${cause.title}`);
      }
    }

    const newIndex = currentIndex - 1;
    currentIndexRef.current = newIndex;
    setCurrentIndex(newIndex);

    // Check if all cards swiped
    if (newIndex < 0) {
      setTimeout(() => {
        setCelebrating(true);
      }, 300);
    }
  };

  const onCardLeftScreen = (causeId) => {
    console.log(`${causeId} left the screen`);
  };

  const reloadMatches = () => {
    setCelebrating(false);
    fetchCauses();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            💚
          </motion.div>
          <p className="text-xl text-gray-600">Loading amazing causes...</p>
        </div>
      </div>
    );
  }

  if (celebrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 relative overflow-hidden">
        {/* Animated background particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
              rotate: 0
            }}
            animate={{ 
              y: -100,
              rotate: 360,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['🎉', '✨', '💚', '🌟', '⭐'][i % 5]}
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-6"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            className="text-9xl mb-8"
          >
            🎉
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            You've Seen All Matches!
          </h2>
          
          <p className="text-2xl text-green-50 mb-12">
            Come back later for more causes or reload to see them again
          </p>

          <motion.button
            onClick={reloadMatches}
            className="px-10 py-5 bg-white text-green-600 rounded-full font-bold text-xl shadow-2xl"
            whileHover={{ scale: 1.1, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 40px rgba(255,255,255,0.8)",
                "0 0 20px rgba(255,255,255,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔄 Reload Matches
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Discover Your <span className="text-green-600">Impact</span>
          </h1>
          <p className="text-lg text-gray-600">
            Swipe right to join a cause, left to skip • {currentIndex + 1} remaining
          </p>
        </motion.div>

        {/* Swipe Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 mb-8"
        >
          <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
            <span className="text-2xl">👈</span>
            <span className="text-red-700 font-medium">Skip</span>
          </div>
          <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-700 font-medium">Join</span>
            <span className="text-2xl">👉</span>
          </div>
        </motion.div>

        {/* Card Container */}
        <div className="relative w-full max-w-md mx-auto" style={{ height: '600px' }}>
          {causes.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-xl">No causes available</p>
            </div>
          ) : (
            <div className="absolute w-full h-full">
              {causes.map((cause, index) => (
                <TinderCard
                  key={cause._id}
                  onSwipe={(dir) => onSwipe(dir, cause)}
                  onCardLeftScreen={() => onCardLeftScreen(cause._id)}
                  preventSwipe={['up', 'down']}
                  className="absolute w-full"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ 
                      scale: index === currentIndex ? 1 : 0.95,
                      opacity: index === currentIndex ? 1 : 0.5,
                      y: (currentIndex - index) * 10,
                    }}
                    className="relative"
                    style={{
                      zIndex: index === currentIndex ? 10 : 10 - (currentIndex - index),
                    }}
                  >
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing h-[600px]">
                      {/* Image/Gradient Header */}
                      <div className={`h-48 bg-gradient-to-br ${categoryGradients[cause.category] || 'from-green-400 to-emerald-500'} relative`}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                          <ModernIcon 
                            name={categoryIcons[cause.category]?.name || 'causes'}
                            size="sm"
                            gradient={categoryIcons[cause.category]?.gradient || 'teal'}
                            animated={false}
                            glow={false}
                          />
                          <span className="font-semibold text-gray-800">{cause.category}</span>
                        </div>
                        
                        {/* Impact Score Badge */}
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                          <ModernIcon name="causes" size="xs" gradient="blue" animated={false} glow={false} />
                          <span className="text-gray-800 font-bold">{cause.impactScore || 85}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {cause.title}
                        </h2>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <ModernIcon name="dashboard" size="xs" gradient="blue" animated={false} glow={false} />
                          <span className="font-medium">{cause.organization}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-6">
                          <ModernIcon name="location" size="xs" gradient="teal" animated={false} glow={false} />
                          <span className="font-medium">{cause.location}</span>
                        </div>

                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                          {cause.description}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-4 mt-auto">
                          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl flex-1">
                            <ModernIcon name="dashboard" size="sm" gradient="teal" animated={false} glow={false} />
                            <div>
                              <div className="text-sm text-gray-600">Volunteers</div>
                              <div className="font-bold text-gray-900">{cause.volunteers || 0}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl flex-1">
                            <ModernIcon name="transparent-tracking" size="sm" gradient="blue" animated={false} glow={false} />
                            <div>
                              <div className="text-sm text-gray-600">Impact</div>
                              <div className="font-bold text-gray-900">High</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </TinderCard>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-6 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg text-white text-2xl hover:bg-red-600"
            onClick={() => {
              if (currentIndex >= 0) {
                onSwipe('left', causes[currentIndex]);
              }
            }}
          >
            ✕
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl text-white text-3xl hover:bg-green-600"
            onClick={() => {
              if (currentIndex >= 0) {
                onSwipe('right', causes[currentIndex]);
              }
            }}
          >
            💚
          </motion.button>
        </motion.div>
      </div>

      {/* Login Prompt Modal */}
      <AnimatePresence>
        {showLoginPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLoginPrompt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-7xl mb-4">🔒</div>
                <h3 className="text-3xl font-black text-gray-900 mb-3">Login Required</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Create an account or login to join causes and make an impact!
                </p>

                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/register')}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg"
                  >
                    Create Account
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/register')}
                    className="w-full py-4 bg-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-200"
                  >
                    Already have an account? Login
                  </motion.button>
                  
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
