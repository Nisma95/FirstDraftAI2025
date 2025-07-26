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
        // Replace the entire motion.div section with this:
        <motion.div
            className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 bg-gray-100 dark:bg-[#111214] dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white h-48 flex flex-col justify-center"
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            {/* Icon and Title Together */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-500 hover:border-white flex items-center justify-center transition-all duration-300">
                    <PlusIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-white transition-all duration-300" />
                </div>

                <h2 className="text-xl font-semibold transition-all duration-300">
                    {t("create_new_project_label", "Create New Project")}
                </h2>
            </div>

            <p className="text-sm mt-2 transition-all duration-300">
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
        </motion.div>
    );
}
