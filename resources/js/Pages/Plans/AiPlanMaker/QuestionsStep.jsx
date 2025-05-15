import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProgressBar from "./ProgressBar";
import AIQuestionCard from "./AIQuestionCard";
import AnswerInput from "./AnswerInput";

export default function QuestionsStep({
    currentQuestion,
    questionCount,
    answer,
    onAnswerChange,
    onSubmit,
    isLoading,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Progress */}
            <ProgressBar currentStep={questionCount} totalSteps={5} />

            {/* AI Question */}
            <AIQuestionCard question={currentQuestion.question} />

            {/* Answer Input */}
            <AnswerInput
                question={currentQuestion}
                answer={answer}
                onChange={onAnswerChange}
            />

            <div className="text-center">
                <button
                    onClick={onSubmit}
                    disabled={!answer.trim() || isLoading}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {t("processing", "Processing...")}
                        </span>
                    ) : (
                        <>
                            {questionCount < 5
                                ? t("next_question", "Next Question")
                                : t("generate_plan", "Generate Plan")}
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
