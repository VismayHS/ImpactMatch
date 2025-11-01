import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, X, MapPin, Users, Calendar, Info, Clock } from 'lucide-react';
import TinderCard from 'react-tinder-card';
import api, { API_BASE_URL } from '../../../utils/axiosConfig';
import { toast } from 'react-toastify';

const UserDiscover = () => {
  const [causes, setCauses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log('👤 User data from localStorage:', userData);
    setUser(userData);
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      // Try to get personalized causes first
      let response;
      try {
        console.log('🚀 Attempting to fetch personalized causes...');
        response = await api.get('/api/causes/personalized', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.causes) {
          console.log('✅ Loaded personalized causes:', response.data.causes.length);
          console.log('📋 User preferences from API:', response.data.preferences);
          console.log('📦 Sample causes:', response.data.causes.slice(0, 3).map(c => ({
            title: c.title,
            city: c.city,
            category: c.category,
            score: c.relevanceScore
          })));
          
          const personalizedCauses = response.data.causes.map(c => ({
            ...c,
            title: c.title || c.name, // Support both name and title fields
            relevanceScore: c.relevanceScore || 0
          }));
          
          // Filter out already joined causes
          const userId = userData?.id || userData?._id;
          const matchesResponse = await api.get('/api/matches');
          const matchesData = Array.isArray(matchesResponse.data) 
            ? matchesResponse.data 
            : matchesResponse.data.matches || [];
          
          const userMatches = matchesData.filter(m => {
            const matchUserId = m.userId?._id || m.userId;
            return matchUserId.toString() === userId.toString();
          });
          
          const joinedCauseIds = userMatches.map(m => {
            const causeId = m.causeId?._id || m.causeId;
            return causeId.toString();
          });
          
          const availableCauses = personalizedCauses.filter(c => !joinedCauseIds.includes(c._id.toString()));
          
          setCauses(availableCauses);
          setCurrentIndex(availableCauses.length - 1);
          currentIndexRef.current = availableCauses.length - 1;
          setIsPersonalized(true);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('ℹ️ Personalized causes not available, falling back to all causes');
      }
      
      // Fallback to all causes
      response = await api.get('/api/causes', {
        params: { status: 'active' }
      });
      
      console.log('📦 Causes response:', response.data);
      
      // Handle causes response format
      const allCauses = Array.isArray(response.data) 
        ? response.data 
        : response.data.causes || [];
      
      console.log('📋 All causes count:', allCauses.length);
      
      // Filter out causes the user has already joined
      const userId = JSON.parse(localStorage.getItem('user'))?.id || JSON.parse(localStorage.getItem('user'))?._id;
      console.log('🔍 Filtering for user ID:', userId);
      
      const matchesResponse = await api.get('/api/matches');
      console.log('🎯 Matches response:', matchesResponse.data);
      
      // Handle matches response format
      const matchesData = Array.isArray(matchesResponse.data) 
        ? matchesResponse.data 
        : matchesResponse.data.matches || [];
      
      console.log('📦 All matches data:', matchesData);
      
      const userMatches = matchesData.filter(m => {
        const matchUserId = m.userId?._id || m.userId;
        return matchUserId.toString() === userId.toString();
      });
      
      const joinedCauseIds = userMatches.map(m => {
        const causeId = m.causeId?._id || m.causeId;
        return causeId.toString();
      });
      
      console.log('✅ User matches:', userMatches.length);
      console.log('🎯 Joined cause IDs:', joinedCauseIds);
      
      const availableCauses = allCauses
        .filter(c => !joinedCauseIds.includes(c._id.toString()))
        .map(c => ({
          ...c,
          title: c.title || c.name // Support both name and title fields
        }));
      
      console.log('🆕 Available causes count:', availableCauses.length);
        
      setCauses(availableCauses);
      setCurrentIndex(availableCauses.length - 1);
      currentIndexRef.current = availableCauses.length - 1;
      setIsPersonalized(false);
    } catch (error) {
      console.error('❌ Error loading causes:', error);
      toast.error('Failed to load causes');
      setCauses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, cause) => {
    console.log('🔄 Swipe detected:', { direction, causeId: cause._id, causeTitle: cause.title });
    
    if (direction === 'right') {
      // User liked the cause - join it
      try {
        const userId = user?.id || user?._id;
        console.log('👤 User ID:', userId);
        console.log('📋 Cause ID:', cause._id);
        
        const response = await api.post('/api/match/join', {
          userId,
          causeId: cause._id
        });
        
        console.log('✅ Join response:', response.data);
        toast.success(`🎉 Joined "${cause.title}"!`);
        
        // Reload causes to update the filtered list
        setTimeout(() => loadCauses(), 500);
      } catch (error) {
        console.error('❌ Error joining cause:', error);
        console.error('Error details:', error.response?.data);
        console.error('Full error object:', JSON.stringify(error.response, null, 2));
        
        // Check if already joined
        if (error.response?.data?.error?.includes('Already joined')) {
          console.log('ℹ️ Already joined this cause, skipping...');
          toast.info(`Already joined "${cause.title}"`);
          // Still reload to remove it from the list
          setTimeout(() => loadCauses(), 500);
        } else {
          const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to join cause';
          toast.error(errorMsg);
          console.error('💥 Server error:', errorMsg);
        }
      }
    } else {
      console.log('⏭️ Skipped cause:', cause.title);
    }
    
    // Update index (always move to next card)
    const newIndex = currentIndex - 1;
    currentIndexRef.current = newIndex;
    setCurrentIndex(newIndex);
    console.log('📊 New index:', newIndex, '| Remaining causes:', newIndex + 1);
  };

  const onCardLeftScreen = (causeId) => {
    console.log(`${causeId} left the screen`);
  };

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

  if (causes.length === 0 || currentIndex < 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-purple-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">No More Causes</h2>
        <p className="text-gray-600 mb-6">You've seen all available causes! Check back later for more.</p>
        <button
          onClick={() => {
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
          Discover Causes {isPersonalized && <span className="text-green-600">🎯</span>}
        </h1>
        <p className="text-gray-600">Swipe right to join, left to skip • {currentIndex + 1} remaining</p>
      </div>

      {/* Swipe Instructions */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-medium">Skip</span>
        </div>
        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
          <span className="text-green-700 font-medium">Join</span>
          <Heart className="w-5 h-5 text-green-600" fill="currentColor" />
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-full max-w-md mx-auto" style={{ height: '500px' }}>
        <div className="absolute w-full h-full">
          {causes.map((cause, index) => (
            <TinderCard
              key={cause._id}
              onSwipe={(dir) => handleSwipe(dir, cause)}
              onCardLeftScreen={() => onCardLeftScreen(cause._id)}
              preventSwipe={['up', 'down']}
              swipeRequirementType="position"
              swipeThreshold={100}
              className="absolute w-full"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: index === currentIndex ? 1 : 0.95 - (currentIndex - index) * 0.02,
                  opacity: index <= currentIndex ? 1 : 0,
                  y: (currentIndex - index) * -8,
                }}
                className="relative"
                style={{
                  zIndex: index === currentIndex ? 10 : 10 - (currentIndex - index),
                  pointerEvents: index === currentIndex ? 'auto' : 'none',
                }}
              >
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-white/20 cursor-grab active:cursor-grabbing">
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-200 to-pink-200">
                    {cause.image ? (
                      <img 
                        src={`${API_BASE_URL}/${cause.image}`}
                        alt={cause.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="w-20 h-20 text-purple-400" />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-purple-600">
                      {cause.category || 'General'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1.5">{cause.title}</h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{cause.description}</p>
                    </div>

                    {/* Upcoming Event Details */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100 space-y-2">
                      <div className="flex items-center gap-2 text-purple-700 font-semibold text-sm">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Upcoming Event</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-start gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-gray-500 text-xs">Date & Time</div>
                            <div className="font-medium text-gray-800">
                              {cause.eventDate ? new Date(cause.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                            </div>
                            <div className="text-gray-600 text-xs">
                              {cause.eventTime || '10:00 AM - 2:00 PM'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-gray-500 text-xs">Location</div>
                            <div className="font-medium text-gray-800 text-sm">{cause.city || 'TBD'}</div>
                            <div className="text-gray-600 text-xs line-clamp-1">{cause.address || 'Details on join'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 flex-1 bg-green-50 px-2.5 py-1.5 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-600">Volunteers</div>
                          <div className="font-bold text-gray-900 text-sm">
                            {cause.volunteersJoined || 0}/{cause.volunteerLimit || '∞'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-1 bg-blue-50 px-2.5 py-1.5 rounded-lg">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-600">NGO</div>
                          <div className="font-bold text-gray-900 text-xs truncate">
                            {cause.ngoId?.name || 'Verified'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TinderCard>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8 pt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (currentIndex >= 0) {
              handleSwipe('left', causes[currentIndex]);
            }
          }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <X className="w-8 h-8 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (currentIndex >= 0) {
              handleSwipe('right', causes[currentIndex]);
            }
          }}
          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        >
          <Heart className="w-10 h-10 text-white" fill="white" />
        </motion.button>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center text-sm text-gray-500">
        <p>💡 Tip: Drag cards left/right with mouse or use buttons below</p>
      </div>
    </div>
  );
};

export default UserDiscover;
