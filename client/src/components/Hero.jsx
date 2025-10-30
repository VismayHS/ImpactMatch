import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ModernIcon } from './IconSystem';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-800 to-green-900">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 animate-pulse" style={{ animationDuration: '4s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Animated mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -60, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Glowing badge */}
          <motion.div
            className="inline-block mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-70"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="relative text-8xl">💚</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-7xl md:text-8xl font-black mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="inline-block bg-gradient-to-r from-emerald-200 via-teal-100 to-cyan-200 bg-clip-text text-transparent drop-shadow-2xl">
              Impact
            </span>
            <span className="inline-block bg-gradient-to-r from-white via-emerald-50 to-white bg-clip-text text-transparent drop-shadow-2xl">
              Match
            </span>
          </motion.h1>

          <motion.div
            className="space-y-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <p className="text-3xl md:text-4xl text-emerald-50 font-light tracking-wide drop-shadow-lg">
              Find causes that match your passion
            </p>
            <p className="text-xl md:text-2xl text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
              AI-powered social impact platform connecting volunteers with causes that truly resonate
            </p>
          </motion.div>

          {/* CTA Buttons with glow effects */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.button
              onClick={() => navigate('/register')}
              className="group relative px-10 py-5 bg-white text-emerald-900 rounded-full font-bold text-lg shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-20"
                initial={false}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative flex items-center gap-2">
                🔄 Explore Causes
              </span>
            </motion.button>

            <motion.button
              onClick={() => navigate('/register')}
              className="group relative px-10 py-5 bg-transparent text-white rounded-full font-bold text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex items-center gap-2">
                Join Our Mission
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating stats cards with glassmorphism */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {[
            { number: "500+", label: "Active Causes", iconName: "causes", gradient: "teal" },
            { number: "10K+", label: "Volunteers", iconName: "dashboard", gradient: "blue" },
            { number: "50+", label: "Cities", iconName: "map", gradient: "violet" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              
              {/* Glass card */}
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                <div className="mb-3">
                  <ModernIcon name={stat.iconName} size="xl" gradient={stat.gradient} animated={true} glow={true} />
                </div>
                <div className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-emerald-200 to-cyan-200 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-emerald-100 text-lg font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-14 border-2 border-white/40 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ y: [0, 24, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
};

export default Hero;
