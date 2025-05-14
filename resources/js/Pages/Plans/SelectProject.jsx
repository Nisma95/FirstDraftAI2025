import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

const SelectProject = ({
    projects = [],
    selectedProjectId,
    onSelectProject,
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    // Get the most recent project (assuming projects are sorted or have a date field)
    const lastProject = projects.length > 0 ? projects[0] : null;

    const handleCreateNewProject = () => {
        window.location.href = route("projects.create");
    };

    const handleNewProjectSelection = () => {
        if (onSelectProject) {
            onSelectProject("new"); // Signal that new project was selected
        }
        handleCreateNewProject();
    };

    return (
        <div className="relative w-full">
            {/* Projects Section */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-semibold">
                        {t("choose_project_title")}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("select_project_subtitle")}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Last Created Project Card */}
                    {lastProject && (
                        <motion.div
                            onClick={() => onSelectProject(lastProject.id)}
                            className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300
                                ${
                                    selectedProjectId === lastProject.id
                                        ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                                        : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                                }
                                hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white`}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h2 className="text-xl font-semibold">
                                {lastProject.name || t("unnamed_project")}
                            </h2>
                            <p className="text-sm mt-2">
                                {lastProject.industry ||
                                    lastProject.status ||
                                    t("no_details_available")}
                            </p>
                            <p className="text-xs mt-1 opacity-70">
                                {t("last_created")}
                            </p>
                        </motion.div>
                    )}

                    {/* Create New Project Card */}
                    <motion.div
                        onClick={handleNewProjectSelection}
                        className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300
                            ${
                                selectedProjectId === "new"
                                    ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                                    : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                            }
                            hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white`}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex flex-col items-center">
                            <Plus
                                size={40}
                                className="mb-3 transition-transform duration-300 group-hover:rotate-90"
                            />
                            <h2 className="text-xl font-semibold">
                                {t("create_new_project")}
                            </h2>
                            <p className="text-sm mt-2">
                                {t("start_new_project_description")}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* If no projects exist */}
                {projects.length === 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        <motion.div
                            onClick={handleNewProjectSelection}
                            className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 bg-gray-100 dark:bg-[#111214] dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white"
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="flex flex-col items-center">
                                <Plus
                                    size={40}
                                    className="mb-3 transition-transform duration-300 group-hover:rotate-90"
                                />
                                <h2 className="text-xl font-semibold">
                                    {t("create_first_project")}
                                </h2>
                                <p className="text-sm mt-2">
                                    {t("get_started_description")}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectProject;
