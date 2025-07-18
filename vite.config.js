import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/js/app.jsx",
        "resources/css/app.css",
        "resources/css/stylingFonts.css",
        "resources/css/navigation-media.css",
        "resources/css/dashboard.css",
      ],
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": "/resources/js",
    },
  },
  build: {
    manifest: true,
    outDir: "public/build",
    assetsDir: "",
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
