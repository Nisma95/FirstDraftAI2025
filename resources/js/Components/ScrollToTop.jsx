import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when user scrolls down 300px
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        // Clean up the event listener
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top using Lenis for ultra-smooth scrolling
    const scrollToTop = () => {
        // Check if lenis is available on the window object
        if (window.lenis) {
            // Use lenis to scroll to top with custom easing
            window.lenis.scrollTo(0, {
                duration: 1.5, // 1.5 seconds for a nice smooth scroll
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
                lock: true, // Prevents user scroll during animation
                lerp: 0.1, // Lower value = smoother but slower
            });
        } else {
            // Fallback to custom smooth scrolling if Lenis isn't initialized
            const currentPosition = window.pageYOffset;
            const duration = Math.max(
                800,
                Math.min(currentPosition / 1.5, 2000)
            );

            const startTime = performance.now();

            function animateScroll(currentTime) {
                const elapsedTime = currentTime - startTime;

                // Smoother easeOutExpo easing function
                const progress = Math.min(elapsedTime / duration, 1);
                const easeProgress =
                    progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

                window.scrollTo(0, currentPosition * (1 - easeProgress));

                if (elapsedTime < duration) {
                    requestAnimationFrame(animateScroll);
                }
            }

            requestAnimationFrame(animateScroll);
        }
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 p-4 rounded-full fdRoundedIcon fdButton hover:fdButton:hover z-50"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} />
                </button>
            )}
        </>
    );
};

export default ScrollToTop;
