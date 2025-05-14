import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProjectCreationHeader({
    currentStep,
    totalSteps,
    onBack,
    showBackButton = true,
    title,
}) {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <div className="flex justify-between items-center mb-8">
            {/* Back Button - Left side */}
            <div className="w-24">
                {showBackButton && (
                    <motion.button
                        onClick={onBack}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        whileTap={{ scale: 0.95 }}
                        type="button"
                    >
                        {isRTL ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </motion.button>
                )}
            </div>

            {/* Title - Center */}
            <div className="flex-1 text-center">
                {title && (
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {title}
                    </h1>
                )}
            </div>

            {/* Step Numbers - Right side */}
            <div className="w-24 flex justify-end">
                {currentStep && totalSteps && (
                    <span className="fdIcon w-12 h-12 inline-flex items-center justify-center text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                        {currentStep} / {totalSteps}
                    </span>
                )}
            </div>
        </div>
    );
}
