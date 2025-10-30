import React from 'react';
import { motion } from 'framer-motion';
import { 
  ModernIcon, 
  FloatingIconBadge, 
  FeatureIcon, 
  SocialIcon,
  NavIcon 
} from './IconSystem';

const IconShowcase = () => {
  const featureIcons = [
    { name: 'ai-matching', label: 'AI Cause Matching', gradient: 'teal' },
    { name: 'local-discovery', label: 'Local Impact Discovery', gradient: 'blue' },
    { name: 'transparent-tracking', label: 'Transparent Tracking', gradient: 'violet' },
    { name: 'real-time-chat', label: 'Real-time Chat', gradient: 'tealBlue' },
    { name: 'impact-scoring', label: 'Impact Scoring', gradient: 'teal' },
    { name: 'interactive-map', label: 'Interactive Map', gradient: 'blue' },
  ];

  const navigationIcons = [
    { name: 'home', label: 'Home' },
    { name: 'causes', label: 'Causes' },
    { name: 'map', label: 'Map' },
    { name: 'dashboard', label: 'Dashboard' },
  ];

  const contactIcons = [
    { name: 'email', label: 'Email', href: 'mailto:contact@impactmatch.com' },
    { name: 'phone', label: 'Phone', href: 'tel:+1234567890' },
    { name: 'location', label: 'Location', href: '#' },
  ];

  const socialIcons = [
    { name: 'twitter', href: 'https://twitter.com/impactmatch' },
    { name: 'facebook', href: 'https://facebook.com/impactmatch' },
    { name: 'instagram', href: 'https://instagram.com/impactmatch' },
    { name: 'linkedin', href: 'https://linkedin.com/company/impactmatch' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f9f6] via-[#f2f7ff] to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-4">
            <span className="text-gray-800">ImpactMatch </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C6A7] via-[#007CF0] to-[#8E2DE2]">
              Icon System
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A cohesive modern icon set with glassmorphic design, neon gradients, and futuristic animations
          </p>
        </motion.div>

        {/* Feature Icons Section */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Feature Icons
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Large animated icons for feature cards
            </span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {featureIcons.map((icon, index) => (
              <motion.div
                key={icon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <FeatureIcon name={icon.name} gradient={icon.gradient} />
                <p className="text-sm text-gray-600 text-center font-medium">
                  {icon.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modern Icon Sizes */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Icon Sizes
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Glassmorphic icons in various sizes (xs, sm, md, lg, xl)
            </span>
          </motion.h2>
          <div className="flex items-end justify-center gap-8 bg-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/60">
            <div className="flex flex-col items-center gap-2">
              <ModernIcon name="ai-matching" size="xs" gradient="teal" />
              <span className="text-xs text-gray-500">xs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ModernIcon name="local-discovery" size="sm" gradient="blue" />
              <span className="text-xs text-gray-500">sm</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ModernIcon name="transparent-tracking" size="md" gradient="violet" />
              <span className="text-xs text-gray-500">md</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ModernIcon name="real-time-chat" size="lg" gradient="tealBlue" />
              <span className="text-xs text-gray-500">lg</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ModernIcon name="impact-scoring" size="xl" gradient="teal" />
              <span className="text-xs text-gray-500">xl</span>
            </div>
          </div>
        </section>

        {/* Floating Icon Badges */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Floating Icon Badges
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Perfect for hero sections and call-outs
            </span>
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4">
            <FloatingIconBadge name="ai-matching" label="AI Powered" gradient="teal" />
            <FloatingIconBadge name="local-discovery" label="Find Locally" gradient="blue" />
            <FloatingIconBadge name="transparent-tracking" label="100% Transparent" gradient="violet" />
            <FloatingIconBadge name="impact-scoring" label="Track Impact" gradient="tealBlue" />
          </div>
        </section>

        {/* Navigation Icons */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Navigation Icons
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Interactive navbar icons with active states
            </span>
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-4 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/40">
            {navigationIcons.map((icon, index) => (
              <NavIcon
                key={icon.name}
                name={icon.name}
                label={icon.label}
                active={index === 0}
              />
            ))}
          </div>
        </section>

        {/* Contact Icons */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Contact Icons
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Simple icons for contact information
            </span>
          </motion.h2>
          <div className="flex justify-center gap-6">
            {contactIcons.map((icon, index) => (
              <motion.div
                key={icon.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <ModernIcon name={icon.name} size="md" gradient="teal" />
                <span className="text-sm text-gray-600">{icon.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Icons */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Social Media Icons
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Hover-animated icons for social links
            </span>
          </motion.h2>
          <div className="flex justify-center gap-4">
            {socialIcons.map((icon, index) => (
              <motion.div
                key={icon.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <SocialIcon name={icon.name} href={icon.href} size="lg" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gradient Options */}
        <section className="mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
          >
            Gradient Variations
            <span className="block text-sm text-gray-500 font-normal mt-2">
              Four gradient presets: teal, blue, violet, tealBlue
            </span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['teal', 'blue', 'violet', 'tealBlue'].map((gradient, index) => (
              <motion.div
                key={gradient}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-4"
              >
                <ModernIcon name="ai-matching" size="lg" gradient={gradient} />
                <span className="text-sm text-gray-600 capitalize font-medium">
                  {gradient}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/40">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usage Example</h2>
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto font-mono text-sm">
            <pre>{`import { 
  ModernIcon, 
  FeatureIcon, 
  FloatingIconBadge,
  NavIcon,
  SocialIcon 
} from './components/IconSystem';

// Feature Icon
<FeatureIcon 
  name="ai-matching" 
  gradient="teal" 
  animated={true} 
/>

// Modern Icon with custom size
<ModernIcon 
  name="local-discovery" 
  size="lg" 
  gradient="blue"
  glow={true}
/>

// Navigation Icon
<NavIcon 
  name="home" 
  label="Home"
  active={true}
  onClick={() => navigate('/')}
/>

// Social Icon
<SocialIcon 
  name="twitter"
  href="https://twitter.com/..."
  size="md"
/>

// Floating Badge
<FloatingIconBadge 
  name="impact-scoring"
  label="AI Powered"
  gradient="teal"
/>`}</pre>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IconShowcase;
