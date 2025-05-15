import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function IntroStep({ isLoading, projectSelection }) {
    const { t } = useTranslation();

    return (
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
                {t(
                    "ai_plan_intro_title",
                    "Let's Create Your Business Plan Together! 🚀"
                )}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t(
                    "ai_plan_intro_description",
                    "I'll ask you 5 smart questions about your business plan and create a comprehensive analysis based on your answers."
                )}{" "}
                {t(
                    "select_project_to_begin",
                    "Simply select a project to begin!"
                )}
            </p>

            {/* Project Selection */}
            {projectSelection}

            {/* Loading state when a project is being processed */}
            {isLoading && (
                <div className="flex items-center justify-center gap-2 text-purple-600">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span>
                        {t(
                            "starting_ai_conversation",
                            "Starting AI Conversation..."
                        )}
                    </span>
                </div>
            )}
        </motion.div>
    );
}
