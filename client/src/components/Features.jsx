import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { FeatureIcon } from './IconSystem';

const Features = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const features = [
    {
      iconName: 'ai-matching',
      title: 'AI Cause Matching',
      description: 'Our advanced TF-IDF algorithm analyzes your interests and matches you with causes that truly resonate with your passion.',
      gradient: 'teal',
      glowColor: 'rgba(0, 198, 167, 0.4)',
      delay: 0.1
    },
    {
      iconName: 'local-discovery',
      title: 'Local Impact Discovery',
      description: 'Find opportunities right in your neighborhood. We prioritize causes based on proximity and relevance to maximize your local impact.',
      gradient: 'blue',
      glowColor: 'rgba(0, 124, 240, 0.4)',
      delay: 0.2
    },
    {
      iconName: 'transparent-tracking',
      title: 'Transparent Tracking',
      description: 'Every contribution is verified and recorded on blockchain. Track your impact with complete transparency and earn recognition.',
      gradient: 'violet',
      glowColor: 'rgba(0, 198, 167, 0.4)',
      delay: 0.3
    },
    {
      iconName: 'real-time-chat',
      title: 'Real-time Chat',
      description: 'Connect directly with NGOs and fellow volunteers. Coordinate efforts and stay updated on cause progress in real-time.',
      gradient: 'tealBlue',
      glowColor: 'rgba(0, 124, 240, 0.4)',
      delay: 0.4
    },
    {
      iconName: 'impact-scoring',
      title: 'Impact Scoring',
      description: 'Earn points and badges as you contribute. Build your volunteer profile and showcase your commitment to making a difference.',
      gradient: 'violet',
      glowColor: 'rgba(142, 45, 226, 0.4)',
      delay: 0.5
    },
    {
      iconName: 'interactive-map',
      title: 'Interactive Map',
      description: 'Visualize causes on an interactive map. Explore impact zones and discover new opportunities in your city and beyond.',
      gradient: 'teal',
      glowColor: 'rgba(0, 198, 167, 0.4)',
      delay: 0.6
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-white via-[#f2f7ff]/30 to-white overflow-hidden" ref={ref}>
      {/* Soft ambient gradient glows with new vibrant colors */}
      
      {/* Top-left teal glow */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 600px at 10% 20%, rgba(0, 198, 167, 0.12), transparent 50%)',
        }}
      />
      
      {/* Top-right blue glow */}
      <div 
        className="absolute top-0 right-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 550px at 90% 15%, rgba(0, 124, 240, 0.12), transparent 50%)',
        }}
      />
      
      {/* Center-left violet glow */}
      <div 
        className="absolute top-1/3 left-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 500px at 15% 50%, rgba(142, 45, 226, 0.1), transparent 55%)',
        }}
      />
      
      {/* Center-right teal glow */}
      <div 
        className="absolute top-1/2 right-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 520px at 85% 55%, rgba(0, 198, 167, 0.11), transparent 52%)',
        }}
      />
      
      {/* Bottom-left blue glow */}
      <div 
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 580px at 20% 85%, rgba(0, 124, 240, 0.11), transparent 50%)',
        }}
      />
      
      {/* Bottom-right violet glow */}
      <div 
        className="absolute bottom-0 right-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle 600px at 80% 90%, rgba(142, 45, 226, 0.12), transparent 48%)',
        }}
      />
      
      {/* Subtle animated pulse for depth with new color */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 800px at 50% 50%, rgba(0, 198, 167, 0.05), transparent 60%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
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
            <span className="text-6xl">⚡</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6 text-gray-800">
            Powerful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] via-[#007CF0] to-[#8E2DE2]">
              Features
            </span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Everything you need to discover, connect, and create lasting impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              className="relative group perspective-1000"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated glow background */}
              <motion.div
                className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-50 transition-all duration-500`}
                animate={hoveredIndex === index ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Main card with 3D tilt effect and inner shadow */}
              <motion.div
                className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100/60 h-full overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: hoveredIndex === index 
                    ? `inset 0 1px 2px 0 rgba(148, 163, 184, 0.1), 0 30px 60px -15px ${feature.glowColor}, 0 15px 30px -8px rgba(0, 0, 0, 0.06)`
                    : 'inset 0 1px 2px 0 rgba(148, 163, 184, 0.08), 0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 10px 20px -5px rgba(0, 0, 0, 0.04)'
                }}
                whileHover={{ 
                  y: -12,
                  rotateX: 5,
                  rotateY: -5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{
                    background: hoveredIndex === index ? feature.glowColor : 'transparent'
                  }}
                />

                {/* Modern Icon */}
                <div className="mb-6 flex justify-center">
                  <FeatureIcon 
                    name={feature.iconName} 
                    gradient={feature.gradient}
                    animated={hoveredIndex === index}
                  />
                </div>

                <motion.h3
                  className="text-2xl font-black text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-[#00C6A7] group-hover:to-[#007CF0] transition-all duration-300"
                >
                  {feature.title}
                </motion.h3>

                <p className="text-gray-700 text-lg leading-relaxed">
                  {feature.description}
                </p>

                {/* Animated bottom accent */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1.5 rounded-b-3xl"
                  style={{
                    background: hoveredIndex === index 
                      ? `linear-gradient(to right, ${feature.glowColor}, ${feature.glowColor})` 
                      : 'transparent'
                  }}
                  initial={{ width: 0 }}
                  animate={hoveredIndex === index ? { width: '100%' } : { width: 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Corner shine effect */}
                <motion.div
                  className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full opacity-0 group-hover:opacity-20 blur-2xl"
                  animate={hoveredIndex === index ? {
                    x: [0, 100],
                    y: [0, 100],
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-24 relative group"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
          
          {/* Glass CTA card */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Animated mesh background */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />

            <div className="relative z-10">
              <motion.h3
                className="text-4xl md:text-5xl font-black text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
              >
                Ready to Make an Impact?
              </motion.h3>
              <motion.p
                className="text-emerald-50 text-xl mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1 }}
              >
                Join thousands of volunteers using ImpactMatch to create meaningful change in their communities
              </motion.p>
              
              <motion.button
                className="group/btn relative px-10 py-5 bg-white text-emerald-900 rounded-full font-bold text-xl shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover/btn:opacity-30"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative flex items-center gap-3">
                  Get Started Now
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
