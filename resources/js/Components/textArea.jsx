import React, { useEffect, useRef } from "react";

export default function TextArea({ className = "", children, ...props }) {
    const textArea = useRef();

    useEffect(() => {
        if (textArea.current) {
            textArea.current.focus();
        }
    }, []);

    const defaultClasses =
        "w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

    return (
        <textarea
            {...props}
            ref={textArea}
            className={`${defaultClasses} ${className}`}
        />
    );
}
