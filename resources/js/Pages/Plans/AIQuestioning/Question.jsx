import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChatBubbleLeftRightIcon,
    SparklesIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    QuestionMarkCircleIcon,
    CheckCircleIcon,
    ClockIcon,
    ForwardIcon,
    LightBulbIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function AIQuestion({
    auth,
    plan,
    question,
    progress,
    totalQuestions,
    answeredQuestions,
    previousAnswer,
}) {
    const [isTyping, setIsTyping] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [aiSuggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        answer_text: "",
        structured_data: {},
        confidence: 90,
    });

    // Simulate AI typing effect
    useEffect(() => {
        setIsTyping(true);
        const typingTimer = setTimeout(() => {
            setIsTyping(false);
            setShowQuestion(true);
        }, 1500);

        return () => clearTimeout(typingTimer);
    }, [question.id]);

    // Track word count
    useEffect(() => {
        const words = data.answer_text
            .trim()
            .split(/\s+/)
            .filter((word) => word.length > 0);
        setWordCount(words.length);
    }, [data.answer_text]);

    // Fetch AI suggestions based on answer
    useEffect(() => {
        if (data.answer_text.length > 10) {
            const debounce = setTimeout(() => {
                fetchSuggestions();
            }, 1000);

            return () => clearTimeout(debounce);
        }
    }, [data.answer_text]);

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(
                route("plans.ai.suggestions", plan.id),
                {
                    method: "GET",
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                    },
                }
            );

            if (response.ok) {
                const result = await response.json();
                setSuggestions(result.suggestions || []);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("plans.ai.answer", [plan.id, question.id]));
    };

    const handleSkip = () => {
        if (!question.is_required) {
            post(route("plans.ai.skip", [plan.id, question.id]));
        }
    };

    const applySuggestion = (suggestion) => {
        setData("answer_text", data.answer_text + "\n\n" + suggestion.content);
        setShowSuggestions(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {plan.title} - الأسئلة الذكية
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        السؤال {answeredQuestions + 1} من {totalQuestions}
                    </div>
                </div>
            }
        >
            <Head title={`${plan.title} - Question ${answeredQuestions + 1}`} />

            <div className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>التقدم</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <motion.div
                                className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {/* AI Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        key="typing"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                <SparklesIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        AI يكتب
                                                    </span>
                                                    <div className="flex space-x-1">
                                                        <motion.div
                                                            className="w-2 h-2 bg-purple-500 rounded-full"
                                                            animate={{
                                                                y: [0, -10, 0],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.6,
                                                                delay: 0,
                                                            }}
                                                        />
                                                        <motion.div
                                                            className="w-2 h-2 bg-purple-500 rounded-full"
                                                            animate={{
                                                                y: [0, -10, 0],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.6,
                                                                delay: 0.2,
                                                            }}
                                                        />
                                                        <motion.div
                                                            className="w-2 h-2 bg-purple-500 rounded-full"
                                                            animate={{
                                                                y: [0, -10, 0],
                                                            }}
                                                            transition={{
                                                                repeat: Infinity,
                                                                duration: 0.6,
                                                                delay: 0.4,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Question Display */}
                                {showQuestion && !isTyping && (
                                    <motion.div
                                        key="question"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        className="space-y-6"
                                    >
                                        {/* AI Question Bubble */}
                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                            مساعد AI
                                                        </span>
                                                        {question.is_required && (
                                                            <ExclamationCircleIcon
                                                                className="w-4 h-4 text-red-500"
                                                                title="سؤال مطلوب"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                                                        {question.question_text}
                                                    </p>
                                                    {question.question_context && (
                                                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                            {question
                                                                .question_context
                                                                .description && (
                                                                <p>
                                                                    {
                                                                        question
                                                                            .question_context
                                                                            .description
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answer Form */}
                                        <form
                                            onSubmit={handleSubmit}
                                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                                        >
                                            <div className="space-y-4">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    إجابتك
                                                </label>
                                                <textarea
                                                    value={data.answer_text}
                                                    onChange={(e) =>
                                                        setData(
                                                            "answer_text",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="اكتب إجابتك هنا..."
                                                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                                    autoFocus
                                                />

                                                {errors.answer_text && (
                                                    <p className="text-red-600 dark:text-red-400 text-sm">
                                                        {errors.answer_text}
                                                    </p>
                                                )}

                                                {/* Word Count */}
                                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                    <span>
                                                        {wordCount} كلمة
                                                    </span>
                                                    <span>
                                                        {
                                                            data.answer_text
                                                                .length
                                                        }{" "}
                                                        حرف
                                                    </span>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-4 pt-4">
                                                    <motion.button
                                                        type="submit"
                                                        disabled={
                                                            processing ||
                                                            !data.answer_text.trim()
                                                        }
                                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                    >
                                                        {processing ? (
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                جاري الحفظ...
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-2">
                                                                إرسال الإجابة
                                                                <ArrowRightIcon className="w-4 h-4" />
                                                            </span>
                                                        )}
                                                    </motion.button>

                                                    {!question.is_required && (
                                                        <motion.button
                                                            type="button"
                                                            onClick={handleSkip}
                                                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                            whileTap={{
                                                                scale: 0.98,
                                                            }}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                تخطي
                                                                <ForwardIcon className="w-4 h-4" />
                                                            </span>
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Previous Answer Reference */}
                            {previousAnswer && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                                >
                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                        إجابتك السابقة
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                                        {previousAnswer.answer_text}
                                    </p>
                                </motion.div>
                            )}

                            {/* AI Suggestions */}
                            {showSuggestions && aiSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4"
                                >
                                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                                        <LightBulbIcon className="w-4 h-4" />
                                        اقتراحات ذكية
                                    </h3>
                                    <div className="space-y-2">
                                        {aiSuggestions
                                            .slice(0, 3)
                                            .map((suggestion, index) => (
                                                <motion.button
                                                    key={index}
                                                    onClick={() =>
                                                        applySuggestion(
                                                            suggestion
                                                        )
                                                    }
                                                    className="w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors text-sm border border-purple-200 dark:border-purple-700"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="font-medium text-purple-600 dark:text-purple-400 text-xs block mb-1">
                                                        {suggestion.type}
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300">
                                                        {suggestion.content}
                                                    </span>
                                                </motion.button>
                                            ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Question Type Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
                            >
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                    نوع السؤال
                                </h3>
                                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                                    {question.question_type}
                                </span>
                                {question.is_required ? (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                                        * هذا السؤال مطلوب
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        يمكنك تخطي هذا السؤال
                                    </p>
                                )}
                            </motion.div>

                            {/* Progress Summary */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
                            >
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                    ملخص التقدم
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            الأسئلة المجابة
                                        </span>
                                        <span className="font-medium">
                                            {answeredQuestions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            الأسئلة المتبقية
                                        </span>
                                        <span className="font-medium">
                                            {totalQuestions - answeredQuestions}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            نسبة الإكمال
                                        </span>
                                        <span className="font-medium text-purple-600">
                                            {progress}%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
