import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SparklesIcon } from "@heroicons/react/24/outline";

// Define the ExclamationTriangleIcon as a custom component
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

import ProjectSelection from "./AiPlanMaker/ProjectSelection";
import IntroStep from "./AiPlanMaker/IntroStep";
import QuestionsStep from "./AiPlanMaker/QuestionsStep";
import GeneratingStep from "./AiPlanMaker/GeneratingStep";
import ErrorMessage from "./AiPlanMaker/ErrorMessage";
import useAIBusinessPlan from "./AiPlanMaker/useAIBusinessPlan";

export default function AiPlanner({ auth, projects, project_id = null }) {
    const { t } = useTranslation();
    const [step, setStep] = useState("intro");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [results, setResults] = useState(null);

    const {
        data,
        setData,
        handleCreateNewProject,
        startAIConversation,
        submitAnswer,
        generatePlan,
        checkGenerationStatus,
    } = useAIBusinessPlan();

    useEffect(() => {
        if (project_id && projects && projects.length > 0) {
            // Find the project with matching ID
            const projectToSelect = projects.find(
                (p) => p.id === parseInt(project_id, 10)
            );

            if (projectToSelect) {
                console.log("Auto-selecting project:", projectToSelect);
                setSelectedProject(projectToSelect);
            }
        }
    }, [project_id, projects]);
    const handleSelectProject = async (project) => {
        console.log("🚀 Selecting project:", project);
        setSelectedProject(project);
        setIsLoading(true);
        setError(null);

        try {
            console.log("🚀 Starting AI conversation for project:", project);
            const result = await startAIConversation(project);
            console.log("✅ AI conversation result:", result);

            if (result && result.success && result.question) {
                setCurrentQuestion(result.question);
                setQuestionCount(1);
                setStep("questions");
                console.log("✅ Successfully moved to questions step");
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
            console.error("❌ Error starting AI conversation:", error);
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

    const handleSubmitAnswer = async () => {
        if (!data.answer.trim()) {
            setError(t("answer_required", "Please provide an answer"));
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log("📝 Submitting answer:", data.answer);
            console.log("📊 Current question count:", questionCount);

            if (questionCount >= 5) {
                console.log("🏁 Reached 5 questions, generating plan...");
                await handleGeneratePlan();
                return;
            }

            const { result, newAnswer } = await submitAnswer(
                currentQuestion,
                answers,
                selectedProject,
                questionCount
            );

            console.log("✅ Answer submitted, result:", result);
            const updatedAnswers = [...answers, newAnswer];
            setAnswers(updatedAnswers);

            if (result.success) {
                if (result.question && questionCount < 5) {
                    setCurrentQuestion(result.question);
                    setData("answer", "");
                    setQuestionCount((prev) => prev + 1);
                    console.log(
                        "➡️ Moving to next question:",
                        result.question.question
                    );
                } else {
                    console.log("🏁 No more questions, generating plan...");
                    await handleGeneratePlan(updatedAnswers);
                }
            } else {
                const errorMessage =
                    result.message ||
                    t("error_next_question", "Error getting next question");
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("❌ Error submitting answer:", error);
            const errorText =
                t("error_submitting_answer", "Error submitting answer") +
                `: ${error.message}`;
            setError(errorText);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePlan = async (answersToUse = null) => {
        console.log("🔨 Starting plan generation...");
        setStep("generating");
        setError(null);

        try {
            const finalAnswers = answersToUse || answers;
            console.log("📊 Generating plan with answers:", finalAnswers);
            console.log("📊 Selected project:", selectedProject);

            const result = await generatePlan(finalAnswers, selectedProject);
            console.log("✅ Plan generation result:", result);

            if (result.success) {
                setResults(result);
                console.log("🎉 Plan created successfully, redirecting...");

                setTimeout(() => {
                    router.visit(`/plans/${result.plan.id}`, {
                        onSuccess: () => {
                            console.log(
                                "📍 Successfully navigated to plan page"
                            );
                            checkGenerationStatus(result.plan.id);
                        },
                        onError: (errors) => {
                            console.error("❌ Navigation error:", errors);
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
            console.error("❌ Error generating plan:", error);
            setStep("error");
            const errorText =
                t("plan_generation_failed", "Plan generation failed") +
                `: ${error.message}`;
            setError(errorText);
        }
    };

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

            <AnimatePresence>
                {error && (
                    <motion.div
                        className="mx-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                        {t(
                                            "error_occurred",
                                            "An error occurred"
                                        )}
                                    </h3>
                                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                        {error}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() => setError(null)}
                                        className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-200"
                                    >
                                        <span className="sr-only">
                                            {t("dismiss", "Dismiss")}
                                        </span>
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed inset-0 flex items-center justify-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <AnimatePresence mode="wait">
                        {step === "intro" && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="text-center space-y-8"
                            >
                                <div className="space-y-6">
                                    <motion.div
                                        className="flex items-center justify-center gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <motion.div
                                            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                delay: 0.1,
                                                type: "spring",
                                                stiffness: 200,
                                            }}
                                        >
                                            <SparklesIcon className="w-8 h-8 text-white" />
                                        </motion.div>

                                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {t(
                                                "ai_plan_intro_title",
                                                "Let's Create Your Business Plan Together! 🚀"
                                            )}
                                        </h1>
                                    </motion.div>

                                    <motion.p
                                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {t(
                                            "ai_plan_intro_description",
                                            "I'll ask you 5 smart questions about your business plan and create a comprehensive analysis based on your answers."
                                        )}{" "}
                                        {t(
                                            "select_project_to_begin",
                                            "Simply select a project to begin!"
                                        )}
                                    </motion.p>
                                </div>

                                {isLoading && (
                                    <motion.div
                                        className="flex items-center justify-center gap-2 text-purple-600"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                        <span>
                                            {t(
                                                "starting_ai_conversation",
                                                "Starting AI Conversation..."
                                            )}
                                        </span>
                                    </motion.div>
                                )}

                                {!isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <ProjectSelection
                                            projects={projects}
                                            selectedProject={selectedProject}
                                            onSelectProject={
                                                handleSelectProject
                                            }
                                            onCreateNewProject={
                                                handleCreateNewProject
                                            }
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {step === "questions" && currentQuestion && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <QuestionsStep
                                    currentQuestion={currentQuestion}
                                    questionCount={questionCount}
                                    totalQuestions={5}
                                    answer={data.answer}
                                    onAnswerChange={(value) =>
                                        setData("answer", value)
                                    }
                                    onSubmit={handleSubmitAnswer}
                                    isLoading={isLoading}
                                />

                                <div className="flex justify-between items-center pt-6">
                                    <button
                                        onClick={handleReset}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    >
                                        ← {t("start_over", "Start Over")}
                                    </button>

                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t(
                                            "question_progress",
                                            "Question {{current}} of {{total}}",
                                            {
                                                current: questionCount,
                                                total: 5,
                                            }
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

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
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {t(
                                            "analyzing_answers",
                                            "Analyzing your answers and creating your business plan..."
                                        )}
                                    </p>

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
