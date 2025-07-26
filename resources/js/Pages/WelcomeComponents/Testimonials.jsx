// resources/js/Pages/WelcomeComponents/Testimonials.jsx
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Testimonials = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const testimonialsRef = useRef(null);

    useEffect(() => {
        // Create animation for testimonial cards
        const cards = gsap.utils.toArray(".testimonial-card");

        cards.forEach((card, index) => {
            gsap.fromTo(
                card,
                {
                    y: 50,
                    opacity: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: testimonialsRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        return () => {
            // Clean up ScrollTrigger instances
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    // Sample testimonial data
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Startup Founder",
            image: "/images/testimonial1.webp",
            quote: "testimonial_quote1",
        },
        {
            id: 2,
            name: "Ahmed Al-Saud",
            role: "Small Business Owner",
            image: "/images/testimonial2.webp",
            quote: "testimonial_quote2",
        },
        {
            id: 3,
            name: "Maria Rodriguez",
            role: "Entrepreneur",
            image: "/images/testimonial3.webp",
            quote: "testimonial_quote3",
        },
    ];

    return (
        <section
            ref={testimonialsRef}
            className="py-16 bg-gray-50 dark:bg-gray-900"
        >
            <div className="container mx-auto px-4">
                <h2 className={`fdGradientColorzTX text-center mb-12`}>
                    {t("testimonials_title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <div
                            key={item.id}
                            className="testimonial-card fdDiveCard p-6 rounded-lg"
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-20 h-20 mb-4 overflow-hidden rounded-full">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src =
                                                "/images/default-avatar.webp";
                                        }}
                                    />
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 italic mb-4 text-center">
                                    "{t(item.quote)}"
                                </p>

                                <h3 className="font-bold text-lg">
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.role}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
