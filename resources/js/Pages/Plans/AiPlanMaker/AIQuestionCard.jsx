import React from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function AIQuestionCard({ question }) {
    const { t } = useTranslation();

    return (
        <div className="p-5">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                        {t("ai_assistant", "AI Assistant")}
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200 text-lg">
                        {question}
                    </p>
                </div>
            </div>
        </div>
    );
}
