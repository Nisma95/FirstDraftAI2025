import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const LoadingStates = ({ step }) => {
    const { t } = useTranslation();

    if (step === "creating") {
        return (
            <motion.div
                key="creating"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
            >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">
                    {t("creating_plan")}
                </p>
            </motion.div>
        );
    }

    if (step === "success") {
        return (
            <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 150,
                    }}
                    className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
                >
                    <Check className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                    {t("plan_created_successfully")}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                    {t("redirecting_to_plans")}
                </p>
            </motion.div>
        );
    }

    return null;
};

export default LoadingStates;
