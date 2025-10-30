import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FeatureIcon, FloatingIconBadge } from './IconSystem';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section id="about" className="relative py-32 bg-gradient-to-br from-white via-[#e8f9f6]/30 to-[#f2f7ff]/20 overflow-hidden" ref={ref}>
      {/* Animated background elements with new vibrant colors */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ 
          y,
          background: 'radial-gradient(circle, rgba(0,198,167,0.2) 0%, transparent 70%)'
        }}
      />
      <motion.div
        className="absolute bottom-20 left-0 w-80 h-80 rounded-full blur-3xl"
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], [-80, 80]),
          background: 'radial-gradient(circle, rgba(0,124,240,0.2) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <span className="text-6xl">✨</span>
          </motion.div>
          
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              ImpactMatch
            </span>
          </h2>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            AI-driven cause matching for transparent, measurable social impact
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left side - Description */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">
              Connecting Passion with{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Purpose
              </span>
            </h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              ImpactMatch uses advanced AI algorithms to connect volunteers with causes that 
              align with their interests, skills, and location. We believe that meaningful 
              change happens when passion meets purpose.
            </p>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Our platform leverages TF-IDF matching, geolocation-based recommendations, and 
              blockchain-verified impact tracking to create a transparent ecosystem where every 
              action counts.
            </p>
            
            {/* Premium tags with glow - NOW WITH MODERN ICONS */}
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'AI Matching', iconName: 'ai-matching', gradient: 'teal' },
                { label: 'Verified Impact', iconName: 'transparent-tracking', gradient: 'violet' },
                { label: 'Local Focus', iconName: 'local-discovery', gradient: 'blue' },
                { label: 'Transparent', iconName: 'impact-scoring', gradient: 'tealBlue' }
              ].map((tag, index) => (
                <motion.div
                  key={tag.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <FloatingIconBadge name={tag.iconName} label={tag.label} gradient={tag.gradient} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Premium glass cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
            style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
          >
            <div className="relative">
              <div className="space-y-6">
                {[
                  { 
                    iconName: 'ai-matching', 
                    title: 'AI-Powered Matching', 
                    desc: 'Smart algorithms find your perfect cause',
                    gradient: 'teal'
                  },
                  { 
                    iconName: 'local-discovery', 
                    title: 'Local Impact', 
                    desc: 'Discover opportunities in your community',
                    gradient: 'blue'
                  },
                  { 
                    iconName: 'transparent-tracking', 
                    title: 'Verified Results', 
                    desc: 'Blockchain-backed impact tracking',
                    gradient: 'violet'
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.6 + index * 0.15 }}
                    whileHover={{ scale: 1.03, y: -8 }}
                  >
                    {/* Glow effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-all duration-500"
                      style={{
                        background: item.gradient === 'teal' ? 'linear-gradient(135deg, #00C6A7, #007CF0)' :
                                   item.gradient === 'blue' ? 'linear-gradient(135deg, #007CF0, #8E2DE2)' :
                                   'linear-gradient(135deg, #8E2DE2, #00C6A7)'
                      }}
                    />
                    
                    {/* Glass card */}
                    <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl">
                      <div className="flex items-start gap-6">
                        {/* Modern Feature Icon */}
                        <div className="flex-shrink-0">
                          <FeatureIcon name={item.iconName} gradient={item.gradient} animated={true} />
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-[#00C6A7] group-hover:to-[#007CF0] transition-all">
                            {item.title}
                          </h4>
                          <p className="text-gray-700 text-lg leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating decorative elements with parallax */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-full opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Curved separator */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};

export default About;
