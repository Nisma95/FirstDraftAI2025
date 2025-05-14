import React from "react";
import { Head } from "@inertiajs/react";
import StarBackground from "@/Components/StarBackground";
import Footer from "@/Layouts/Footer";
import WelcomeSection from "./MainContent/WelcomeSection";
import CreateOptions from "./MainContent/CreateOptions";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            {/* Star Background */}
            <StarBackground />

            <div className="flex min-h-screen">
                {/* Sidebar space for desktop */}
                <div className="">{/* Sidebar goes here */}</div>

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
