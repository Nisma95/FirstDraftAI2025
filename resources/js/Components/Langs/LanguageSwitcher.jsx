import React, { useState, useEffect } from "react";
import i18next from "i18next"; // Ensure you have i18next for translation
import "./LanguageSwitcher.css"; // Import the styles

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("preferredLanguage") || "en"
  );

  useEffect(() => {
    i18next.changeLanguage(language); // Apply translation
    document.documentElement.lang = language; // Set HTML lang attribute
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"; // Set text direction
    localStorage.setItem("preferredLanguage", language); // Save selection
  }, [language]);

  const handleLanguageToggle = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "ar" : "en"));
  };

  return (
    <div
      className="language-switcher"
      style={{ marginRight: language === "ar" ? "15px" : "10px" }}
    >
      <input
        type="checkbox"
        id="language-toggle"
        checked={language === "ar"}
        onChange={handleLanguageToggle}
      />
      <label id="button" htmlFor="language-toggle">
        <div id="knob" className={language}></div>
      </label>
    </div>
  );
};

export default LanguageSwitcher;
