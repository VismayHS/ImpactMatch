import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ModernIcon, SocialIcon } from './IconSystem';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', path: '/', iconName: 'home' },
    { label: 'Causes', path: '/swipe', iconName: 'causes' },
    { label: 'Map', path: '/map', iconName: 'map' },
    { label: 'Dashboard', path: '/dashboard', iconName: 'dashboard' },
  ];

  const socialLinks = [
    { iconName: 'twitter', name: 'Twitter', url: 'https://twitter.com/impactmatch' },
    { iconName: 'facebook', name: 'Facebook', url: 'https://facebook.com/impactmatch' },
    { iconName: 'instagram', name: 'Instagram', url: 'https://instagram.com/impactmatch' },
    { iconName: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/impactmatch' },
  ];

  const contactInfo = [
    { iconName: 'email', text: 'hello@impactmatch.org' },
    { iconName: 'phone', text: '+91 9876543210' },
    { iconName: 'location', text: 'Bangalore, India' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white overflow-hidden">
      {/* Animated top separator with glow */}
      <div className="relative h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-xl opacity-70"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6 group">
              <motion.div
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-0 group-hover:opacity-60"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative text-4xl">💚</span>
              </motion.div>
              <span className="text-3xl font-black bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
                ImpactMatch
              </span>
            </div>
            <p className="text-emerald-100 text-lg leading-relaxed mb-6">
              Connecting passion with purpose for meaningful social impact
            </p>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-emerald-100 font-semibold"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <span className="text-xl">🌟</span>
              <span>Made with love</span>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-black text-2xl mb-6 text-emerald-200">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={link.path}
                    className="group flex items-center gap-3 text-emerald-100 hover:text-white transition-colors"
                  >
                    <motion.div
                      className="flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <ModernIcon name={link.iconName} size="sm" gradient="teal" />
                    </motion.div>
                    <span className="font-semibold text-lg group-hover:translate-x-2 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-black text-2xl mb-6 text-emerald-200">Contact</h3>
            <ul className="space-y-4 text-emerald-100">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={item.text}
                  className="flex items-center gap-3 group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                >
                  <ModernIcon name={item.iconName} size="sm" gradient="blue" />
                  <span className="font-medium text-lg group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-black text-2xl mb-6 text-emerald-200">Follow Us</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  className="group relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all"
                  >
                    <ModernIcon name={social.iconName} size="md" gradient="tealBlue" />
                    <span className="text-xs font-bold text-white">{social.name}</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="relative pt-8 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {/* Glowing separator */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30" />
          
          <div className="text-center">
            <p className="text-emerald-100 text-lg font-semibold mb-2">
              © {currentYear} ImpactMatch • All Rights Reserved
            </p>
            <motion.p
              className="text-emerald-200 text-xl font-bold"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Made with 💚 for social good
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
