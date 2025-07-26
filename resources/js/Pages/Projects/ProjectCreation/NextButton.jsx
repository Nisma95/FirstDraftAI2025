import React from "react";
import { motion } from "framer-motion";
import { Slash } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NextButton({ onNext, canProceed, isLastField, isRTL }) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-3 mt-6 sm:mt-8 w-full px-1">
            {" "}
            {/* Responsive margin + padding */}
            <motion.button
                onClick={onNext}
                className={`w-full group flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                } justify-between rounded-lg py-3 sm:py-4 px-4 sm:px-5 text-base sm:text-lg font-bold transition-all duration-300 relative overflow-hidden min-h-[52px] sm:min-h-[60px] touch-manipulation ${
                    canProceed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 dark:bg-white dark:text-black"
                }`}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled={!canProceed}
            >
                <span className="transition-all duration-300 relative z-10 leading-tight">
                    {isLastField ? t("create_project_button") : t("next")}
                </span>

                {/* Button background effect */}
                {canProceed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-90 background-animate"></div>
                )}

                <div
                    className={`flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-lg transition-all duration-300 relative z-10 ${
                        canProceed
                            ? "bg-black text-white"
                            : "bg-gray-800 text-white dark:bg-black dark:text-white"
                    }`}
                >
                    <Slash
                        size={14}
                        strokeWidth={5}
                        className={`sm:w-4 sm:h-4 transition-transform duration-300 ${
                            canProceed ? "rotate-[90deg]" : ""
                        }`}
                    />
                </div>
            </motion.button>
        </div>
    );
}
