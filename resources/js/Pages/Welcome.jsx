// resources/js/Pages/Welcome.jsx
import { Head } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
import Navigation from "../Layouts/Navigation";
import { useTranslation } from "react-i18next";
import Lenis from "@studio-freight/lenis";

import Hero from "./WelcomeComponents/Hero";
import StarBackground from "@/Components/StarBackground";
import ScrollToTop from "@/Components/ScrollToTop";
import Features from "./WelcomeComponents/Features";
import ImgHero from "./WelcomeComponents/ImgHero";
import FAQ from "./WelcomeComponents/FAQ";
import Contact from "./WelcomeComponents/Contact";

import MobileHome from "./MobileHome";

export default function Welcome({ auth }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === "ar";
    const featuresRef = useRef(null);

    useEffect(() => {
        // Set document attributes based on language
        document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", i18n.language);
        document.body.setAttribute("lang", i18n.language);

        // Only enable smooth scrolling on desktop
        const isMobile = window.innerWidth < 640;

        if (!isMobile) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
                direction: "vertical",
                gestureDirection: "vertical",
                smoothTouch: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            return () => lenis.destroy();
        }
    }, [isRTL, i18n.language]);

    return (
        <>
            <Head title={t("First_Draft")} />

            {/* Background Effect */}
            <StarBackground />

            {/* Navigation - always visible */}
            <Navigation auth={auth} />

            {/* Mobile content - visible ONLY on small screens */}
            <div className="sm:hidden">
                <MobileHome />
            </div>

            {/* Desktop and Tablet content - hidden on mobile */}
            <div
                ref={featuresRef}
                className={`hidden sm:block ${
                    isRTL
                        ? "rtl font-arabic text-right"
                        : "ltr font-sans text-left"
                } relative z-10 text-white`}
            >
                {/* Hero */}
                <Hero />

                {/* Features */}
                <Features />

                {/* Image Hero */}
                <ImgHero />

                {/* FAQ Section */}
                <FAQ />

                {/* Contact us */}
                <Contact />

                <div className="mt-20"></div>

                <ScrollToTop />
            </div>
        </>
    );
}
