// Components/ProjectCreation/FormField.jsx
import React from "react";
import { motion } from "framer-motion";
import {
    ChevronRight,
    ChevronLeft,
    Wand2,
    Loader2,
    Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FormField({
    field,
    fieldData,
    value,
    onChange,
    onKeyPress,
    canProceed,
    onNext,
    isRTL,
    error,
    // AI Enhancement props (existing)
    onEnhanceDescription,
    isEnhancing,
    hasRequiredData,
    hasMinimumWords,
    // NEW: AI Field Generation props
    shouldShowAiButton,
    onGenerateField,
    isGeneratingField,
    generatingFieldName,
    getAiButtonText, // NEW: Dynamic button text function
}) {
    const { t } = useTranslation();

    // Check if current field is being generated
    const isCurrentFieldGenerating = generatingFieldName === field;

    const renderProjectScaleField = () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            {fieldData?.options?.map((option) => (
                <motion.div
                    key={option.value}
                    onClick={() =>
                        !isCurrentFieldGenerating &&
                        onChange(field, option.value)
                    }
                    className={`p-4 sm:p-6 rounded-lg cursor-pointer text-center transition-all duration-300 min-h-[60px] sm:min-h-[80px] flex items-center justify-center
                        ${
                            value === option.value
                                ? "Fdbg text-white"
                                : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                        }
                        hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white
                        ${
                            isCurrentFieldGenerating
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    whileTap={{ scale: isCurrentFieldGenerating ? 1 : 0.95 }}
                >
                    <h3 className="text-base sm:text-lg font-semibold leading-tight">
                        {option.label}
                    </h3>
                </motion.div>
            ))}
        </div>
    );

    const renderSelectField = () => (
        <select
            name={field}
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value)}
            disabled={isCurrentFieldGenerating}
            className={`h-12 sm:h-16 w-full ${
                isRTL
                    ? "pr-3 sm:pr-4 pl-8 sm:pl-10"
                    : "pl-3 sm:pl-4 pr-8 sm:pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 text-sm sm:text-base ${
                isRTL ? "text-right" : "text-left"
            } ${
                isCurrentFieldGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            dir={isRTL ? "rtl" : "ltr"}
            autoFocus={!isCurrentFieldGenerating}
        >
            <option value="">
                {t("select")} {fieldData?.label}
            </option>
            {fieldData?.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );

    const renderNumberField = () => (
        <input
            type="number"
            name={field}
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value)}
            onKeyDown={onKeyPress}
            min="1"
            disabled={isCurrentFieldGenerating}
            className={`h-12 sm:h-16 w-full ${
                isRTL
                    ? "pr-3 sm:pr-4 pl-8 sm:pl-10"
                    : "pl-3 sm:pl-4 pr-8 sm:pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 text-sm sm:text-base ${
                isRTL ? "text-right" : "text-left"
            } ${
                isCurrentFieldGenerating ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder={fieldData?.placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            autoFocus={!isCurrentFieldGenerating}
        />
    );

    const renderTextareaField = () => (
        <div className="relative space-y-3">
            <textarea
                name={field}
                value={value || ""}
                onChange={(e) => onChange(field, e.target.value)}
                onKeyDown={onKeyPress}
                disabled={isCurrentFieldGenerating}
                onInput={(e) => {
                    // Auto-expand the textarea
                    e.target.style.height = "auto";
                    const newHeight = Math.min(
                        Math.max(e.target.scrollHeight, 100), // Smaller min height on mobile
                        window.innerWidth < 640 ? 200 : 300 // Responsive max height
                    );
                    e.target.style.height = newHeight + "px";
                }}
                className={`w-full ${
                    isRTL
                        ? "pr-3 sm:pr-4 pl-3 sm:pl-4"
                        : "pl-3 sm:pl-4 pr-3 sm:pr-4"
                } py-3 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 resize-none overflow-y-auto text-sm sm:text-base ${
                    isRTL ? "text-right" : "text-left"
                } custom-scrollbar ${
                    isCurrentFieldGenerating
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
                placeholder={fieldData?.placeholder}
                dir={isRTL ? "rtl" : "ltr"}
                autoFocus={!isCurrentFieldGenerating}
                style={{
                    minHeight: window.innerWidth < 640 ? "100px" : "120px", // Responsive min height
                    height: window.innerWidth < 640 ? "100px" : "120px",
                    lineHeight: "1.6",
                }}
                ref={(el) => {
                    if (el && value) {
                        // Adjust height on mount if there's already content
                        setTimeout(() => {
                            el.style.height = "auto";
                            const newHeight = Math.min(
                                Math.max(
                                    el.scrollHeight,
                                    window.innerWidth < 640 ? 100 : 120
                                ),
                                window.innerWidth < 640 ? 200 : 300
                            );
                            el.style.height = newHeight + "px";
                        }, 0);
                    }
                }}
            />

            {/* AI Enhance button for description field */}
            {field === "description" &&
                hasMinimumWords &&
                !isCurrentFieldGenerating && (
                    <div
                        className={`absolute ${
                            isRTL ? "left-2 sm:left-3" : "right-2 sm:right-3"
                        } bottom-2 sm:bottom-3`}
                    >
                        <div className="relative group">
                            <motion.button
                                onClick={onEnhanceDescription}
                                disabled={isEnhancing || !hasRequiredData}
                                className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 touch-manipulation"
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ scale: 1.05 }}
                                type="button"
                            >
                                {isEnhancing ? (
                                    <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                )}
                            </motion.button>

                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                                    {isEnhancing
                                        ? t("enhancing")
                                        : t("enhance_with_ai")}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* NEW: AI Field Generation button for supported textarea fields */}
            {shouldShowAiButton && fieldData?.showAiButton && (
                <div
                    className={`absolute ${
                        isRTL ? "left-2 sm:left-3" : "right-2 sm:right-3"
                    } bottom-2 sm:bottom-3`}
                >
                    <div className="relative group">
                        <motion.button
                            type="button"
                            onClick={() => onGenerateField(field)}
                            disabled={isCurrentFieldGenerating}
                            className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 touch-manipulation
                    ${
                        isCurrentFieldGenerating
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                            : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
                    }
                `}
                            whileHover={
                                !isCurrentFieldGenerating ? { scale: 1.05 } : {}
                            }
                            whileTap={
                                !isCurrentFieldGenerating ? { scale: 0.9 } : {}
                            }
                        >
                            {isCurrentFieldGenerating ? (
                                <motion.div
                                    className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-purple-600 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            ) : (
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                        </motion.button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                                {isCurrentFieldGenerating
                                    ? t("ai_generating", "AI is generating...")
                                    : getAiButtonText
                                    ? getAiButtonText()
                                    : t(
                                          "ai_answer_for_you",
                                          "Let AI answer for you"
                                      )}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderTextField = () => (
        <div className="relative">
            <input
                type="text"
                name={field}
                value={value || ""}
                onChange={(e) => onChange(field, e.target.value)}
                onKeyDown={onKeyPress}
                disabled={isCurrentFieldGenerating}
                className={`h-12 sm:h-16 w-full ${
                    isRTL
                        ? "pr-3 sm:pr-4 pl-8 sm:pl-10"
                        : "pl-3 sm:pl-4 pr-8 sm:pr-10"
                } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 text-sm sm:text-base ${
                    isRTL ? "text-right" : "text-left"
                } ${
                    isCurrentFieldGenerating
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
                placeholder={fieldData?.placeholder}
                dir={isRTL ? "rtl" : "ltr"}
                autoFocus={!isCurrentFieldGenerating}
            />

            {/* NEW: AI Field Generation button for supported text fields */}
            {shouldShowAiButton && fieldData?.showAiButton && (
                <div
                    className={`absolute inset-y-0 ${
                        isRTL ? "left-0 pl-2 sm:pl-3" : "right-0 pr-2 sm:pr-3"
                    } flex items-center`}
                >
                    <div className="relative group">
                        <motion.button
                            type="button"
                            onClick={() => onGenerateField(field)}
                            disabled={isCurrentFieldGenerating}
                            className={`
                            w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation
                            ${
                                isCurrentFieldGenerating
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-500"
                            }
                        `}
                            whileHover={
                                !isCurrentFieldGenerating ? { scale: 1.05 } : {}
                            }
                            whileTap={
                                !isCurrentFieldGenerating ? { scale: 0.9 } : {}
                            }
                        >
                            {isCurrentFieldGenerating ? (
                                <motion.div
                                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-purple-600 border-t-transparent rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            ) : (
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            )}
                        </motion.button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-gray-900 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap">
                                {isCurrentFieldGenerating
                                    ? t("ai_generating", "AI is generating...")
                                    : getAiButtonText
                                    ? getAiButtonText()
                                    : t(
                                          "ai_answer_for_you",
                                          "Let AI answer for you"
                                      )}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderField = () => {
        if (fieldData?.type === "select") {
            return field === "project_scale"
                ? renderProjectScaleField()
                : renderSelectField();
        } else if (fieldData?.type === "number") {
            return renderNumberField();
        } else if (fieldData?.type === "textarea") {
            return renderTextareaField();
        } else {
            return renderTextField();
        }
    };

    return (
        <motion.div
            key={`${field}-field`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
        >
            {renderField()}

            {/* Next Arrow Button - Only show for non-textarea fields and when not generating */}
            {fieldData?.type !== "textarea" &&
                field !== "project_scale" &&
                !isCurrentFieldGenerating && (
                    <div
                        className={`absolute inset-y-0 ${
                            isRTL
                                ? "left-0 pl-2 sm:pl-3"
                                : "right-0 pr-2 sm:pr-3"
                        } flex items-center cursor-pointer touch-manipulation ${
                            !canProceed && "pointer-events-none opacity-50"
                        }`}
                        onClick={() => {
                            if (canProceed) {
                                onNext();
                            }
                        }}
                    >
                        {isRTL ? (
                            <ChevronLeft
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    canProceed
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-400 dark:text-gray-600"
                                }`}
                            />
                        ) : (
                            <ChevronRight
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                    canProceed
                                        ? "text-indigo-600 dark:text-indigo-400"
                                        : "text-gray-400 dark:text-gray-600"
                                }`}
                            />
                        )}
                    </div>
                )}

            {/* Error Display */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-xs sm:text-sm text-red-600 dark:text-red-400 px-1"
                >
                    {error}
                </motion.p>
            )}

            {/* Character/Length Info for fields with maxLength */}
            {fieldData?.maxLength && value && (
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 px-1">
                    <span className="text-xs">
                        {fieldData.type === "textarea"
                            ? t(
                                  "ctrl_enter_to_proceed",
                                  "Press Ctrl + Enter to proceed"
                              )
                            : t("enter_to_proceed", "Press Enter to proceed")}
                    </span>
                    <span
                        className={
                            value.length > fieldData.maxLength * 0.9
                                ? "text-amber-500"
                                : ""
                        }
                    >
                        {value.length}/{fieldData.maxLength}
                    </span>
                </div>
            )}
        </motion.div>
    );
}
