import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function GeneratingStep() {
    const { t } = useTranslation();

    return (
        <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
        >
            <div className="w-24 h-24 mx-auto">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                    <SparklesIcon className="w-12 h-12 text-white" />
                </motion.div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("creating_business_plan", "Creating Your Business Plan...")}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400">
                {t(
                    "analyzing_answers",
                    "Analyzing your answers and generating a comprehensive business plan based on your selected project."
                )}
            </p>
        </motion.div>
    );
}
