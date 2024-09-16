import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false // Disable minification
  },
  plugins: [react()],
  define: {
    global: {},
},
})
