import React from "react";
import { Link } from "@inertiajs/react"; // Use Inertia's Link component
import ApplicationLogo from "./ApplicationLogo"; // Assuming ApplicationLogo.jsx is in the same directory or a components folder
import LanguageSwitcher from "./Langs/LanguageSwitcher";
import ModeSwitcher from "./Mode/ModeSwitcher";

export default function TopTools() {
    return (
        <>
            {/* Top Left Logo */}
            <div className="DarkfdIcon fixed top-4 left-4 z-50 ml-5 ">
                <Link href={route("dashboard")} className="cursor-pointer">
                    <ApplicationLogo style={{ height: "40px" }} />
                </Link>
            </div>

            {/* Top Right Switchers */}
            <div className="fixed top-4 right-4 flex items-center justify-center gap-2 z-50">
                <ModeSwitcher />
                <LanguageSwitcher />
            </div>
        </>
    );
}
