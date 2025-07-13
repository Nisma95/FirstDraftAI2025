import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: "resources/js/app.jsx",
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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@headlessui/react", "@material-tailwind/react"],
          three: ["three"],
          gsap: ["gsap", "@gsap/react"],
          utils: ["axios", "dayjs", "date-fns"],
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  define: {
    global: "globalThis",
  },
});
