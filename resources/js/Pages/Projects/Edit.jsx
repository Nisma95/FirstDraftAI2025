import React, { useState, useRef, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeft,
    Save,
    Building2,
    Target,
    MapPin,
    Users,
    DollarSign,
    Package,
    Lightbulb,
    BarChart3,
    Briefcase,
    FileText,
    ChevronDown,
    Sparkles,
    Zap,
    Loader,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TopTools from "@/Components/TopTools";

export default function Edit({ auth, project, industries, businessTypes }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    // Use regular React state instead of Inertia's useForm
    const [formData, setFormData] = useState({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "new_project",
        industry_id: project.industry_id || "",
        business_type_id: project.business_type_id || "",
        target_market: project.target_market || "",
        location: project.location || "",
        main_product_service: project.main_product_service || "",
        team_size: project.team_size || "",
        project_scale: project.project_scale || "",
        revenue_model: project.revenue_model || "",
        main_differentiator: project.main_differentiator || "",
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleBack = () => {
        router.get(route("projects.show", project.id));
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await router.put(route("projects.update", project.id), formData, {
                onSuccess: () => {
                    router.get(route("projects.show", project.id));
                },
                onError: (errors) => {
                    setErrors(errors);
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
        } catch (error) {
            setProcessing(false);
            console.error("Error updating project:", error);
        }
    };

    // Form field component
    const FormField = ({ label, children, error }) => (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <TopTools />
            <Head title={`${t("projects.edit_project")} - ${project.name}`} />

            <div className="min-h-screen py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="relative">
                                <div className="flex items-center gap-4 mb-4">
                                    <button
                                        onClick={handleBack}
                                        className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                        title={t("common.back")}
                                    >
                                        <ArrowLeft
                                            size={24}
                                            className={
                                                isRTL ? "rotate-180" : ""
                                            }
                                        />
                                    </button>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                                    {t("projects.edit_project")}
                                </h1>
                                <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
                                    {project.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Basic Information */}
                            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <Package
                                            className="text-indigo-600 dark:text-indigo-400"
                                            size={24}
                                        />
                                    </div>
                                    {t("projects.basic_information")}
                                </h2>

                                <div className="space-y-6">
                                    {/* Project Name */}
                                    <FormField
                                        label={t("projects.project_name")}
                                        error={errors.name}
                                    >
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100"
                                            placeholder={t(
                                                "projects.enter_project_name"
                                            )}
                                        />
                                    </FormField>

                                    {/* Project Description */}
                                    <FormField
                                        label={t("common.description")}
                                        error={errors.description}
                                    >
                                        <div className="relative">
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows={4}
                                                className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-gray-900 dark:text-gray-100"
                                                placeholder={t(
                                                    "projects.strat_writing_the_ai_will_help_you_enhance_it"
                                                )}
                                                style={{
                                                    minHeight: "100px",
                                                    maxHeight: "300px",
                                                    overflow: "auto",
                                                }}
                                            />
                                            <FileText
                                                className="absolute top-3 right-3 text-gray-400 pointer-events-none"
                                                size={20}
                                            />
                                        </div>
                                    </FormField>

                                    {/* Status */}
                                    <FormField
                                        label={t("projects.project_type")}
                                        error={errors.status}
                                    >
                                        <div className="relative">
                                            <select
                                                value={formData.status}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "status",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-100 appearance-none"
                                            >
                                                <option value="new_project">
                                                    {t("projects.new_business")}
                                                </option>
                                                <option value="existed_project">
                                                    {t(
                                                        "projects.existing_business"
                                                    )}
                                                </option>
                                            </select>
                                            <ChevronDown
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                size={20}
                                            />
                                        </div>
                                    </FormField>

                                    {/* Industry & Business Type */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormField
                                            label={t("projects.industry")}
                                            error={errors.industry_id}
                                        >
                                            <div className="relative">
                                                <Building2
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none"
                                                    size={20}
                                                />
                                                <select
                                                    value={formData.industry_id}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "industry_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 appearance-none"
                                                >
                                                    <option value="">
                                                        {t(
                                                            "projects.select_industry"
                                                        )}
                                                    </option>
                                                    {industries.map(
                                                        (industry) => (
                                                            <option
                                                                key={
                                                                    industry.id
                                                                }
                                                                value={
                                                                    industry.id
                                                                }
                                                            >
                                                                {
                                                                    industry.industry_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                    size={20}
                                                />
                                            </div>
                                        </FormField>

                                        <FormField
                                            label={t("projects.business_type")}
                                            error={errors.business_type_id}
                                        >
                                            <div className="relative">
                                                <Briefcase
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-600 pointer-events-none"
                                                    size={20}
                                                />
                                                <select
                                                    value={
                                                        formData.business_type_id
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "business_type_id",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-gray-100 appearance-none"
                                                >
                                                    <option value="">
                                                        {t(
                                                            "projects.select_business_type"
                                                        )}
                                                    </option>
                                                    {businessTypes.map(
                                                        (type) => (
                                                            <option
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                {
                                                                    type.business_type_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                    size={20}
                                                />
                                            </div>
                                        </FormField>
                                    </div>

                                    {/* Target Market & Location */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <FormField
                                            label={t("projects.target_market")}
                                            error={errors.target_market}
                                        >
                                            <div className="relative">
                                                <Target
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 pointer-events-none"
                                                    size={20}
                                                />
                                                <input
                                                    type="text"
                                                    value={
                                                        formData.target_market
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "target_market",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-gray-100"
                                                    placeholder={t(
                                                        "projects.enter_target_market"
                                                    )}
                                                />
                                            </div>
                                        </FormField>

                                        <FormField
                                            label={t("projects.location")}
                                            error={errors.location}
                                        >
                                            <div className="relative">
                                                <MapPin
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 pointer-events-none"
                                                    size={20}
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "location",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-gray-100"
                                                    placeholder={t(
                                                        "projects.enter_location"
                                                    )}
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="space-y-6">
                                {/* Project Scale & Team */}
                                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                            <BarChart3
                                                className="text-purple-600 dark:text-purple-400"
                                                size={20}
                                            />
                                        </div>
                                        {t("projects.scale_and_team")}
                                    </h3>
                                    <div className="space-y-4">
                                        <FormField
                                            label={t("projects.project_scale")}
                                            error={errors.project_scale}
                                        >
                                            <div className="relative">
                                                <select
                                                    value={
                                                        formData.project_scale
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "project_scale",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 dark:text-gray-100 appearance-none"
                                                >
                                                    <option value="">
                                                        {t(
                                                            "projects.select_project_scale"
                                                        )}
                                                    </option>
                                                    <option value="small">
                                                        {t(
                                                            "projects.small_project"
                                                        )}
                                                    </option>
                                                    <option value="medium">
                                                        {t(
                                                            "projects.medium_project"
                                                        )}
                                                    </option>
                                                    <option value="large">
                                                        {t(
                                                            "projects.large_project"
                                                        )}
                                                    </option>
                                                </select>
                                                <ChevronDown
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                                    size={20}
                                                />
                                            </div>
                                        </FormField>

                                        <FormField
                                            label={t("projects.team_size")}
                                            error={errors.team_size}
                                        >
                                            <div className="relative">
                                                <Users
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 pointer-events-none"
                                                    size={20}
                                                />
                                                <input
                                                    type="number"
                                                    value={formData.team_size}
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "team_size",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
                                                    placeholder={t(
                                                        "projects.enter_team_size"
                                                    )}
                                                    min="0"
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                </div>

                                {/* Business Details */}
                                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                                            <DollarSign
                                                className="text-green-600 dark:text-green-400"
                                                size={20}
                                            />
                                        </div>
                                        {t("projects.business_details")}
                                    </h3>
                                    <div className="space-y-4">
                                        <FormField
                                            label={t(
                                                "projects.main_product_service"
                                            )}
                                            error={errors.main_product_service}
                                        >
                                            <textarea
                                                value={
                                                    formData.main_product_service
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "main_product_service",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y text-gray-900 dark:text-gray-100"
                                                placeholder={t(
                                                    "projects.describe_main_product_service"
                                                )}
                                                style={{
                                                    minHeight: "80px",
                                                    maxHeight: "200px",
                                                    overflow: "auto",
                                                }}
                                            />
                                        </FormField>

                                        <FormField
                                            label={t("projects.revenue_model")}
                                            error={errors.revenue_model}
                                        >
                                            <textarea
                                                value={formData.revenue_model}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "revenue_model",
                                                        e.target.value
                                                    )
                                                }
                                                rows={3}
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y text-gray-900 dark:text-gray-100"
                                                placeholder={t(
                                                    "projects.describe_revenue_model"
                                                )}
                                                style={{
                                                    minHeight: "80px",
                                                    maxHeight: "200px",
                                                    overflow: "auto",
                                                }}
                                            />
                                        </FormField>

                                        <FormField
                                            label={t(
                                                "projects.main_differentiator"
                                            )}
                                            error={errors.main_differentiator}
                                        >
                                            <div className="relative">
                                                <textarea
                                                    value={
                                                        formData.main_differentiator
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            "main_differentiator",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={3}
                                                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-y text-gray-900 dark:text-gray-100"
                                                    placeholder={t(
                                                        "projects.describe_main_differentiator"
                                                    )}
                                                    style={{
                                                        minHeight: "80px",
                                                        maxHeight: "200px",
                                                        overflow: "auto",
                                                    }}
                                                />
                                                <Lightbulb
                                                    className="absolute top-3 right-3 text-yellow-500 pointer-events-none"
                                                    size={20}
                                                />
                                            </div>
                                        </FormField>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 justify-center"
                            >
                                {processing ? (
                                    <Loader
                                        className="animate-spin"
                                        size={20}
                                    />
                                ) : (
                                    <Save size={20} />
                                )}
                                {processing
                                    ? t("common.loading")
                                    : t("common.save")}
                                {!processing && (
                                    <Sparkles
                                        size={16}
                                        className="text-yellow-300"
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleBack}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl flex items-center gap-3 justify-center"
                            >
                                <ArrowLeft
                                    size={20}
                                    className={isRTL ? "rotate-180" : ""}
                                />
                                {t("common.cancel")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
