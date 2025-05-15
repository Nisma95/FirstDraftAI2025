import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Import all components from AiPlanMaker folder
import ProjectSelection from "./AiPlanMaker/ProjectSelection";
import IntroStep from "./AiPlanMaker/IntroStep";
import QuestionsStep from "./AiPlanMaker/QuestionsStep";
import GeneratingStep from "./AiPlanMaker/GeneratingStep";
import ErrorMessage from "./AiPlanMaker/ErrorMessage";
import useAIBusinessPlan from "./AiPlanMaker/useAIBusinessPlan";

export default function AIFirst({ auth, projects }) {
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

            <ErrorMessage error={error} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        {/* Introduction Step */}
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

                        {/* Questions Step */}
                        {step === "questions" && currentQuestion && (
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
                        )}

                        {/* Generating Step */}
                        {step === "generating" && <GeneratingStep />}

                        {/* Error Step */}
                        {step === "error" && (
                            <div className="text-center">
                                <div className="text-red-600 text-lg mb-4">
                                    {t(
                                        "business_plan_generation_error",
                                        "An error occurred during business plan generation"
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setStep("intro");
                                        setError(null);
                                        setSelectedProject(null);
                                        setAnswers([]);
                                        setQuestionCount(0);
                                    }}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
                                >
                                    {t("try_again", "Try Again")}
                                </button>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
