import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ProjectSelectionCard({
    project,
    isSelected,
    onSelect,
}) {
    const { t } = useTranslation();

    // Function to truncate description to first 4 words
    const truncateDescription = (description) => {
        if (!description) return "";

        const words = description.split(" ");
        if (words.length <= 4) return description;

        return words.slice(0, 4).join(" ") + "...";
    };

    // Determine what text to show in the badge - updated for new status values
    const getBadgeText = () => {
        // Handle both old and new status values
        if (project.status === "new" || project.status === "new_project") {
            return t("projects.new_project_status", "New");
        } else if (
            project.status === "existing" ||
            project.status === "existed_project"
        ) {
            return t("projects.existing_project_status", "Existing");
        } else if (project.status === "launched") {
            return t("projects.launched_status", "Launched");
        } else {
            return t("projects.project_status", "Project");
        }
    };

    // Get badge color based on status
    const getBadgeColor = () => {
        if (project.status === "new" || project.status === "new_project") {
            return isSelected
                ? "bg-white text-green-600"
                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 group-hover:bg-white group-hover:text-green-800";
        } else if (project.status === "launched") {
            return isSelected
                ? "bg-white text-blue-600"
                : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 group-hover:bg-white group-hover:text-blue-800";
        } else {
            return isSelected
                ? "bg-white text-purple-600"
                : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 group-hover:bg-white group-hover:text-purple-800";
        }
    };

    const handleClick = () => {
        console.log("Project card clicked:", project);
        onSelect(project);
    };

    return (
        // Replace the entire motion.div section (around lines 50-90) with this:
        <motion.div
            className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 h-48 flex flex-col justify-center ${
                isSelected
                    ? "Fdbg text-white"
                    : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
            } hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white`}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            <h2 className={`text-xl font-semibold transition-all duration-300`}>
                {project.name}
            </h2>
            <p className={`text-sm mt-2 transition-all duration-300`}>
                {truncateDescription(project.description) ||
                    t(
                        "projects.project_description_fallback",
                        "No description available"
                    )}
            </p>
            <div className="mt-4">
                <span
                    className={`inline-block text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${getBadgeColor()}`}
                >
                    {getBadgeText()}
                </span>
            </div>
        </motion.div>
    );
}
