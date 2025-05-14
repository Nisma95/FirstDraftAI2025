// Components/ProjectCreation/NextButton.jsx
import React from "react";
import { motion } from "framer-motion";
import { Slash } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NextButton({ onNext, canProceed, isLastField, isRTL }) {
    const { t } = useTranslation();

    return (
        <div className="flex gap-3 mt-8 w-full">
            <motion.button
                onClick={onNext}
                className={`w-full group flex items-center ${
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
                    {isLastField ? t("create_project_button") : t("next")}
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
}
