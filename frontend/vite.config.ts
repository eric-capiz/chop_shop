import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@types": path.resolve(__dirname, "./src/types"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: "modern-compiler",
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: "https://barbershop-new.fly.dev", // Original 1.0 API - DO NOT USE
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true,
  },
});
