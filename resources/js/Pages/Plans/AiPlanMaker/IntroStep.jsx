import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function IntroStep({ isLoading, projectSelection }) {
  const { t } = useTranslation();

  // If loading, show only the loading state centered
  if (isLoading) {
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center min-h-[400px] px-4"
      >
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 text-purple-600 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg sm:text-xl lg:text-2xl font-medium">
            {t("starting_ai_conversation", "Its getting Ready...")}
          </span>
        </motion.div>
      </motion.div>
    );
  }

  // Show intro content when not loading
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6 md:space-y-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="space-y-4 md:space-y-6">
        {/* Icon and Title - Responsive Layout */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 200,
            }}
          >
            <SparklesIcon className="w-5 h-5 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </motion.div>

          <h1 className="text-md sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight max-w-4xl">
            {t(
              "ai_plan_intro_title",
              "Let's Create Your Business Plan Together!"
            )}
          </h1>
        </motion.div>

        <motion.p
          className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t(
            "ai_plan_intro_description",
            "Ai Will Help You Create Clear and Smart Plan For Your Business"
          )}
        </motion.p>
      </div>

      {/* Project Selection */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {projectSelection}
      </motion.div>
    </motion.div>
  );
}
