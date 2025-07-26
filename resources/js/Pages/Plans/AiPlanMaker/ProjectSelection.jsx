// ProjectSelection.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import ProjectSelectionCard from "./ProjectSelectionCard";
import CreateNewProjectCard from "./CreateNewProjectCard";

export default function ProjectSelection({
    projects,
    selectedProject,
    onSelectProject,
    onCreateNewProject,
}) {
    const { t } = useTranslation();

    // If no projects, show helpful message
    if (!projects || projects.length === 0) {
        return (
            <div className="p-5">
                <div className="text-center mb-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t(
                            "no_projects_available",
                            "You don't have any projects yet."
                        )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        {t(
                            "create_first_project",
                            "Create your first project to get started with AI business planning."
                        )}
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <CreateNewProjectCard onCreateNew={onCreateNewProject} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-5">
            {/* Header */}
            <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {selectedProject
                        ? t("confirm_project", "Confirm Project Selection")
                        : t("select_project", "Select a Project")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedProject
                        ? t(
                              "project_preselected",
                              "This project was selected for you"
                          )
                        : t(
                              "project_selection_hint",
                              "Choose an existing project or create a new one"
                          )}
                </p>
            </div>

            {/* Grid layout - Only 2 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Selected Project Card (or first project if none selected) */}
                <div className="h-64">
                    <ProjectSelectionCard
                        project={selectedProject || projects[0]}
                        isSelected={!!selectedProject}
                        onSelect={onSelectProject}
                    />
                </div>

                {/* Create New Project Card */}
                <div className="h-64">
                    <CreateNewProjectCard onCreateNew={onCreateNewProject} />
                </div>
            </div>
        </div>
    );
}
