// Components/ProjectCreation/ProjectDetailsStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";
import FormField from "./FormField";
import NextButton from "./NextButton";
import CustomScrollbarStyles from "./CustomScrollbarStyles";

export default function ProjectDetailsStep({
    fields,
    currentField,
    currentFieldData,
    data,
    errors,
    canProceed,
    isLastField,
    getCurrentFieldIndex,
    getProgressPercentage,
    onInputChange,
    onKeyPress,
    onNextStep,
    onPrevious,
    isRTL,
    // AI Enhancement props
    onEnhanceDescription,
    isEnhancingDescription,
    hasMinimumWords,
    hasRequiredDataForAI,
    setData,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div className="mb-6">
                <ProjectCreationHeader
                    currentStep={getCurrentFieldIndex()}
                    totalSteps={fields.length}
                    onBack={onPrevious}
                    title={currentFieldData?.label}
                />
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-8">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${getProgressPercentage()}%`,
                        }}
                    ></div>
                </div>
            </div>

            <FormField
                field={currentField}
                fieldData={currentFieldData}
                value={data[currentField]}
                onChange={setData}
                onKeyPress={onKeyPress}
                canProceed={canProceed}
                onNext={onNextStep}
                isRTL={isRTL}
                error={errors[currentField]}
                // AI Enhancement props
                onEnhanceDescription={onEnhanceDescription}
                isEnhancing={isEnhancingDescription}
                hasRequiredData={hasRequiredDataForAI}
                hasMinimumWords={hasMinimumWords}
            />

            <NextButton
                onNext={onNextStep}
                canProceed={canProceed}
                isLastField={isLastField()}
                isRTL={isRTL}
            />

            <CustomScrollbarStyles />
        </motion.div>
    );
}
