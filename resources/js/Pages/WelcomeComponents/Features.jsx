// resources/js/Pages/WelcomeComponents/Features.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import VerticalScroll from "./VerticalScroll";
import HorizontalScroll from "./HorizontalScroll";
import { cleanupScrollTrigger } from "../../utils/scrollTriggerUtils";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    const lenisRef = useRef(null);
    const rafIdRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Initialize smooth scrolling with Lenis
        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        lenisRef.current.on("scroll", ScrollTrigger.update);

        const raf = (time) => {
            if (lenisRef.current) {
                lenisRef.current.raf(time);
                ScrollTrigger.update();
                rafIdRef.current = requestAnimationFrame(raf);
            }
        };

        rafIdRef.current = requestAnimationFrame(raf);

        return () => {
            // Cancel animation frame
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }

            // Destroy Lenis
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }

            // Clean up ScrollTrigger
            cleanupScrollTrigger();
        };
    }, []);

    return (
        <>
            <VerticalScroll />
            <HorizontalScroll />
        </>
    );
};

export default Features;
