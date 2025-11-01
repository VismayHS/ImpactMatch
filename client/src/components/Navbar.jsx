import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ModernIcon } from './IconSystem';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Auto-hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { path: '/', label: 'Home', iconName: 'home' },
    { path: '/dashboard', label: 'Dashboard', iconName: 'dashboard', protected: true },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -120 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            className="mt-4 relative overflow-hidden rounded-3xl"
            animate={{
              height: isScrolled ? '64px' : '72px',
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Premium Glassmorphic Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#e0f7f4]/90 via-white/85 to-[#e3f2fd]/90 backdrop-blur-2xl" />
            
            {/* Subtle Glass Reflection Effect (like macOS dock) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-transparent" />
            
            {/* Border with dual-tone glow */}
            <div 
              className="absolute inset-0 rounded-3xl"
              style={{
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                boxShadow: isScrolled 
                  ? '0 8px 32px -4px rgba(0, 198, 167, 0.15), 0 20px 60px -15px rgba(0, 124, 240, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  : '0 4px 24px -4px rgba(0, 0, 0, 0.06), 0 12px 40px -8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                transition: 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />

            {/* Content */}
            <div className="relative px-6 sm:px-8 h-full flex items-center">
              <div className="flex justify-between items-center w-full">
                {/* Logo with animated sparkle */}
                <Link to="/" className="group relative flex items-center gap-3">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] via-[#007CF0] to-[#8E2DE2] tracking-tight">
                      ImpactMatch
                    </span>
                    
                    {/* Animated sparkle effect */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-[#00C6A7] to-[#007CF0] rounded-full"
                      animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                  
                  {/* Tagline with sparkle */}
                  <div className="hidden lg:flex items-center gap-1.5">
                    <div className="w-px h-6 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                    <motion.span 
                      className="text-xs font-semibold text-gray-500 tracking-wide relative"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      AI-Powered Impact Platform
                      
                      {/* Tiny sparkle animation */}
                      <motion.span
                        className="absolute -top-0.5 -right-2 text-[#00C6A7]"
                        animate={{
                          scale: [0, 1, 0],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 4,
                          ease: "easeInOut",
                        }}
                      >
                        ✨
                      </motion.span>
                    </motion.span>
                  </div>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-1.5">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const shouldHide = link.protected && !user;
                    // Hide userOnly links for NGOs and admins
                    const shouldHideForRole = link.userOnly && (userRole === 'ngo' || userRole === 'admin');
                    
                    if (shouldHide || shouldHideForRole) return null;

                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className="relative group"
                      >
                        <motion.div
                          className={`relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                            isActive
                              ? 'text-[#007CF0]'
                              : 'text-gray-600 hover:text-[#007CF0]'
                          }`}
                          whileHover={{ y: -3, scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          style={{
                            letterSpacing: '0.02em',
                          }}
                        >
                          {/* Active state: elevated luminous background */}
                          {isActive && (
                            <>
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-[#e0f7f4] via-white to-[#e3f2fd] rounded-2xl"
                                layoutId="activeNav"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                style={{
                                  border: '1.5px solid rgba(0, 198, 167, 0.3)',
                                  boxShadow: '0 4px 16px -2px rgba(0, 198, 167, 0.2), 0 8px 24px -4px rgba(0, 124, 240, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                                }}
                              />
                              
                              {/* Glow effect on active */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-[#00C6A7]/10 to-[#007CF0]/10 rounded-2xl blur-xl"
                                animate={{
                                  opacity: [0.5, 0.8, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            </>
                          )}
                          
                          {/* Hover state: glowing border and color bloom */}
                          {!isActive && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-[#e0f7f4]/40 via-white/50 to-[#e3f2fd]/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                border: '1.5px solid rgba(0, 198, 167, 0.2)',
                                boxShadow: '0 2px 12px -2px rgba(0, 198, 167, 0.15), 0 4px 16px -4px rgba(0, 124, 240, 0.1)',
                              }}
                            />
                          )}
                          
                          {/* Icon with scale animation */}
                          <motion.span 
                            className="relative flex items-center justify-center"
                            whileHover={{ scale: 1.15, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ModernIcon name={link.iconName} size="xs" gradient="teal" animated={false} glow={isActive} />
                          </motion.span>
                          
                          <span className="relative">{link.label}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-800">{user.name}</p>
                        <p className="text-xs font-semibold bg-gradient-to-r from-[#00C6A7] to-[#007CF0] bg-clip-text text-transparent">
                          {user.impactScore || 0} points
                        </p>
                      </div>
                      <motion.button
                        onClick={onLogout}
                        className="px-5 py-2.5 bg-white/60 hover:bg-white/80 text-gray-700 rounded-xl font-semibold text-sm backdrop-blur-sm transition-all border border-gray-200/60 shadow-sm"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      onClick={() => navigate('/register')}
                      className="relative group px-6 py-2.5 rounded-xl font-semibold text-sm overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #00C6A7 0%, #007CF0 100%)',
                        boxShadow: '0 4px 20px -2px rgba(0, 198, 167, 0.4), 0 8px 32px -4px rgba(0, 124, 240, 0.3)',
                        letterSpacing: '0.02em',
                      }}
                      whileHover={{ 
                        scale: 1.05, 
                        y: -2,
                        boxShadow: '0 8px 28px -2px rgba(0, 198, 167, 0.5), 0 12px 40px -4px rgba(0, 124, 240, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                      }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                      {/* Gradient reverses on hover */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(135deg, #007CF0 0%, #00C6A7 100%)',
                        }}
                      />
                      
                      {/* Inner glow effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      
                      {/* Glowing border animation on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          border: '2px solid rgba(255, 255, 255, 0.6)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      
                      <span className="relative flex items-center gap-2 text-white font-bold">
                        Get Started
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  )}
                  
                  {/* Mobile Menu Toggle */}
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60"
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      animate={isMobileMenuOpen ? "open" : "closed"}
                      className="w-5 h-5 flex flex-col justify-center items-center gap-1"
                    >
                      <motion.span
                        className="w-4 h-0.5 bg-gray-700 rounded-full"
                        variants={{
                          closed: { rotate: 0, y: 0 },
                          open: { rotate: 45, y: 5 },
                        }}
                      />
                      <motion.span
                        className="w-4 h-0.5 bg-gray-700 rounded-full"
                        variants={{
                          closed: { opacity: 1 },
                          open: { opacity: 0 },
                        }}
                      />
                      <motion.span
                        className="w-4 h-0.5 bg-gray-700 rounded-full"
                        variants={{
                          closed: { rotate: 0, y: 0 },
                          open: { rotate: -45, y: -5 },
                        }}
                      />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed top-20 left-4 right-4 z-40"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              {/* Glassmorphic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e0f7f4]/95 via-white/90 to-[#e3f2fd]/95 backdrop-blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent" />
              <div 
                className="absolute inset-0 rounded-2xl"
                style={{
                  border: '1.5px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 8px 32px -4px rgba(0, 198, 167, 0.2), 0 20px 60px -15px rgba(0, 124, 240, 0.15)',
                }}
              />
              
              {/* Menu items */}
              <div className="relative p-4 space-y-1">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.path;
                  const shouldHide = link.protected && !user;
                  // Hide userOnly links for NGOs and admins
                  const shouldHideForRole = link.userOnly && (userRole === 'ngo' || userRole === 'admin');
                  
                  if (shouldHide || shouldHideForRole) return null;

                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block"
                      >
                        <motion.div
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                            isActive
                              ? 'text-[#007CF0] bg-gradient-to-r from-[#e0f7f4] to-[#e3f2fd]'
                              : 'text-gray-600 hover:text-[#007CF0] hover:bg-white/50'
                          }`}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            border: isActive ? '1.5px solid rgba(0, 198, 167, 0.2)' : '1.5px solid transparent',
                            boxShadow: isActive ? '0 2px 12px -2px rgba(0, 198, 167, 0.15)' : 'none',
                          }}
                        >
                          <ModernIcon name={link.iconName} size="sm" gradient="teal" animated={false} glow={isActive} />
                          <span>{link.label}</span>
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-[#00C6A7] to-[#007CF0]"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav - Bottom Fixed */}
      <motion.div
        className="md:hidden fixed bottom-4 left-4 right-4 z-50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative overflow-hidden rounded-2xl">
          {/* Premium glassmorphic background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#e0f7f4]/90 via-white/85 to-[#e3f2fd]/90 backdrop-blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent" />
          <div 
            className="absolute inset-0 rounded-2xl"
            style={{
              border: '1.5px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 -4px 24px -4px rgba(0, 198, 167, 0.15), 0 -12px 48px -8px rgba(0, 124, 240, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          />
          
          <div className="relative flex justify-around py-4 px-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const shouldHide = link.protected && !user;
              // Hide userOnly links for NGOs and admins
              const shouldHideForRole = link.userOnly && (userRole === 'ngo' || userRole === 'admin');
              
              if (shouldHide || shouldHideForRole) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative flex flex-col items-center gap-1.5 min-w-[60px]"
                >
                  <motion.div
                    className={`flex flex-col items-center gap-1.5 transition-colors duration-300 ${
                      isActive ? 'text-[#007CF0]' : 'text-gray-600'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active indicator with glow */}
                    {isActive && (
                      <>
                        <motion.div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                          layoutId="mobileActiveIndicator"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          style={{
                            background: 'linear-gradient(90deg, #00C6A7 0%, #007CF0 100%)',
                            boxShadow: '0 2px 8px -1px rgba(0, 198, 167, 0.5), 0 4px 12px -2px rgba(0, 124, 240, 0.4)',
                          }}
                        />
                        
                        {/* Glow pulse effect */}
                        <motion.div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-gradient-to-r from-[#00C6A7] to-[#007CF0] blur-sm"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}
                    
                    {/* Icon with hover scale */}
                    <motion.div 
                      className="flex items-center justify-center"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ModernIcon name={link.iconName} size="sm" gradient="teal" animated={false} glow={isActive} />
                    </motion.div>
                    
                    <span className="text-xs font-semibold">{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
