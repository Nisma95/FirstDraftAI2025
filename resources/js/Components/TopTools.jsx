import React from "react";
import ApplicationLogo from "./ApplicationLogo"; // Assuming ApplicationLogo.jsx is in the same directory or a components folder
import LanguageSwitcher from "./Langs/LanguageSwitcher";
import ModeSwitcher from "./Mode/ModeSwitcher";
export default function TopTools() {
    return (
        <>
            {/* Top Left Logo */}
            <div className="DarkfdIcon fixed top-4 left-4 z-50 ml-5 ">
                <ApplicationLogo style={{ height: "40px" }} />{" "}
                {/* You can adjust the style as needed */}
            </div>

            {/* Top Right Switchers */}
            <div className="fixed top-4 right-4 flex items-center justify-center gap-2 z-50">
                <ModeSwitcher />
                <LanguageSwitcher />
            </div>
        </>
    );
}
