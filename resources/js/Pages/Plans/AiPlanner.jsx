import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Import components
import ProjectSelection from "./AiPlanMaker/ProjectSelection";
import IntroStep from "./AiPlanMaker/IntroStep";
import AiQuestionsStep from "./AiPlanMaker/AiQuestionsStep";
import GeneratingStep from "./AiPlanMaker/GeneratingStep";
import ErrorMessage from "./AiPlanMaker/ErrorMessage";
import useAIBusinessPlan from "./AiPlanMaker/useAIBusinessPlan";

// Define the ExclamationTriangleIcon for error step
const ExclamationTriangleIcon = ({ className }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
    </svg>
);

export default function AiPlanner({ auth, projects, project_id = null }) {
    const { t } = useTranslation();

    // State management
    const [step, setStep] = useState("intro");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [results, setResults] = useState(null);

    // Custom hook for AI business plan functionality
    const {
        data,
        setData,
        handleCreateNewProject,
        startAIConversation,
        submitAnswer,
        generatePlan,
        checkGenerationStatus,
    } = useAIBusinessPlan();

    // Auto-select project if project_id is provided
    useEffect(() => {
        if (project_id && projects && projects.length > 0) {
            const projectToSelect = projects.find(
                (p) => p.id === parseInt(project_id, 10)
            );
            if (projectToSelect) {
                setSelectedProject(projectToSelect);
            }
        }
    }, [project_id, projects]);

    // Handle project selection and start AI conversation
    const handleSelectProject = async (project) => {
        setSelectedProject(project);
        setIsLoading(true);
        setError(null);

        try {
            const result = await startAIConversation(project);

            if (result && result.success && result.question) {
                setCurrentQuestion(result.question);
                setQuestionCount(1);
                setStep("questions");
            } else {
                const errorMessage =
                    result?.message ||
                    t(
                        "ai_conversation_failed",
                        "Failed to start AI conversation"
                    );
                throw new Error(errorMessage);
            }
        } catch (error) {
            // More specific error handling
            let errorText;
            if (error.message.includes("404")) {
                errorText = t(
                    "api_endpoint_not_found",
                    "API endpoint not found. Please check your backend configuration."
                );
            } else if (error.message.includes("fetch")) {
                errorText = t(
                    "network_error",
                    "Network error. Please check your internet connection."
                );
            } else {
                errorText =
                    t(
                        "error_starting_conversation",
                        "Error starting conversation"
                    ) + `: ${error.message}`;
            }
            setError(errorText);
            setSelectedProject(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle answer submission
    const handleSubmitAnswer = async () => {
        if (!data.answer.trim()) {
            setError(t("answer_required", "Please provide an answer"));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (questionCount >= 5) {
                await handleGeneratePlan();
                return;
            }

            const { result, newAnswer } = await submitAnswer(
                currentQuestion,
                answers,
                selectedProject,
                questionCount
            );

            const updatedAnswers = [...answers, newAnswer];
            setAnswers(updatedAnswers);

            if (result.success) {
                if (result.question && questionCount < 5) {
                    setCurrentQuestion(result.question);
                    setData("answer", "");
                    setQuestionCount((prev) => prev + 1);
                } else {
                    await handleGeneratePlan(updatedAnswers);
                }
            } else {
                const errorMessage =
                    result.message ||
                    t("error_next_question", "Error getting next question");
                throw new Error(errorMessage);
            }
        } catch (error) {
            const errorText =
                t("error_submitting_answer", "Error submitting answer") +
                `: ${error.message}`;
            setError(errorText);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle plan generation
    const handleGeneratePlan = async (answersToUse = null) => {
        setStep("generating");
        setError(null);

        try {
            const finalAnswers = answersToUse || answers;
            const result = await generatePlan(finalAnswers, selectedProject);

            if (result.success) {
                setResults(result);

                setTimeout(() => {
                    router.visit(`/plans/${result.plan.id}`, {
                        onSuccess: () => {
                            checkGenerationStatus(result.plan.id);
                        },
                        onError: (errors) => {
                            setError("Failed to navigate to plan page");
                        },
                    });
                }, 3000);
            } else {
                const errorMessage =
                    result.message ||
                    t(
                        "error_generating_plan",
                        "Error generating business plan"
                    );
                throw new Error(errorMessage);
            }
        } catch (error) {
            setStep("error");
            const errorText =
                t("plan_generation_failed", "Plan generation failed") +
                `: ${error.message}`;
            setError(errorText);
        }
    };

    // Reset to initial state
    const handleReset = () => {
        setStep("intro");
        setError(null);
        setSelectedProject(null);
        setAnswers([]);
        setQuestionCount(0);
        setCurrentQuestion(null);
        setData("answer", "");
        setResults(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="mb-10">
                <TopTools />
            </div>

            <Head
                title={t(
                    "create_business_plan_ai",
                    "Create Business Plan with AI"
                )}
            />

            {/* Error Display using existing ErrorMessage component */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="mx-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ErrorMessage
                            error={error}
                            onDismiss={() => setError(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content - Fixed for laptop screens */}
            <div className="min-h-screen flex items-center justify-center py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <AnimatePresence mode="wait">
                        {/* Intro Step - Using fixed IntroStep component */}
                        {step === "intro" && (
                            <IntroStep
                                isLoading={isLoading}
                                projectSelection={
                                    <ProjectSelection
                                        projects={projects}
                                        selectedProject={selectedProject}
                                        onSelectProject={handleSelectProject}
                                        onCreateNewProject={
                                            handleCreateNewProject
                                        }
                                    />
                                }
                            />
                        )}

                        {/* Questions Step - Using new AiQuestionsStep component */}
                        {step === "questions" && currentQuestion && (
                            <AiQuestionsStep
                                currentQuestion={currentQuestion}
                                questionCount={questionCount}
                                totalQuestions={5}
                                answer={data.answer}
                                onAnswerChange={(value) =>
                                    setData("answer", value)
                                }
                                onSubmit={handleSubmitAnswer}
                                isLoading={isLoading}
                                onReset={handleReset}
                            />
                        )}

                        {/* Generating Step */}
                        {step === "generating" && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="text-center space-y-8"
                            >
                                <GeneratingStep />

                                <div className="space-y-4">
                                    <div className="max-w-md mx-auto">
                                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <motion.div
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {results && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                                        >
                                            <p className="text-green-800 dark:text-green-200 font-medium">
                                                {t(
                                                    "plan_created_successfully",
                                                    "Plan created successfully!"
                                                )}
                                            </p>
                                            <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                                                {t(
                                                    "redirecting_to_plan",
                                                    "Redirecting to your plan..."
                                                )}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Error Step */}
                        {step === "error" && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                                className="text-center space-y-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
                                >
                                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500" />
                                </motion.div>

                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-red-600 dark:text-red-400">
                                        {t(
                                            "business_plan_generation_error",
                                            "An error occurred during business plan generation"
                                        )}
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {t(
                                            "error_try_again",
                                            "Don't worry, let's try again with a fresh start."
                                        )}
                                    </p>
                                </div>

                                <motion.button
                                    onClick={handleReset}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t("try_again", "Try Again")}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
