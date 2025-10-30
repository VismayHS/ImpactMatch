import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/swipe', label: 'Causes', icon: '�' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊', protected: true },
    { path: '/map', label: 'Map', icon: '🗺️' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? 'bg-white/95 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span
              className="text-3xl"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              💚
            </motion.span>
            <span className={`text-2xl font-bold ${isScrolled || !isHomePage ? 'text-green-600' : 'text-white'}`}>
              ImpactMatch
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              const shouldHide = link.protected && !user;
              
              if (shouldHide) return null;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative"
                >
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'text-green-600'
                        : isScrolled || !isHomePage
                        ? 'text-gray-700 hover:text-green-600'
                        : 'text-white hover:text-green-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className={`text-right hidden sm:block ${isScrolled || !isHomePage ? 'text-gray-900' : 'text-white'}`}>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs opacity-80">
                    Score: {user.impactScore || 0}
                  </p>
                </div>
                <motion.button
                  onClick={onLogout}
                  className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={() => navigate('/login')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  isScrolled || !isHomePage
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white text-green-600'
                } hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now →
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex justify-around py-3 border-t border-gray-200">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const shouldHide = link.protected && !user;
            
            if (shouldHide) return null;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? 'text-green-600' : 'text-gray-600'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
