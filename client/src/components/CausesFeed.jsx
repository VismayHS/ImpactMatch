import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ModernIcon, FeatureIcon } from './IconSystem';
import api, { API_BASE_URL } from '../utils/axiosConfig';

const CausesFeed = () => {
  const navigate = useNavigate();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Category to icon mapping
  const categoryMapping = {
    'Environment': { iconName: 'local-discovery', gradient: 'teal', glowColor: 'rgba(0, 198, 167, 0.4)' },
    'Education': { iconName: 'ai-matching', gradient: 'blue', glowColor: 'rgba(0, 124, 240, 0.4)' },
    'Health': { iconName: 'transparent-tracking', gradient: 'violet', glowColor: 'rgba(142, 45, 226, 0.4)' },
    'Animal Welfare': { iconName: 'impact-scoring', gradient: 'tealBlue', glowColor: 'rgba(0, 198, 167, 0.4)' },
    'Social Welfare': { iconName: 'dashboard', gradient: 'blue', glowColor: 'rgba(0, 124, 240, 0.4)' },
    'Community': { iconName: 'dashboard', gradient: 'violet', glowColor: 'rgba(142, 45, 226, 0.4)' },
  };

  // Fetch causes from backend
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/causes');
        
        if (response.data && response.data.causes) {
          // Map backend data to frontend format with icons
          const mappedCauses = response.data.causes.slice(0, 8).map((cause) => {
            const categoryData = categoryMapping[cause.category] || categoryMapping['Community'];
            return {
              id: cause._id,
              title: cause.name,
              category: cause.category,
              location: cause.city,
              description: cause.description,
              volunteers: Math.floor(Math.random() * 50) + 10, // Random for demo
              iconName: categoryData.iconName,
              gradient: categoryData.gradient,
              glowColor: categoryData.glowColor,
            };
          });
          setCauses(mappedCauses);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch causes:', err);
        setError('Failed to load causes');
        setLoading(false);
        
        // Fallback to mock data if backend fails
        setCauses(mockCauses);
      }
    };

    fetchCauses();
  }, []);

  // Mock data for fallback
  const mockCauses = [
    {
      id: 1,
      title: 'Tree Plantation Drive',
      category: 'Environment',
      location: 'Bangalore',
      volunteers: 45,
      description: 'Join us in making the city greener',
      iconName: 'local-discovery',
      gradient: 'teal',
      glowColor: 'rgba(0, 198, 167, 0.4)'
    },
    {
      id: 2,
      title: 'Teach Kids Coding',
      category: 'Education',
      location: 'Mumbai',
      volunteers: 32,
      description: 'Help children learn programming skills',
      iconName: 'ai-matching',
      gradient: 'blue',
      glowColor: 'rgba(0, 124, 240, 0.4)'
    },
    {
      id: 3,
      title: 'Community Health Camp',
      category: 'Health',
      location: 'Delhi',
      volunteers: 28,
      description: 'Free health checkups for underprivileged',
      iconName: 'transparent-tracking',
      gradient: 'violet',
      glowColor: 'rgba(142, 45, 226, 0.4)'
    },
    {
      id: 4,
      title: 'Animal Shelter Support',
      category: 'Animal Welfare',
      location: 'Pune',
      volunteers: 38,
      description: 'Care for rescued animals',
      iconName: 'impact-scoring',
      gradient: 'tealBlue',
      glowColor: 'rgba(0, 198, 167, 0.4)'
    }
  ];

  return (
    <section className="relative py-32 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 overflow-hidden" ref={ref}>
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-200/40 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <FeatureIcon name="causes" gradient="teal" animated={true} />
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            Explore{' '}
            <span className="bg-gradient-to-r from-[#00C6A7] via-[#007CF0] to-[#8E2DE2] bg-clip-text text-transparent">
              Causes
            </span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover meaningful opportunities to make a difference in your community
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-[#00C6A7] border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-lg font-semibold text-gray-600">Loading causes...</p>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
              <p className="text-gray-600">Showing mock data instead</p>
            </motion.div>
          </div>
        )}

        {/* Causes Grid */}
        {!loading && causes.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {causes.map((cause, index) => (
            <motion.div
              key={cause.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 60, scale: 0.9 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredCard(cause.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated glow */}
              <motion.div
                className={`absolute -inset-2 bg-gradient-to-r ${cause.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500`}
                animate={hoveredCard === cause.id ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Card */}
              <motion.div
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 h-full overflow-hidden"
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  rotateY: 3,
                  rotateX: -3
                }}
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: hoveredCard === cause.id 
                    ? `0 25px 50px -12px ${cause.glowColor}` 
                    : '0 10px 30px -10px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${cause.glowColor}, transparent)`
                  }}
                />

                {/* Modern Feature Icon with pulsing effect */}
                <motion.div
                  className="relative mb-6 flex justify-center"
                  animate={hoveredCard === cause.id ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <FeatureIcon name={cause.iconName} gradient={cause.gradient} animated={hoveredCard === cause.id} />
                </motion.div>

                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-[#00C6A7] group-hover:to-[#007CF0] transition-all">
                  {cause.title}
                </h3>
                
                <div className="inline-block px-4 py-2 text-white rounded-full font-bold text-sm mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${cause.glowColor}, ${cause.glowColor}dd)`
                  }}
                >
                  {cause.category}
                </div>
                
                <div className="flex items-center gap-2 text-gray-600 text-lg mb-4">
                  <ModernIcon name="location" size="xs" gradient="teal" animated={false} glow={false} />
                  <span className="font-medium">{cause.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <ModernIcon name="dashboard" size="xs" gradient="blue" animated={false} glow={false} />
                  <span className="text-lg">{cause.volunteers} volunteers</span>
                </div>

                {/* Bottom accent bar */}
                <motion.div
                  className="absolute bottom-0 left-0 h-2 rounded-b-3xl"
                  style={{
                    background: `linear-gradient(to right, ${cause.glowColor}, ${cause.glowColor}dd)`
                  }}
                  initial={{ width: 0 }}
                  animate={hoveredCard === cause.id ? { width: '100%' } : { width: 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Shine effect */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-0 group-hover:opacity-30 blur-3xl"
                  animate={hoveredCard === cause.id ? {
                    x: [0, 100],
                    y: [0, 100],
                  } : {}}
                  transition={{ duration: 1.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && causes.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FeatureIcon name="causes" gradient="teal" animated={false} />
              <p className="text-2xl font-bold text-gray-800 mt-6 mb-2">No causes available</p>
              <p className="text-gray-600">Check back later for new opportunities</p>
            </motion.div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            onClick={() => navigate('/swipe')}
            className="group/btn relative px-12 py-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-full font-bold text-xl shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              animate={{ x: ['-200%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Pulsing glow */}
            <motion.div
              className="absolute inset-0 bg-white rounded-full opacity-0 group-hover/btn:opacity-20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <span className="relative flex items-center gap-3">
              View All Causes
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CausesFeed;
