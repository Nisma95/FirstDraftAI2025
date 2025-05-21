import React from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function CreateNewProjectCard({ onCreateNew }) {
    const { t } = useTranslation();

    const handleClick = () => {
        console.log("Create new project card clicked");
        onCreateNew();
    };

    return (
        <motion.div
            className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 backdrop-blur-xl bg-white/10 dark:bg-white/10 hover:bg-Fdbg-hover hover:text-white shadow-lg border border-white/20 group h-full"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleClick}
        >
            <div className="rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center h-full">
                {/* Plus Icon */}
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 group-hover:border-white flex items-center justify-center mb-4 transition-all duration-300">
                    <PlusIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-white transition-all duration-300" />
                </div>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white group-hover:text-white mb-2 transition-all duration-300">
                    {t("create_new_project_label", "Create New Project")}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-white transition-all duration-300">
                    {t(
                        "create_new_project_description",
                        "Start a fresh project for your plan"
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
