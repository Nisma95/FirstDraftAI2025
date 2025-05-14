import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircleIcon,
    PencilIcon,
    PlayIcon,
    ArrowLeftIcon,
    ExclamationCircleIcon,
    SparklesIcon,
    DocumentTextIcon,
    ChartBarIcon,
    LightBulbIcon,
    ClockIcon,
    TrophyIcon,
} from "@heroicons/react/24/outline";

export default function Review({
    auth,
    plan,
    questions,
    progress,
    completionScore,
    isReadyForGeneration,
}) {
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [insights, setInsights] = useState({});

    const toggleExpanded = (questionId) => {
        setExpandedQuestion(
            expandedQuestion === questionId ? null : questionId
        );
    };

    const getQuestionTypeIcon = (type) => {
        const icons = {
            business_model: DocumentTextIcon,
            target_market: ChartBarIcon,
            competitive_advantage: TrophyIcon,
            financial_plan: ChartBarIcon,
            marketing_strategy: LightBulbIcon,
            operational_plan: DocumentTextIcon,
            team_structure: ExclamationCircleIcon,
            product_service: DocumentTextIcon,
            revenue_model: ChartBarIcon,
            other: ExclamationCircleIcon,
        };
        return icons[type] || ExclamationCircleIcon;
    };

    const getQuestionTypeName = (type) => {
        const names = {
            business_model: "نموذج العمل",
            target_market: "السوق المستهدف",
            competitive_advantage: "الميزة التنافسية",
            financial_plan: "الخطة المالية",
            marketing_strategy: "استراتيجية التسويق",
            operational_plan: "خطة التشغيل",
            team_structure: "هيكل الفريق",
            product_service: "المنتج أو الخدمة",
            revenue_model: "نموذج الإيرادات",
            other: "أخرى",
        };
        return names[type] || type;
    };

    const calculateAnswerQuality = (answer) => {
        const length = answer.answer_text.length;
        let quality = 0;

        if (length > 0 && length < 20) quality = 20;
        else if (length >= 20 && length < 50) quality = 50;
        else if (length >= 50 && length < 200) quality = 80;
        else if (length >= 200) quality = 100;

        return quality;
    };

    const getQualityColor = (quality) => {
        if (quality >= 80) return "text-green-600 dark:text-green-400";
        if (quality >= 50) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getQualityLabel = (quality) => {
        if (quality >= 80) return "ممتاز";
        if (quality >= 50) return "جيد";
        return "يحتاج تحسين";
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {plan.title} - مراجعة الإجابات
                </h2>
            }
        >
            <Head title={`${plan.title} - Review Answers`} />

            <div className="py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
                        >
                            <CheckCircleIcon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            مراجعة الإجابات النهائية
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            راجع إجاباتك قبل إنشاء خطة العمل النهائية
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {questions.length}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        الأسئلة المجابة
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {completionScore}%
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        نتيجة الإكمال
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${
                                isReadyForGeneration
                                    ? "ring-2 ring-green-500 dark:ring-green-400"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        isReadyForGeneration
                                            ? "bg-green-100 dark:bg-green-900"
                                            : "bg-yellow-100 dark:bg-yellow-900"
                                    }`}
                                >
                                    {isReadyForGeneration ? (
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {isReadyForGeneration
                                            ? "جاهز للتوليد"
                                            : "غير جاهز"}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        حالة الخطة
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Warning if not ready */}
                    {!isReadyForGeneration && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-8"
                        >
                            <div className="flex items-center gap-3">
                                <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <p className="text-yellow-700 dark:text-yellow-300">
                                    يجب الإجابة على الأسئلة المطلوبة التالية قبل
                                    توليد خطة العمل: نموذج العمل، السوق
                                    المستهدف، الميزة التنافسية
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Questions List */}
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const Icon = getQuestionTypeIcon(
                                question.question_type
                            );
                            const isExpanded = expandedQuestion === question.id;
                            const quality = calculateAnswerQuality(
                                question.answer
                            );

                            return (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
                                >
                                    <button
                                        onClick={() =>
                                            toggleExpanded(question.id)
                                        }
                                        className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                                    <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        السؤال {index + 1}:{" "}
                                                        {getQuestionTypeName(
                                                            question.question_type
                                                        )}
                                                    </h3>
                                                    <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {question.question_text}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div
                                                        className={`font-semibold ${getQualityColor(
                                                            quality
                                                        )}`}
                                                    >
                                                        {getQualityLabel(
                                                            quality
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {
                                                            question.answer
                                                                .answer_text
                                                                .length
                                                        }{" "}
                                                        حرف
                                                    </div>
                                                </div>
                                                <motion.div
                                                    animate={{
                                                        rotate: isExpanded
                                                            ? 180
                                                            : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                    }}
                                                >
                                                    <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="p-6">
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                        السؤال:
                                                    </h4>
                                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                        {question.question_text}
                                                    </p>

                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                        إجابتك:
                                                    </h4>
                                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                                            {
                                                                question.answer
                                                                    .answer_text
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                الثقة:{" "}
                                                                {
                                                                    question
                                                                        .answer
                                                                        .confidence_score
                                                                }
                                                                %
                                                            </span>
                                                            <span className="text-gray-600 dark:text-gray-400">
                                                                تم الإنشاء:{" "}
                                                                {new Date(
                                                                    question.answer.created_at
                                                                ).toLocaleDateString(
                                                                    "ar-AE"
                                                                )}
                                                            </span>
                                                        </div>

                                                        <Link
                                                            href={route(
                                                                "plans.questions.answers.edit",
                                                                [
                                                                    plan.id,
                                                                    question.id,
                                                                ]
                                                            )}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                            تعديل
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-12">
                        <Link
                            href={route("plans.ai.start", plan.id)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            العودة للأسئلة
                        </Link>

                        {isReadyForGeneration ? (
                            <Link
                                href={route("plans.ai.generate", plan.id)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                إنشاء خطة العمل
                                <PlayIcon className="w-5 h-5" />
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="bg-gray-400 text-gray-600 px-8 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
                            >
                                <ClockIcon className="w-5 h-5" />
                                إنشاء خطة العمل
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
