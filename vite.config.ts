import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 8000,
    proxy: {
      "/webapi": {
        target: "https://h5.panda-3d.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
