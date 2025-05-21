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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {fieldData?.options?.map((option) => (
                <motion.div
                    key={option.value}
                    onClick={() =>
                        !isCurrentFieldGenerating &&
                        onChange(field, option.value)
                    }
                    className={`p-6 rounded-lg cursor-pointer text-center transition-all duration-300
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
                    <h3 className="text-lg font-semibold">{option.label}</h3>
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
            className={`h-[4rem] w-full ${
                isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 ${
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
            className={`h-[4rem] w-full ${
                isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 ${
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
                        Math.max(e.target.scrollHeight, 120),
                        300
                    );
                    e.target.style.height = newHeight + "px";
                }}
                className={`w-full ${
                    isRTL ? "pr-4 pl-4" : "pl-4 pr-4"
                } py-3 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 resize-none overflow-y-auto ${
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
                    minHeight: "120px",
                    height: "120px",
                    lineHeight: "1.6",
                }}
                ref={(el) => {
                    if (el && value) {
                        // Adjust height on mount if there's already content
                        setTimeout(() => {
                            el.style.height = "auto";
                            const newHeight = Math.min(
                                Math.max(el.scrollHeight, 120),
                                300
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
                            isRTL ? "left-3" : "right-3"
                        } bottom-3`}
                    >
                        <motion.button
                            onClick={onEnhanceDescription}
                            disabled={isEnhancing || !hasRequiredData}
                            className="bg-indigo-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
                            whileTap={{ scale: 0.95 }}
                            type="button"
                        >
                            {isEnhancing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Wand2 className="w-4 h-4" />
                            )}
                            {isEnhancing
                                ? t("enhancing")
                                : t("enhance_with_ai")}
                        </motion.button>
                    </div>
                )}

            {/* NEW: AI Field Generation button for supported textarea fields */}
            {shouldShowAiButton && fieldData?.showAiButton && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                >
                    <motion.button
                        type="button"
                        onClick={() => onGenerateField(field)}
                        disabled={isCurrentFieldGenerating}
                        className={`
                            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                            rounded-lg transition-all duration-200 
                            ${
                                isCurrentFieldGenerating
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800"
                            }
                        `}
                        whileHover={
                            !isCurrentFieldGenerating ? { scale: 1.02 } : {}
                        }
                        whileTap={
                            !isCurrentFieldGenerating ? { scale: 0.98 } : {}
                        }
                    >
                        {isCurrentFieldGenerating ? (
                            <motion.div
                                className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span>
                            {isCurrentFieldGenerating
                                ? t("ai_generating", "AI is generating...")
                                : getAiButtonText
                                ? getAiButtonText()
                                : t(
                                      "ai_answer_for_you",
                                      "Let AI answer for you"
                                  )}
                        </span>
                    </motion.button>
                </motion.div>
            )}
        </div>
    );

    const renderTextField = () => (
        <div className="space-y-3">
            <input
                type="text"
                name={field}
                value={value || ""}
                onChange={(e) => onChange(field, e.target.value)}
                onKeyDown={onKeyPress}
                disabled={isCurrentFieldGenerating}
                className={`h-[4rem] w-full ${
                    isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
                } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 ${
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
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex justify-start"
                >
                    <motion.button
                        type="button"
                        onClick={() => onGenerateField(field)}
                        disabled={isCurrentFieldGenerating}
                        className={`
                            inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                            rounded-lg transition-all duration-200 
                            ${
                                isCurrentFieldGenerating
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800"
                            }
                        `}
                        whileHover={
                            !isCurrentFieldGenerating ? { scale: 1.02 } : {}
                        }
                        whileTap={
                            !isCurrentFieldGenerating ? { scale: 0.98 } : {}
                        }
                    >
                        {isCurrentFieldGenerating ? (
                            <motion.div
                                className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            />
                        ) : (
                            <Sparkles className="w-4 h-4" />
                        )}
                        <span>
                            {isCurrentFieldGenerating
                                ? t("ai_generating", "AI is generating...")
                                : getAiButtonText
                                ? getAiButtonText()
                                : t(
                                      "ai_answer_for_you",
                                      "Let AI answer for you"
                                  )}
                        </span>
                    </motion.button>
                </motion.div>
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
            {fieldData?.type !== "textarea" && !isCurrentFieldGenerating && (
                <div
                    className={`absolute inset-y-0 ${
                        isRTL ? "left-0 pl-3" : "right-0 pr-3"
                    } flex items-center cursor-pointer ${
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
                            className={`w-6 h-6 ${
                                canProceed
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-400 dark:text-gray-600"
                            }`}
                        />
                    ) : (
                        <ChevronRight
                            className={`w-6 h-6 ${
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
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </motion.p>
            )}

            {/* Character/Length Info for fields with maxLength */}
            {fieldData?.maxLength && value && (
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>
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
