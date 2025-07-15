// resources/js/Pages/MobileComponents/MobileHero.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MobileHero = () => {
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
      delay: index * 150, // Slightly faster animation for mobile
    }));

    setWords(wordArray);

    // Set animation after a small delay for the initial appearance
    const animationTimer = setTimeout(() => {
      setAnimateIn(true);
    }, 200);

    // Clean up timer on unmount
    return () => {
      clearTimeout(animationTimer);
    };
  }, [t]);

  return (
    <section
      className="bg-zoom relative flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 bg-cover bg-no-repeat bg-center px-4"
      style={{
        backgroundImage: "url('/images/firstdraft1bg.jpg')",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div
        className="p-6 rounded-lg text-center w-full max-w-sm"
        style={{ textAlign: "center" }}
      >
        <h1 className="relative overflow-hidden">
          <span className="sr-only">{t("welcome")}</span>
          <div className="flex flex-wrap justify-center">
            {words.map((item, index) => (
              <span
                key={index}
                className="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-1 text-lg sm:text-xl"
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

        {/* Start Now Button with Language-Based Arrows - Mobile Optimized */}
        <div className="mt-6">
          <a
            href={route("plans.create")}
            target="_blank"
            rel="noopener noreferrer"
            className="fdButton px-6 py-3 inline-flex items-center gap-2 text-sm font-medium"
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0)" : "translateY(30px)", // Reduced translateY for mobile
              transitionDelay: `${words.length * 150 + 400}ms`, // Faster timing for mobile
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
    </section>
  );
};

export default MobileHero;
