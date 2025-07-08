// resources/js/Pages/MobileComponents/Head.jsx
import React from "react";
import { Shield, User } from "lucide-react";

export default function Head() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow-md w-full md:hidden">
            {/* Left: User Icon */}
            <div>
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>

            {/* Right: Shield Icon */}
            <div>
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
        </div>
    );
}
