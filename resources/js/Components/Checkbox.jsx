import React from "react";

export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 focus:ring-offset-0 " +
                "dark:border-gray-700 dark:bg-gray-800 dark:checked:bg-indigo-600 dark:focus:ring-indigo-500 " +
                "h-5 w-5 transition duration-150 ease-in-out " +
                className
            }
        />
    );
}
