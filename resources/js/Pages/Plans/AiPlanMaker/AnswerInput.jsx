import React from "react";
import { useTranslation } from "react-i18next";

export default function AnswerInput({
    question,
    answer,
    onChange,
    autoFocus = true,
}) {
    const { t } = useTranslation();

    const isNumericQuestion =
        question?.type === "number" ||
        (question?.keywords && question.keywords.includes("number"));

    const renderInput = () => {
        if (isNumericQuestion) {
            return (
                <input
                    type="number"
                    value={answer}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t(
                        "enter_number_placeholder",
                        "Enter number here..."
                    )}
                    className="w-full h-12 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    autoFocus={autoFocus}
                    min="0"
                />
            );
        }

        return (
            <textarea
                value={answer}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t(
                    "enter_answer_placeholder",
                    "Write your answer here..."
                )}
                className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                autoFocus={autoFocus}
            />
        );
    };

    return (
        <div className="p-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("your_answer", "Your answer:")}
            </label>
            {renderInput()}
        </div>
    );
}
