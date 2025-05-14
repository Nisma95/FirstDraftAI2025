import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { ChevronDown } from "lucide-react";

const ImgHero = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const sectionRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        // Animation for the overlay
        gsap.fromTo(
            ".overlay",
            {
                opacity: 0,
            },
            {
                opacity: 0.2,
                duration: 2,
                ease: "sine.inOut",
            }
        );

        // Create parallax scrolling effect
        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            },
        })
            .fromTo(
                sectionRef.current,
                { backgroundPositionY: "-30%" },
                { backgroundPositionY: "0%" },
                0
            )
            .fromTo(
                textRef.current.querySelector("h1"),
                { y: 0 },
                { y: -50 },
                0
            )
            .fromTo(
                textRef.current.querySelector("p"),
                { y: 0 },
                { y: -30 },
                0
            );

        // Add hover effect for the arrow
        const arrowRef = textRef.current.querySelector(".scroll-arrow");
        if (arrowRef) {
            arrowRef.addEventListener("mouseenter", () => {
                gsap.to(arrowRef, {
                    y: 10,
                    duration: 0.8,
                    ease: "back.inOut(3)",
                    overwrite: "auto",
                });
            });

            arrowRef.addEventListener("mouseleave", () => {
                gsap.to(arrowRef, {
                    y: 0,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto",
                });
            });

            arrowRef.addEventListener("click", () => {
                // Scroll down to the next section
                const nextSection = sectionRef.current.nextElementSibling;
                if (nextSection) {
                    gsap.to(window, {
                        scrollTo: nextSection.offsetTop,
                        duration: 1.5,
                        ease: "power1.inOut",
                    });
                } else {
                    // If no next section, scroll down one viewport height
                    gsap.to(window, {
                        scrollTo: window.scrollY + window.innerHeight,
                        duration: 1.5,
                        ease: "power1.inOut",
                    });
                }
            });
        }

        // Clean up
        return () => {
            if (arrowRef) {
                arrowRef.removeEventListener("mouseenter", () => {});
                arrowRef.removeEventListener("mouseleave", () => {});
                arrowRef.removeEventListener("click", () => {});
            }
            // Kill ScrollTrigger instances
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="bg-zoom relative h-screen flex items-center justify-center bg-fixed bg-cover bg-no-repeat"
            style={{
                backgroundImage: "url('/images/riyadh.webp')",
                backgroundPosition: "50% -30%",
            }}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Overlay for contrast */}
            <div className="absolute inset-0 bg-black/20 overlay"></div>

            {/* Text container */}
            <div
                ref={textRef}
                className="relative z-10 text-center px-4 flex flex-col items-center"
            >
                <h1 className="fdHighLighTXT  mb-4" dir="auto">
                    {t("hero_title")}
                </h1>
                <p
                    className="text-4xl md:text-5xl mb-8 text-shadow-lg"
                    dir="auto"
                >
                    {t("hero_subtitle")}
                </p>

                {/* Arrow button using ChevronDown - app CSS will handle RTL rotation */}
                <div className="mt-10 cursor-pointer scroll-arrow">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full"
                        style={{
                            backgroundColor: "rgba(89, 86, 233, 0.1)",
                        }}
                    >
                        <ChevronDown
                            size={36}
                            color="#5a56e9"
                            strokeWidth={2}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImgHero;
