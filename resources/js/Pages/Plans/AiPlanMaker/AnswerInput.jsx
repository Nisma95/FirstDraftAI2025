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
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {t("cost_breakdown_answer", "Cost breakdown complete")}
                </label>

                <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
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

                <div className="text-xs text-slate-500 dark:text-slate-400">
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
                    className="w-full h-12 p-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700"
                    autoFocus={autoFocus}
                    disabled={disabled}
                    min="0"
                    step="any"
                />
            );
        }

        return (
            <div className="textarea-container relative">
                <textarea
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder ||
                        t("enter_answer_placeholder", "Share your thoughts...")
                    }
                    className="creative-textarea"
                    autoFocus={autoFocus}
                    disabled={disabled}
                />

                {/* Enhanced character counter */}
                <div className="character-counter">
                    {answer.length} {t("characters", "characters")}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-3">
            {/* Label section with detail feedback NEXT TO "Your answer:" */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {!isCostBreakdownQuestion && (
                            <>
                                {t("your_answer", "Your answer:")}
                                {question?.type === "number" && (
                                    <span className="text-indigo-600 dark:text-indigo-400 ml-1">
                                        ({t("numeric_value", "numeric value")})
                                    </span>
                                )}
                            </>
                        )}
                    </label>

                    {/* "Try to provide more detail" NEXT TO "Your answer:" */}
                    {!isCostBreakdownQuestion && !isNumericQuestion && (
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                answer.length < 10
                                    ? "text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                                    : "text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400"
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

                {/* Let AI Answer button STAYS in top right */}
                {!isCostBreakdownQuestion && !isNumericQuestion && (
                    <button
                        type="button"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                        onClick={() => {
                            // Add your AI answer logic here
                            console.log("Let AI answer this question");
                        }}
                    >
                        {t("let_ai_answer", "Let AI Answer it for me")}
                    </button>
                )}
            </div>

            {renderInput()}

            {/* Help text - removed duplicate Ctrl+Enter since it's shown below the button */}
            {!isCostBreakdownQuestion && (
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span className="flex items-center gap-1">
                        {isNumericQuestion &&
                            t("enter_valid_number", "Enter a valid number")}
                    </span>
                </div>
            )}
        </div>
    );
}
