// resources/js/Pages/Dashboard.tsx
import React from "react";
import { Head } from "@inertiajs/react";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import Footer from "@/Layouts/Footer";
import WelcomeSection from "./MainContent/WelcomeSection";
import CreateOptions from "./MainContent/CreateOptions";
import ContractCreation from "./MainContent/ContractCreation";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            {/* Star Background */}
            <StarBackground />

            {/* Enhanced gradient overlay that works with both light and dark modes */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Light mode overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:hidden md:block hidden" />
                <div className="absolute inset-0 bg-gradient-mobile md:hidden dark:hidden" />

                {/* Dark mode overlay */}
                <div className="hidden dark:md:block absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/15 to-indigo-950/25" />
                <div className="dark:block dark:md:hidden absolute inset-0 bg-gradient-to-br from-blue-950/10 via-purple-950/5 to-indigo-950/10" />

                {/* Subtle animated gradients - hidden on mobile for performance */}
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse mobile-hide-animation hidden md:block"
                    style={{ animationDuration: "4s" }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-violet-500/10 rounded-full blur-3xl animate-pulse mobile-hide-animation hidden md:block"
                    style={{ animationDuration: "6s", animationDelay: "2s" }}
                />
            </div>

            <div className="flex min-h-screen relative z-10 dashboard-main">
                {/* Top Right Tools - Mode and Language Switchers */}
                <div className="mobile-touch-target">
                    <TopTools />
                </div>

                {/* Main content */}
                <div className="flex-1 w-full dashboard-content p-4 md:p-10">
                    <div className="dashboard-section pt-16 md:pt-20 lg:pt-24 py-2 sm:py-4 lg:py-8 px-2 sm:px-4 lg:px-10 sm-padding mobile-text-adjust">
                        {/* Welcome Section */}
                        <WelcomeSection />
                    </div>
                    <div className="dashboard-section m-4 md:m-10 sm-margin mobile-card-spacing">
                        <CreateOptions />
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </>
    );
}
