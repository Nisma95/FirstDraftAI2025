import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    QuestionMarkCircleIcon,
    SparklesIcon,
    CurrencyDollarIcon,
    PlusIcon,
    MinusIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function AIQuestionCard({
    question,
    questionType = "text",
    questionDetails = null, // New prop for detailed breakdowns
}) {
    const { t } = useTranslation();

    // State for managing cost breakdown inputs
    const [costBreakdown, setCostBreakdown] = useState(
        questionDetails?.costBreakdown || {}
    );

    // State for custom items user can add
    const [customItems, setCustomItems] = useState([]);

    // Determine icon based on question type
    const getQuestionIcon = () => {
        if (questionType === "number" || questionType === "cost_breakdown") {
            return <CurrencyDollarIcon className="w-6 h-6 text-white" />;
        }
        if (questionType === "cost_breakdown") {
            return <CurrencyDollarIcon className="w-6 h-6 text-white" />;
        }
        return <QuestionMarkCircleIcon className="w-6 h-6 text-white" />;
    };

    // Get question type label
    const getQuestionTypeLabel = () => {
        if (questionType === "number") {
            return t("numeric_question", "Numeric Question");
        }
        if (questionType === "cost_breakdown") {
            return t("cost_breakdown_question", "Cost Breakdown Question");
        }
        return t("text_question", "Text Question");
    };

    // Handle cost item input change
    const handleCostChange = (itemKey, value) => {
        setCostBreakdown((prev) => ({
            ...prev,
            [itemKey]: parseFloat(value) || 0,
        }));
    };

    // Add custom cost item
    const addCustomItem = () => {
        const newKey = `custom_${Date.now()}`;
        setCustomItems((prev) => [...prev, { key: newKey, name: "", cost: 0 }]);
    };

    // Update custom item
    const updateCustomItem = (index, field, value) => {
        setCustomItems((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    // Remove custom item
    const removeCustomItem = (index) => {
        setCustomItems((prev) => prev.filter((_, i) => i !== index));
    };

    // Calculate total cost
    const getTotalCost = () => {
        const breakdownTotal = Object.values(costBreakdown).reduce(
            (sum, cost) => sum + (parseFloat(cost) || 0),
            0
        );
        const customTotal = customItems.reduce(
            (sum, item) => sum + (parseFloat(item.cost) || 0),
            0
        );
        return breakdownTotal + customTotal;
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <motion.div
            className="p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="flex items-start gap-4">
                {/* AI Avatar */}
                <motion.div
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    {getQuestionIcon()}

                    {/* Pulse effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                {t("ai_assistant", "AI Assistant")}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {getQuestionTypeLabel()}
                            </p>
                        </div>
                    </div>

                    {/* Question text */}
                    <motion.p
                        className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {question}
                    </motion.p>

                    {/* Cost Breakdown Section */}
                    {questionType === "cost_breakdown" &&
                        questionDetails?.costItems && (
                            <motion.div
                                className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50 dark:border-gray-600/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                                    <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                                    {t(
                                        "cost_breakdown_details",
                                        "Cost Breakdown Details"
                                    )}
                                </h4>

                                <div className="space-y-3">
                                    {questionDetails.costItems.map(
                                        (item, index) => (
                                            <motion.div
                                                key={item.key}
                                                className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-lg"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: 0.7 + index * 0.1,
                                                }}
                                            >
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {item.name}
                                                    </label>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                    {item.examples && (
                                                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                            {t(
                                                                "examples",
                                                                "Examples"
                                                            )}
                                                            :{" "}
                                                            {item.examples.join(
                                                                ", "
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="relative">
                                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                            $
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={
                                                                costBreakdown[
                                                                    item.key
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleCostChange(
                                                                    item.key,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="0"
                                                            className="w-28 pl-8 pr-3 py-2 text-right border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                            min="0"
                                                            step="100"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    )}

                                    {/* Custom Items */}
                                    {customItems.map((item, index) => (
                                        <motion.div
                                            key={item.key}
                                            className="flex items-center justify-between p-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        updateCustomItem(
                                                            index,
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={t(
                                                        "custom_item_name",
                                                        "Custom item name..."
                                                    )}
                                                    className="w-full text-sm font-medium border-none bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                        $
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={item.cost || ""}
                                                        onChange={(e) =>
                                                            updateCustomItem(
                                                                index,
                                                                "cost",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="0"
                                                        className="w-28 pl-8 pr-3 py-2 text-right border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                        min="0"
                                                        step="100"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeCustomItem(index)
                                                    }
                                                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <MinusIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Add Custom Item Button */}
                                    <motion.button
                                        onClick={addCustomItem}
                                        className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        {t(
                                            "add_custom_item",
                                            "Add custom item"
                                        )}
                                    </motion.button>

                                    {/* Total Cost Display */}
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                                            <span className="font-bold text-gray-700 dark:text-gray-300">
                                                {t(
                                                    "total_estimated_cost",
                                                    "Total Estimated Cost"
                                                )}
                                            </span>
                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(getTotalCost())}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    {/* Question type hint for regular numeric questions */}
                    {questionType === "number" &&
                        questionType !== "cost_breakdown" && (
                            <motion.div
                                className="mt-3 text-sm text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30 px-3 py-2 rounded-lg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                💡{" "}
                                {t(
                                    "number_question_hint",
                                    "Please provide a numeric answer"
                                )}
                            </motion.div>
                        )}
                </div>
            </div>
        </motion.div>
    );
}
