import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const faqRef = useRef(null);
    const titleRef = useRef(null);
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    // Get FAQ data from translations
    const faqs = [
        {
            question: t("faq.questions.q1"),
            answer: t("faq.answers.a1"),
        },
        {
            question: t("faq.questions.q2"),
            answer: t("faq.answers.a2"),
        },
        {
            question: t("faq.questions.q3"),
            answer: t("faq.answers.a3"),
        },
        {
            question: t("faq.questions.q4"),
            answer: t("faq.answers.a4"),
        },
        {
            question: t("faq.questions.q5"),
            answer: t("faq.answers.a5"),
        },
        {
            question: t("faq.questions.q6"),
            answer: t("faq.answers.a6"),
        },
        {
            question: t("faq.questions.q7"),
            answer: t("faq.answers.a7"),
        },
        {
            question: t("faq.questions.q8"),
            answer: t("faq.answers.a8"),
        },
        {
            question: t("faq.questions.q9"),
            answer: t("faq.answers.a9"),
        },
        {
            question: t("faq.questions.q10"),
            answer: t("faq.answers.a10"),
        },
    ];

    // Initialize animations with Intersection Observer instead of GSAP
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (faqRef.current) {
            observer.observe(faqRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    // State to track open accordion items
    const [openIndex, setOpenIndex] = useState(null);

    // Toggle accordion
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            ref={faqRef}
            className="py-20 relative overflow-hidden"
            id="faq"
        >
            {/* Animated background particles */}
            <div className="absolute w-full h-full top-0 left-0 overflow-hidden opacity-20 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-indigo-500 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${8 + Math.random() * 10}s`,
                        }}
                    ></div>
                ))}
            </div>

            <div className="container mx-auto px-4 relative">
                {/* Main Content */}
                <div className="w-full max-w-6xl mx-auto relative">
                    {/* New layout with vertical title on the sides */}
                    <div className="flex flex-col md:flex-row">
                        {/* Title - Positioned to left in LTR or right in RTL */}
                        <div
                            ref={titleRef}
                            className={`md:w-[15%] flex items-center ${
                                isRTL
                                    ? "md:order-last justify-end"
                                    : "md:order-first justify-start"
                            } my-12 md:my-0 relative transition-all duration-1000 ${
                                isVisible
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-50"
                            }`}
                        >
                            <div className="absolute -z-10 w-full h-full opacity-30 blur-2xl bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-900 dark:to-purple-900 rounded-full"></div>
                            <h2
                                className={`fdGradientColorzTX writing-mode-vertical-rl transform ${
                                    isRTL ? "" : "rotate-180"
                                } text-5xl md:text-[5rem]`}
                            >
                                {t("faq_title")}
                            </h2>
                        </div>

                        {/* Questions content */}
                        <div className={`md:w-[85%] flex flex-col md:flex-row`}>
                            {/* Left column questions */}
                            <div
                                ref={leftColumnRef}
                                className={`md:w-1/2 md:pr-4 rtl:md:pr-0 rtl:md:pl-4 transition-all duration-700 ${
                                    isVisible
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 -translate-x-10"
                                }`}
                            >
                                {faqs.slice(0, 5).map((faq, index) => (
                                    <div
                                        key={`left-${index}`}
                                        className={`border-b border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600`}
                                        style={{
                                            transitionDelay: isVisible
                                                ? `${index * 150}ms`
                                                : "0ms",
                                        }}
                                    >
                                        <button
                                            className={`w-full py-4 flex items-center justify-between ${
                                                isRTL
                                                    ? "text-right"
                                                    : "text-left"
                                            } transition-colors`}
                                            onClick={() =>
                                                toggleAccordion(index)
                                            }
                                        >
                                            <span className="p-2 font-medium text-base text-gray-800 dark:text-gray-200 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                {faq.question}
                                            </span>
                                            <div
                                                className={`flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center transition-all duration-500 ${
                                                    openIndex === index
                                                        ? "rotate-180 bg-indigo-200 dark:bg-indigo-800"
                                                        : ""
                                                }`}
                                            >
                                                <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                openIndex === index
                                                    ? "max-h-40 opacity-100 pb-3"
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <p
                                                className={`text-gray-600 dark:text-gray-300 text-sm ${
                                                    isRTL
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}
                                            >
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Right column questions */}
                            <div
                                ref={rightColumnRef}
                                className={`md:w-1/2 md:pl-4 rtl:md:pl-0 rtl:md:pr-4 transition-all duration-700 ${
                                    isVisible
                                        ? "opacity-100 translate-x-0"
                                        : "opacity-0 translate-x-10"
                                }`}
                            >
                                {faqs.slice(5, 10).map((faq, index) => (
                                    <div
                                        key={`right-${index}`}
                                        className={`border-b border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-600`}
                                        style={{
                                            transitionDelay: isVisible
                                                ? `${index * 150}ms`
                                                : "0ms",
                                        }}
                                    >
                                        <button
                                            className={`w-full py-4 flex items-center justify-between ${
                                                isRTL
                                                    ? "text-right"
                                                    : "text-left"
                                            } transition-colors`}
                                            onClick={() =>
                                                toggleAccordion(index + 5)
                                            }
                                        >
                                            <span className="p-2 font-medium text-base text-gray-800 dark:text-gray-200 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                                {faq.question}
                                            </span>
                                            <div
                                                className={`flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center transition-all duration-500 ${
                                                    openIndex === index + 5
                                                        ? "rotate-180 bg-indigo-200 dark:bg-indigo-800"
                                                        : ""
                                                }`}
                                            >
                                                <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                openIndex === index + 5
                                                    ? "max-h-40 opacity-100 pb-3"
                                                    : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <p
                                                className={`text-gray-600 dark:text-gray-300 text-sm ${
                                                    isRTL
                                                        ? "text-right"
                                                        : "text-left"
                                                }`}
                                            >
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) translateX(0);
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                    }
                    50% {
                        transform: translateY(0) translateX(20px);
                    }
                    75% {
                        transform: translateY(20px) translateX(10px);
                    }
                    100% {
                        transform: translateY(0) translateX(0);
                    }
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .writing-mode-vertical-rl {
                    writing-mode: vertical-rl;
                }
            `}</style>
        </section>
    );
};

export default FAQ;
