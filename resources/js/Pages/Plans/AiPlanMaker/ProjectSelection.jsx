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

    // Always show exactly 4 cards: 3 projects + 1 create new
    // Take first 3 projects and add the create new card
    const displayProjects = projects.slice(0, 3);

    return (
        <div className="p-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t(
                    "select_project_label",
                    "Select a project for this business plan:"
                )}
            </label>

            {/* Using flex layout for consistent card sizing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First row: 2 project cards */}
                {displayProjects.slice(0, 2).map((project) => (
                    <div key={project.id} className="h-full">
                        <ProjectSelectionCard
                            project={project}
                            isSelected={selectedProject?.id === project.id}
                            onSelect={onSelectProject}
                        />
                    </div>
                ))}

                {/* Second row: 1 project card + 1 create new card */}
                {displayProjects.length > 2 && (
                    <div className="h-full">
                        <ProjectSelectionCard
                            project={displayProjects[2]}
                            isSelected={
                                selectedProject?.id === displayProjects[2].id
                            }
                            onSelect={onSelectProject}
                        />
                    </div>
                )}

                <div className="h-full">
                    <CreateNewProjectCard onCreateNew={onCreateNewProject} />
                </div>
            </div>
        </div>
    );
}
