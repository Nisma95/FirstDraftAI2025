// resources/js/Pages/WelcomeComponents/Goals.jsx
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { cleanupScrollTrigger } from "../../utils/scrollTriggerUtils";

gsap.registerPlugin(ScrollTrigger);

const Goals = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const goalSectionRef = useRef(null);
    const goalTitleRef = useRef(null);
    const lenisRef = useRef(null);
    const rafIdRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Initialize Lenis smooth scrolling
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

        // GSAP animation for the title
        if (goalTitleRef.current && goalSectionRef.current) {
            animationRef.current = gsap.to(goalTitleRef.current, {
                y: "-100vh",
                ease: "none",
                scrollTrigger: {
                    trigger: goalSectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    markers: false, // Set to true for debugging
                    onRefresh: () => {
                        // Ensure elements still exist
                        if (!goalTitleRef.current || !goalSectionRef.current) {
                            if (animationRef.current) {
                                animationRef.current.kill();
                            }
                        }
                    },
                },
            });
        }

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

            // Kill specific animation
            if (animationRef.current) {
                animationRef.current.kill();
            }

            // Clean up ScrollTrigger
            cleanupScrollTrigger();
        };
    }, []);

    return (
        <section
            id="goals"
            ref={goalSectionRef}
            className={`mt-14 flex w-fit px-6 transition-all duration-300 justify-end mb-10 ${
                isRTL ? "rtl" : "ltr"
            }`}
        >
            <div
                className="w-[50%] flex flex-col text-left dark:text-white h-full mt-[300px]"
                ref={goalTitleRef}
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
