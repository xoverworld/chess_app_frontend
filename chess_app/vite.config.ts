import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // This is the magic line
      react: path.resolve('./node_modules/react'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws' : {
        target: 'ws://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
      }
    }
  }
})
