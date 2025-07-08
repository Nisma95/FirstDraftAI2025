// resources/js/Pages/MobileHome.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import StarBackground from "@/Components/StarBackground";
import Head from "@/Pages/MobileComponents/Head";

import MobileHero from "@/Pages/MobileComponents/MobileHero";

export default function MobileHome() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <StarBackground />

            {/* Page Content (pushed down so it's not under the header) */}
            <div className="">
                <MobileHero />
                {/* other mobile content... */}
            </div>
        </div>
    );
}
