// HorizontalScroll.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HorizontalScroll = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    useEffect(() => {
        // Horizontal scroll animation
        const section_2 = document.getElementById("horizontal");
        let box_items = gsap.utils.toArray(".horizontal__item");

        const horizontalScrollTrigger = gsap.to(box_items, {
            xPercent: (isRTL ? 50 : -50) * (box_items.length - 1),
            ease: "power1.out", // Adding a smooth easing function
            scrollTrigger: {
                trigger: section_2,
                pin: true,
                scrub: 2, // Increased value for smoother scrolling
                markers: false,
                anticipatePin: 1, // Helps prevent jarring pin behavior
                start: "top 20%",
                end: "bottom 20%",
                pinSpacing: true,
                preventOverlaps: true, // Help prevent conflicting animations
                fastScrollEnd: true, // Prevent momentum scrolling from affecting the scroll
            },
        });

        return () => {
            // Clean up ScrollTrigger for this section
            if (horizontalScrollTrigger.scrollTrigger) {
                horizontalScrollTrigger.scrollTrigger.kill();
            }
        };
    }, [isRTL]);

    return (
        <section id="horizontal" dir={isRTL ? "rtl" : "ltr"}>
            <div className="container py-10 mb-20">
                <div className="horizontal__content">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="horizontal__item">
                            <div className="horizontal__text">
                                {/* Text removed */}
                            </div>
                            <img
                                src={`/images/firstDraftApp_bm0${i + 1}.png`}
                                alt={`Card ${i + 1}`}
                                className="horizontal__image"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HorizontalScroll;
