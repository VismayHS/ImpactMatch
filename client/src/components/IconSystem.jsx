import { motion } from 'framer-motion';
import { 
  FiTarget, 
  FiMapPin, 
  FiCheckCircle, 
  FiMessageCircle, 
  FiAward,
  FiMap,
  FiHome,
  FiMail,
  FiPhone,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiBarChart2
} from 'react-icons/fi';
import { 
  RiRobot2Line,
  RiDashboardLine 
} from 'react-icons/ri';

// Icon mapping with their respective React Icons
export const iconMap = {
  // Feature Icons
  'ai-matching': RiRobot2Line,
  'local-discovery': FiMapPin,
  'transparent-tracking': FiCheckCircle,
  'real-time-chat': FiMessageCircle,
  'impact-scoring': FiAward,
  'interactive-map': FiMap,
  
  // Navigation Icons
  'home': FiHome,
  'causes': FiTarget,
  'map': FiMap,
  'dashboard': RiDashboardLine,
  
  // Contact Icons
  'email': FiMail,
  'phone': FiPhone,
  'location': FiMapPin,
  
  // Social Icons
  'twitter': FiTwitter,
  'facebook': FiFacebook,
  'instagram': FiInstagram,
  'linkedin': FiLinkedin,
};

// Gradient presets for different icon types
const gradientPresets = {
  teal: 'from-[#00C6A7] to-[#007CF0]',
  blue: 'from-[#007CF0] to-[#8E2DE2]',
  violet: 'from-[#8E2DE2] to-[#00C6A7]',
  tealBlue: 'from-[#00C6A7] via-[#007CF0] to-[#8E2DE2]',
};

// Modern Icon Component with glassmorphic and neon effects
export const ModernIcon = ({ 
  name, 
  size = 'md', 
  gradient = 'teal',
  glow = true,
  animated = true,
  className = '',
  ...props 
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const iconSizes = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 40,
    xl: 48,
  };

  const gradientColors = {
    teal: { from: '#00C6A7', to: '#007CF0', glow: 'rgba(0, 198, 167, 0.4)' },
    blue: { from: '#007CF0', to: '#8E2DE2', glow: 'rgba(0, 124, 240, 0.4)' },
    violet: { from: '#8E2DE2', to: '#00C6A7', glow: 'rgba(142, 45, 226, 0.4)' },
    tealBlue: { from: '#00C6A7', to: '#8E2DE2', glow: 'rgba(0, 198, 167, 0.4)' },
  };

  const colors = gradientColors[gradient];

  return (
    <motion.div
      className={`relative group ${sizeClasses[size]} ${className}`}
      whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...props}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-2xl border border-white/40 shadow-lg" />
      
      {/* Gradient glow background */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-2xl blur-md opacity-40 group-hover:opacity-70"
          style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          }}
          animate={animated ? {
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* Icon with gradient - using inline SVG coloring */}
      <div 
        className="relative flex items-center justify-center h-full z-10"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        <IconComponent 
          size={iconSizes[size]} 
          strokeWidth={2}
          style={{
            filter: `drop-shadow(0 2px 6px ${colors.glow})`,
          }}
        />
      </div>
      
      {/* Subtle inner glow */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${colors.glow}, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

// Floating Icon Badge - For hero section or call-outs
export const FloatingIconBadge = ({ 
  name, 
  label,
  gradient = 'teal',
  className = ''
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) return null;

  return (
    <motion.div
      className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative w-8 h-8 flex items-center justify-center bg-gradient-to-br ${gradientPresets[gradient]} rounded-xl shadow-md`}>
        <IconComponent size={16} className="text-white" />
      </div>
      {label && (
        <span className={`text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradientPresets[gradient]}`}>
          {label}
        </span>
      )}
    </motion.div>
  );
};

// Large Feature Icon - For feature cards
export const FeatureIcon = ({ 
  name,
  gradient = 'teal',
  animated = true,
  className = ''
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) return null;

  const gradientColors = {
    teal: { from: '#00C6A7', to: '#007CF0', glow: 'rgba(0, 198, 167, 0.5)' },
    blue: { from: '#007CF0', to: '#8E2DE2', glow: 'rgba(0, 124, 240, 0.5)' },
    violet: { from: '#8E2DE2', to: '#00C6A7', glow: 'rgba(142, 45, 226, 0.5)' },
    tealBlue: { from: '#00C6A7', to: '#8E2DE2', glow: 'rgba(0, 198, 167, 0.5)' },
  };

  const colors = gradientColors[gradient];

  return (
    <div className={`relative ${className}`}>
      {/* Animated glow background */}
      {animated && (
        <motion.div
          className="absolute inset-0 rounded-3xl blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
            opacity: 0.6,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {/* Main icon container */}
      <motion.div
        className="relative w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/30"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
        }}
        whileHover={{ 
          rotate: 360,
          scale: 1.15
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <IconComponent 
          size={40} 
          strokeWidth={2}
          className="text-white drop-shadow-lg" 
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
          }}
        />
      </motion.div>
    </div>
  );
};

// Social Icon with hover effect
export const SocialIcon = ({ 
  name,
  href,
  size = 'md',
  className = ''
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) return null;

  const sizeMap = {
    sm: { container: 'w-8 h-8', icon: 16 },
    md: { container: 'w-10 h-10', icon: 20 },
    lg: { container: 'w-12 h-12', icon: 24 },
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative group ${sizeMap[size].container} ${className}`}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glassmorphic background */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-xl border border-white/40 shadow-md" />
      
      {/* Gradient glow on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#00C6A7] to-[#007CF0] rounded-xl opacity-0 group-hover:opacity-20 blur-lg"
        transition={{ duration: 0.3 }}
      />
      
      {/* Icon */}
      <div className="relative flex items-center justify-center h-full">
        <IconComponent 
          size={sizeMap[size].icon} 
          className="text-gray-700 group-hover:text-[#007CF0] transition-colors duration-300"
        />
      </div>
    </motion.a>
  );
};

// Navigation Icon - For navbar
export const NavIcon = ({ 
  name,
  active = false,
  label,
  onClick,
  className = ''
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) return null;

  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
        active
          ? 'text-[#007CF0]'
          : 'text-gray-600 hover:text-[#007CF0]'
      } ${className}`}
      whileHover={{ y: -2, scale: 1.05 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Active background with gradient */}
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#e8f9f6] to-[#e3f2fd] rounded-xl border border-[#00C6A7]/20"
          layoutId="activeNavIcon"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#e8f9f6]/50 to-[#e3f2fd]/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
      />
      
      <IconComponent size={20} className="relative z-10" />
      {label && <span className="relative z-10">{label}</span>}
    </motion.button>
  );
};

export default ModernIcon;
