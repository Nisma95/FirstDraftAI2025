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
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[1200px] bg-white dark:bg-black rounded-full shadow-lg dark:shadow-white/10 z-50 transition-all duration-300 lg:top-4 lg:bottom-auto"
            dir={usePage().props.locale === "ar" ? "rtl" : "ltr"}
        >
            <div className="flex items-center justify-between px-3 py-2">
                {/* Logo */}
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

                {/* Navigation Links */}
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

                {/* Right Section - Desktop only */}
                <div
                    className={`hidden lg:flex items-center ${
                        isRTL ? "space-x-reverse space-x-4" : "space-x-4"
                    }`}
                >
                    <LanguageSwitcher />
                    <ModeSwitcher />
                    <AuthIcon user={auth?.user} />
                </div>

                {/* Mobile/Tablet Right Section */}
                <div
                    className={`flex lg:hidden items-center ${
                        isRTL ? "space-x-reverse space-x-2" : "space-x-2"
                    }`}
                >
                    <LanguageSwitcher />
                    <ModeSwitcher />

                    {/* Mobile Menu Button - Same style as ModeSwitcher */}
                    <div className="relative" ref={mobileMenuRef}>
                        <button
                            onClick={toggleMobileMenu}
                            className="w-12 h-12 rounded-full flex items-center justify-center p-4 mx-2 transition-all duration-300"
                            style={{
                                background:
                                    "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
                                color: "#d4d3d3",
                            }}
                        >
                            {isMobileMenuOpen ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                        {/* Mobile Menu Dropdown */}
                        {isMobileMenuOpen && (
                            <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px] z-50">
                                <nav className="flex flex-col space-y-3">
                                    <Link
                                        href="#"
                                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {t("About")}
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {t("Pricing")}
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {t("Product")}
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {t("Contact")}
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium transition-colors"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        {t("Blog")}
                                    </Link>
                                </nav>

                                {/* Auth section */}
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
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
