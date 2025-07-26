import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function useProjectCreation({
    industries = [],
    businessTypes = [],
}) {
    const { t, i18n } = useTranslation();

    // Navigation state
    const [step, setStep] = useState("select");
    const [projectStatus, setProjectStatus] = useState(null);
    const [currentField, setCurrentField] = useState("name");

    // AI state
    const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
    const [isGeneratingField, setIsGeneratingField] = useState(false);
    const [generatingFieldName, setGeneratingFieldName] = useState(null);

    // Error state
    const [fieldErrors, setFieldErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        status: "",
        industry_id: "",
        custom_industry: "",
        business_type_id: "",
        target_market: "",
        location: "",
        main_product_service: "",
        team_size: "",
        project_scale: "",
        revenue_model: "",
        main_differentiator: "",
    });

    const fields = [
        {
            key: "name",
            label: t("project_name"),
            placeholder: t("enter_project_name"),
            maxLength: 255,
            showAiButton: false,
        },
        {
            key: "description",
            label: t("project_description"),
            placeholder: t("strat_writing_the_ai_will_help_you_enhance_it"),
            type: "textarea",
            showAiButton: false,
        },
        {
            key: "target_market",
            label: t("target_market"),
            placeholder: t("enter_target_market"),
            type: "textarea",
            maxLength: 800,
            showAiButton: true,
        },
        {
            key: "location",
            label: t("location"),
            placeholder: t("enter_location"),
            type: "textarea",
            maxLength: 255,
            showAiButton: true,
        },
        {
            key: "main_product_service",
            label: t("main_product_service"),
            placeholder: t("describe_main_product_service"),
            type: "textarea",
            showAiButton: true,
        },
        {
            key: "team_size",
            label: t("team_size"),
            placeholder: t("enter_team_size"),
            type: "number",
            min: 1,
            max: 9999,
            showAiButton: false,
        },
        {
            key: "project_scale",
            label: t("project_scale"),
            placeholder: t("select_project_scale"),
            type: "select",
            showAiButton: false,
            options: [
                { value: "small", label: t("small_project") },
                { value: "medium", label: t("medium_project") },
                { value: "large", label: t("large_project") },
            ],
        },
        {
            key: "revenue_model",
            label: t("revenue_model"),
            placeholder: t("describe_revenue_model"),
            type: "textarea",
            maxLength: 500,
            showAiButton: true,
        },
        {
            key: "main_differentiator",
            label: t("main_differentiator"),
            placeholder: t("describe_main_differentiator"),
            type: "textarea",
            showAiButton: true,
        },
    ];

    // Ensure currentField is always valid
    useEffect(() => {
        if (
            step === "details" &&
            !fields.some((field) => field.key === currentField)
        ) {
            setCurrentField(fields[0]?.key || "name");
        }
    }, [step, currentField, fields]);

    // Field validation
    const validateField = (fieldKey, value) => {
        const field = fields.find((f) => f.key === fieldKey);
        if (!field) return null;

        // Required field validation
        if (
            !value &&
            fieldKey !== "team_size" &&
            fieldKey !== "project_scale"
        ) {
            return t("field_required");
        }

        // Max length validation
        if (field.maxLength && value && value.length > field.maxLength) {
            return t("max_length_error", { length: field.maxLength });
        }

        // Number validation
        if (fieldKey === "team_size" && value) {
            const numValue = parseInt(value);
            if (isNaN(numValue) || numValue < 1) {
                return t("min_value_error", { min: 1 });
            }
        }

        return null;
    };

    // Navigation handlers
    const handleStatusSelect = (isExisted) => {
        const status = isExisted ? "existed_project" : "new_project";
        setProjectStatus(isExisted);
        setData("status", status);
        setStep("industry");
    };

    const handleIndustrySelect = (industryId, customIndustryName = null) => {
        if (industryId === "other" || industryId === "other-temp") {
            // Find the real "Other" industry from database, or use a special ID
            const otherIndustry = industries.find(
                (industry) =>
                    industry.industry_name.toLowerCase().trim() === "other"
            );

            if (otherIndustry) {
                setData("industry_id", parseInt(otherIndustry.id));
            } else {
                // If "Other" doesn't exist in database, use a special identifier
                setData("industry_id", "other");
            }

            // Store the custom industry name for AI context
            setData("custom_industry", customIndustryName);
        } else {
            setData("industry_id", parseInt(industryId));
            setData("custom_industry", null); // Clear custom industry for regular selections
        }
        setStep("businessType");
    };

    const handleBusinessTypeSelect = (businessTypeId) => {
        setData("business_type_id", parseInt(businessTypeId));
        setStep("details");
    };

    const handlePrevious = () => {
        if (step === "industry") {
            setStep("select");
        } else if (step === "businessType") {
            setStep("industry");
        } else if (step === "details") {
            const currentIndex = fields.findIndex(
                (field) => field.key === currentField
            );
            if (currentIndex > 0) {
                setCurrentField(fields[currentIndex - 1].key);
            } else {
                setStep("businessType");
            }
        }
    };

    const handleNext = () => {
        const currentIndex = fields.findIndex(
            (field) => field.key === currentField
        );
        const error = validateField(currentField, data[currentField]);

        if (error) {
            setFieldErrors((prev) => ({ ...prev, [currentField]: error }));
            return;
        } else {
            setFieldErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[currentField];
                return newErrors;
            });
        }

        if (currentIndex < fields.length - 1) {
            setCurrentField(fields[currentIndex + 1].key);
        }
    };

    const handleSubmit = () => {
        // Validate all fields
        let hasErrors = false;
        const newFieldErrors = {};

        fields.forEach((field) => {
            const error = validateField(field.key, data[field.key]);
            if (error) {
                newFieldErrors[field.key] = error;
                hasErrors = true;
            }
        });

        if (hasErrors) {
            setFieldErrors(newFieldErrors);
            const firstErrorField = fields.find(
                (field) => newFieldErrors[field.key]
            );
            if (firstErrorField) {
                setCurrentField(firstErrorField.key);
            }
            return;
        }

        setFieldErrors({});
        setStep("creating");

        post(route("projects.store"), {
            onSuccess: () => {
                setStep("success");
                setTimeout(() => {
                    window.location.href = route("projects.index");
                }, 2000);
            },
            onError: (errors) => {
                // Map backend errors to field errors
                const newFieldErrors = {};
                let foundFieldError = false;

                Object.keys(errors).forEach((key) => {
                    if (fields.some((field) => field.key === key)) {
                        newFieldErrors[key] = errors[key];
                        foundFieldError = true;
                    }
                });

                if (foundFieldError) {
                    setFieldErrors(newFieldErrors);
                    const firstErrorField = fields.find(
                        (field) => newFieldErrors[field.key]
                    );
                    if (firstErrorField) {
                        setCurrentField(firstErrorField.key);
                    }
                }
                setStep("details");
            },
        });
    };

    const handleKeyPress = (e) => {
        // For non-textarea fields, Enter navigates to next
        if (
            e.key === "Enter" &&
            currentFieldData?.type !== "textarea" &&
            currentFieldData?.type !== "select"
        ) {
            e.preventDefault();
            const currentIndex = fields.findIndex(
                (field) => field.key === currentField
            );
            if (data[currentField] && data[currentField].toString().trim()) {
                if (currentIndex < fields.length - 1) {
                    handleNext();
                } else {
                    handleSubmit();
                }
            }
        }
        // For textarea fields, Ctrl+Enter navigates
        else if (
            e.key === "Enter" &&
            e.ctrlKey &&
            currentFieldData?.type === "textarea"
        ) {
            e.preventDefault();
            const currentIndex = fields.findIndex(
                (field) => field.key === currentField
            );
            if (data[currentField] && data[currentField].toString().trim()) {
                if (currentIndex < fields.length - 1) {
                    handleNext();
                } else {
                    handleSubmit();
                }
            }
        }
    };

    const handleInputChange = (e) => {
        if (currentField === "team_size") {
            const value = parseInt(e.target.value);
            if (value >= 0 || e.target.value === "") {
                setData(currentField, e.target.value);
                if (value > 0 || e.target.value === "") {
                    setFieldErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[currentField];
                        return newErrors;
                    });
                }
            }
        } else {
            setData(currentField, e.target.value);
            const field = fields.find((f) => f.key === currentField);
            if (
                field &&
                field.maxLength &&
                e.target.value.length > field.maxLength
            ) {
                setFieldErrors((prev) => ({
                    ...prev,
                    [currentField]: t("max_length_error", {
                        length: field.maxLength,
                    }),
                }));
            } else {
                setFieldErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[currentField];
                    return newErrors;
                });
            }
        }
    };

    const handleNextStep = () => {
        const currentIndex = fields.findIndex(
            (field) => field.key === currentField
        );
        const error = validateField(currentField, data[currentField]);

        if (error) {
            setFieldErrors((prev) => ({ ...prev, [currentField]: error }));
            return;
        }

        if (currentIndex < fields.length - 1) {
            handleNext();
        } else {
            handleSubmit();
        }
    };

    // AI functions
    const generateFieldContent = async () => {
        if (isGeneratingField || !data.industry_id || !data.business_type_id)
            return;

        setIsGeneratingField(true);
        setGeneratingFieldName(currentField);

        try {
            const response = await axios.post(
                route("ai.generate-field"),
                {
                    field: currentField,
                    project_data: {
                        name: data.name,
                        description: data.description,
                        industry_id: data.industry_id,
                        business_type_id: data.business_type_id,
                    },
                    language: i18n.language,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.data && response.data.content) {
                setData(currentField, response.data.content);
            }
        } catch (error) {
            console.error(
                `Failed to generate content for ${currentField}:`,
                error
            );
        } finally {
            setIsGeneratingField(false);
            setGeneratingFieldName(null);
        }
    };

    const enhanceFieldContent = async () => {
        if (
            isGeneratingField ||
            isEnhancingDescription ||
            !data.industry_id ||
            !data.business_type_id
        )
            return;
        if (!data[currentField] || !data[currentField].trim()) return;

        if (currentField === "description") {
            setIsEnhancingDescription(true);
        } else {
            setIsGeneratingField(true);
            setGeneratingFieldName(currentField);
        }

        try {
            const response = await axios.post(
                route("ai.enhance-field"),
                {
                    field: currentField,
                    current_content: data[currentField],
                    project_data: {
                        name: data.name,
                        description: data.description,
                        industry_id: data.industry_id,
                        business_type_id: data.business_type_id,
                    },
                    language: i18n.language,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (response.data && response.data.content) {
                setData(currentField, response.data.content);
            }
        } catch (error) {
            console.error(
                `Failed to enhance content for ${currentField}:`,
                error
            );
        } finally {
            if (currentField === "description") {
                setIsEnhancingDescription(false);
            } else {
                setIsGeneratingField(false);
                setGeneratingFieldName(null);
            }
        }
    };

    const handleAiButtonClick = () => {
        if (data[currentField] && data[currentField].trim()) {
            enhanceFieldContent();
        } else {
            generateFieldContent();
        }
    };

    // Computed values
    const currentFieldData =
        fields.find((field) => field.key === currentField) || fields[0];
    const getCurrentFieldIndex = () =>
        fields.findIndex((field) => field.key === currentField) + 1;
    const getProgressPercentage = () =>
        Math.round((getCurrentFieldIndex() / fields.length) * 100);
    const isLastField = () => getCurrentFieldIndex() === fields.length;
    const canProceed = () => {
        if (fieldErrors[currentField]) return false;
        if (isGeneratingField && generatingFieldName === currentField)
            return false;
        if (isEnhancingDescription && currentField === "description")
            return false;

        if (currentField === "team_size") {
            return (
                data[currentField] === "" ||
                (data[currentField] && parseInt(data[currentField]) > 0)
            );
        }
        if (currentFieldData?.type === "select") return true;
        return data[currentField] && data[currentField].toString().trim();
    };
    const shouldShowAiButton = currentFieldData?.showAiButton || false;
    const isAiButtonDisabled = !data.industry_id || !data.business_type_id;
    const getWordCount = (text) =>
        !text || !text.trim() ? 0 : text.trim().split(/\s+/).length;
    const hasMinimumWords = getWordCount(data.description) >= 3;
    const hasRequiredDataForAI =
        data.name && data.business_type_id && data.industry_id;

    return {
        // State
        step,
        projectStatus,
        currentField,
        data,
        errors: { ...errors, ...fieldErrors },
        processing,
        fields,
        currentFieldData,
        isEnhancingDescription,
        canProceed,
        getCurrentFieldIndex,
        getProgressPercentage,
        isLastField,
        isGeneratingField,
        generatingFieldName,
        fieldErrors,
        shouldShowAiButton,
        isAiButtonDisabled,
        hasMinimumWords,
        hasRequiredDataForAI,

        // Handlers
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
        enhanceAiDescription: enhanceFieldContent,
        generateFieldSuggestion: handleAiButtonClick,
    };
}
