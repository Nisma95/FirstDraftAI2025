// Components/ProjectCreation/SuccessStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SuccessStep() {
    const { t } = useTranslation();

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
                {t("project_created_successfully")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
                {t("redirecting_to_projects")}
            </p>
        </motion.div>
    );
}
