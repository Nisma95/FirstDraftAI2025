import React, { useState } from "react";

const ChatToggleButton = ({
    position = "bottom-right",
    size = "medium",
    hasNotification = false,
    onClick,
    theme = "glassmorphism",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
    };

    const sizeClasses = {
        small: "w-12 h-12",
        medium: "w-14 h-14",
        large: "w-16 h-16",
    };

    const iconSizeClasses = {
        small: "w-5 h-5",
        medium: "w-6 h-6",
        large: "w-7 h-7",
    };

    const themeClasses =
        theme === "glassmorphism" ? "glassmorphism chat-toggle-button" : "";

    return (
        <button
            className={`fixed ${positionClasses[position]} ${
                sizeClasses[size]
            } ${themeClasses} ${
                theme === "glassmorphism"
                    ? "text-white rounded-full shadow-2xl transition-all duration-300 focus:outline-none z-50 group"
                    : "bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 z-50 group"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                e.preventDefault();
                console.log("Chat button clicked!");
                if (onClick) {
                    onClick();
                }
            }}
        >
            {/* Notification dot */}
            {hasNotification && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
            )}

            {/* Main icon */}
            <div className="relative w-full h-full flex items-center justify-center">
                <svg
                    className={`${
                        iconSizeClasses[size]
                    } transition-transform duration-300 ${
                        isHovered ? "scale-110" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                </svg>

                {/* Ripple effect */}
                <div
                    className={`absolute inset-0 rounded-full ${
                        theme === "glassmorphism"
                            ? "bg-white opacity-0 group-hover:opacity-5"
                            : "bg-white opacity-0 group-hover:opacity-10"
                    } transition-opacity duration-300`}
                ></div>
            </div>

            {/* Tooltip */}
            <div
                className={`absolute ${
                    position.includes("right")
                        ? "right-full mr-3"
                        : "left-full ml-3"
                } top-1/2 transform -translate-y-1/2 ${
                    theme === "glassmorphism"
                        ? "backdrop-blur-md bg-black/70 text-white"
                        : "bg-gray-900 text-white"
                } text-sm px-3 py-1 rounded-lg whitespace-nowrap opacity-0 ${
                    isHovered ? "opacity-100" : ""
                } transition-opacity duration-200 pointer-events-none`}
            >
                Chat with AI
                <div
                    className={`absolute ${
                        position.includes("right") ? "left-full" : "right-full"
                    } top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-2 border-b-2 border-transparent ${
                        position.includes("right")
                            ? `border-l-2 ${
                                  theme === "glassmorphism"
                                      ? "border-l-black/70"
                                      : "border-l-gray-900"
                              }`
                            : `border-r-2 ${
                                  theme === "glassmorphism"
                                      ? "border-r-black/70"
                                      : "border-r-gray-900"
                              }`
                    }`}
                ></div>
            </div>
        </button>
    );
};

export default ChatToggleButton;
