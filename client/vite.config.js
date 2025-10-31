import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to next available port if 3000 is taken
    host: true, // Listen on all addresses
    watch: {
      usePolling: true, // More reliable file watching on Windows
      interval: 100
    },
    hmr: {
      overlay: true, // Show errors as overlay instead of crashing
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
      }
    }
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress certain warnings
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      }
    }
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
