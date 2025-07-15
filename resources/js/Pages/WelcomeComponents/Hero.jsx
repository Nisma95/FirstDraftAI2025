// resources/js/Pages/WelcomeComponents/Hero.jsx

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
      {/* Mobile Version - Visible on small screens only */}
      <div
        className="sm:hidden p-6 rounded-lg text-center w-full max-w-sm"
        style={{ textAlign: "center" }}
      >
        <h1 className="relative overflow-hidden">
          <span className="sr-only">{t("welcome")}</span>
          <div className="flex flex-wrap justify-center">
            {words.map((item, index) => (
              <span
                key={index}
                className="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-1 text-lg"
                style={{
                  opacity: animateIn ? 1 : 0,
                  transform: animateIn ? "translateY(0)" : "translateY(80px)", // Reduced translateY for mobile
                  transitionDelay: `${item.delay}ms`,
                  cursor: "default",
                  lineHeight: isRTL ? "1.6" : "1.4", // Adjusted line height for mobile
                  paddingBottom: isRTL ? "0.2em" : "0",
                  marginBottom: isRTL ? "0.1em" : "0",
                }}
                onTouchStart={(e) => {
                  // Mobile touch interaction
                  e.target.style.transform = "translateY(-5px) scale(1.02)"; // Reduced scale for mobile
                  e.target.style.transition = "transform 0.2s ease";
                }}
                onTouchEnd={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.transition = "transform 0.2s ease";
                }}
              >
                {item.word}
              </span>
            ))}
          </div>
        </h1>

        {/* Start Now Button - Mobile Version */}
        <div className="mt-6">
          <a
            href={route("plans.create")}
            target="_blank"
            rel="noopener noreferrer"
            className="fdButton px-6 py-3 inline-flex items-center gap-2 text-sm font-medium"
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(30px)", // Reduced translateY for mobile
              transitionDelay: `${words.length * 200 + 400}ms`, // Faster timing for mobile
              transition: "all 800ms ease-out",
              minHeight: "44px", // Touch-friendly button height
              minWidth: "120px", // Adequate button width for mobile
            }}
          >
            {t("startNow")}

            {/* Single arrow based on language direction */}
            {isRTL ? (
              <svg
                className="w-4 h-4 flex-shrink-0"
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
                className="w-4 h-4 flex-shrink-0"
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

      {/* Desktop Version - Hidden on small screens */}
      <div
        className="hidden sm:block p-12 rounded-lg text-center"
        style={{ textAlign: "center" }} // Ensure text is centered
      >
        <h1 className="relative overflow-hidden">
          <span className="sr-only">{t("welcome")}</span>
          <div className="flex flex-wrap justify-center">
            {words.map((item, index) => (
              <span
                key={index}
                className="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-2 lg:text-2xl xl:text-3xl"
                style={{
                  opacity: animateIn ? 1 : 0, // Full opacity when animated in
                  transform: animateIn ? "translateY(0)" : "translateY(100px)",
                  transitionDelay: `${item.delay}ms`,
                  cursor: "default",
                  lineHeight: isRTL ? "1.6" : "1.2", // Increased line height for RTL languages
                  paddingBottom: isRTL ? "0.2em" : "0", // Add padding bottom for Arabic text
                  marginBottom: isRTL ? "0.1em" : "0", // Add some margin for spacing between words
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-10px) scale(1.05)";
                  e.target.style.transition = "transform 0.3s ease";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0) scale(1)";
                  e.target.style.transition = "transform 0.3s ease";
                }}
              >
                {item.word}
              </span>
            ))}
          </div>
        </h1>

        {/* Start Now Button - Desktop Version */}
        <div className="mt-8">
          <a
            href={route("plans.create")}
            target="_blank"
            rel="noopener noreferrer"
            className="fdButton px-10 inline-flex items-center gap-2"
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(50px)",
              transitionDelay: `${words.length * 200 + 500}ms`, // Appear after all words
              transition: "all 1000ms ease-out",
            }}
          >
            {t("startNow")}

            {/* Single arrow based on language direction */}
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
};

export default Hero;
