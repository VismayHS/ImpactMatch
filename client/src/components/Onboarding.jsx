import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/userAPI';
import { CITIES } from '../constants';

export default function Onboarding({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    interests: '',
    availability: '',
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/swipe';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAutoDetectCity = () => {
    // Simulate geolocation - in real app would use navigator.geolocation
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    setFormData({ ...formData, city: randomCity });
    toast.info(`Detected city: ${randomCity}`);
  };

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      toast.error('Please fill in all fields');
      return;
    }
    if (step === 2 && (!formData.city || !formData.interests)) {
      toast.error('Please select city and enter interests');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerUser(formData);
      toast.success('Welcome to ImpactMatch! 🎉');
      onLogin(response.user);
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/10 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-soft-hover p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            💚 ImpactMatch
          </h1>
          <p className="text-secondary">Swipe for change. Make an impact.</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8 space-x-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors duration-300 ${
                s <= step ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Create Account</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Full Name"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Email"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Password"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Location & Interests</h2>
                <div className="space-y-4">
                  <div>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      aria-label="City"
                    >
                      <option value="">Select City</option>
                      {CITIES.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAutoDetectCity}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      📍 Auto-detect my city
                    </button>
                  </div>
                  <textarea
                    name="interests"
                    placeholder="Your interests (e.g., environment, education, health)"
                    value={formData.interests}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Interests"
                  />
                  <input
                    type="text"
                    name="availability"
                    placeholder="Availability (optional)"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Availability"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">Ready to Make Impact!</h2>
                <div className="bg-bg-soft rounded-lg p-4 mb-4 space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Name:</span> {formData.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">City:</span> {formData.city}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Interests:</span> {formData.interests}
                  </p>
                </div>
                <p className="text-sm text-secondary mb-4">
                  Start swiping to discover causes that match your passions!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-secondary border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-3 btn-gradient text-white rounded-lg font-medium shadow-button"
                aria-label="Next Step"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-3 btn-gradient text-white rounded-lg font-medium shadow-button disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Get Started"
              >
                {loading ? 'Creating...' : 'Get Started'}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
