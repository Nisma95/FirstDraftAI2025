import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, X, Slash } from "lucide-react";
import { useTranslation } from "react-i18next";

const NavigationButtons = ({
    step,
    canProceed,
    onBack,
    onNext,
    isLastField = false,
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    // Determine which icon to show based on step
    const BackIcon = step === "project" ? X : ChevronLeft;

    // Determine the next button text
    const nextButtonText = isLastField ? t("create_plan_button") : t("next");

    return (
        <div className="flex gap-3 mt-8">
            {/* Back Button - 15% width */}
            <motion.button
                onClick={onBack}
                className="w-[15%] bg-white border border-gray-300 text-black rounded-lg py-3 hover:bg-gray-50 transition-colors"
                whileTap={{ scale: 0.95 }}
                type="button"
            >
                <BackIcon className="w-5 h-5 mx-auto" />
            </motion.button>

            {/* Next Button - 85% width */}
            <motion.button
                onClick={onNext}
                className={`w-[85%] group flex items-center ${
                    isRTL ? "flex-row-reverse" : ""
                } justify-between rounded-lg py-4 px-5 text-lg font-bold transition-all duration-300 relative overflow-hidden ${
                    canProceed
                        ? "Fdbg text-white"
                        : "bg-gray-200 text-gray-800 dark:bg-white dark:text-black"
                }`}
                whileTap={{ scale: 0.95 }}
                type="button"
                disabled={!canProceed}
            >
                <span className="transition-all duration-300 relative z-10">
                    {nextButtonText}
                </span>

                {/* Button background effect */}
                {canProceed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-90 background-animate"></div>
                )}

                <div
                    className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300 relative z-10 ${
                        canProceed
                            ? "bg-black text-white"
                            : "bg-gray-800 text-white dark:bg-black dark:text-white"
                    }`}
                >
                    <Slash
                        size={16}
                        strokeWidth={5}
                        className={`transition-transform duration-300 ${
                            canProceed ? "rotate-[90deg]" : ""
                        }`}
                    />
                </div>
            </motion.button>
        </div>
    );
};

export default NavigationButtons;
