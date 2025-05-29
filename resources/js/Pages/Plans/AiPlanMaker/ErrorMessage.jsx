import React from "react";
import { useTranslation } from "react-i18next";

export default function ErrorMessage({ error, onDismiss }) {
    const { t } = useTranslation();

    if (!error) return null;

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <svg
                        className="w-6 h-6 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {t("error_occurred", "An error occurred")}
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {error}
                    </p>
                </div>
                {onDismiss && (
                    <div className="flex-shrink-0">
                        <button
                            onClick={onDismiss}
                            className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-200 transition-colors"
                        >
                            <span className="sr-only">
                                {t("dismiss", "Dismiss")}
                            </span>
                            <svg
                                className="w-5 h-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
