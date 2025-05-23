import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StarBackground from "@/Components/StarBackground";
import {
    DocumentTextIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    UsersIcon,
    CheckIcon,
    FlagIcon,
    Cog6ToothIcon,
    SparklesIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function Edit({ auth, plan }) {
    const [currentSection, setCurrentSection] = useState("basic");
    const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

    const sections = [
        { id: "basic", label: "المعلومات الأساسية", icon: DocumentTextIcon },
        {
            id: "finances",
            label: "التمويل والموازنة",
            icon: CurrencyDollarIcon,
        },
        { id: "market", label: "تحليل السوق", icon: ChartBarIcon },
        { id: "audiences", label: "الجمهور المستهدف", icon: UsersIcon },
        { id: "goals", label: "الأهداف والمهام", icon: FlagIcon },
        { id: "operations", label: "العمليات", icon: Cog6ToothIcon },
    ];

    const handleGenerateAI = async () => {
        setIsGeneratingAnalysis(true);
        router.post(
            route("plans.ai-analysis", plan.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsGeneratingAnalysis(false);
                },
                onError: () => {
                    setIsGeneratingAnalysis(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        تعديل: {plan.title}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleGenerateAI}
                            disabled={isGeneratingAnalysis}
                            className="fdButton flex items-center gap-2 disabled:opacity-50"
                        >
                            {isGeneratingAnalysis ? (
                                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                            ) : (
                                <SparklesIcon className="h-4 w-4" />
                            )}
                            {isGeneratingAnalysis
                                ? "جاري التحليل..."
                                : "تحديث التحليل الذكي"}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`تعديل: ${plan.title}`} />
            <StarBackground />

            <div className="py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="fdDiveCard overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav
                                className="-mb-px flex space-x-8 px-6"
                                aria-label="Tabs"
                            >
                                {sections.map((section) => {
                                    const Icon = section.icon;
                                    const isActive =
                                        currentSection === section.id;

                                    return (
                                        <button
                                            key={section.id}
                                            onClick={() =>
                                                setCurrentSection(section.id)
                                            }
                                            className={`
                                                py-4 px-1 text-sm font-medium inline-flex items-center gap-2 border-b-2 transition-colors
                                                ${
                                                    isActive
                                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                                                }
                                            `}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {section.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Section Content */}
                        <div className="p-6">
                            {currentSection === "basic" && (
                                <BasicInfoSection plan={plan} />
                            )}
                            {currentSection === "finances" && (
                                <FinancesSection plan={plan} />
                            )}
                            {currentSection === "market" && (
                                <MarketSection plan={plan} />
                            )}
                            {currentSection === "audiences" && (
                                <AudiencesSection plan={plan} />
                            )}
                            {currentSection === "goals" && (
                                <GoalsSection plan={plan} />
                            )}
                            {currentSection === "operations" && (
                                <OperationsSection plan={plan} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Basic Info Section Component
const BasicInfoSection = ({ plan }) => {
    const { data, setData, patch, processing, errors } = useForm({
        title: plan.title || "",
        summary: plan.summary || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route("plans.update", plan.id), {
            preserveScroll: true,
        });
    };

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    المعلومات الأساسية
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    تحديث المعلومات الأساسية لخطة العمل
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        عنوان خطة العمل
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="summary"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                        ملخص الخطة
                    </label>
                    <textarea
                        id="summary"
                        name="summary"
                        value={data.summary}
                        onChange={(e) => setData("summary", e.target.value)}
                        rows={6}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="اكتب ملخصاً شاملاً عن خطة العمل..."
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        سيتم استخدام هذا الملخص بواسطة الذكاء الاصطناعي لتحليل
                        الخطة وتقديم التوصيات
                    </p>
                    {errors.summary && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                            {errors.summary}
                        </p>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                        معلومات المشروع المرتبط
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                اسم المشروع
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {plan.project.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                الصناعة
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {plan.project.industry || "غير محدد"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                السوق المستهدف
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {plan.project.target_market || "غير محدد"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                الموقع
                            </p>
                            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {plan.project.location || "غير محدد"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="fdButton px-6 py-2 disabled:opacity-50"
                    >
                        {processing ? "جاري الحفظ..." : "حفظ التغييرات"}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Placeholder components for other sections
const FinancesSection = ({ plan }) => {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    التمويل والموازنة
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    إدارة التفاصيل المالية لمشروعك
                </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                    محتوى قسم التمويل والموازنة
                </p>
            </div>
        </div>
    );
};

const MarketSection = ({ plan }) => {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    تحليل السوق
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    تحليل السوق والمنافسة
                </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                    محتوى قسم تحليل السوق
                </p>
            </div>
        </div>
    );
};

const AudiencesSection = ({ plan }) => {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    الجمهور المستهدف
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    تحديد شرائح العملاء المستهدفة
                </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                    محتوى قسم الجمهور المستهدف
                </p>
            </div>
        </div>
    );
};

const GoalsSection = ({ plan }) => {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    الأهداف والمهام
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    تحديد الأهداف وخطط التنفيذ
                </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <FlagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                    محتوى قسم الأهداف والمهام
                </p>
            </div>
        </div>
    );
};

const OperationsSection = ({ plan }) => {
    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    العمليات التشغيلية
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    خطة العمليات والتشغيل
                </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                <Cog6ToothIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                    محتوى قسم العمليات التشغيلية
                </p>
            </div>
        </div>
    );
};
