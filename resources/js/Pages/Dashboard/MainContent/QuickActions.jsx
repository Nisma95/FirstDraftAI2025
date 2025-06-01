import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function QuickActions() {
    const { t, i18n } = useTranslation();

    const actions = [
        {
            label: t("quickActions.checkProjects"),
            href: "/projects",
            className:
                "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
            icon: (
                <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
        },
        {
            label: t("quickActions.checkPlans"),
            href: "/plans",
            className:
                "text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300",
            icon: (
                <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            label: t("quickActions.checkSubscription"),
            href: "/subscriptions",
            className:
                "text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300",
            icon: (
                <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div
            className="flex flex-col space-y-4"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            {actions.map((action, index) => (
                <a
                    key={index}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 p-3 rounded-lg
                        backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 
                        hover:bg-white/60 dark:hover:bg-gray-800/60 
                        transition-all duration-300 ease-out
                        hover:shadow-lg hover:scale-105 ${action.className}`}
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">{action.icon}</div>

                    {/* Label */}
                    <span className="font-semibold text-lg sm:text-xl flex-1">
                        {action.label}
                    </span>

                    {/* Arrow - respects RTL/LTR */}
                    <ArrowRight
                        className={`w-4 h-4 transition-all duration-300 ease-out
                             group-hover:scale-110 ${
                                 i18n.language === "ar"
                                     ? "rotate-180 group-hover:-translate-x-1"
                                     : "group-hover:translate-x-1"
                             }`}
                    />
                </a>
            ))}
        </div>
    );
}
