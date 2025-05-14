import React from "react";
import { Sparkles, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProgressHeader = ({ step, currentField, fields }) => {
    const { t } = useTranslation();

    // Calculate progress percentage
    const getProgress = () => {
        if (step === "project") return 33;
        if (step === "details") {
            const currentIndex = fields.findIndex(
                (f) => f.key === currentField
            );
            return 33 + ((currentIndex + 1) / fields.length) * 67;
        }
        return 100;
    };

    // Get current field data for details step
    const currentFieldData = fields.find((field) => field.key === currentField);

    // Get title and subtitle based on step
    const getTitleAndSubtitle = () => {
        if (step === "project") {
            return {
                icon: <Sparkles size={24} />,
                title: t("create_smart_plan"),
                subtitle: t("ai_help_create_plan"),
            };
        } else if (step === "details" && currentFieldData) {
            return {
                icon: <Info size={24} />,
                title: currentFieldData.label,
                subtitle:
                    currentField === "title"
                        ? t("plan_title_subtitle")
                        : currentField === "summary"
                        ? t("plan_summary_subtitle")
                        : "",
            };
        }
        return null;
    };

    const headerContent = getTitleAndSubtitle();

    if (!headerContent) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {headerContent.icon}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {headerContent.title}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {headerContent.subtitle}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-8">
                <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ProgressHeader;
