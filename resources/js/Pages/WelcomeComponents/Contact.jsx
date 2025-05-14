import React, { useState, useEffect, useRef } from "react";
import { Slash } from "lucide-react";
import { useTranslation } from "react-i18next";

const Contact = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const formRef = useRef(null);
    const containerRef = useRef(null);
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        message: "",
    });

    const [activeField, setActiveField] = useState(null);
    const [isSubmitActive, setIsSubmitActive] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [animated, setAnimated] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [stars, setStars] = useState([]);

    // Track mouse position for particle effects - with throttling for performance
    useEffect(() => {
        let timeoutId = null;

        const handleMouseMove = (e) => {
            if (timeoutId) return; // Skip if we're throttling

            timeoutId = setTimeout(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setCursorPosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    });
                }
                timeoutId = null;
            }, 50); // Throttle to 50ms
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    // Generate stars for background effect
    useEffect(() => {
        // Reduce number of stars for better performance
        const newStars = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.5 + 0.3,
            duration: Math.random() * 5 + 3,
        }));

        setStars(newStars);
    }, []);

    // Apply animation on component mount - with simpler transitions
    useEffect(() => {
        if (!animated && formRef.current) {
            const formElements =
                formRef.current.querySelectorAll(".animate-item");

            formElements.forEach((el, index) => {
                el.style.opacity = "0";
                el.style.transform = "translateY(20px)";

                setTimeout(() => {
                    el.style.transition =
                        "opacity 0.5s ease, transform 0.5s ease";
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, 100 + index * 100);
            });

            setAnimated(true);
        }
    }, [animated]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle input focus
    const handleFocus = (field) => {
        setActiveField(field);
        setIsSubmitActive(true);
    };

    // Handle input blur
    const handleBlur = () => {
        setActiveField(null);

        // Keep submit button active if any field has content
        const hasContent = Object.values(formData).some(
            (value) => value.trim() !== ""
        );
        setIsSubmitActive(hasContent);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setSubmitted(true);

        // Reset form after successful submission
        setTimeout(() => {
            setFormData({
                name: "",
                company: "",
                email: "",
                message: "",
            });
            setIsSubmitActive(false);
            setSubmitted(false);
        }, 3000);
    };

    const inputStyles = (fieldName) => ({
        width: "100%",
        backgroundColor: "transparent",
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
        borderBottom:
            activeField === fieldName
                ? "2px solid #5956e9"
                : "1px solid rgba(107, 114, 128, 0.6)",
        paddingBottom: "6px",
        outline: "none",
        color: "currentColor", // Use currentColor to inherit from parent
        boxShadow: "none",
        borderRadius: 0,
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        transition: "all 0.3s ease",
        transform:
            activeField === fieldName ? "translateY(-3px)" : "translateY(0px)",
    });

    return (
        <div
            ref={containerRef}
            className={`w-full min-h-screen text-gray-800 dark:text-white px-4 md:px-8 py-8 relative overflow-hidden transition-colors duration-300 ${
                isRTL ? "rtl" : "ltr"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Background stars - only visible in dark mode */}
            <div className="hidden dark:block">
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            animation: `twinkle ${star.duration}s infinite ease-in-out`,
                        }}
                    />
                ))}
            </div>

            {/* Mouse follow effect - adjusted for both modes */}
            <div
                className="pointer-events-none absolute rounded-full mix-blend-multiply dark:mix-blend-screen opacity-30"
                style={{
                    left: cursorPosition.x,
                    top: cursorPosition.y,
                    width: "150px",
                    height: "150px",
                    background:
                        "radial-gradient(circle, rgba(89,86,233,0.8) 0%, rgba(89,86,233,0) 70%)",
                    transform: "translate(-50%, -50%)",
                    transition: "left 0.2s ease, top 0.2s ease",
                }}
            />

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="w-full max-w-6xl mx-auto relative z-10"
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Hello with Emoji */}
                <div className="flex items-center mb-12 animate-item">
                    <div className="flex items-center overflow-hidden">
                        <h2 className="fdGradientColorzTX text-7xl md:text-8xl lg:text-9xl inline-flex relative">
                            {t("contact.greeting")}
                            <span className="absolute -top-12 text-6xl animate-bounce delay-500 right-0">
                                👋
                            </span>
                        </h2>
                    </div>
                </div>

                {/* Name Field */}
                <div className="mb-10 animate-item overflow-hidden">
                    <div
                        className={`flex flex-col md:flex-row items-baseline relative ${
                            isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                        <label
                            htmlFor="name"
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap mr-4 mb-3 md:mb-0 relative`}
                        >
                            {t("contact.name_label")}
                            {activeField === "name" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                            )}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => handleFocus("name")}
                            onBlur={handleBlur}
                            className="w-full placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder={t("contact.name_placeholder")}
                            style={inputStyles("name")}
                            required
                        />
                    </div>
                </div>

                {/* Company Field */}
                <div className="mb-10 animate-item overflow-hidden">
                    <div
                        className={`flex flex-col md:flex-row items-baseline relative ${
                            isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                        <label
                            htmlFor="company"
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap mr-4 mb-3 md:mb-0 relative`}
                        >
                            {t("contact.company_label")}
                            {activeField === "company" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                            )}
                        </label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            onFocus={() => handleFocus("company")}
                            onBlur={handleBlur}
                            className="w-full placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder={t("contact.company_placeholder")}
                            style={inputStyles("company")}
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="mb-10 animate-item overflow-hidden">
                    <div
                        className={`flex flex-col md:flex-row items-baseline relative ${
                            isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                        <label
                            htmlFor="email"
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap mr-4 mb-3 md:mb-0 relative`}
                        >
                            {t("contact.email_label")}
                            {activeField === "email" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                            )}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFocus("email")}
                            onBlur={handleBlur}
                            className="w-full placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder={t("contact.email_placeholder")}
                            style={inputStyles("email")}
                            required
                        />
                    </div>
                </div>

                {/* Message Field */}
                <div className="mb-12 animate-item overflow-hidden">
                    <div
                        className={`flex flex-col md:flex-row items-baseline relative ${
                            isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                        <label
                            htmlFor="message"
                            className={`text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap mr-4 mb-3 md:mb-0 relative`}
                        >
                            {t("contact.message_label")}
                            {activeField === "message" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                            )}
                        </label>
                        <input
                            type="text"
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => handleFocus("message")}
                            onBlur={handleBlur}
                            className="w-full placeholder-gray-500 dark:placeholder-gray-400"
                            placeholder={t("contact.message_placeholder")}
                            style={inputStyles("message")}
                            required
                        />
                    </div>
                </div>

                {/* Submit Button with dark/light mode aware styling */}
                <div className="mt-10 animate-item">
                    <button
                        type="submit"
                        className={`group flex items-center ${
                            isRTL ? "flex-row-reverse" : ""
                        } justify-between w-full rounded-full py-4 px-5 text-2xl font-bold transition-all duration-300 relative overflow-hidden ${
                            isSubmitActive
                                ? "Fdbg text-white"
                                : "bg-gray-200 text-gray-800 dark:bg-white dark:text-black"
                        }`}
                        style={{ borderRadius: "9999px" }}
                        disabled={submitted}
                    >
                        <span
                            className={`transition-all duration-300 relative z-10 ${
                                submitted ? "animate-pulse" : ""
                            }`}
                        >
                            {submitted
                                ? t("contact.thanks_message")
                                : t("contact.submit_button")}
                        </span>

                        {/* Button background effect */}
                        {isSubmitActive && !submitted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-90 background-animate"></div>
                        )}

                        <div
                            className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300 ${
                                isSubmitActive
                                    ? "bg-black text-white"
                                    : "bg-gray-800 text-white dark:bg-black dark:text-white"
                            }`}
                            style={{ borderRadius: "9999px" }}
                        >
                            <Slash
                                size={16}
                                strokeWidth={5}
                                className={`transition-transform duration-300 ${
                                    isSubmitActive ? "rotate-[90deg]" : ""
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </form>

            <style jsx>{`
                @keyframes twinkle {
                    0%,
                    100% {
                        opacity: 0.2;
                        transform: scale(0.8);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.2);
                    }
                }

                .background-animate {
                    background-size: 400%;
                    animation: gradient 3s ease infinite;
                }

                @keyframes gradient {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                /* Light mode specific styles */
                @media (prefers-color-scheme: light) {
                    input::placeholder {
                        color: rgba(107, 114, 128, 0.8);
                    }
                }

                /* Dark mode specific styles */
                @media (prefers-color-scheme: dark) {
                    input::placeholder {
                        color: rgba(209, 213, 219, 0.8);
                    }
                }

                /* RTL support */
                [dir="rtl"] {
                    direction: rtl;
                }

                [dir="rtl"] input {
                    text-align: right;
                }

                [dir="rtl"] button {
                    text-align: right;
                }

                [dir="ltr"] {
                    direction: ltr;
                }
            `}</style>
        </div>
    );
};

export default Contact;
