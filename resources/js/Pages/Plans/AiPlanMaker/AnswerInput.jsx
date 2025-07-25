import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function AnswerInput({
    question,
    answer,
    onChange,
    onKeyPress,
    disabled = false,
    autoFocus = true,
    placeholder,
    // New props for AI functionality
    businessIdea = "",
    projectName = "",
    projectDescription = "",
    previousAnswers = [],
}) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const textareaRef = useRef(null);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const isNumericQuestion = question?.type === "number";
    const isCostBreakdownQuestion = question?.type === "cost_breakdown";

    // Smart auto-resize textarea function with proper scrolling
    const autoResize = (textarea) => {
        if (!textarea) return;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = "auto";

        const minHeight = 144; // 9rem
        const maxHeight = 400; // 25rem - reasonable max before scrolling
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight <= maxHeight) {
            // Auto-resize if content fits within max height
            const newHeight = Math.max(minHeight, scrollHeight);
            textarea.style.height = newHeight + "px";
            textarea.style.overflowY = "hidden";
        } else {
            // Enable scrolling if content exceeds max height
            textarea.style.height = maxHeight + "px";
            textarea.style.overflowY = "auto";

            // Ensure the textarea can be scrolled with mouse wheel
            textarea.style.scrollBehavior = "smooth";
        }
    };

    // Enhanced textarea input with mouse wheel support
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea || isNumericQuestion || isCostBreakdownQuestion) return;

        // Handle mouse wheel scrolling
        const handleWheel = (e) => {
            // Check if textarea has scrollable content
            if (textarea.scrollHeight > textarea.clientHeight) {
                e.stopPropagation(); // Prevent page scroll when scrolling textarea

                const delta = e.deltaY;
                textarea.scrollTop += delta;
            }
        };

        // Add event listener
        textarea.addEventListener("wheel", handleWheel, { passive: false });

        // Cleanup
        return () => {
            textarea.removeEventListener("wheel", handleWheel);
        };
    }, [isNumericQuestion, isCostBreakdownQuestion]);

    // Auto-focus and setup resize observer
    useEffect(() => {
        if (autoFocus && !disabled && !isCostBreakdownQuestion) {
            const element = isNumericQuestion
                ? inputRef.current
                : textareaRef.current;
            if (element) {
                element.focus();

                // Auto-resize for textarea
                if (!isNumericQuestion && textareaRef.current) {
                    autoResize(textareaRef.current);
                }
            }
        }
    }, [
        question?.question,
        autoFocus,
        disabled,
        isNumericQuestion,
        isCostBreakdownQuestion,
    ]);

    // Auto-resize when answer changes
    useEffect(() => {
        if (
            !isNumericQuestion &&
            !isCostBreakdownQuestion &&
            textareaRef.current
        ) {
            autoResize(textareaRef.current);
        }
    }, [answer, isNumericQuestion, isCostBreakdownQuestion]);

    // Handle textarea input with auto-resize
    const handleTextareaChange = (e) => {
        onChange(e.target.value);
        autoResize(e.target);
    };

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

    const handleAIAnswer = async () => {
        if (isGeneratingAI) return;

        setIsGeneratingAI(true);

        try {
            console.log("Making request to:", "/plans/ai/generate-answer");
            console.log("Request data:", {
                question: question?.question || "",
                question_type: question?.type || "text",
                business_idea: businessIdea,
                project_name: projectName,
                project_description: projectDescription,
                previous_answers: previousAnswers,
            });

            const response = await fetch("/plans/ai/generate-answer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN":
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute("content") || "",
                },
                body: JSON.stringify({
                    question: question?.question || "",
                    question_type: question?.type || "text",
                    business_idea: businessIdea,
                    project_name: projectName,
                    project_description: projectDescription,
                    previous_answers: previousAnswers,
                }),
            });

            console.log("Response status:", response.status);
            console.log(
                "Response headers:",
                Object.fromEntries(response.headers)
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error(
                    "HTTP Error:",
                    response.status,
                    errorText.substring(0, 200)
                );
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const htmlText = await response.text();
                console.error(
                    "Non-JSON response received:",
                    htmlText.substring(0, 500)
                );
                throw new Error(
                    "Server returned HTML instead of JSON - likely a 404 or server error"
                );
            }

            const result = await response.json();
            console.log("AI response result:", result);

            if (result.success && result.suggested_answer) {
                onChange(result.suggested_answer);
                // Auto-resize after AI content is added
                setTimeout(() => {
                    if (textareaRef.current) {
                        autoResize(textareaRef.current);
                    }
                }, 100);
            } else {
                console.error("AI Answer Error:", result.message);
                alert(
                    "Error: " + (result.message || "Failed to generate answer")
                );
            }
        } catch (error) {
            console.error("AI Answer Error:", error);
            alert("Error generating AI answer: " + error.message);
        } finally {
            setIsGeneratingAI(false);
        }
    };

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
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                        placeholder ||
                        t("enter_answer_placeholder", "Share your thoughts...")
                    }
                    className="enhanced-auto-textarea"
                    autoFocus={autoFocus}
                    disabled={disabled}
                    style={{
                        minHeight: "144px", // 9rem equivalent
                        maxHeight: "400px",
                        height: "auto",
                        resize: "none",
                        overflow: "hidden", // Hide scrollbar, let auto-resize handle it
                    }}
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

                {/* Let AI Answer button with loading state */}
                {!isCostBreakdownQuestion && !isNumericQuestion && (
                    <button
                        type="button"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
                        onClick={handleAIAnswer}
                        disabled={isGeneratingAI || disabled}
                    >
                        {isGeneratingAI ? (
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                {t("generating", "Generating...")}
                            </span>
                        ) : (
                            t("let_ai_answer", "Let AI Answer it for me")
                        )}
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
