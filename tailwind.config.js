import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
                arabic: ["Cairo", "sans-serif"],
            },
            animation: {
                "fade-up": "fade-up 0.3s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                gradient: "gradientAnimation 3s ease infinite",
            },
            keyframes: {
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "scale(0.95)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                gradientAnimation: {
                    "0%": { "background-position": "0% 50%" },
                    "50%": { "background-position": "100% 50%" },
                    "100%": { "background-position": "0% 50%" },
                },
            },
            backgroundImage: {
                "dropdown-arrow":
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                Fdbg: "linear-gradient(90deg, #2c2b2b, #6077a1, #5956e9)",
                "Fdbg-hover":
                    "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
            },
            backgroundColor: {
                "dark-card": "#111214",
            },
        },
    },
    plugins: [forms],
    variants: {
        extend: {
            backgroundImage: ["hover"],
            animation: ["hover"],
            backgroundColor: ["group-hover"],
        },
    },
};
