import React from "react";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "./ApplicationLogo";
import LanguageSwitcher from "./Langs/LanguageSwitcher";
import ModeSwitcher from "./Mode/ModeSwitcher";
import AuthIcon from "./AuthIcon"; // Updated import name

export default function TopTools({ hideAuthIcon = false }) {
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
                <LanguageSwitcher />
                <ModeSwitcher />
                {!hideAuthIcon && <AuthIcon />}{" "}
                {/* Conditionally render AuthIcon */}
            </div>
        </>
    );
}
