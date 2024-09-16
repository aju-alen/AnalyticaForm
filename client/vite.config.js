import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
},
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          // Create separate chunks for dependencies
          return id.toString().split('node_modules/')[1].split('/')[0].toString();
        }
      },
    },
  },
  // Optionally adjust the chunk size warning limit
  chunkSizeWarningLimit: 1000, // Adjust the limit (default is 500KB)
},
})
