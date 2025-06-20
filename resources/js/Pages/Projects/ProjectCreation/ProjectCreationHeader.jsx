// ProjectCreationHeader.jsx
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

    const appIconStyle = {
        background: "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
        color: "#d4d3d3",
    };

    return (
        <div className="flex justify-between items-center mb-4 sm:mb-8 px-1">
            {/* Back Button - Left side */}
            <div className="w-16 sm:w-24">
                {showBackButton && (
                    <motion.button
                        onClick={onBack}
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
                        style={appIconStyle}
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
            <div className="flex-1 text-center px-2 sm:px-4">
                {title && (
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
                        {title}
                    </h1>
                )}
            </div>

            {/* Step Numbers - Right side */}
            <div className="w-16 sm:w-24 flex justify-end">
                {currentStep && totalSteps && (
                    <span
                        className="w-12 h-12 rounded-full inline-flex items-center justify-center text-sm font-medium transition-all duration-300"
                        style={appIconStyle}
                    >
                        {currentStep} / {totalSteps}
                    </span>
                )}
            </div>
        </div>
    );
}
