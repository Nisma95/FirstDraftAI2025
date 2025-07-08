// resources/js/Pages/MobileComponents/MobileHero.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MobileHero() {
    const { t, i18n } = useTranslation();
    const [animateIn, setAnimateIn] = useState(false);
    const [words, setWords] = useState([]);

    const isRTL = i18n.dir() === "rtl";

    useEffect(() => {
        const welcomeText = t("welcome");
        const wordArray = welcomeText.split(" ").map((word, index) => ({
            word,
            delay: index * 200,
        }));

        setWords(wordArray);

        const animationTimer = setTimeout(() => {
            setAnimateIn(true);
        }, 300);

        return () => {
            clearTimeout(animationTimer);
        };
    }, [t]);

    return (
        <section
            className="relative flex items-center justify-center bg-gray-100 dark:bg-gray-900 md:hidden h-screen"
            style={{
                direction: isRTL ? "rtl" : "ltr",
            }}
        >
            <div className="p-12 rounded-lg text-center w-full h-full flex flex-col justify-center items-center">
                <h1 className="relative overflow-hidden">
                    <span className="sr-only">{t("welcome")}</span>
                    <div className="flex flex-wrap justify-center">
                        {words.map((item, index) => (
                            <span
                                key={index}
                                className="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-2 text-lg sm:text-xl"
                                style={{
                                    opacity: animateIn ? 1 : 0,
                                    transform: animateIn
                                        ? "translateY(0)"
                                        : "translateY(100px)",
                                    transitionDelay: `${item.delay}ms`,
                                    cursor: "default",
                                    lineHeight: isRTL ? "1.6" : "1.2",
                                    paddingBottom: isRTL ? "0.2em" : "0",
                                    marginBottom: isRTL ? "0.1em" : "0",
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

                <div className="mt-8">
                    <a
                        href={route("plans.create")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fdButton px-10 inline-flex items-center gap-2"
                        style={{
                            opacity: animateIn ? 1 : 0,
                            transform: animateIn
                                ? "translateY(0)"
                                : "translateY(50px)",
                            transitionDelay: `${words.length * 200 + 500}ms`,
                            transition: "all 1000ms ease-out",
                        }}
                    >
                        {t("startNow")}

                        {isRTL ? (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        )}
                    </a>
                </div>
            </div>
        </section>
    );
}
