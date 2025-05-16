import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CreateNewProjectCard({ onCreateNew }) {
    const { t } = useTranslation();

    return (
        <motion.div
            className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 backdrop-blur-xl bg-white/10 dark:bg-white/10 hover:bg-Fdbg-hover hover:text-white shadow-lg border border-white/20 group"
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
        >
            <div className="rounded-lg p-4 transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-white">
                    {t("create_new_project_label", "Create New Project")}
                </h2>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-300 group-hover:text-white">
                    {t(
                        "create_new_project_description",
                        "Start a fresh project for your  plan"
                    )}
                </p>
                <div className="mt-4">
                    <span className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 group-hover:bg-white group-hover:text-indigo-800 text-xs font-medium px-3 py-1 rounded-full transition-all duration-300">
                        {t("new_project", "New Project")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
