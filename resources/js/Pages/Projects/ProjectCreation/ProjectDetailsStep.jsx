import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";
import FormField from "./FormField";
import NextButton from "./NextButton";
import CustomScrollbarStyles from "./CustomScrollbarStyles";

export default function ProjectDetailsStep({
    fields = [],
    currentField = "",
    currentFieldData = null,
    data = {},
    errors = {},
    canProceed = false,
    isLastField = () => false,
    getCurrentFieldIndex = () => 1,
    getProgressPercentage = () => 0,
    onInputChange = () => {},
    onKeyPress = () => {},
    onNextStep = () => {},
    onPrevious = () => {},
    isRTL = false,
    // AI Enhancement props (existing)
    onEnhanceDescription = () => {},
    isEnhancingDescription = false,
    hasMinimumWords = false,
    hasRequiredDataForAI = false,
    setData = () => {},
    // NEW: AI Field Generation props
    shouldShowAiButton = false,
    onGenerateField = () => {},
    isGeneratingField = false,
    generatingFieldName = null,
    fieldErrors = {},
    getAiButtonText = () => "Let AI answer for you", // Default value
}) {
    const { t } = useTranslation();

    // Handle form submission with preventDefault
    const handleSubmit = (e) => {
        e.preventDefault();
        if (canProceed) {
            onNextStep();
        }
    };

    // Safely get field label with fallback
    const getFieldLabel = () => {
        return currentFieldData?.label || t("field");
    };

    // Safely get current field index with fallback
    const safeGetCurrentFieldIndex = () => {
        try {
            return getCurrentFieldIndex() || 1;
        } catch (error) {
            console.error("Error getting current field index:", error);
            return 1;
        }
    };

    // Safely get progress percentage with fallback
    const safeGetProgressPercentage = () => {
        try {
            return getProgressPercentage() || 0;
        } catch (error) {
            console.error("Error getting progress percentage:", error);
            return 0;
        }
    };

    // Safely check if current field is last field with fallback
    const safeIsLastField = () => {
        try {
            return isLastField() || false;
        } catch (error) {
            console.error("Error checking if field is last:", error);
            return false;
        }
    };

    return (
        <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full px-3 sm:px-0" // Mobile padding
        >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {" "}
                {/* Responsive spacing */}
                <div className="mb-4 sm:mb-6">
                    {" "}
                    {/* Responsive margin */}
                    <ProjectCreationHeader
                        currentStep={safeGetCurrentFieldIndex()}
                        totalSteps={fields?.length || 1}
                        onBack={onPrevious}
                        title={getFieldLabel()}
                    />
                    {/* Mobile-optimized progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 dark:bg-gray-700 mb-6 sm:mb-8">
                        <div
                            className="bg-indigo-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${safeGetProgressPercentage()}%`,
                            }}
                        ></div>
                    </div>
                </div>
                <FormField
                    field={currentField}
                    fieldData={currentFieldData || {}}
                    value={data[currentField] || ""}
                    onChange={setData}
                    onKeyPress={onKeyPress}
                    canProceed={canProceed}
                    onNext={onNextStep}
                    isRTL={isRTL}
                    error={errors[currentField] || fieldErrors[currentField]}
                    // AI Enhancement props (existing)
                    onEnhanceDescription={onEnhanceDescription}
                    isEnhancing={isEnhancingDescription}
                    hasRequiredData={hasRequiredDataForAI}
                    hasMinimumWords={hasMinimumWords}
                    // NEW: AI Field Generation props
                    shouldShowAiButton={shouldShowAiButton}
                    onGenerateField={onGenerateField}
                    isGeneratingField={isGeneratingField}
                    generatingFieldName={generatingFieldName}
                    getAiButtonText={getAiButtonText}
                />
                <NextButton
                    onNext={onNextStep}
                    canProceed={canProceed}
                    isLastField={safeIsLastField()}
                    isRTL={isRTL}
                />
                <CustomScrollbarStyles />
            </form>
        </motion.div>
    );
}
