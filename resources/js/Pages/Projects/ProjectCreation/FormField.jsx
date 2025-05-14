// Components/ProjectCreation/FormField.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Wand2, Loader2 } from "lucide-react";
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
    // AI Enhancement props
    onEnhanceDescription,
    isEnhancing,
    hasRequiredData,
    hasMinimumWords,
}) {
    const { t } = useTranslation();

    const renderProjectScaleField = () => (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {fieldData?.options?.map((option) => (
                <motion.div
                    key={option.value}
                    onClick={() => onChange(field, option.value)}
                    className={`p-6 rounded-lg cursor-pointer text-center transition-all duration-300
                        ${
                            value === option.value
                                ? "Fdbg text-white"
                                : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                        }
                        hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
                    whileTap={{ scale: 0.95 }}
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
            className={`h-[4rem] w-full ${
                isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 ${
                isRTL ? "text-right" : "text-left"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
            autoFocus
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
            className={`h-[4rem] w-full ${
                isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 ${
                isRTL ? "text-right" : "text-left"
            }`}
            placeholder={fieldData?.placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            autoFocus
        />
    );

    const renderTextareaField = () => (
        <div className="relative">
            <textarea
                name={field}
                value={value || ""}
                onChange={(e) => onChange(field, e.target.value)}
                onKeyDown={onKeyPress}
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
                } custom-scrollbar`}
                placeholder={fieldData?.placeholder}
                dir={isRTL ? "rtl" : "ltr"}
                autoFocus
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
            {field === "description" && hasMinimumWords && (
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
                        {isEnhancing ? t("enhancing") : t("enhance_with_ai")}
                    </motion.button>
                </div>
            )}
        </div>
    );

    const renderTextField = () => (
        <input
            type="text"
            name={field}
            value={value || ""}
            onChange={(e) => onChange(field, e.target.value)}
            onKeyDown={onKeyPress}
            className={`h-[4rem] w-full ${
                isRTL ? "pr-4 pl-10" : "pl-4 pr-10"
            } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 ${
                isRTL ? "text-right" : "text-left"
            }`}
            placeholder={fieldData?.placeholder}
            dir={isRTL ? "rtl" : "ltr"}
            autoFocus
        />
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

            {/* Next Arrow Button - Only show for non-textarea fields */}
            {fieldData?.type !== "textarea" && (
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
        </motion.div>
    );
}
