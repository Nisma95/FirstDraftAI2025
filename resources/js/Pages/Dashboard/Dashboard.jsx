import React from "react";
import { Head } from "@inertiajs/react";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import Footer from "@/Layouts/Footer";
import WelcomeSection from "./MainContent/WelcomeSection";
import CreateOptions from "./MainContent/CreateOptions";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            {/* Star Background */}
            <StarBackground />

            {/* Enhanced gradient overlay that works with both light and dark modes */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Light mode overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:hidden" />

                {/* Dark mode overlay */}
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/15 to-indigo-950/25" />

                {/* Subtle animated gradients */}
                <div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "4s" }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-violet-500/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "6s", animationDelay: "2s" }}
                />
            </div>

            <div className="flex min-h-screen relative z-10">
                {/* Top Right Tools - Mode and Language Switchers */}
                <div>
                    <TopTools />
                </div>

                {/* Main content */}
                <div className="flex-1 w-full p-10">
                    <div className="py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-10">
                        {/* Welcome Section */}
                        <WelcomeSection />
                    </div>
                    <div className="m-10">
                        <CreateOptions />
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </>
    );
}
