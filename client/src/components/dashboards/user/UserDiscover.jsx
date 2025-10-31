import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, Users, Calendar, Info } from 'lucide-react';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const UserDiscover = () => {
  const [causes, setCauses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/causes', {
        params: { status: 'active' }
      });
      
      // Filter out causes the user has already joined
      const userId = JSON.parse(localStorage.getItem('user'))?.id || JSON.parse(localStorage.getItem('user'))?._id;
      const matchesResponse = await api.get('/api/matches');
      const userMatches = matchesResponse.data.filter(m => m.userId === userId);
      const joinedCauseIds = userMatches.map(m => m.causeId);
      
      const availableCauses = response.data.filter(c => !joinedCauseIds.includes(c._id));
      setCauses(availableCauses);
    } catch (error) {
      console.error('Error loading causes:', error);
      toast.error('Failed to load causes');
      setCauses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= causes.length) return;
    
    setSwipeDirection(direction);
    
    if (direction === 'right') {
      // User liked the cause - join it
      const cause = causes[currentIndex];
      try {
        const userId = user?.id || user?._id;
        await api.post('/api/matches', {
          userId,
          causeId: cause._id,
          status: 'joined'
        });
        
        toast.success(`🎉 Joined "${cause.title}"!`);
      } catch (error) {
        console.error('Error joining cause:', error);
        toast.error('Failed to join cause');
      }
    }
    
    // Move to next cause after animation
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 300);
  };

  const currentCause = causes[currentIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading causes...</p>
        </div>
      </div>
    );
  }

  if (causes.length === 0 || currentIndex >= causes.length) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No More Causes</h2>
        <p className="text-gray-600 mb-6">You've seen all available causes! Check back later for more.</p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            loadCauses();
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Discover Causes
        </h1>
        <p className="text-gray-600">Swipe right to join, left to skip</p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-white/50 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{causes.length - currentIndex}</p>
          <p className="text-sm text-gray-600">Remaining</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{currentIndex}</p>
          <p className="text-sm text-gray-600">Reviewed</p>
        </div>
      </div>

      {/* Card Stack */}
      <div className="relative h-[500px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentCause && (
            <motion.div
              key={currentCause._id}
              initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateY: 0,
                x: swipeDirection === 'right' ? 300 : swipeDirection === 'left' ? -300 : 0,
                rotate: swipeDirection === 'right' ? 20 : swipeDirection === 'left' ? -20 : 0
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20">
                {/* Image */}
                <div className="relative h-64 bg-gradient-to-br from-purple-200 to-pink-200">
                  {currentCause.image ? (
                    <img 
                      src={`${API_BASE_URL}/${currentCause.image}`}
                      alt={currentCause.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-20 h-20 text-purple-400" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-purple-600">
                    {currentCause.category || 'General'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentCause.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{currentCause.description}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">{currentCause.city || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">
                        {currentCause.volunteersJoined || 0} / {currentCause.volunteerLimit || 'Unlimited'} volunteers
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Posted {new Date(currentCause.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* NGO Info */}
                  {currentCause.ngoId && (
                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Info className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">
                        <strong>By:</strong> {currentCause.ngoId.name || 'NGO'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 pt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('left')}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <X className="w-8 h-8 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleSwipe('right')}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="w-10 h-10 text-white" fill="white" />
        </motion.button>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center text-sm text-gray-500">
        <p>Tip: Use arrow keys → (join) or ← (skip)</p>
      </div>
    </div>
  );
};

export default UserDiscover;
