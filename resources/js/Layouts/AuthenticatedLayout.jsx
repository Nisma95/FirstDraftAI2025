import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import StarBackground from "@/Components/StarBackground";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <>
            {/* Star Background Component */}
            <StarBackground />
            <div
                className=""
                dir={usePage().props.locale === "ar" ? "rtl" : "ltr"}
            >
                {/* Page Header */}
                {header && (
                    <header className="bg-white dark:bg-black shadow-sm dark:shadow-gray-800 relative z-10">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main>{children}</main>
            </div>
        </>
    );
}
