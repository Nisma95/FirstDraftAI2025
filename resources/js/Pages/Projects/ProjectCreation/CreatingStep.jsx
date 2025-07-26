// Components/ProjectCreation/CreatingStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CreatingStep() {
    const { t } = useTranslation();

    return (
        <motion.div
            key="creating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
                {t("creating_project")}
            </p>
        </motion.div>
    );
}
