import React, { useState, useEffect } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    ArrowRightIcon,
    QuestionMarkCircleIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";

export default function AIFirst({ auth, projects }) {
    const [step, setStep] = useState("intro");
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [results, setResults] = useState(null);

    const { data, setData, post, processing } = useForm({
        answer: "",
    });

    // Start the AI conversation
    const startAIConversation = async () => {
        if (!selectedProject) return;

        setIsLoading(true);

        // Use the selected project's description as the business idea
        const businessIdea =
            selectedProject.description ||
            selectedProject.name ||
            "New business project";

        try {
            // Call API to start AI questioning
            const response = await fetch("/api/ai/start-business-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    business_idea: businessIdea,
                    project_id: selectedProject.id,
                    project_name: selectedProject.name,
                    project_description: selectedProject.description,
                }),
            });

            const result = await response.json();

            if (result.success) {
                setCurrentQuestion(result.question);
                setQuestionCount(1);
                setStep("questions");
            }
        } catch (error) {
            console.error("Error starting AI conversation:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Submit answer and get next question
    const submitAnswer = async () => {
        if (!data.answer.trim()) return;

        const newAnswer = {
            question: currentQuestion.question,
            question_type: currentQuestion.type,
            answer: data.answer,
            timestamp: new Date(),
        };

        setAnswers([...answers, newAnswer]);
        setIsLoading(true);

        try {
            // Check if we reached 5 questions
            if (questionCount >= 5) {
                generatePlan();
                return;
            }

            // Send answer to AI and get next question
            const response = await fetch("/api/ai/next-question", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    answer: data.answer,
                    previous_answers: [...answers, newAnswer],
                    business_idea:
                        selectedProject.description ||
                        selectedProject.name ||
                        "New business project",
                    question_count: questionCount,
                }),
            });

            // Check if the response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();

                if (result.success) {
                    if (result.question && questionCount < 5) {
                        setCurrentQuestion(result.question);
                        setData("answer", "");
                        setQuestionCount((prev) => prev + 1);
                    } else {
                        // Generate plan after 5 questions
                        generatePlan();
                    }
                } else {
                    throw new Error(
                        result.message || "حدث خطأ في الحصول على السؤال التالي"
                    );
                }
            } else {
                // Handle HTML response (likely an error page)
                const htmlResponse = await response.text();
                console.error("HTML Error Response:", htmlResponse);

                // Extract error message from HTML if possible
                const titleMatch = htmlResponse.match(
                    /<title>([^<]+)<\/title>/
                );
                const errorTitle = titleMatch ? titleMatch[1] : "خطأ في الخادم";

                throw new Error(
                    `${errorTitle} - الخادم أرجع صفحة خطأ بدلاً من JSON`
                );
            }
        } catch (error) {
            console.error("Error getting next question:", error);
            setError(error.message || "حدث خطأ في الحصول على السؤال التالي");
        } finally {
            setIsLoading(false);
        }
    };

    // Generate the final business plan
    const generatePlan = async () => {
        setStep("generating");

        const businessIdea =
            selectedProject.description ||
            selectedProject.name ||
            "New business project";

        try {
            const response = await fetch("/api/ai/generate-plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({
                    answers: answers,
                    business_idea: businessIdea,
                    project_id: selectedProject.id,
                    project_name: selectedProject.name,
                    project_description: selectedProject.description,
                }),
            });

            // Check if response is JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();

                if (result.success) {
                    setResults(result);

                    setTimeout(() => {
                        router.visit(`/plans/${result.plan.id}`, {
                            onSuccess: () => {
                                alert(
                                    "تم بدء عملية إنشاء خطة العمل. سيتم تحديث الصفحة عند اكتمال العملية."
                                );
                                checkGenerationStatus(result.plan.id);
                            },
                        });
                    }, 2000);
                } else {
                    throw new Error(
                        result.message || "حدث خطأ في إنشاء خطة العمل"
                    );
                }
            } else {
                // Handle non-JSON response
                const textResponse = await response.text();
                console.log("Non-JSON response:", textResponse);
                throw new Error("الخادم لم يعيد استجابة صحيحة");
            }
        } catch (error) {
            console.error("Error generating plan:", error);
            setStep("error");
            setError(error.message || "حدث خطأ في إنشاء خطة العمل");
        }
    };

    // Check generation status
    const checkGenerationStatus = async (planId) => {
        let checking = true;
        let attempts = 0;

        while (checking && attempts < 12) {
            // Limit attempts to prevent infinite loop
            attempts++;

            try {
                const response = await fetch(`/api/plans/${planId}/status`);

                if (!response.ok) {
                    console.error(
                        `Status check failed: ${response.status} ${response.statusText}`
                    );
                    if (attempts < 3) {
                        // Retry a few times for network issues
                        await new Promise((resolve) =>
                            setTimeout(resolve, 5000)
                        );
                        continue;
                    } else {
                        // After a few attempts, stop checking and just reload
                        console.log(
                            "Stopping status checks, will check on page load"
                        );
                        checking = false;
                        break;
                    }
                }

                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();

                    if (result.status === "completed") {
                        // Reload the page to show completed plan
                        window.location.reload();
                        checking = false;
                    } else if (result.status === "failed") {
                        alert(
                            "حدث خطأ في إنشاء خطة العمل. يرجى المحاولة مرة أخرى."
                        );
                        checking = false;
                    } else {
                        // Still generating, wait and check again
                        await new Promise((resolve) =>
                            setTimeout(resolve, 5000)
                        );
                    }
                } else {
                    console.error("Non-JSON response from status endpoint");
                    // Wait longer before next attempt
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                }
            } catch (error) {
                console.error("Error checking status:", error);
                if (attempts < 3) {
                    // Wait before retrying
                    await new Promise((resolve) => setTimeout(resolve, 10000));
                } else {
                    // After several attempts, give up
                    console.log("Giving up on status checks");
                    checking = false;
                }
            }
        }

        if (attempts >= 12) {
            // After maximum attempts, just reload the page
            console.log("Maximum attempts reached, reloading page");
            window.location.reload();
        }
    };

    // Navigate to create new project
    const handleCreateNewProject = () => {
        router.visit("/projects/create");
    };

    // Render input based on question type
    const renderQuestionInput = () => {
        if (!currentQuestion) return null;

        const isNumericQuestion =
            currentQuestion.type === "number" ||
            (currentQuestion.keywords &&
                currentQuestion.keywords.includes("number"));

        if (isNumericQuestion) {
            return (
                <input
                    type="number"
                    value={data.answer}
                    onChange={(e) => setData("answer", e.target.value)}
                    placeholder="أدخل الرقم هنا..."
                    className="w-full h-12 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    autoFocus
                    min="0"
                />
            );
        }

        return (
            <textarea
                value={data.answer}
                onChange={(e) => setData("answer", e.target.value)}
                placeholder="اكتب إجابتك هنا..."
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                autoFocus
            />
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Business Plan with AI" />

            {error && <div className="error-message">{error}</div>}
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        {/* Introduction Step */}
                        {step === "intro" && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <SparklesIcon className="w-12 h-12 text-white" />
                                </div>

                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                    Let's Create Your Business Plan Together! 🚀
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                    I'll ask you 5 smart questions about your
                                    business plan and create a comprehensive
                                    analysis based on your answers.
                                </p>

                                {/* Project Selection */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Select a project for this business plan:
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {projects.map((project) => (
                                            <button
                                                key={project.id}
                                                onClick={() =>
                                                    setSelectedProject(project)
                                                }
                                                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                                    selectedProject?.id ===
                                                    project.id
                                                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                                        : "border-gray-300 dark:border-gray-600 hover:border-purple-300"
                                                }`}
                                            >
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {project.name}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {project.description}
                                                </p>
                                            </button>
                                        ))}

                                        {/* Create New Project Card */}
                                        <button
                                            onClick={handleCreateNewProject}
                                            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center transition-colors hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 group"
                                        >
                                            <div className="flex flex-col items-center justify-center h-full space-y-2">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                                                    <PlusIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h3 className="font-medium text-gray-700 dark:text-gray-300">
                                                    Create New Project
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-500 text-sm">
                                                    Start a fresh project for
                                                    your business plan
                                                </p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={startAIConversation}
                                    disabled={!selectedProject || isLoading}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Starting AI Conversation...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Start AI Conversation
                                            <ArrowRightIcon className="w-5 h-5" />
                                        </span>
                                    )}
                                </button>
                            </motion.div>
                        )}

                        {/* Questions Step */}
                        {step === "questions" && currentQuestion && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Progress */}
                                <div className="text-center">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Question {questionCount} of 5
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${
                                                    (questionCount / 5) * 100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* AI Question */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                            <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                                                AI Assistant
                                            </h3>
                                            <p className="text-gray-800 dark:text-gray-200 text-lg">
                                                {currentQuestion.question}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Answer Input */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your answer:
                                    </label>
                                    {renderQuestionInput()}
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={submitAnswer}
                                        disabled={
                                            !data.answer.trim() || isLoading
                                        }
                                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <>
                                                {questionCount < 5
                                                    ? "Next Question"
                                                    : "Generate Plan"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Generating Step */}
                        {step === "generating" && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 mx-auto">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                                    >
                                        <SparklesIcon className="w-12 h-12 text-white" />
                                    </motion.div>
                                </div>

                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Creating Your Business Plan...
                                </h1>

                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    Analyzing your answers and generating a
                                    comprehensive business plan based on your
                                    selected project.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
