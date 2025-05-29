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

    console.log("ProjectSelection rendering with:", {
        selectedProject: selectedProject
            ? `ID: ${selectedProject.id}, Name: ${selectedProject.name}`
            : "none",
        projects: projects.map((p) => `ID: ${p.id}, Name: ${p.name}`),
    });

    // Always show exactly 4 cards: 3 projects + 1 create new
    // Take first 3 projects and add the create new card
    const displayProjects = projects?.slice(0, 1) || []; // Only take the first (most recent) project

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
                    {t("select_project", "Select a Project")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t(
                        "project_selection_hint",
                        "Choose an existing project or create a new one"
                    )}
                </p>
            </div>

            {/* Grid layout - responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {/* Project cards */}
                {displayProjects.map((project) => (
                    <div key={project.id} className="h-64">
                        <ProjectSelectionCard
                            project={project}
                            isSelected={
                                selectedProject &&
                                selectedProject.id === project.id
                            }
                            onSelect={onSelectProject}
                        />
                    </div>
                ))}

                {/* Create new card */}
                <div className="h-64">
                    <CreateNewProjectCard onCreateNew={onCreateNewProject} />
                </div>
            </div>

            {/* Show count if more than 3 projects */}
            {projects.length > 3 && (
                <div className="text-center mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t(
                            "showing_projects",
                            "Showing 3 of {{total}} projects",
                            {
                                total: projects.length,
                            }
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
