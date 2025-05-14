// Features.jsx - Updated main component
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import VerticalScroll from "./VerticalScroll";
import HorizontalScroll from "./HorizontalScroll";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
    useEffect(() => {
        // Initialize smooth scrolling with Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        lenis.on("scroll", ScrollTrigger.update);

        function raf(time) {
            lenis.raf(time);
            ScrollTrigger.update();
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy(); // Properly clean up Lenis instance
            ScrollTrigger.killAll(); // Clean up all ScrollTrigger instances
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
