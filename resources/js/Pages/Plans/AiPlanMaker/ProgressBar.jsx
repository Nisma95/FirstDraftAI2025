import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProgressBar({ currentStep, totalSteps }) {
    const { t } = useTranslation();
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="text-center space-y-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t("question_progress", "Question {{current}} of {{total}}", {
                    current: currentStep,
                    total: totalSteps,
                })}
            </p>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden">
                <motion.div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />

                {/* Progress glow effect */}
                <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                />
            </div>

            {/* Step indicators */}
            <div className="flex justify-between items-center">
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index < currentStep
                                ? "bg-purple-600"
                                : index === currentStep - 1
                                ? "bg-purple-400"
                                : "bg-gray-300 dark:bg-gray-600"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
