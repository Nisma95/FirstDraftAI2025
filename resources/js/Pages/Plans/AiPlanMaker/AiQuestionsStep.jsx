import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import QuestionsStep from "./QuestionsStep";

export default function AiQuestionsStep({
    currentQuestion,
    questionCount,
    totalQuestions = 5,
    answer,
    onAnswerChange,
    onSubmit,
    isLoading,
    onReset,
    // Add props for AI functionality
    selectedProject,
    answers,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="questions"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Top Header with Start Over (left) and Question Count (right) */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={onReset} className="fdCardLighterBg">
                    <svg
                        className="arrow-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    {t("start_over", "Start Over")}
                </button>

                <div className="fdCardLighterBg">
                    {t(
                        "question_progress",
                        "Question {{current}} of {{total}}",
                        {
                            current: questionCount,
                            total: totalQuestions,
                        }
                    )}
                </div>
            </div>

            {/* Question Content - QuestionsStep already has ProgressBar */}
            <QuestionsStep
                currentQuestion={currentQuestion}
                questionCount={questionCount}
                totalQuestions={totalQuestions}
                answer={answer}
                onAnswerChange={onAnswerChange}
                onSubmit={onSubmit}
                isLoading={isLoading}
                // Pass the new props for AI functionality
                selectedProject={selectedProject}
                answers={answers}
            />
        </motion.div>
    );
}
