// rescource/js/pages/Project/Create.jsx
import React from "react";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import useProjectCreation from "./ProjectCreation/useProjectCreation";

// Import all step components
import ProjectStatusStep from "./ProjectCreation/ProjectStatusStep";
import IndustrySelectionStep from "./ProjectCreation/IndustrySelectionStep";
import BusinessTypeSelectionStep from "./ProjectCreation/BusinessTypeSelectionStep";
import ProjectDetailsStep from "./ProjectCreation/ProjectDetailsStep";
import CreatingStep from "./ProjectCreation/CreatingStep";
import SuccessStep from "./ProjectCreation/SuccessStep";
import BackgroundAnimationStyles from "./ProjectCreation/BackgroundAnimationStyles";

export default function Create({ auth, industries = [], businessTypes = [] }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const {
    // Existing state
    step,
    projectStatus,
    currentField,
    data,
    errors,
    processing,
    fields,
    currentFieldData,
    isEnhancingDescription,
    canProceed,
    getCurrentFieldIndex,
    getProgressPercentage,
    isLastField,

    // NEW: AI Field Generation state
    isGeneratingField,
    generatingFieldName,
    fieldErrors,

    // Computed values
    shouldShowAiButton,
    isAiButtonDisabled,

    // Navigation handlers
    handleStatusSelect,
    handleIndustrySelect,
    handleBusinessTypeSelect,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleKeyPress,
    handleInputChange,
    handleNextStep,
    setCurrentField,
    setData,

    // AI functions
    enhanceAiDescription,
    generateFieldSuggestion, // NEW: Field generation function
  } = useProjectCreation({ industries, businessTypes });

  // Debug: Log current step
  console.log("Current step in Create component:", step);

  // Check if description has at least 3 words
  const getWordCount = (text) => {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  const hasMinimumWords = getWordCount(data.description) >= 3;

  // Check if required data exists for AI enhancement
  const hasRequiredDataForAI =
    data.name && data.business_type_id && data.industry_id;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t("create_project")} />

      <div className="min-h-screen flex items-center justify-center pt-32 pb-12 md:pt-40 md:pb-16 lg:pt-24 lg:pb-16 px-3 sm:px-4 lg:px-4 relative">
        {/* Top Right Tools - Mode and Language Switchers */}
        <TopTools />

        <div className="w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: PROJECT STATUS SELECTION */}
            {step === "select" && (
              <ProjectStatusStep
                projectStatus={projectStatus}
                onStatusSelect={handleStatusSelect}
              />
            )}

            {/* STEP 2: INDUSTRY SELECTION */}
            {step === "industry" && (
              <IndustrySelectionStep
                industries={industries}
                selectedIndustryId={data.industry_id}
                customIndustryName={data.custom_industry} // Add this line
                onIndustrySelect={handleIndustrySelect}
                onBack={handlePrevious}
              />
            )}

            {/* STEP 3: BUSINESS TYPE SELECTION */}
            {step === "businessType" && (
              <BusinessTypeSelectionStep
                businessTypes={businessTypes}
                selectedBusinessTypeId={data.business_type_id}
                onBusinessTypeSelect={handleBusinessTypeSelect}
                onBack={handlePrevious}
              />
            )}

            {/* STEP 4: PROJECT DETAILS */}
            {step === "details" && (
              <ProjectDetailsStep
                fields={fields}
                currentField={currentField}
                currentFieldData={currentFieldData}
                data={data}
                errors={errors}
                canProceed={canProceed}
                isLastField={isLastField}
                getCurrentFieldIndex={getCurrentFieldIndex}
                getProgressPercentage={getProgressPercentage}
                onInputChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onNextStep={handleNextStep}
                onPrevious={handlePrevious}
                isRTL={isRTL}
                // AI Enhancement props (existing)
                onEnhanceDescription={enhanceAiDescription}
                isEnhancingDescription={isEnhancingDescription}
                hasMinimumWords={hasMinimumWords}
                hasRequiredDataForAI={hasRequiredDataForAI}
                setData={setData}
                // NEW: AI Field Generation props
                shouldShowAiButton={shouldShowAiButton}
                isAiButtonDisabled={isAiButtonDisabled}
                onGenerateField={generateFieldSuggestion}
                isGeneratingField={isGeneratingField}
                generatingFieldName={generatingFieldName}
                fieldErrors={fieldErrors}
              />
            )}

            {/* STEP 5: CREATING */}
            {step === "creating" && <CreatingStep />}

            {/* STEP 6: SUCCESS */}
            {step === "success" && <SuccessStep />}
          </AnimatePresence>
        </div>
      </div>

      <BackgroundAnimationStyles />
    </AuthenticatedLayout>
  );
}
