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
            className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 group ${
                isSelected
                    ? "bg-Fdbg-hover text-white"
                    : "backdrop-blur-xl bg-white/10 dark:bg-white/10 hover:bg-Fdbg-hover hover:text-white border border-white/20"
            } shadow-lg`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(project)}
        >
            <div className="rounded-lg p-4 transition-all duration-300">
                <h2
                    className={`text-xl font-semibold transition-all duration-300 ${
                        isSelected
                            ? "text-white"
                            : "text-gray-800 dark:text-white group-hover:text-white"
                    }`}
                >
                    {project.name}
                </h2>
                <p
                    className={`text-sm mt-2 transition-all duration-300 ${
                        isSelected
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300 group-hover:text-white"
                    }`}
                >
                    {project.description ||
                        t(
                            "project_description_fallback",
                            "Project description"
                        )}
                </p>
                <div className="mt-4">
                    <span
                        className={`inline-block text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                            isSelected
                                ? "bg-white text-purple-600"
                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 group-hover:bg-white group-hover:text-purple-800"
                        }`}
                    >
                        {t("project", "Project")}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
