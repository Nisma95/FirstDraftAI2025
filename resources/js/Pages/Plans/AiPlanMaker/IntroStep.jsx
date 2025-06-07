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
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
        >
            <div className="space-y-6">
                {/* Icon and Title Side by Side */}
                <motion.div
                    className="flex items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 200,
                        }}
                    >
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        {t(
                            "ai_plan_intro_title",
                            "Let's Create Your Business Plan Together!"
                        )}
                    </h1>
                </motion.div>

                <motion.p
                    className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {t(
                        "ai_plan_intro_description",
                        "I'll ask you 5 smart questions about your business plan and create a comprehensive analysis based on your answers."
                    )}{" "}
                    {t(
                        "select_project_to_begin",
                        "Simply select a project to begin!"
                    )}
                </motion.p>
            </div>

            {/* Loading state when a project is being processed */}
            {isLoading && (
                <motion.div
                    className="flex items-center justify-center gap-2 text-purple-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <span>
                        {t(
                            "starting_ai_conversation",
                            "Starting AI Conversation..."
                        )}
                    </span>
                </motion.div>
            )}

            {/* Project Selection - only show when not loading */}
            {!isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {projectSelection}
                </motion.div>
            )}
        </motion.div>
    );
}
