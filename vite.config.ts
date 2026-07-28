import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Ensures CSS is inlined into HTML so bg color loads immediately
        inlineDynamicImports: false,
      }
    }
  }
})
