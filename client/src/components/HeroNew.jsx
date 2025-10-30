import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function HeroNew() {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax effects - hero content moves slower than scroll
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const statsY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-visible">
      {/* Vibrant ambient radial glow background */}
      <div 
        className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(0,198,167,0.15)_0%,transparent_60%)]"
      />
      
      {/* Extended gradient background with new color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e8f9f6] via-[#f2f7ff] to-[#ffffff] -bottom-32" />
      
      {/* Animated Gradient Background Layer with vibrant colors */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0,198,167,0.08) 0%, rgba(0,124,240,0.12) 50%, rgba(142,45,226,0.08) 100%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Radial Glow Under Header with new vibrant colors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 800px 400px at center top, rgba(0,198,167,0.18), transparent 50%)',
          }}
        />
      </div>

      {/* Floating Gradient Orbs with new vibrant colors */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,198,167,0.5) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 80, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(0,124,240,0.5) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -70, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Additional violet orb for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(142,45,226,0.4) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content with Parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Badge with glassmorphism and new colors */}
        <motion.div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-[#00C6A7]/20 shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-2xl">✨</span>
          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] to-[#007CF0]">
            AI-Powered Impact Platform
          </span>
        </motion.div>

        {/* Main Headline with fade-up animation and vibrant gradient */}
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="block text-gray-800">
            Match Your
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] via-[#007CF0] to-[#8E2DE2]">
            Impact
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl text-gray-700 mb-12 max-w-2xl mx-auto font-medium leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Discover volunteer opportunities that align with your passion.
          <br />
          Swipe, connect, and create real change in your community.
        </motion.p>

        {/* CTA Buttons with vibrant gradient */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={() => navigate('/register')}
            className="relative group px-8 py-4 bg-gradient-to-r from-[#00C6A7] to-[#007CF0] text-white rounded-2xl font-bold text-lg shadow-xl overflow-hidden"
            style={{
              boxShadow: '0 8px 20px 0 rgba(0, 198, 167, 0.3)',
            }}
            whileHover={{ 
              scale: 1.03, 
              y: -2,
              background: 'linear-gradient(to right, #007CF0, #00C6A7)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            {/* Glowing hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#007CF0] to-[#00C6A7] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              Get Started Free
              <span className="text-xl">→</span>
            </span>
          </motion.button>

          <motion.button
            onClick={() => navigate('/swipe')}
            className="relative group px-8 py-4 bg-white/80 backdrop-blur-md text-gray-700 rounded-2xl font-bold text-lg shadow-lg border border-[#00C6A7]/20 overflow-hidden"
            whileHover={{ 
              scale: 1.03, 
              y: -2, 
              borderColor: 'rgba(0, 198, 167, 0.4)',
              color: '#007CF0'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <span className="relative">Explore Causes</span>
          </motion.button>
        </motion.div>

        {/* Glassmorphism Stats Cards with parallax */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          style={{ y: statsY }}
        >
          {[
            { icon: '🎯', value: '500+', label: 'Active Causes' },
            { icon: '🤝', value: '10K+', label: 'Volunteers Matched' },
            { icon: '💚', value: '50K+', label: 'Hours Contributed' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="relative group p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.6), 0 20px 40px -10px rgba(0,0,0,0.1)',
              }}
            >
              {/* Inner glow on hover with new colors */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00C6A7]/10 to-[#007CF0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] to-[#007CF0] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-600">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator with new colors */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <span className="text-sm font-semibold text-gray-600">Scroll to explore</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-gray-400 flex items-start justify-center p-1.5"
          animate={{ borderColor: ['rgba(100,116,139,0.4)', 'rgba(0,198,167,0.6)', 'rgba(100,116,139,0.4)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#00C6A7]"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
      
      {/* Smooth fade zone at bottom with new color scheme */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-[#e8f9f6]/20 to-transparent pointer-events-none z-10" />
    </section>
  );
}
