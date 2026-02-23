import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure WASM files aren't inlined to massive base64 strings and are treated as separate chunks
    target: 'esnext',
  },
  optimizeDeps: {
    exclude: ['@huggingface/transformers'] // Let Vite handle it properly for the browser
  }
})
