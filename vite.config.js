import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Venus Veggies",
        short_name: "Venus",
        theme_color: "#5B8C42",
        background_color: "#F3F4EB",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": process.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    },
  },
});
