import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProgressBar from "./ProgressBar";
import AIQuestionCard from "./AIQuestionCard";
import AnswerInput from "./AnswerInput";

export default function QuestionsStep({
    currentQuestion,
    questionCount,
    totalQuestions = 5,
    answer,
    onAnswerChange,
    onSubmit,
    isLoading,
}) {
    const { t } = useTranslation();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!answer.trim() || isLoading) {
            return;
        }
        onSubmit();
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleSubmit(e);
        }
    };

    return (
        <motion.div
            key="questions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            {/* Progress */}
            <ProgressBar
                currentStep={questionCount}
                totalSteps={totalQuestions}
            />

            {/* AI Question */}
            <AIQuestionCard
                question={currentQuestion.question}
                questionType={currentQuestion.type}
                questionCount={questionCount}
                totalQuestions={totalQuestions}
            />

            {/* Answer Input */}
            <form onSubmit={handleSubmit}>
                <AnswerInput
                    question={currentQuestion}
                    answer={answer}
                    onChange={onAnswerChange}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    placeholder={
                        currentQuestion.type === "number"
                            ? t("enter_number", "Enter a number...")
                            : t("share_your_thoughts", "Share your thoughts...")
                    }
                />

                <div className="text-center mt-6">
                    <button
                        type="submit"
                        disabled={!answer.trim() || isLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t("processing", "Processing...")}
                            </span>
                        ) : (
                            <>
                                {questionCount < totalQuestions
                                    ? t("next_question", "Next Question")
                                    : t("generate_plan", "Generate Plan")}
                                <span className="ml-2 text-xs opacity-70">
                                    ({questionCount}/{totalQuestions})
                                </span>
                            </>
                        )}
                    </button>

                    {/* Hint for keyboard shortcut */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {t("submit_hint", "Press Ctrl + Enter to submit")}
                    </p>
                </div>
            </form>
        </motion.div>
    );
}
