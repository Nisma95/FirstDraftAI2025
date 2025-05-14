import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    QuestionMarkCircleIcon,
    ArrowRightIcon,
    LightBulbIcon,
} from "@heroicons/react/24/outline";

export default function AIQuestioningStart({
    auth,
    plan,
    question,
    progress,
    totalQuestions,
}) {
    const [isReady, setIsReady] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

    useEffect(() => {
        // Show intro for 3 seconds
        const timer = setTimeout(() => {
            setShowIntro(false);
            setIsReady(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleStartQuestioning = () => {
        if (question) {
            router.visit(route("plans.ai.question", [plan.id, question.id]));
        }
    };

    const features = [
        {
            icon: SparklesIcon,
            title: "ذكاء اصطناعي متطور",
            description: "أسئلة ذكية ومخصصة حسب مشروعك",
        },
        {
            icon: ChatBubbleLeftRightIcon,
            title: "محادثة تفاعلية",
            description: "أسئلة متدرجة تبني على إجاباتك السابقة",
        },
        {
            icon: LightBulbIcon,
            title: "اقتراحات ذكية",
            description: "نصائح فورية لتحسين خطة عملك",
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {plan.title} - الأسئلة الذكية
                </h2>
            }
        >
            <Head title={`${plan.title} - AI Questioning`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <AnimatePresence mode="wait">
                        {showIntro && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                                className="text-center"
                            >
                                <div className="relative">
                                    <div className="mx-auto w-32 h-32 mb-8">
                                        <motion.div
                                            animate={{
                                                rotate: 360,
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                rotate: {
                                                    duration: 3,
                                                    ease: "linear",
                                                    repeat: Infinity,
                                                },
                                                scale: {
                                                    duration: 2,
                                                    repeat: Infinity,
                                                },
                                            }}
                                            className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                                        >
                                            <SparklesIcon className="w-16 h-16 text-white" />
                                        </motion.div>
                                    </div>
                                    <motion.h1
                                        className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        جاري تحضير الأسئلة الذكية...
                                    </motion.h1>
                                    <motion.p
                                        className="text-lg text-gray-600 dark:text-gray-400"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        سيقوم الذكاء الاصطناعي بطرح أسئلة مخصصة
                                        لمشروعك
                                    </motion.p>
                                </div>
                            </motion.div>
                        )}

                        {!showIntro && isReady && (
                            <motion.div
                                key="ready"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="space-y-8"
                            >
                                {/* Header */}
                                <div className="text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            type: "spring",
                                        }}
                                        className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <QuestionMarkCircleIcon className="w-12 h-12 text-white" />
                                    </motion.div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        مرحباً بك في جلسة الأسئلة الذكية! 🎯
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                        سيقوم مساعد الذكاء الاصطناعي بطرح أسئلة
                                        متدرجة ومخصصة لمساعدتك في إنشاء خطة عمل
                                        شاملة ومتطورة لمشروع{" "}
                                        <span className="font-semibold text-purple-600">
                                            {plan.project.name}
                                        </span>
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={feature.title}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.6 + index * 0.1,
                                            }}
                                            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                                        >
                                            <div className="text-center">
                                                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                                                    <feature.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Progress Info */}
                                {question && (
                                    <motion.div
                                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                جاهز للبدء؟
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                                لديك {totalQuestions} سؤال
                                                تقريباً للإجابة عليه
                                            </p>
                                            <div className="flex items-center justify-center space-x-4 space-x-reverse">
                                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    سيتم حفظ إجاباتك تلقائياً
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Start Button */}
                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                >
                                    <motion.button
                                        onClick={handleStartQuestioning}
                                        className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="flex items-center gap-3">
                                            ابدأ الأسئلة الذكية
                                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </motion.button>
                                </motion.div>

                                {/* Help Text */}
                                <motion.div
                                    className="text-center text-sm text-gray-500 dark:text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    💡 يمكنك العودة وتعديل إجاباتك في أي وقت
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
