import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProjectSelectionCard({
    project,
    isSelected,
    onSelect,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 ${
                isSelected
                    ? "bg-Fdbg-hover text-white"
                    : "bg-gray-100 dark:bg-dark-card dark:text-gray-200 hover:bg-Fdbg-hover hover:text-white"
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(project)}
        >
            <div className="group-hover:Fdbg rounded-lg p-4 transition-all duration-300">
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-sm mt-2">
                    {project.description ||
                        t(
                            "project_description_fallback",
                            "Project description"
                        )}
                </p>
                <div className="mt-4">
                    <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                            isSelected
                                ? "bg-white text-purple-600"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                        }`}
                    >
                        {t("project", "Project")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
