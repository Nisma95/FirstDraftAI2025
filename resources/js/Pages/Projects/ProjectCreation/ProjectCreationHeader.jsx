// ProjectCreationHeader.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProjectCreationHeader({
  currentStep,
  totalSteps,
  onBack,
  showBackButton = true,
  title,
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const appIconStyle = {
    background: "linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b)",
    color: "#d4d3d3",
  };

  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-1 sm:px-2">
      {/* Back Button - Left side */}
      <div className="w-12 sm:w-16 lg:w-24">
        {showBackButton && (
          <motion.button
            onClick={onBack}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300"
            style={appIconStyle}
            whileTap={{ scale: 0.95 }}
            type="button"
          >
            {isRTL ? (
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </motion.button>
        )}
      </div>

      {/* Title - Center */}
      <div className="flex-1 text-center px-1 sm:px-2 md:px-4">
        {title && (
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Step Numbers - Right side */}
      <div className="w-12 sm:w-16 lg:w-24 flex justify-end">
        {currentStep && totalSteps && (
          <span
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full inline-flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300"
            style={appIconStyle}
          >
            {currentStep} / {totalSteps}
          </span>
        )}
      </div>
    </div>
  );
}
