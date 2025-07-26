// OurGoals.jsx
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";

const OurGoals = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const containerRef = useRef(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const section = sectionRef.current;

        if (!container || !section) return;

        // First, check if the section is already in the viewport when the page loads
        const checkInitialPosition = () => {
            const sectionBounds = section.getBoundingClientRect();

            // If the section is already at the center of the viewport when component mounts
            if (sectionBounds.center <= 0 && sectionBounds.bottom > 0) {
                // Apply the pinned state immediately
                gsap.set(container, { position: "fixed", center: 0 });
            }
        };

        // Run the initial check after a brief delay to ensure proper calculations
        setTimeout(checkInitialPosition, 100);

        // Add the sticky behavior with smoother scrubbing

        // Add a listener for resize events to recheck position
        window.addEventListener("resize", checkInitialPosition);

        return () => {
            window.removeEventListener("resize", checkInitialPosition);
        };
    }, []);

    return (
        <section ref={sectionRef} id="our-goals" className="p-4 h-auto">
            <div ref={containerRef} className="container">
                {/* This is the wrapper that will be positioned and pinned */}
                <div
                    className="-mt-[600px] w-full transition-all duration-300 ease-out"
                    style={{ willChange: "transform" }} // Optimize for animations
                >
                    {/* Container with fixed width and alignment */}
                    <div
                        className={`${
                            isRTL ? "mr-auto" : "ml-auto"
                        }  w-80 transition-all duration-500 ease-in-out`}
                        style={{
                            textAlign: isRTL ? "right" : "left",
                        }}
                    >
                        <h2
                            className={`fdGradientColorzTX ${
                                isRTL ? "border-r-5" : "border-l-5"
                            } border-[#5a56e9] text-5xl font-bold block`}
                        >
                            {t("OurGoals")}
                        </h2>

                        <p className="block text-lg text-gray-700 dark:text-gray-300 mt-2">
                            {t("OurGoalsDec")}
                        </p>

                        <div className="block mt-4">
                            <a
                                href="/goals"
                                className="inline-flex bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded shadow-lg items-center space-x-2 rtl:space-x-reverse transition-all duration-300"
                            >
                                <span>{t("get_started")}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="fdColor w-6 h-6 transform transition-transform duration-300 rtl:rotate-180 hover:translate-x-1 rtl:hover:-translate-x-1"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M15.187 12L7.47 4.285q-.221-.221-.218-.532q.003-.31.224-.532Q7.698 3 8.009 3q.31 0 .532.221l7.636 7.643q.242.242.354.54t.111.596t-.111.596t-.354.54L8.535 20.78q-.222.221-.53.218q-.307-.003-.528-.224t-.221-.532t.221-.531z"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OurGoals;
