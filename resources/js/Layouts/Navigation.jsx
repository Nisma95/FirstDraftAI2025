// resources/js/Layouts/Navigation.jsx

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, usePage } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/Components/Langs/LanguageSwitcher";
import ModeSwitcher from "@/Components/Mode/ModeSwitcher";
import AuthIcon from "@/Components/AuthIcon";

export default function Navigation({ auth }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
      w-[95%] max-w-[1200px] bg-white/80 dark:bg-black/80 rounded-full shadow-2xl border-1 border-gray-300 dark:border-gray-600 z-[9999] transition-all duration-300 md:w-[90%] lg:top-6 lg:bottom-auto lg:w-[85%]"
      dir={usePage().props.locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 ">
        {/* Logo */}
        <Link
          href={auth?.user ? route("dashboard") : route("login")}
          className="flex items-center flex-shrink-0"
        >
          <div
            className={`${
              isRTL ? "ml-3" : "mr-3"
            } w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-all duration-200 dark:bg-white border border-1 border-black`}
          >
            <img
              src="/images/FD-logo.png"
              alt="Logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">
            {t("First_Draft")}
          </span>
        </Link>

        {/* Right Section - Desktop/Tablet */}
        <div
          className={`hidden md:flex items-center flex-shrink-0 ${
            isRTL ? "space-x-reverse space-x-4" : "space-x-4"
          }`}
        >
          <LanguageSwitcher />
          <ModeSwitcher />
          <AuthIcon user={auth?.user} />
        </div>

        {/* Mobile Right Section */}
        <div
          className={`flex md:hidden items-center flex-shrink-0 ${
            isRTL ? "space-x-reverse space-x-3" : "space-x-3"
          }`}
        >
          <LanguageSwitcher />
          <ModeSwitcher />

          {/* Mobile Menu Button */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={toggleMobileMenu}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div
                className={`absolute bottom-full mb-4 ${
                  isRTL ? "left-0" : "right-0"
                } bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 min-w-[220px] z-50 border border-gray-200 dark:border-gray-700`}
              >
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("About")}
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Pricing")}
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Product")}
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Contact")}
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Blog")}
                  </Link>
                </nav>

                {/* Auth section */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-center">
                    <AuthIcon user={auth?.user} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
