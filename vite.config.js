import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/public/",
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
  // Configuration for build optimization
  build: {
    // إزالة تحذيرات الـ chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // تقسيم الكود بطريقة أفضل
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@headlessui/react", "@material-tailwind/react"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          gsap: ["gsap", "@gsap/react"],
          utils: ["axios", "dayjs", "date-fns"],
        },
      },
    },
  },
  // Add development server configuration to suppress warnings
  server: {
    hmr: {
      overlay: false, // This will disable the error overlay
    },
  },
  // Suppress the IndexedDB warning
  define: {
    global: "globalThis",
  },
});
