import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    SparklesIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    CogIcon,
    LightBulbIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    TrophyIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function Generate({
    auth,
    plan,
    answeredQuestions,
    totalQuestions,
}) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [error, setError] = useState(null);
    const [results, setResults] = useState(null);

    const generationSteps = [
        {
            id: 1,
            title: "تحليل الإجابات",
            description: "تحليل إجاباتك باستخدام الذكاء الاصطناعي",
            icon: SparklesIcon,
            estimatedTime: "30 ثانية",
        },
        {
            id: 2,
            title: "إنشاء الملخص التنفيذي",
            description: "كتابة ملخص شامل لخطة العمل",
            icon: DocumentTextIcon,
            estimatedTime: "45 ثانية",
        },
        {
            id: 3,
            title: "تحليل السوق",
            description: "تطوير تحليل تفصيلي لسوقك المستهدف",
            icon: ChartBarIcon,
            estimatedTime: "60 ثانية",
        },
        {
            id: 4,
            title: "الخطة المالية",
            description: "إعداد التوقعات والتحليل المالي",
            icon: CurrencyDollarIcon,
            estimatedTime: "45 ثانية",
        },
        {
            id: 5,
            title: "الاقتراحات والتوصيات",
            description: "توليد اقتراحات ذكية لتحسين خطة العمل",
            icon: LightBulbIcon,
            estimatedTime: "30 ثانية",
        },
        {
            id: 6,
            title: "الانتهاء",
            description: "دمج جميع الأقسام وإنهاء خطة العمل",
            icon: TrophyIcon,
            estimatedTime: "15 ثانية",
        },
    ];

    useEffect(() => {
        // Start generation automatically
        startGeneration();
    }, []);

    const startGeneration = async () => {
        setIsGenerating(true);
        setGenerationStep(0);
        setCompletedSteps([]);
        setError(null);

        try {
            // Simulate step-by-step generation
            for (let i = 1; i <= generationSteps.length; i++) {
                setGenerationStep(i);

                // Add random delay to make it feel more natural
                const delay = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
                await new Promise((resolve) => setTimeout(resolve, delay));

                setCompletedSteps((prev) => [...prev, i]);
            }

            // Send actual request to generate the plan
            const response = await fetch(
                route("plans.ai.process-generation", plan.id),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            const result = await response.json();

            if (result.success) {
                setResults(result);
                // Redirect to the plan view after a short delay
                setTimeout(() => {
                    router.visit(result.redirect_url);
                }, 2000);
            } else {
                setError(result.message || "حدث خطأ في توليد خطة العمل");
            }
        } catch (err) {
            console.error("Generation error:", err);
            setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };

    const retryGeneration = () => {
        startGeneration();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {plan.title} - إنشاء خطة العمل
                </h2>
            }
        >
            <Head title={`${plan.title} - Generating Plan`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6"
                        >
                            {error ? (
                                <ExclamationTriangleIcon className="w-12 h-12 text-white" />
                            ) : results ? (
                                <TrophyIcon className="w-12 h-12 text-white" />
                            ) : (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                >
                                    <CogIcon className="w-12 h-12 text-white" />
                                </motion.div>
                            )}
                        </motion.div>

                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            {error
                                ? "حدث خطأ!"
                                : results
                                ? "تم إنشاء خطة العمل بنجاح! 🎉"
                                : "جاري إنشاء خطة العمل..."}
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {error
                                ? error
                                : results
                                ? "يتم توجيهك إلى خطة العمل الجديدة..."
                                : "يرجى الانتظار بينما نقوم بإنشاء خطة عمل شاملة من إجاباتك"}
                        </p>
                    </div>

                    {/* Progress Summary */}
                    {!error && !results && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {answeredQuestions}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        الأسئلة المجابة
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {Math.round(
                                            (answeredQuestions /
                                                totalQuestions) *
                                                100
                                        )}
                                        %
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        نسبة الإكمال
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        6
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        أقسام رئيسية
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generation Steps */}
                    {!error && !results && (
                        <div className="space-y-4">
                            {generationSteps.map((step) => {
                                const isActive = generationStep === step.id;
                                const isCompleted = completedSteps.includes(
                                    step.id
                                );
                                const isPending = generationStep < step.id;

                                return (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: step.id * 0.1 }}
                                        className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 ${
                                            isActive
                                                ? "border-purple-500"
                                                : isCompleted
                                                ? "border-green-500"
                                                : "border-gray-200 dark:border-gray-700"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    isCompleted
                                                        ? "bg-green-500"
                                                        : isActive
                                                        ? "bg-purple-500"
                                                        : "bg-gray-200 dark:bg-gray-700"
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                                ) : (
                                                    <step.icon
                                                        className={`w-6 h-6 ${
                                                            isActive
                                                                ? "text-white"
                                                                : "text-gray-500"
                                                        }`}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3
                                                    className={`text-lg font-semibold ${
                                                        isCompleted
                                                            ? "text-green-600 dark:text-green-400"
                                                            : isActive
                                                            ? "text-purple-600 dark:text-purple-400"
                                                            : "text-gray-700 dark:text-gray-300"
                                                    }`}
                                                >
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                    {step.description}
                                                </p>
                                            </div>

                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {isCompleted ? (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="text-green-600 dark:text-green-400 font-medium"
                                                    >
                                                        ✓ تم
                                                    </motion.div>
                                                ) : isActive ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                        <span>
                                                            {step.estimatedTime}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span>
                                                        {step.estimatedTime}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Success Results */}
                    {results && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8 text-center"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                        {results.completion_score}%
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        نتيجة الإكمال
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {results.sections_generated}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        الأقسام المنشأة
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                        {results.suggestions_count}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        الاقتراحات الذكية
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                className="mt-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircleIcon className="w-5 h-5" />
                                    <span className="font-medium">
                                        جاري التوجيه إلى خطة العمل الخاصة بك...
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 dark:bg-red-900/20 rounded-xl p-8 text-center"
                        >
                            <div className="mb-6">
                                <p className="text-red-700 dark:text-red-300 text-lg mb-4">
                                    {error}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    لا تقلق، يمكنك إعادة المحاولة. إجاباتك
                                    محفوظة بأمان.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <motion.button
                                    onClick={retryGeneration}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    إعادة المحاولة
                                </motion.button>
                                <motion.button
                                    onClick={() =>
                                        router.visit(
                                            route("plans.show", plan.id)
                                        )
                                    }
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                    whileTap={{ scale: 0.98 }}
                                >
                                    العودة للخطة
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
