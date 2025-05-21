import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import { useTranslation } from "react-i18next";

import {
    CheckCircleIcon,
    ClockIcon,
    DocumentArrowDownIcon,
    PencilIcon,
    SparklesIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    LockClosedIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    UsersIcon,
    ChartPieIcon,
    BuildingOfficeIcon,
    ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export default function Show({ auth, plan, canGeneratePDF, isPremium }) {
    const { t, i18n } = useTranslation();
    const [expandedSection, setExpandedSection] = useState(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Get current language
    const isArabic = i18n.language === "ar";

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true);
        try {
            window.open(`/plans/${plan.id}/pdf`, "_blank");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const getStatusInfo = () => {
        const statusMap = {
            draft: {
                icon: ClockIcon,
                text: t("plans.status.draft"),
                color: "text-yellow-600",
                bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
                borderColor: "border-yellow-300 dark:border-yellow-700",
            },
            completed: {
                icon: CheckCircleIcon,
                text: t("plans.status.completed"),
                color: "text-green-600 dark:text-green-400",
                bgColor: "bg-green-100 dark:bg-green-900/20",
                borderColor: "border-green-300 dark:border-green-700",
            },
            generating: {
                icon: ClockIcon,
                text: t("plans.status.generating"),
                color: "text-blue-600 dark:text-blue-400",
                bgColor: "bg-blue-100 dark:bg-blue-900/20",
                borderColor: "border-blue-300 dark:border-blue-700",
            },
            failed: {
                icon: ClockIcon,
                text: t("plans.status.failed"),
                color: "text-red-600 dark:text-red-400",
                bgColor: "bg-red-100 dark:bg-red-900/20",
                borderColor: "border-red-300 dark:border-red-700",
            },
            premium: {
                icon: SparklesIcon,
                text: t("plans.status.premium"),
                color: "text-purple-600 dark:text-purple-400",
                bgColor: "bg-purple-100 dark:bg-purple-900/20",
                borderColor: "border-purple-300 dark:border-purple-700",
            },
        };

        return (
            statusMap[plan.status] || {
                icon: ClockIcon,
                text: t("plans.status.unknown"),
                color: "text-gray-600 dark:text-gray-400",
                bgColor: "bg-gray-100 dark:bg-gray-900/20",
                borderColor: "border-gray-300 dark:border-gray-700",
            }
        );
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    // Get sections from ai_analysis if available
    let aiAnalysis = {};

    // Check if plan.ai_analysis exists and handle different data types
    if (plan.ai_analysis) {
        if (typeof plan.ai_analysis === "string") {
            try {
                aiAnalysis = JSON.parse(plan.ai_analysis);
            } catch (e) {
                aiAnalysis = {};
            }
        } else if (typeof plan.ai_analysis === "object") {
            aiAnalysis = plan.ai_analysis;
        }
    }

    const sectionsData = {
        executive_summary: {
            title: t("plans.sections.executive_summary"),
            content: aiAnalysis.executive_summary,
            completed: !!aiAnalysis.executive_summary,
        },
        market_analysis: {
            title: t("plans.sections.market_analysis"),
            content: aiAnalysis.market_analysis,
            completed: !!aiAnalysis.market_analysis,
        },
        swot_analysis: {
            title: t("plans.sections.swot_analysis"),
            content: aiAnalysis.swot_analysis,
            completed: !!aiAnalysis.swot_analysis,
        },
        marketing_strategy: {
            title: t("plans.sections.marketing_strategy"),
            content: aiAnalysis.marketing_strategy,
            completed: !!aiAnalysis.marketing_strategy,
        },
        financial_plan: {
            title: t("plans.sections.financial_plan"),
            content: aiAnalysis.financial_plan,
            completed: !!aiAnalysis.financial_plan,
        },
        operational_plan: {
            title: t("plans.sections.operational_plan"),
            content: aiAnalysis.operational_plan,
            completed: !!aiAnalysis.operational_plan,
        },
    };

    const completedSections = Object.values(sectionsData).filter(
        (section) => section.completed
    ).length;
    const totalSections = Object.keys(sectionsData).length;
    const completionPercentage = Math.round(
        (completedSections / totalSections) * 100
    );

    const sectionIcons = {
        executive_summary: ChartBarIcon,
        market_analysis: ChartPieIcon,
        marketing_strategy: UsersIcon,
        financial_plan: CurrencyDollarIcon,
        swot_analysis: ArrowTrendingUpIcon,
        operational_plan: BuildingOfficeIcon,
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Top Right Tools - Mode and Language Switchers */}
            <div className="mb-20">
                <TopTools />
            </div>

            <Head title={plan.title} />
            <StarBackground />

            <div className="py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {plan.title}
                                </h1>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}
                                >
                                    <StatusIcon className="h-4 w-4 mr-1.5" />
                                    {statusInfo.text}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/plans/${plan.id}/edit`}
                                    className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <PencilIcon className="h-4 w-4" />
                                    {t("common.edit")}
                                </Link>
                                {canGeneratePDF && (
                                    <button
                                        onClick={handleGeneratePDF}
                                        disabled={isGeneratingPDF}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <DocumentArrowDownIcon className="h-4 w-4" />
                                        {isGeneratingPDF
                                            ? t("plans.generating_pdf")
                                            : t("plans.download_pdf")}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t("plans.overall_progress")}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isArabic
                                        ? `${completedSections} من ${totalSections} أقسام مكتملة`
                                        : `${completedSections} of ${totalSections} sections completed`}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {completionPercentage}%
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {statusInfo.text}
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    style={{
                                        width: `${completionPercentage}%`,
                                    }}
                                    className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Project Info */}
                    {plan.project && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                {t("plans.project_info")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("plans.project_name")}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("plans.industry")}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.industry?.industry_name ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Business Type
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.business_type
                                            ?.business_type_name ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("plans.target_market")}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.target_market ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t("plans.location")}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.location ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Project Scale
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.project_scale ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Team Size
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.team_size
                                            ? `${plan.project.team_size} people`
                                            : t("common.not_specified")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Revenue Model
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.revenue_model ||
                                            t("common.not_specified")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Plan Sections */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                            {isArabic
                                ? "أقسام خطة العمل"
                                : "Business Plan Sections"}
                        </h3>

                        {/* Sections */}
                        <div className="space-y-4">
                            {Object.entries(sectionsData).map(
                                ([key, section]) => {
                                    const SectionIcon =
                                        sectionIcons[key] || ChartBarIcon;
                                    const isExpanded = expandedSection === key;
                                    // Temporarily disable premium lock since payment system is not implemented yet
                                    const isPremiumSection = false; // Set to false to show all sections
                                    const isLocked = false; // Set to false to allow access to all sections

                                    return (
                                        <div
                                            key={key}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() =>
                                                    setExpandedSection(
                                                        isExpanded ? null : key
                                                    )
                                                }
                                                className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                disabled={isLocked}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <SectionIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {section.title}
                                                    </span>
                                                    {section.completed &&
                                                        !isLocked && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                                                {t(
                                                                    "plans.status.completed_section"
                                                                )}
                                                            </span>
                                                        )}
                                                    {isLocked && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                                                            {t(
                                                                "plans.premium_content"
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                {isLocked ? (
                                                    <LockClosedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                ) : isExpanded ? (
                                                    <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                                )}
                                            </button>

                                            {isExpanded && !isLocked && (
                                                <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                                    {section.completed &&
                                                    section.content ? (
                                                        <div
                                                            className="prose prose-gray dark:prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{
                                                                __html: section.content,
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="text-center py-8">
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                                {t(
                                                                    "plans.section_not_completed"
                                                                )}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                                {t(
                                                                    "plans.start_filling_info"
                                                                )}
                                                            </p>
                                                            <Link
                                                                href={`/plans/${plan.id}/edit`}
                                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                {t(
                                                                    "plans.complete_section"
                                                                )}
                                                            </Link>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {isExpanded && isLocked && (
                                                <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-center">
                                                    <LockClosedIcon className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                                                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                        {isArabic
                                                            ? "محتوى مدفوع"
                                                            : "Premium Content"}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                        {isArabic
                                                            ? "الخطة المالية والخطة التشغيلية متاحة للمشتركين المدفوعين فقط."
                                                            : "Financial and operational plans are available to premium subscribers only."}
                                                    </p>
                                                    <Link
                                                        href="/subscription"
                                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                    >
                                                        {t(
                                                            "plans.upgrade_subscription"
                                                        )}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced CSS for content display */}
            <style>{`
                .prose {
                    line-height: 1.75;
                }
                .prose h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    margin-top: 1.5rem;
                    color: #111827;
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 0.5rem;
                }
                .dark .prose h2 {
                    color: #f9fafb;
                    border-bottom-color: #374151;
                }
                .prose h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 0.75rem;
                    margin-top: 1.25rem;
                    color: #111827;
                }
                .dark .prose h3 {
                    color: #f9fafb;
                }
                .prose p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                    color: #374151;
                    text-align: justify;
                }
                .dark .prose p {
                    color: #d1d5db;
                }
                .prose strong {
                    font-weight: 600;
                    color: #111827;
                }
                .dark .prose strong {
                    color: #f9fafb;
                }
                .prose ul, .prose ol {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                .prose li {
                    margin-bottom: 0.5rem;
                    color: #374151;
                }
                .dark .prose li {
                    color: #d1d5db;
                }
                .prose br {
                    display: block;
                    margin: 0.5rem 0;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
