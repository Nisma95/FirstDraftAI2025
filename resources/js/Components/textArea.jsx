import React, { useEffect, useRef } from "react";

export default function TextArea({ className = "", children, ...props }) {
    const textArea = useRef();

    useEffect(() => {
        if (textArea.current) {
            textArea.current.focus();

            // Add data attribute to prevent Lenis from handling this element
            textArea.current.setAttribute("data-lenis-prevent", "");

            // Also add the CSS class
            textArea.current.classList.add("lenis-prevent");

            // Additional wheel event handler for extra insurance
            const handleWheel = (event) => {
                // Stop the event from bubbling up to Lenis
                event.stopPropagation();

                // Let the browser handle the textarea scrolling naturally
                // Don't prevent default - we want native scrolling
            };

            // Add event listener with capture to catch the event before Lenis
            textArea.current.addEventListener("wheel", handleWheel, {
                capture: true,
                passive: true,
            });

            // Cleanup
            return () => {
                if (textArea.current) {
                    textArea.current.removeEventListener("wheel", handleWheel, {
                        capture: true,
                    });
                }
            };
        }
    }, []);

    const defaultClasses =
        "w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 lenis-prevent";

    return (
        <textarea
            {...props}
            ref={textArea}
            className={`${defaultClasses} ${className}`}
            data-lenis-prevent=""
            style={{
                resize: "vertical",
                overflowY: "auto",
                overscrollBehavior: "contain",
                ...props.style,
            }}
        />
    );
}
