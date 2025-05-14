import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

const Goals = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl"; // Detect RTL language

    // Create a ref for the goal section and title
    const goalSectionRef = useRef(null);
    const goalTitleRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis smooth scrolling
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

        // GSAP animation for the title to scroll up and down
        gsap.to(goalTitleRef.current, {
            y: "-100vh", // Move the title up by 100vh
            ease: "none",
            scrollTrigger: {
                trigger: goalSectionRef.current, // Trigger animation when the section is in view
                start: "top top", // Start animation when the top of the section reaches the top of the viewport
                end: "bottom top", // End animation when the bottom of the section reaches the top of the viewport
                scrub: true, // Smoothly scrub through the animation based on scroll
                markers: true, // Show markers for debugging
            },
        });

        return () => {
            lenis.destroy(); // Properly clean up Lenis instance
            ScrollTrigger.killAll(); // Clean up ScrollTrigger
        };
    }, []);

    return (
        <section
            id="goals"
            ref={goalSectionRef} // Assign the ref to the section
            className={`mt-14 flex w-fit px-6 transition-all duration-300 justify-end mb-10 ${
                isRTL ? "rtl" : "ltr"
            }`}
        >
            <div
                className="w-[50%] flex flex-col text-left dark:text-white h-full mt-[300px]"
                ref={goalTitleRef} // Assign the ref to the title container
            >
                <h1
                    className={`!text-[4rem] fdGradientColorzTX font-bold ${
                        isRTL ? "text-right mr-auto" : "text-left "
                    }`}
                >
                    {t("mainGoals")}
                </h1>
                <p
                    className={`mt-4 text-lg text-gray-600 dark:text-white font-bold ${
                        isRTL ? "text-right mr-auto" : "text-left ml-auto"
                    }`}
                >
                    {t("mainGoalsDesc")}
                </p>
            </div>
        </section>
    );
};

export default Goals;
