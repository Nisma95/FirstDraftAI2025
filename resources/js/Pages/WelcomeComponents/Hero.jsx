import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Hero = () => {
    const { t, i18n } = useTranslation();
    const [animateIn, setAnimateIn] = useState(false);
    const [words, setWords] = useState([]);

    // Determine text direction based on the current language
    const isRTL = i18n.dir() === "rtl";

    useEffect(() => {
        // Split the welcome text into individual words for animation
        const welcomeText = t("welcome");
        const wordArray = welcomeText.split(" ").map((word, index) => ({
            word,
            delay: index * 200, // Stagger the animation delay for each word
        }));

        setWords(wordArray);

        // Set animation after a small delay for the initial appearance
        const animationTimer = setTimeout(() => {
            setAnimateIn(true);
        }, 300);

        // Clean up timer on unmount
        return () => {
            clearTimeout(animationTimer);
        };
    }, [t]);

    return (
        <section
            className="bg-zoom relative flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 bg-cover bg-no-repeat bg-center"
            style={{
                backgroundImage: "url('/images/firstdraft1bg.jpg')",
                direction: isRTL ? "rtl" : "ltr", // Set text direction dynamically
            }}
        >
            <div
                className="p-12 rounded-lg text-center"
                style={{ textAlign: "center" }} // Ensure text is centered
            >
                <h1 className="relative overflow-hidden">
                    <span className="sr-only">{t("welcome")}</span>
                    <div className="flex flex-wrap justify-center">
                        {words.map((item, index) => (
                            <span
                                key={index}
                                className="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-2"
                                style={{
                                    opacity: animateIn ? 1 : 0, // Full opacity when animated in
                                    transform: animateIn
                                        ? "translateY(0)"
                                        : "translateY(100px)",
                                    transitionDelay: `${item.delay}ms`,
                                    cursor: "default",
                                    lineHeight: isRTL ? "1.6" : "1.2", // Increased line height for RTL languages
                                    paddingBottom: isRTL ? "0.2em" : "0", // Add padding bottom for Arabic text
                                    marginBottom: isRTL ? "0.1em" : "0", // Add some margin for spacing between words
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform =
                                        "translateY(-10px) scale(1.05)";
                                    e.target.style.transition =
                                        "transform 0.3s ease";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform =
                                        "translateY(0) scale(1)";
                                    e.target.style.transition =
                                        "transform 0.3s ease";
                                }}
                            >
                                {item.word}
                            </span>
                        ))}
                    </div>
                </h1>
            </div>
        </section>
    );
};

export default Hero;
