import "../css/app.css";
import "../css/stylingFonts.css";

import "./bootstrap";
import "./locales/i18n";
import Lenis from "@studio-freight/lenis";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

function AppWrapper({ App, props }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy(); // Cleanup on unmount
    }, []);

    return (
        <>
            <App {...props} />
        </>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        console.log("Trying to resolve page:", name); // Debug log

        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ).catch((error) => {
            console.error("Page resolution failed for:", name);
            console.error("Error:", error);

            // Try to get available pages for debugging
            const availablePages = import.meta.glob("./Pages/**/*.jsx");
            console.log("Available pages:", Object.keys(availablePages));

            throw error;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        color: "#4B5563",
    },
});

window.React = React;
window.createRoot = createRoot;
