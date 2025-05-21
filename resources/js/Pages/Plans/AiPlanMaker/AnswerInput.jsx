import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function AnswerInput({
    question,
    answer,
    onChange,
    onKeyPress,
    disabled = false,
    autoFocus = true,
    placeholder,
}) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const textareaRef = useRef(null);

    const isNumericQuestion = question?.type === "number";
    const isCostBreakdownQuestion = question?.type === "cost_breakdown";

    // Auto-focus the input when component mounts or question changes
    useEffect(() => {
        if (autoFocus && !disabled && !isCostBreakdownQuestion) {
            const element = isNumericQuestion
                ? inputRef.current
                : textareaRef.current;
            if (element) {
                element.focus();
            }
        }
    }, [
        question?.question,
        autoFocus,
        disabled,
        isNumericQuestion,
        isCostBreakdownQuestion,
    ]);

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (onKeyPress) {
            onKeyPress(e);
        }

        // Auto-submit on Ctrl+Enter for textarea
        if (
            e.key === "Enter" &&
            e.ctrlKey &&
            !isNumericQuestion &&
            !isCostBreakdownQuestion
        ) {
            e.preventDefault();
            if (onKeyPress) onKeyPress(e);
        }
    };

    // Handle cost breakdown answer compilation
    const handleCostBreakdownSubmit = () => {
        if (question?.questionDetails?.costItems) {
            // Collect all the cost data from the question card
            // This would be passed down from the parent component
            const costData = question.costBreakdown || {};
            const customItems = question.customItems || [];

            // Calculate total
            const breakdownTotal = Object.values(costData).reduce(
                (sum, cost) => sum + (parseFloat(cost) || 0),
                0
            );
            const customTotal = customItems.reduce(
                (sum, item) => sum + (parseFloat(item.cost) || 0),
                0
            );
            const totalCost = breakdownTotal + customTotal;

            // Create structured answer
            const structuredAnswer = {
                breakdown: costData,
                customItems: customItems,
                total: totalCost,
                summary: `Total estimated cost: $${totalCost.toLocaleString()}`,
            };

            // Update the answer with the structured data
            onChange(JSON.stringify(structuredAnswer));
        }
    };

    if (isCostBreakdownQuestion) {
        return (
            <div className="p-5 space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("cost_breakdown_answer", "Cost breakdown complete")}
                </label>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="font-medium">
                            {t(
                                "cost_breakdown_ready",
                                "Please fill in the cost estimates above, then click 'Next Question' to continue."
                            )}
                        </span>
                    </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {t(
                        "cost_breakdown_instructions",
                        "Fill in the cost estimates for each item. You can add custom items if needed. The total will be calculated automatically."
                    )}
                </div>
            </div>
        );
    }

    const renderInput = () => {
        if (isNumericQuestion) {
            return (
                <input
                    ref={inputRef}
                    type="number"
                    value={answer}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder ||
                        t("enter_number_placeholder", "Enter number here...")
                    }
                    className="w-full h-12 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus={autoFocus}
                    disabled={disabled}
                    min="0"
                    step="any"
                />
            );
        }

        return (
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder ||
                        t(
                            "enter_answer_placeholder",
                            "Write your answer here..."
                        )
                    }
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus={autoFocus}
                    disabled={disabled}
                />

                {/* Character counter */}
                <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500">
                    {answer.length} {t("characters", "characters")}
                </div>
            </div>
        );
    };

    return (
        <div className="p-5 space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {!isCostBreakdownQuestion && (
                    <>
                        {t("your_answer", "Your answer:")}
                        {question?.type === "number" && (
                            <span className="text-purple-600 dark:text-purple-400 ml-1">
                                ({t("numeric_value", "numeric value")})
                            </span>
                        )}
                    </>
                )}
            </label>

            {renderInput()}

            {/* Help text */}
            {!isCostBreakdownQuestion && (
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>
                        {isNumericQuestion
                            ? t("enter_valid_number", "Enter a valid number")
                            : t(
                                  "ctrl_enter_to_submit",
                                  "Press Ctrl + Enter to submit"
                              )}
                    </span>

                    {!isNumericQuestion && (
                        <span
                            className={`${
                                answer.length < 10
                                    ? "text-orange-500"
                                    : "text-green-500"
                            }`}
                        >
                            {answer.length < 10
                                ? t(
                                      "answer_too_short",
                                      "Try to provide more detail"
                                  )
                                : t("good_length", "Good length")}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
