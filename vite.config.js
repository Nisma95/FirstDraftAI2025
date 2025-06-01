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
