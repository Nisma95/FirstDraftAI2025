// resources/js/Layouts/Navigation.jsx

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, usePage } from "@inertiajs/react";
import LanguageSwitcher from "@/Components/Langs/LanguageSwitcher";
import ModeSwitcher from "@/Components/Mode/ModeSwitcher";

export default function Navigation({ auth }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar"; // Only detect Arabic, not other RTL languages

    // Toggle the dropdown menu
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    // Toggle mobile menu
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Close dropdown and mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
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
            className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] bg-white dark:bg-black rounded-full shadow-lg dark:shadow-white/10 z-50 transition-all duration-300"
            dir={usePage().props.locale === "ar" ? "rtl" : "ltr"}
        >
            <div className="flex items-center justify-between px-3 py-2">
                {/* Logo (Left side on mobile) */}
                <Link
                    href={auth?.user ? route("dashboard") : route("login")}
                    className="flex items-center"
                >
                    <div
                        className={`${
                            isRTL ? "ml-2" : "mr-2"
                        } w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full shadow-sm transition-all`}
                    >
                        <img
                            src="/images/FD-logo.png"
                            alt="Logo"
                            className="w-6"
                        />
                    </div>
                    <span className="text-base font-bold text-gray-800 dark:text-gray-200 hidden sm:block">
                        {t("First_Draft")}
                    </span>
                </Link>

                {/* Navigation Links - Only visible on medium screens and above */}
                <nav className="hidden">
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm lg:text-base"
                    >
                        {t("About")}
                    </Link>
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm lg:text-base"
                    >
                        {t("Pricing")}
                    </Link>
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-sm lg:text-base"
                    >
                        {t("Product")}
                    </Link>
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium hidden lg:block"
                    >
                        {t("Contact")}
                    </Link>
                    <Link
                        href="#"
                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium hidden lg:block"
                    >
                        {t("Blog")}
                    </Link>
                </nav>

                {/* Right Section - Only visible on medium screens and above */}
                <div
                    className={`hidden md:flex items-center ${
                        isRTL ? "space-x-reverse space-x-4" : "space-x-4"
                    }`}
                >
                    <LanguageSwitcher />
                    <ModeSwitcher />

                    {/* Removed Auth Button and User Icon */}
                </div>

                {/* Mobile Menu Button - Right side on mobile */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-800 dark:text-gray-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={
                                isMobileMenuOpen
                                    ? "M6 18L18 6M6 6l12 12"
                                    : "M4 6h16M4 12h16M4 18h16"
                            }
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu - Only shows when toggled on small screens */}
            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden bg-white dark:bg-black rounded-2xl mt-2 shadow-lg p-4 absolute left-0 right-0 transition-all duration-300"
                >
                    <nav
                        className={`flex flex-col ${
                            isRTL
                                ? "space-y-reverse space-y-3 rtl-text"
                                : "space-y-3 ltr-text"
                        }`}
                    >
                        <Link
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                        >
                            {t("About")}
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                        >
                            {t("Pricing")}
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                        >
                            {t("Product")}
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                        >
                            {t("Contact")}
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium"
                        >
                            {t("Blog")}
                        </Link>
                    </nav>

                    {/* Auth, Language and Mode Switchers in mobile menu */}
                    <div className="mt-4 space-y-3">
                        <div
                            className={`flex justify-center ${
                                isRTL
                                    ? "space-x-reverse space-x-4"
                                    : "space-x-4"
                            }`}
                        >
                            <LanguageSwitcher />
                            <ModeSwitcher />
                        </div>

                        {/* Removed Auth Section */}
                    </div>
                </div>
            )}
        </header>
    );
}
