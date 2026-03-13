import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,    // default Vite port
    open: '/'      // langsung buka root di browser
  }
})