/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16A34A',
        'primary-light': '#34D399',
        secondary: '#6B7280',
        'bg-soft': '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(2,6,23,0.08)',
        'soft-hover': '0 20px 40px rgba(2,6,23,0.12)',
        'button': '0 6px 18px rgba(16,185,129,0.18)',
      },
      animation: {
        'pulse-green': 'pulse-green 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-badge': 'bounce-badge 0.7s cubic-bezier(0.36, 0, 0.66, -0.56)',
      },
      keyframes: {
        'pulse-green': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(1.6)',
          },
        },
        'bounce-badge': {
          '0%': { transform: 'scale(0.6)' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
