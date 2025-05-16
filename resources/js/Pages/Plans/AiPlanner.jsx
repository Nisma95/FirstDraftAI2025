import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SparklesIcon } from "@heroicons/react/24/outline";

// Import all components from AiPlanMaker folder
import ProjectSelection from "./AiPlanMaker/ProjectSelection";
import IntroStep from "./AiPlanMaker/IntroStep";
import QuestionsStep from "./AiPlanMaker/QuestionsStep";
import GeneratingStep from "./AiPlanMaker/GeneratingStep";
import ErrorMessage from "./AiPlanMaker/ErrorMessage";
import useAIBusinessPlan from "./AiPlanMaker/useAIBusinessPlan";

export default function AiPlanner({ auth, projects }) {
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

    // Handle project selection - automatically start conversation
    const handleSelectProject = async (project) => {
        setSelectedProject(project);
        setIsLoading(true);
        setError(null);

        try {
            console.log("🚀 Starting AI conversation for project:", project);
            const result = await startAIConversation(project);
            console.log("✅ AI conversation result:", result);

            if (result.success) {
                setCurrentQuestion(result.question);
                setQuestionCount(1);
                setStep("questions");
            } else {
                throw new Error(
                    result.message ||
                        t(
                            "ai_conversation_failed",
                            "Failed to start AI conversation"
                        )
                );
            }
        } catch (error) {
            console.error("❌ Error starting AI conversation:", error);
            setError(
                t(
                    "error_starting_conversation",
                    "Error starting conversation"
                ) + `: ${error.message}`
            );
            setSelectedProject(null); // Reset selection on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle submitting answer
    const handleSubmitAnswer = async () => {
        if (!data.answer.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            console.log("📝 Submitting answer:", data.answer);

            // Check if we reached 5 questions
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
            setAnswers([...answers, newAnswer]);

            if (result.success) {
                if (result.question && questionCount < 5) {
                    setCurrentQuestion(result.question);
                    setData("answer", "");
                    setQuestionCount((prev) => prev + 1);
                } else {
                    console.log("🏁 No more questions, generating plan...");
                    await handleGeneratePlan();
                }
            } else {
                throw new Error(
                    result.message ||
                        t("error_next_question", "Error getting next question")
                );
            }
        } catch (error) {
            console.error("❌ Error submitting answer:", error);
            setError(
                t("error_submitting_answer", "Error submitting answer") +
                    `: ${error.message}`
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle generating the plan
    const handleGeneratePlan = async () => {
        console.log("🔨 Starting plan generation...");
        setStep("generating");
        setError(null);

        try {
            console.log("📊 Generating plan with answers:", answers);
            console.log("📊 Selected project:", selectedProject);

            const result = await generatePlan(answers, selectedProject);
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
                            alert(
                                t(
                                    "plan_generation_started",
                                    "Business plan generation has started. The page will update when complete."
                                )
                            );
                            checkGenerationStatus(result.plan.id);
                        },
                        onError: (errors) => {
                            console.error("❌ Navigation error:", errors);
                        },
                    });
                }, 2000);
            } else {
                throw new Error(
                    result.message ||
                        t(
                            "error_generating_plan",
                            "Error generating business plan"
                        )
                );
            }
        } catch (error) {
            console.error("❌ Error generating plan:", error);
            setStep("error");
            setError(
                t("plan_generation_failed", "Plan generation failed") +
                    `: ${error.message}`
            );
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Top Right Tools - Mode and Language Switchers */}
            <div className="mb-10">
                <TopTools />
            </div>

            <Head
                title={t(
                    "create_business_plan_ai",
                    "Create Business Plan with AI"
                )}
            />

            {/* Animated Error Message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        className="mx-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-2xl p-6 text-red-100 mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        {/* Introduction Step */}
                        {step === "intro" && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
                            >
                                <div className="flex items-center justify-center space-x-8 mb-8">
                                    <motion.div
                                        className="w-24 h-24 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `linear-gradient(to right, #5956e9, #6077a1)`,
                                        }}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.1,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                    >
                                        <SparklesIcon className="w-12 h-12 text-white" />
                                    </motion.div>

                                    <motion.h1
                                        className="text-5xl font-bold bg-clip-text text-transparent"
                                        style={{
                                            backgroundImage: `linear-gradient(to right, #5956e9, #6077a1, #5956e9)`,
                                        }}
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.3,
                                        }}
                                    >
                                        AI Business Planner
                                    </motion.h1>
                                </div>

                                {/* Modified IntroStep without icon and title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center space-y-8"
                                >
                                    <p className="text-lg text-gray-600 dark:text-white/70 max-w-2xl mx-auto">
                                        I'll ask you 5 smart questions about
                                        your business plan and create a
                                        comprehensive analysis based on your
                                        answers. Simply select a project to
                                        begin!
                                    </p>

                                    {/* Loading state when a project is being processed */}
                                    {isLoading && (
                                        <div
                                            className="flex items-center justify-center gap-2"
                                            style={{ color: "#5956e9" }}
                                        >
                                            <div
                                                className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                                                style={{
                                                    borderColor: "#5956e9",
                                                }}
                                            />
                                            <span>
                                                Starting AI Conversation...
                                            </span>
                                        </div>
                                    )}

                                    {/* Project Selection */}
                                    <ProjectSelection
                                        projects={projects}
                                        selectedProject={selectedProject}
                                        onSelectProject={handleSelectProject}
                                        onCreateNewProject={
                                            handleCreateNewProject
                                        }
                                    />
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Questions Step */}
                        {step === "questions" && currentQuestion && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, rotateY: -90 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: 90 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                }}
                                className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl"
                            >
                                <QuestionsStep
                                    currentQuestion={currentQuestion}
                                    questionCount={questionCount}
                                    answer={data.answer}
                                    onAnswerChange={(value) =>
                                        setData("answer", value)
                                    }
                                    onSubmit={handleSubmitAnswer}
                                    isLoading={isLoading}
                                />
                            </motion.div>
                        )}

                        {/* Generating Step */}
                        {step === "generating" && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="w-24 h-24 mx-auto mb-8"
                                >
                                    <div
                                        className="w-full h-full border-4 border-t-transparent rounded-full"
                                        style={{
                                            borderColor: "#5956e9",
                                            borderTopColor: "transparent",
                                        }}
                                    />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-white mb-4">
                                    Creating Your Business Plan
                                </h2>

                                <motion.p
                                    className="text-white/70 text-lg"
                                    animate={{ opacity: [1, 0.5, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                >
                                    Our AI is analyzing your responses and
                                    generating a comprehensive business plan...
                                </motion.p>

                                <GeneratingStep />
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
                                className="backdrop-blur-xl bg-red-500/10 rounded-3xl p-12 border border-red-500/20 shadow-2xl text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: 0.2,
                                        type: "spring",
                                        stiffness: 200,
                                    }}
                                    className="w-24 h-24 mx-auto mb-8 bg-red-500/20 rounded-full flex items-center justify-center"
                                >
                                    <svg
                                        className="w-12 h-12 text-red-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </motion.div>

                                <h2 className="text-3xl font-bold text-red-300 mb-4">
                                    {t(
                                        "business_plan_generation_error",
                                        "An error occurred during business plan generation"
                                    )}
                                </h2>

                                <p className="text-red-200/70 mb-8">
                                    Don't worry, let's try again with a fresh
                                    start.
                                </p>

                                <motion.button
                                    onClick={() => {
                                        setStep("intro");
                                        setError(null);
                                        setSelectedProject(null);
                                        setAnswers([]);
                                        setQuestionCount(0);
                                    }}
                                    className="text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    style={{
                                        background: `linear-gradient(to right, #5956e9, #6077a1)`,
                                    }}
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
