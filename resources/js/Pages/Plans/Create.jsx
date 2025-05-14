import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Plus, X, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import ModeSwitcher from "@/Components/Mode/ModeSwitcher";
import LanguageSwitcher from "@/Components/Langs/LanguageSwitcher";

// Import existing components (keeping those that might be needed)
import LoadingStates from "./LoadingStates";

export default function Create({
    auth,
    projects,
    project_id = null,
    selected_project = null,
}) {
    // ENHANCED DEBUGGING
    console.log("=== CREATE COMPONENT LOADED ===");
    console.log("project_id:", project_id, "type:", typeof project_id);
    console.log("selected_project:", selected_project);
    console.log("projects:", projects);
    console.log("===========================");

    const { t } = useTranslation();
    const [conversationStep, setConversationStep] = useState("welcome");
    const [showWelcome, setShowWelcome] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        project_id: project_id || "",
        title: "",
        summary: "",
    });

    const hasProjects = Array.isArray(projects) && projects.length > 0;

    // IMMEDIATE PROJECT SELECTION BASED ON PROPS
    useEffect(() => {
        console.log("=== IMMEDIATE PROJECT SELECTION ===");

        // Check if we have a selected_project prop directly from Laravel
        if (selected_project) {
            console.log(
                "✅ Using selected_project from Laravel:",
                selected_project
            );
            setSelectedProject(selected_project);
            setData("project_id", selected_project.id);
            return;
        }

        // Otherwise, try to find by project_id
        if (project_id && hasProjects) {
            console.log("🔍 Searching for project by ID");

            // Convert project_id to number for comparison
            const projectIdNum = parseInt(project_id);
            console.log("Looking for project with ID:", projectIdNum);

            // Find the project
            const foundProject = projects.find((p) => {
                const projectId = parseInt(p.id);
                console.log(
                    `Comparing ${projectId} === ${projectIdNum}`,
                    projectId === projectIdNum
                );
                return projectId === projectIdNum;
            });

            if (foundProject) {
                console.log("✅ Found project:", foundProject);
                setSelectedProject(foundProject);
                setData("project_id", foundProject.id);
            } else {
                console.log("❌ No project found with ID:", projectIdNum);
                console.log(
                    "Available projects:",
                    projects.map((p) => ({ id: parseInt(p.id), name: p.name }))
                );
            }
        }
        console.log("================================");
    }, [project_id, selected_project, projects, hasProjects, setData]);

    // Welcome sequence effect
    useEffect(() => {
        if (showWelcome) {
            const welcomeTimer = setTimeout(() => {
                setShowWelcome(false);
                setTimeout(() => {
                    setConversationStep("greeting");
                }, 300);
            }, 2000);
            return () => clearTimeout(welcomeTimer);
        }
    }, [showWelcome]);

    // Auto-transition from greeting to plan name
    useEffect(() => {
        if (conversationStep === "greeting") {
            const greetingTimer = setTimeout(() => {
                setConversationStep("planName");
            }, 3000);
            return () => clearTimeout(greetingTimer);
        }
    }, [conversationStep]);

    // Handle click to dismiss welcome
    const handleWelcomeClick = () => {
        if (showWelcome) {
            setShowWelcome(false);
            setTimeout(() => {
                setConversationStep("greeting");
            }, 300);
        }
    };

    // Handlers
    const handlePlanNameSubmit = () => {
        console.log("=== PLAN NAME SUBMIT ===");
        console.log("selectedProject:", selectedProject);
        console.log("data.title:", data.title);

        if (data.title && data.title.trim()) {
            if (selectedProject) {
                console.log(
                    "✅ Skipping to summary - project already selected"
                );
                setConversationStep("summary");
            } else {
                console.log("🔄 Going to project selection");
                setConversationStep("selectProject");
            }
        }
        console.log("=======================");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && conversationStep === "planName") {
            e.preventDefault();
            handlePlanNameSubmit();
        }
    };

    const handleProjectSelect = (project) => {
        console.log("Manual project selected:", project);
        setData("project_id", project.id);
        setSelectedProject(project);
        setConversationStep("summary");
    };

    const handleSubmit = () => {
        console.log("=== FORM SUBMIT ===");
        console.log("data:", data);
        console.log("selectedProject:", selectedProject);
        console.log("==================");

        setConversationStep("creating");
        post(route("plans.store"), {
            onSuccess: (data) => {
                setConversationStep("success");
            },
            onError: () => {
                setConversationStep("error");
            },
        });
    };

    // Debug current state
    console.log("=== CURRENT STATE ===");
    console.log("conversationStep:", conversationStep);
    console.log("selectedProject:", selectedProject);
    console.log("form data:", data);
    console.log("=====================");

    // No projects state
    if (!hasProjects) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <Head title={t("create_plan")} />
                <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
                    <div className="fixed top-4 right-4 flex items-center justify-center gap-2 z-50">
                        <ModeSwitcher />
                        <LanguageSwitcher />
                    </div>
                    <div className="w-full max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
                        >
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <Info
                                        size={32}
                                        className="text-yellow-600 dark:text-yellow-400"
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                    {t("no_projects_available")}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 mb-8">
                                    {t("create_project_first")}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <motion.button
                                        onClick={() => window.history.back()}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg transition-all duration-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <X size={18} />
                                        {t("cancel")}
                                    </motion.button>
                                    <motion.button
                                        onClick={() =>
                                            (window.location.href =
                                                route("projects.create"))
                                        }
                                        className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Plus
                                            size={18}
                                            className="group-hover:rotate-90 transition-transform duration-300"
                                        />
                                        {t("create_new_project")}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t("create_plan")} />
            <div className="min-h-screen flex items-center justify-center py-12 px-4 relative">
                <div className="fixed top-4 right-4 flex items-center justify-center gap-2 z-50">
                    <ModeSwitcher />
                    <LanguageSwitcher />
                </div>

                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        {/* Welcome Message */}
                        {showWelcome && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1, y: -20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut",
                                }}
                                className="flex items-center justify-center cursor-pointer"
                                onClick={handleWelcomeClick}
                            >
                                <div className="text-center">
                                    <motion.h1
                                        className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                    >
                                        Welcome! 👋
                                    </motion.h1>
                                </div>
                            </motion.div>
                        )}

                        {/* Greeting Step */}
                        {conversationStep === "greeting" && !showWelcome && (
                            <motion.div
                                key="greeting"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeOut",
                                }}
                                className="text-center"
                            >
                                <motion.h2
                                    className="text-4xl font-bold text-gray-800 dark:text-white"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3,
                                        duration: 1,
                                        ease: "easeOut",
                                    }}
                                >
                                    Hello! Let's get the journey started and
                                    create your business plan
                                    {selectedProject &&
                                        ` for ${selectedProject.name}`}
                                    ! 🚀
                                </motion.h2>
                            </motion.div>
                        )}

                        {/* Plan Name Step */}
                        {conversationStep === "planName" && (
                            <motion.div
                                key="planName"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center"
                                    >
                                        What would you like to call your plan
                                        {selectedProject &&
                                            ` for ${selectedProject.name}`}
                                        ?
                                    </motion.h2>
                                    {/* Show selected project info */}
                                    {selectedProject && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                                        >
                                            <p className="text-indigo-800 dark:text-indigo-300 text-center">
                                                <strong>
                                                    ✅ Selected Project:
                                                </strong>{" "}
                                                {selectedProject.name}
                                            </p>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter your business plan name..."
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                                            autoFocus
                                        />
                                        {errors.title && (
                                            <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                                                {errors.title}
                                            </p>
                                        )}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-6 text-center"
                                    >
                                        <button
                                            onClick={handlePlanNameSubmit}
                                            disabled={
                                                !data.title ||
                                                !data.title.trim()
                                            }
                                            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                                        >
                                            Continue
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Select Project Step - Only show if no project selected */}
                        {conversationStep === "selectProject" &&
                            !selectedProject && (
                                <motion.div
                                    key="selectProject"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="max-w-4xl mx-auto"
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                        <motion.h2
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center"
                                        >
                                            Select what this business plan is
                                            for:
                                        </motion.h2>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                        >
                                            {projects.map((project, index) => (
                                                <motion.div
                                                    key={project.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay:
                                                            0.6 + index * 0.1,
                                                    }}
                                                    onClick={() =>
                                                        handleProjectSelect(
                                                            project
                                                        )
                                                    }
                                                    className="group cursor-pointer bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-transparent hover:border-indigo-500 transition-all duration-300 hover:shadow-lg"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                                                {project.name}
                                                            </h3>
                                                            <div className="flex items-center gap-2">
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                        project.status ===
                                                                        "active"
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                                            : project.status ===
                                                                              "paused"
                                                                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                                    }`}
                                                                >
                                                                    {
                                                                        project.status
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                        {/* Summary Step */}
                        {conversationStep === "summary" && (
                            <motion.div
                                key="summary"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-3xl mx-auto"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                                    <motion.h2
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center"
                                    >
                                        Great! Let's add a summary for "
                                        {data.title}"
                                        <br />
                                        <span className="text-indigo-600 dark:text-indigo-400 text-lg">
                                            for your {selectedProject?.name}{" "}
                                            project
                                        </span>
                                    </motion.h2>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <textarea
                                            value={data.summary}
                                            onChange={(e) =>
                                                setData(
                                                    "summary",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Tell us about your business plan... (optional)"
                                            className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                            autoFocus
                                        />
                                        {errors.summary && (
                                            <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                                                {errors.summary}
                                            </p>
                                        )}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-6 flex gap-4 justify-center"
                                    >
                                        <button
                                            onClick={() => {
                                                if (project_id) {
                                                    setConversationStep(
                                                        "planName"
                                                    );
                                                } else {
                                                    setConversationStep(
                                                        "selectProject"
                                                    );
                                                }
                                            }}
                                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                                        >
                                            Create Business Plan
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {/* Loading and other states */}
                        {(conversationStep === "creating" ||
                            conversationStep === "success" ||
                            conversationStep === "error") && (
                            <LoadingStates
                                step={
                                    conversationStep === "creating"
                                        ? "creating"
                                        : conversationStep
                                }
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
