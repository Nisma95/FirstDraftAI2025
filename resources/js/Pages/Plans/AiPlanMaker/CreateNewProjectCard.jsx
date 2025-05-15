import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CreateNewProjectCard({ onCreateNew }) {
    const { t } = useTranslation();

    return (
        <motion.div
            className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 bg-gray-100 dark:bg-dark-card dark:text-gray-200 hover:bg-Fdbg-hover hover:text-white"
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
        >
            <div className="group-hover:Fdbg rounded-lg p-4 transition-all duration-300">
                <h2 className="text-xl font-semibold">
                    {t("create_new_project_label", "Create New Project")}
                </h2>
                <p className="text-sm mt-2">
                    {t(
                        "create_new_project_description",
                        "Start a fresh project for your business plan"
                    )}
                </p>
                <div className="mt-4">
                    <span className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
                        {t("new_project", "New Project")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
