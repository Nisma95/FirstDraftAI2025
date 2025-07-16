// resources/js/Layouts/Navigation.jsx

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, usePage } from "@inertiajs/react";
import LanguageSwitcher from "@/Components/Langs/LanguageSwitcher";
import ModeSwitcher from "@/Components/Mode/ModeSwitcher";
import AuthIcon from "@/Components/AuthIcon";

export default function Navigation({ auth }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <>
      {/* Language and Mode Switchers - Fixed in top right for mobile/tablet */}
      <div className="md:hidden fixed top-4 right-4 z-[10000] flex items-center space-x-3 space-x-reverse">
        <LanguageSwitcher />
        <ModeSwitcher />
      </div>

      <header
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
        w-[95%] max-w-[1200px] bg-white/80 dark:bg-black/80 rounded-full shadow-2xl border-1 border-gray-300 dark:border-gray-600 z-[9999] transition-all duration-300 md:w-[90%] lg:top-6 lg:bottom-auto lg:w-[85%]"
        dir={usePage().props.locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
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

          {/* Mobile Right Section - Only Auth Icon */}
          <div className="flex md:hidden items-center flex-shrink-0">
            <AuthIcon user={auth?.user} />
          </div>
        </div>
      </header>
    </>
  );
}
