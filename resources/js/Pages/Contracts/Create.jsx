import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    Loader2,
    FileText,
    Sparkles,
    ChevronLeft,
    ArrowLeft,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";

export default function CreateContract({ auth, contractTypes }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedType, setSelectedType] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        contract_type: "",
        contract_details: {},
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsGenerating(true);

        // Use axios directly with custom timeout for this request
        const formData = {
            title: data.title,
            contract_type: data.contract_type,
            contract_details: data.contract_details,
        };

        window.axios
            .post(route("contracts.store"), formData, {
                timeout: 120000, // 2 minutes timeout
            })
            .then((response) => {
                setIsGenerating(false);
                // Handle success
                if (response.data.success) {
                    window.location.href = response.data.redirect;
                }
            })
            .catch((error) => {
                setIsGenerating(false);
                console.error("Contract creation failed:", error);

                if (error.code === "ECONNABORTED") {
                    alert(
                        "Request timed out. The AI is taking longer than expected. Please try again."
                    );
                } else {
                    alert(
                        "Failed to create contract. Please check your internet connection and try again."
                    );
                }
            });
    };

    const handleContractTypeChange = (value) => {
        setSelectedType(value);
        setData("contract_type", value);
        // Reset contract details when type changes
        setData("contract_details", {});
    };

    const updateContractDetails = (key, value) => {
        setData("contract_details", {
            ...data.contract_details,
            [key]: value,
        });
    };

    const renderContractFields = () => {
        const fields = getFieldsForContractType(selectedType);

        return fields.map((field) => (
            <motion.div
                key={field.key}
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <label
                    htmlFor={field.key}
                    className="block text-sm font-semibold text-gray-900 dark:text-white"
                >
                    {field.label}
                    {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </label>

                {field.type === "textarea" ? (
                    <textarea
                        id={field.key}
                        placeholder={field.placeholder}
                        value={data.contract_details[field.key] || ""}
                        onChange={(e) =>
                            updateContractDetails(field.key, e.target.value)
                        }
                        className={`w-full min-h-[120px] px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 transition-all duration-300 ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                        dir={isRTL ? "rtl" : "ltr"}
                    />
                ) : field.type === "select" ? (
                    <select
                        value={data.contract_details[field.key] || ""}
                        onChange={(e) =>
                            updateContractDetails(field.key, e.target.value)
                        }
                        className={`w-full h-[3.5rem] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 transition-all duration-300 ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={field.key}
                        type={field.type || "text"}
                        placeholder={field.placeholder}
                        value={data.contract_details[field.key] || ""}
                        onChange={(e) =>
                            updateContractDetails(field.key, e.target.value)
                        }
                        className={`w-full h-[3.5rem] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 transition-all duration-300 ${
                            isRTL ? "text-right" : "text-left"
                        }`}
                        dir={isRTL ? "rtl" : "ltr"}
                    />
                )}

                {field.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {field.description}
                    </p>
                )}
            </motion.div>
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t("create_contract", "Create Contract")} />

            {/* Top Tools */}
            <div className="mb-8">
                <TopTools />
            </div>

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <div className="min-h-screen py-8 px-4 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <motion.button
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                whileHover={{ x: isRTL ? 5 : -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isRTL ? (
                                    <ChevronLeft size={20} />
                                ) : (
                                    <ArrowLeft size={20} />
                                )}
                                <span className="font-medium">
                                    {t("back", "Back")}
                                </span>
                            </motion.button>
                        </div>

                        <div className="text-center">
                            <motion.div
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    duration: 0.8,
                                    delay: 0.2,
                                }}
                            >
                                <FileText className="w-8 h-8 text-white" />
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {t("create_ai_contract", "Create AI Contract")}
                            </motion.h1>

                            <motion.p
                                className="text-gray-600 dark:text-gray-400 text-lg font-medium"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {t(
                                    "generate_professional_contracts",
                                    "Generate professional contracts with AI"
                                )}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Main Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
                    >
                        <div className="p-8 space-y-8">
                            {/* Contract Title */}
                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <label
                                    htmlFor="title"
                                    className="block text-sm font-semibold text-gray-900 dark:text-white"
                                >
                                    {t("contract_title", "Contract Title")}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder={t(
                                        "enter_contract_title",
                                        "Enter a descriptive title for your contract"
                                    )}
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className={`w-full h-[3.5rem] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 transition-all duration-300 ${
                                        isRTL ? "text-right" : "text-left"
                                    }`}
                                    dir={isRTL ? "rtl" : "ltr"}
                                />
                                {errors.title && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors.title}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Contract Type Selection */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.2 }}
                            >
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white">
                                    {t("contract_type", "Contract Type")}{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(contractTypes).map(
                                        ([key, typeInfo]) => (
                                            <motion.div
                                                key={key}
                                                onClick={() =>
                                                    handleContractTypeChange(
                                                        key
                                                    )
                                                }
                                                className={`p-6 rounded-lg cursor-pointer text-center transition-all duration-300 ${
                                                    data.contract_type === key
                                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl"
                                                        : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white"
                                                }`}
                                                whileTap={{ scale: 0.95 }}
                                                whileHover={{ scale: 1.02 }}
                                            >
                                                <h3 className="text-lg font-semibold mb-2">
                                                    {typeInfo.label}
                                                </h3>
                                                <p className="text-sm opacity-80">
                                                    {typeInfo.description}
                                                </p>
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                {errors.contract_type && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="text-sm text-red-600 dark:text-red-400"
                                    >
                                        {errors.contract_type}
                                    </motion.p>
                                )}
                            </motion.div>

                            {/* Dynamic Contract Fields */}
                            {selectedType && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-6 p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-gray-200/50 dark:border-gray-600/30"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        {t(
                                            "contract_specific_info",
                                            "Contract Specific Information"
                                        )}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {renderContractFields()}
                                    </div>
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <motion.div
                                className="flex justify-center pt-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                            >
                                <motion.button
                                    onClick={handleSubmit}
                                    disabled={
                                        processing ||
                                        isGenerating ||
                                        !data.title ||
                                        !data.contract_type
                                    }
                                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-indigo-500/30 disabled:shadow-none disabled:cursor-not-allowed"
                                    whileHover={{
                                        scale:
                                            processing || isGenerating
                                                ? 1
                                                : 1.05,
                                    }}
                                    whileTap={{
                                        scale:
                                            processing || isGenerating
                                                ? 1
                                                : 0.95,
                                    }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-3">
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>
                                                    {t(
                                                        "generating_contract",
                                                        "Generating Contract..."
                                                    )}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                <span>
                                                    {t(
                                                        "generate_contract_pdf",
                                                        "Generate Contract & PDF"
                                                    )}
                                                </span>
                                                <FileText className="w-5 h-5" />
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Helper function to get fields based on contract type
function getFieldsForContractType(contractType) {
    const fieldMappings = {
        employment: [
            {
                key: "employee_name",
                label: "Employee Name",
                type: "text",
                required: true,
                placeholder: "Full name of employee",
            },
            {
                key: "employer_name",
                label: "Employer Name",
                type: "text",
                required: true,
                placeholder: "Company or employer name",
            },
            {
                key: "position",
                label: "Job Position",
                type: "text",
                required: true,
                placeholder: "Job title or position",
            },
            {
                key: "salary",
                label: "Salary",
                type: "text",
                required: true,
                placeholder: "Annual salary or hourly rate",
            },
            {
                key: "start_date",
                label: "Start Date",
                type: "date",
                required: true,
            },
            {
                key: "benefits",
                label: "Benefits",
                type: "textarea",
                placeholder: "Health insurance, vacation days, etc.",
            },
        ],
        service: [
            {
                key: "service_provider",
                label: "Service Provider",
                type: "text",
                required: true,
                placeholder: "Name of service provider",
            },
            {
                key: "client_name",
                label: "Client Name",
                type: "text",
                required: true,
                placeholder: "Name of client",
            },
            {
                key: "service_description",
                label: "Service Description",
                type: "textarea",
                required: true,
                placeholder: "Detailed description of services",
            },
            {
                key: "payment_terms",
                label: "Payment Terms",
                type: "text",
                required: true,
                placeholder: "Payment amount and schedule",
            },
            {
                key: "duration",
                label: "Service Duration",
                type: "text",
                placeholder: "Length of service period",
            },
        ],
        rental: [
            {
                key: "landlord_name",
                label: "Landlord Name",
                type: "text",
                required: true,
                placeholder: "Property owner name",
            },
            {
                key: "tenant_name",
                label: "Tenant Name",
                type: "text",
                required: true,
                placeholder: "Renter name",
            },
            {
                key: "property_address",
                label: "Property Address",
                type: "textarea",
                required: true,
                placeholder: "Full property address",
            },
            {
                key: "monthly_rent",
                label: "Monthly Rent",
                type: "text",
                required: true,
                placeholder: "Monthly rental amount",
            },
            {
                key: "lease_term",
                label: "Lease Term",
                type: "text",
                required: true,
                placeholder: "Duration of lease",
            },
            {
                key: "security_deposit",
                label: "Security Deposit",
                type: "text",
                placeholder: "Security deposit amount",
            },
        ],
        nda: [
            {
                key: "disclosing_party",
                label: "Disclosing Party",
                type: "text",
                required: true,
                placeholder: "Party sharing information",
            },
            {
                key: "receiving_party",
                label: "Receiving Party",
                type: "text",
                required: true,
                placeholder: "Party receiving information",
            },
            {
                key: "confidential_info",
                label: "Confidential Information",
                type: "textarea",
                required: true,
                placeholder: "Description of confidential information",
            },
            {
                key: "duration",
                label: "Agreement Duration",
                type: "text",
                required: true,
                placeholder: "How long the NDA lasts",
            },
            {
                key: "purpose",
                label: "Purpose",
                type: "textarea",
                placeholder: "Purpose of information sharing",
            },
        ],
        freelance: [
            {
                key: "freelancer_name",
                label: "Freelancer Name",
                type: "text",
                required: true,
                placeholder: "Freelancer full name",
            },
            {
                key: "client_name",
                label: "Client Name",
                type: "text",
                required: true,
                placeholder: "Client or company name",
            },
            {
                key: "project_description",
                label: "Project Description",
                type: "textarea",
                required: true,
                placeholder: "Detailed project scope",
            },
            {
                key: "payment_amount",
                label: "Payment Amount",
                type: "text",
                required: true,
                placeholder: "Total project cost",
            },
            {
                key: "deadline",
                label: "Project Deadline",
                type: "date",
                required: true,
            },
            {
                key: "deliverables",
                label: "Deliverables",
                type: "textarea",
                placeholder: "What will be delivered",
            },
        ],
    };

    return fieldMappings[contractType] || [];
}
