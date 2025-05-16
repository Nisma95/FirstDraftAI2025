import React from "react";
import { ArrowRight } from "lucide-react";

export default function QuickActions() {
    const actions = [
        {
            label: "Check My Projects List",
            href: "/projects",
            className:
                "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300",
        },
        {
            label: "Check My Plans List",
            href: "/plans",
            className:
                "text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300",
        },
    ];

    return (
        <div className="flex flex-col space-y-4">
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
                    <span className="font-semibold text-lg sm:text-xl">
                        {action.label}
                    </span>
                    <ArrowRight
                        className="w-4 h-4 transition-all duration-300 ease-out 
                            group-hover:translate-x-1 group-hover:scale-110"
                    />
                </a>
            ))}
        </div>
    );
}
