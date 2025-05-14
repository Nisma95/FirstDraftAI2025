import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function useProjectCreation({
    industries = [],
    businessTypes = [],
}) {
    const { t, i18n } = useTranslation();

    // STEP FLOW: select → industry → businessType → details → creating → success
    const [step, setStep] = useState("select");
    const [projectStatus, setProjectStatus] = useState(null);
    const [currentField, setCurrentField] = useState("name");
    const [isGeneratingDescription, setIsGeneratingDescription] =
        useState(false);
    const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        description: "",
        status: "",
        industry_id: "",
        business_type_id: "",
        target_market: "",
        location: "",
        // إضافة الحقول الجديدة
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
        },
        {
            key: "description",
            label: t("project_description"),
            placeholder: t("enter_project_description"),
            type: "textarea",
        },
        {
            key: "target_market",
            label: t("target_market"),
            placeholder: t("enter_target_market"),
        },
        {
            key: "location",
            label: t("location"),
            placeholder: t("enter_location"),
        },
        // إضافة الحقول الجديدة
        {
            key: "main_product_service",
            label: t("main_product_service"),
            placeholder: t("describe_main_product_service"),
            type: "textarea",
        },
        {
            key: "team_size",
            label: t("team_size"),
            placeholder: t("enter_team_size"),
            type: "number",
        },
        {
            key: "project_scale",
            label: t("project_scale"),
            placeholder: t("select_project_scale"),
            type: "select",
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
        },
        {
            key: "main_differentiator",
            label: t("main_differentiator"),
            placeholder: t("describe_main_differentiator"),
            type: "textarea",
        },
    ];

    // FORWARD NAVIGATION HANDLERS

    // Step 1: select → industry
    const handleStatusSelect = (isExisted) => {
        console.log("STATUS SELECT: Going from 'select' to 'industry'");
        const status = isExisted ? "existed_project" : "new_project";
        setProjectStatus(isExisted);
        setData("status", status);
        setStep("industry");
    };

    // Step 2: industry → businessType
    const handleIndustrySelect = (industryId) => {
        console.log("INDUSTRY SELECT: Going from 'industry' to 'businessType'");
        console.log(
            "Selected industry ID:",
            industryId,
            "Type:",
            typeof industryId
        );
        setData("industry_id", parseInt(industryId));
        setStep("businessType");
    };

    // Step 3: businessType → details
    const handleBusinessTypeSelect = (businessTypeId) => {
        console.log(
            "BUSINESS TYPE SELECT: Going from 'businessType' to 'details'"
        );
        console.log(
            "Selected business type ID:",
            businessTypeId,
            "Type:",
            typeof businessTypeId
        );
        setData("business_type_id", parseInt(businessTypeId));
        setStep("details");
    };

    // BACKWARD NAVIGATION HANDLER
    const handlePrevious = () => {
        console.log("BACK BUTTON CLICKED from step:", step);

        if (step === "industry") {
            console.log("Going BACK from 'industry' to 'select'");
            setStep("select");
        } else if (step === "businessType") {
            console.log("Going BACK from 'businessType' to 'industry'");
            setStep("industry");
        } else if (step === "details") {
            const currentIndex = fields.findIndex(
                (field) => field.key === currentField
            );
            console.log("In details step, current field index:", currentIndex);

            if (currentIndex > 0) {
                console.log("Going BACK to previous field within details");
                setCurrentField(fields[currentIndex - 1].key);
            } else {
                console.log("Going BACK from 'details' to 'businessType'");
                setStep("businessType");
            }
        }
    };

    // DETAILS NAVIGATION
    const handleNext = () => {
        const currentIndex = fields.findIndex(
            (field) => field.key === currentField
        );
        if (currentIndex < fields.length - 1) {
            setCurrentField(fields[currentIndex + 1].key);
        }
    };

    const currentFieldData = fields.find((field) => field.key === currentField);

    const handleSubmit = () => {
        setStep("creating");
        post(route("projects.store"), {
            onSuccess: () => {
                setStep("success");
                setTimeout(() => {
                    window.location.href = route("projects.index");
                }, 2000);
            },
            onError: () => {
                setStep("details");
            },
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && currentFieldData?.type !== "select") {
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
        // تحديث خاص للحقول الرقمية
        if (currentField === "team_size") {
            // التأكد من أن القيمة رقم صحيح موجب
            const value = parseInt(e.target.value);
            if (value >= 0 || e.target.value === "") {
                setData(currentField, e.target.value);
            }
        } else {
            setData(currentField, e.target.value);
        }
    };

    // تحديث canProceed للحقول المختلفة
    const canProceed = (() => {
        if (currentField === "team_size") {
            // بالنسبة لحجم الفريق، يُسمح بالقيم الفارغة أو الأرقام الموجبة
            return (
                data[currentField] === "" ||
                (data[currentField] && parseInt(data[currentField]) > 0)
            );
        }
        if (currentFieldData?.type === "select") {
            // بالنسبة للحقول الاختيارية، يُسمح بالقيم الفارغة
            return true;
        }
        // باقي الحقول تحتاج قيمة غير فارغة
        return data[currentField] && data[currentField].toString().trim();
    })();

    const handleNextStep = () => {
        const currentIndex = fields.findIndex(
            (field) => field.key === currentField
        );
        if (currentIndex < fields.length - 1) {
            handleNext();
        } else {
            handleSubmit();
        }
    };

    // Generate AI description (for empty descriptions)
    const generateAiDescription = async () => {
        if (
            !data.name ||
            !data.business_type_id ||
            !data.industry_id ||
            !data.status
        ) {
            return;
        }

        setIsGeneratingDescription(true);

        try {
            const response = await axios.post(
                route("projects.generate-description"),
                {
                    name: data.name,
                    status: data.status,
                    industry_id: data.industry_id,
                    business_type_id: data.business_type_id,
                    language: i18n.language,
                }
            );

            if (response.data.success) {
                setData("description", response.data.description);
            }
        } catch (error) {
            console.error("Error generating AI description:", error);
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    // Enhance existing AI description
    const enhanceAiDescription = async () => {
        if (
            !data.description ||
            !data.name ||
            !data.business_type_id ||
            !data.industry_id ||
            !data.status
        ) {
            return;
        }

        setIsEnhancingDescription(true);

        try {
            const response = await axios.post(
                route("projects.enhance-description"),
                {
                    name: data.name,
                    status: data.status,
                    industry_id: data.industry_id,
                    business_type_id: data.business_type_id,
                    current_description: data.description,
                    language: i18n.language,
                },
                {
                    timeout: 30000, // Increase timeout to 30 seconds for AI calls
                }
            );

            if (response.data.success) {
                setData("description", response.data.description);
            }
        } catch (error) {
            console.error("Error enhancing AI description:", error);

            // Show user-friendly error message
            if (error.code === "ECONNABORTED") {
                alert(t("timeout_error")); // Add this translation
            } else if (error.response?.status === 404) {
                alert(t("route_not_found")); // Add this translation
            } else {
                alert(t("enhancement_failed")); // Add this translation
            }
        } finally {
            setIsEnhancingDescription(false);
        }
    };

    const getCurrentFieldIndex = () => {
        return fields.findIndex((f) => f.key === currentField) + 1;
    };

    const getProgressPercentage = () => {
        return (getCurrentFieldIndex() / fields.length) * 100;
    };

    const isLastField = () => {
        return (
            fields.findIndex((f) => f.key === currentField) ===
            fields.length - 1
        );
    };

    useEffect(() => {
        console.log("Current step:", step);
    }, [step]);

    return {
        // State
        step,
        projectStatus,
        currentField,
        data,
        errors,
        processing,
        fields,
        currentFieldData,
        isGeneratingDescription,
        isEnhancingDescription,

        // Computed values
        canProceed,
        getCurrentFieldIndex,
        getProgressPercentage,
        isLastField,

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
        generateAiDescription,
        enhanceAiDescription,
    };
}
