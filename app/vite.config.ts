// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: false, // We're using our custom manifest
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      "process.env.VITE_OPENWEATHER_API_KEY": JSON.stringify(
        env.VITE_OPENWEATHER_API_KEY
      ),
    },
    build: {
      outDir: "dist",
      // Don't generate source maps
      sourcemap: false,
      // Clean the output directory before build
      emptyOutDir: true,
      // Prevent extra file generation
      rollupOptions: {
        external: ["path", "source-map-js"],  

        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});
