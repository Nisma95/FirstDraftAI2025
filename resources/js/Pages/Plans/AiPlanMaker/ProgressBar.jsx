import React from "react";
import { useTranslation } from "react-i18next";

export default function ProgressBar({ currentStep, totalSteps }) {
    const { t } = useTranslation();
    const percentage = (currentStep / totalSteps) * 100;

    return (
        <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
                {t("question_progress", "Question {{current}} of {{total}}", {
                    current: currentStep,
                    total: totalSteps,
                })}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
}
