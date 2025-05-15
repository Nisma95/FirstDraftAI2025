import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StarBackground from "@/Components/StarBackground";

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
    const [expandedSection, setExpandedSection] = useState("executive_summary");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    // Get user language preference
    const isArabic = auth.user.language === "ar";

    const handleGeneratePDF = async () => {
        setIsGeneratingPDF(true);
        try {
            window.open(route("plans.pdf", plan.id), "_blank");
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const getStatusInfo = () => {
        const texts = {
            ar: {
                draft: "مسودة",
                completed: "مكتملة",
                generating: "جاري الإنشاء",
                failed: "فشل",
                premium: "متميزة",
                unknown: "غير محدد",
            },
            en: {
                draft: "Draft",
                completed: "Completed",
                generating: "Generating",
                failed: "Failed",
                premium: "Premium",
                unknown: "Unknown",
            },
        };

        const currentTexts = isArabic ? texts.ar : texts.en;

        switch (plan.status) {
            case "draft":
                return {
                    icon: ClockIcon,
                    text: currentTexts.draft,
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-100",
                    borderColor: "border-yellow-300",
                };
            case "completed":
                return {
                    icon: CheckCircleIcon,
                    text: currentTexts.completed,
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                    borderColor: "border-green-300",
                };
            case "generating":
                return {
                    icon: ClockIcon,
                    text: currentTexts.generating,
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                    borderColor: "border-blue-300",
                };
            case "failed":
                return {
                    icon: ClockIcon,
                    text: currentTexts.failed,
                    color: "text-red-600",
                    bgColor: "bg-red-100",
                    borderColor: "border-red-300",
                };
            case "premium":
                return {
                    icon: SparklesIcon,
                    text: currentTexts.premium,
                    color: "text-purple-600",
                    bgColor: "bg-purple-100",
                    borderColor: "border-purple-300",
                };
            default:
                return {
                    icon: ClockIcon,
                    text: currentTexts.unknown,
                    color: "text-gray-600",
                    bgColor: "bg-gray-100",
                    borderColor: "border-gray-300",
                };
        }
    };

    // Define translations object
    const translations = {
        ar: {
            edit: "تعديل",
            overall_progress: "التقدم العام",
            sections_completed: (completed, total) =>
                `${completed} من ${total} أقسام مكتملة`,
            project_info: "معلومات المشروع",
            project_name: "اسم المشروع",
            industry: "الصناعة",
            target_market: "السوق المستهدف",
            location: "الموقع",
            not_specified: "غير محدد",
            sections: {
                executive_summary: "الملخص التنفيذي",
                market_analysis: "تحليل السوق",
                swot_analysis: "تحليل SWOT",
                marketing_strategy: "الاستراتيجية التسويقية",
                financial_plan: "الخطة المالية",
                operational_plan: "الخطة التشغيلية",
            },
            completed_section: "مكتمل",
            incomplete: "غير مكتمل",
            premium_content: "محتوى متميز",
            premium_only: "هذا القسم متاح للمشتركين المتميزين فقط",
            upgrade_subscription: "ترقية الاشتراك",
            section_not_completed: "لم يتم إكمال هذا القسم بعد",
            start_filling_info: "ابدأ بتعبئة المعلومات المطلوبة لهذا القسم",
            complete_section: "إكمال القسم",
            last_updated: "آخر تحديث",
            ai_suggestions: "اقتراحات الذكاء الاصطناعي",
            suggestions_available: (count) => `${count} اقتراح متاح`,
            suggestion_types: {
                business: "استراتيجية عمل",
                marketing: "تسويق",
                financial: "مالية",
                operational: "تشغيلية",
                other: "عامة",
            },
            view_all_suggestions: (remaining) =>
                `عرض جميع الاقتراحات (${remaining} أكثر)`,
            generating_pdf: "جاري التحميل...",
            download_pdf: "تحميل PDF",
        },
        en: {
            edit: "Edit",
            overall_progress: "Overall Progress",
            sections_completed: (completed, total) =>
                `${completed} of ${total} sections completed`,
            project_info: "Project Information",
            project_name: "Project Name",
            industry: "Industry",
            target_market: "Target Market",
            location: "Location",
            not_specified: "Not specified",
            sections: {
                executive_summary: "Executive Summary",
                market_analysis: "Market Analysis",
                swot_analysis: "SWOT Analysis",
                marketing_strategy: "Marketing Strategy",
                financial_plan: "Financial Plan",
                operational_plan: "Operational Plan",
            },
            completed_section: "Completed",
            incomplete: "Incomplete",
            premium_content: "Premium Content",
            premium_only:
                "This section is available to premium subscribers only",
            upgrade_subscription: "Upgrade Subscription",
            section_not_completed: "This section has not been completed yet",
            start_filling_info:
                "Start filling in the required information for this section",
            complete_section: "Complete Section",
            last_updated: "Last updated",
            ai_suggestions: "AI Suggestions",
            suggestions_available: (count) => `${count} suggestions available`,
            suggestion_types: {
                business: "Business Strategy",
                marketing: "Marketing",
                financial: "Financial",
                operational: "Operational",
                other: "General",
            },
            view_all_suggestions: (remaining) =>
                `View all suggestions (${remaining} more)`,
            generating_pdf: "Generating...",
            download_pdf: "Download PDF",
        },
    };

    const t = isArabic ? translations.ar : translations.en;

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    // Get sections from ai_analysis if available
    const aiAnalysis = plan.ai_analysis || {};
    const sectionsData = {
        executive_summary: {
            title: t.sections.executive_summary,
            content: aiAnalysis.executive_summary,
            completed: !!aiAnalysis.executive_summary,
        },
        market_analysis: {
            title: t.sections.market_analysis,
            content: aiAnalysis.market_analysis,
            completed: !!aiAnalysis.market_analysis,
        },
        swot_analysis: {
            title: t.sections.swot_analysis,
            content: aiAnalysis.swot_analysis,
            completed: !!aiAnalysis.swot_analysis,
        },
        marketing_strategy: {
            title: t.sections.marketing_strategy,
            content: aiAnalysis.marketing_strategy,
            completed: !!aiAnalysis.marketing_strategy,
        },
        financial_plan: {
            title: t.sections.financial_plan,
            content: aiAnalysis.financial_plan,
            completed: !!aiAnalysis.financial_plan,
        },
        operational_plan: {
            title: t.sections.operational_plan,
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                            {plan.title}
                        </h2>
                        <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor}`}
                        >
                            <StatusIcon className="h-4 w-4 ml-1.5" />
                            {statusInfo.text}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route("plans.edit", plan.id)}
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <PencilIcon className="h-4 w-4" />
                            {t.edit}
                        </Link>
                        {canGeneratePDF && (
                            <button
                                onClick={handleGeneratePDF}
                                disabled={isGeneratingPDF}
                                className="fdButton flex items-center gap-2 disabled:opacity-50"
                            >
                                <DocumentArrowDownIcon className="h-4 w-4" />
                                {isGeneratingPDF
                                    ? t.generating_pdf
                                    : t.download_pdf}
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={plan.title} />
            <StarBackground />

            <div className="py-8 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Overview */}
                    <div className="fdDiveCard p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t.overall_progress}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t.sections_completed(
                                        completedSections,
                                        totalSections
                                    )}
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
                                    className="Fdbg h-4 rounded-full transition-all duration-500"
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Project Info */}
                    {plan.project && (
                        <div className="fdDiveCard p-6 mb-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                {t.project_info}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.project_name}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.industry}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.industry ||
                                            t.not_specified}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.target_market}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.target_market ||
                                            t.not_specified}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.location}
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {plan.project.location ||
                                            t.not_specified}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Plan Sections */}
                    <div className="space-y-4">
                        {Object.entries(sectionsData).map(([key, section]) => {
                            const Icon = sectionIcons[key] || ChartBarIcon;
                            const isPremiumSection = [
                                "swot_analysis",
                                "operational_plan",
                            ].includes(key);
                            const isLocked =
                                isPremiumSection &&
                                !isPremium &&
                                !section.content;

                            return (
                                <div
                                    key={key}
                                    className="fdDiveCard overflow-hidden"
                                >
                                    <button
                                        onClick={() =>
                                            setExpandedSection(
                                                expandedSection === key
                                                    ? null
                                                    : key
                                            )
                                        }
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-lg ${
                                                    section.completed
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                                }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="text-right">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                    {section.title}
                                                    {isLocked && (
                                                        <LockClosedIcon className="h-4 w-4 text-purple-600" />
                                                    )}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {section.completed
                                                        ? t.completed_section
                                                        : t.incomplete}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {section.completed ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <ClockIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                            {expandedSection === key ? (
                                                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {expandedSection === key && (
                                        <div className="border-t border-gray-200 dark:border-gray-700">
                                            <div className="px-6 py-4">
                                                {isLocked ? (
                                                    <div className="text-center py-8">
                                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-4">
                                                            <LockClosedIcon className="h-6 w-6 text-purple-600" />
                                                        </div>
                                                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                            {t.premium_content}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            {t.premium_only}
                                                        </p>
                                                        <Link
                                                            href={route(
                                                                "payments.checkout"
                                                            )}
                                                            className="fdButton inline-flex items-center gap-2"
                                                        >
                                                            <SparklesIcon className="h-4 w-4" />
                                                            {
                                                                t.upgrade_subscription
                                                            }
                                                        </Link>
                                                    </div>
                                                ) : section.content ? (
                                                    <div className="prose dark:prose-invert max-w-none">
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: section.content,
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                            {
                                                                t.section_not_completed
                                                            }
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                            {
                                                                t.start_filling_info
                                                            }
                                                        </p>
                                                        <Link
                                                            href={route(
                                                                "plans.edit",
                                                                plan.id
                                                            )}
                                                            className="fdButton inline-flex items-center gap-2"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                            {t.complete_section}
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>

                                            {section.content && !isLocked && (
                                                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {t.last_updated}:{" "}
                                                            {new Date(
                                                                plan.updated_at
                                                            ).toLocaleDateString(
                                                                isArabic
                                                                    ? "ar-AE"
                                                                    : "en-US"
                                                            )}
                                                        </span>
                                                        <Link
                                                            href={route(
                                                                "plans.edit",
                                                                plan.id
                                                            )}
                                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                        >
                                                            {t.edit}
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* AI Suggestions */}
                    {plan.ai_suggestions && plan.ai_suggestions.length > 0 && (
                        <div className="mt-8 fdDiveCard p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="fdRoundedIcon">
                                    <SparklesIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {t.ai_suggestions}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t.suggestions_available(
                                            plan.ai_suggestions.length
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {plan.ai_suggestions
                                    .slice(0, 3)
                                    .map((suggestion) => (
                                        <div
                                            key={suggestion.id}
                                            className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`p-2 rounded-lg flex-shrink-0 ${
                                                        suggestion.suggestion_type ===
                                                        "business"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : suggestion.suggestion_type ===
                                                              "marketing"
                                                            ? "bg-green-100 text-green-600"
                                                            : suggestion.suggestion_type ===
                                                              "financial"
                                                            ? "bg-purple-100 text-purple-600"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    <SparklesIcon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            {t.suggestion_types[
                                                                suggestion
                                                                    .suggestion_type
                                                            ] ||
                                                                t
                                                                    .suggestion_types
                                                                    .other}
                                                        </span>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {new Date(
                                                                suggestion.created_at
                                                            ).toLocaleDateString(
                                                                isArabic
                                                                    ? "ar-AE"
                                                                    : "en-US"
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                                                        {
                                                            suggestion.suggestion_content
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                {plan.ai_suggestions.length > 3 && (
                                    <div className="text-center pt-4">
                                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                            {t.view_all_suggestions(
                                                plan.ai_suggestions.length - 3
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
