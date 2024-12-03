// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: "dist",
    // Don't generate source maps
    sourcemap: false,
    // Clean the output directory before build
    emptyOutDir: true,
    // Prevent extra file generation
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});