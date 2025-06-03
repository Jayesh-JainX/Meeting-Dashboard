import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can specify the port for the dev server
    proxy: {
      // Proxy API requests to Django backend during development
      "/api": {
        target: "https://web-production-bf6e.up.railway.app", // Your Django backend address
        changeOrigin: true,
        // secure: false, // If your backend is not HTTPS
        // rewrite: (path) => path.replace(/^\/api/, '/api') // Ensure /api prefix is kept if needed by Django
      },
    },
  },
});
