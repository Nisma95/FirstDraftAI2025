// FeatureItem.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const FeatureItem = ({ titleKey, descKey }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <div className="vertical__item">
            <h3 className="fdGradientColorzTX text-2xl md:text-4xl" dir="auto">
                {t(titleKey)}
            </h3>
            <p
                className="mt-4 text-lg text-gray-600 dark:text-white"
                dir="auto"
            >
                {t(descKey)}
            </p>

            {/* Start Now Button with Language-Based Arrow */}
            <div className="mt-6">
                <a
                    href={route("plans.create")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fdButton px-10 inline-flex items-center gap-2"
                >
                    {t("startNow")}

                    {/* Single arrow based on language direction */}
                    {isRTL ? (
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </a>
            </div>
        </div>
    );
};

export default FeatureItem;
