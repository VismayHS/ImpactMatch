import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatSuggest } from '../api/matchAPI';

export default function ImpactBuddyChat({ onClose, userId }) {
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: "Hi! I'm your Impact Buddy 🤖 Ask me to suggest causes based on what you're interested in!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatSuggest(input);
      const suggestions = response.suggestions || [];
      
      const botMessage = {
        type: 'bot',
        text: 'Here are some causes that might interest you:',
        suggestions: suggestions.slice(0, 3),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'bot',
        text: "Sorry, I couldn't find suggestions right now. Try being more specific!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-8 w-80 bg-white rounded-2xl shadow-soft-hover overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-white font-semibold">Impact Buddy</h3>
            <p className="text-white/80 text-xs">Ask me anything!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors duration-150"
          aria-label="Close chat"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-bg-soft">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((cause, i) => (
                      <div
                        key={i}
                        className="bg-primary/5 rounded-lg p-2 text-xs"
                      >
                        <h4 className="font-semibold text-primary mb-1">
                          {cause.name}
                        </h4>
                        <p className="text-gray-600 text-xs">
                          {cause.description?.slice(0, 80)}...
                        </p>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                          <span>📍 {cause.city}</span>
                          <span>•</span>
                          <span>{cause.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about causes..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            disabled={loading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 btn-gradient text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </motion.div>
  );
}
