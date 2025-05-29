import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
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
    ArrowLeftIcon,
    CalendarIcon,
    MapPinIcon,
    BuildingOffice2Icon,
    UserGroupIcon,
    BanknotesIcon,
    LightBulbIcon,
    PlayIcon,
    FireIcon,
    StarIcon,
    AcademicCapIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";

export default function Show({ auth, plan, canGeneratePDF, isPremium }) {
    const { t, i18n } = useTranslation();
    const [expandedSection, setExpandedSection] = useState(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const isRTL = i18n.dir() === "rtl";

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

    const handleBack = () => {
        window.history.back();
    };

    // Enhanced status configuration with creative styling
    const getStatusInfo = () => {
        const statusMap = {
            draft: {
                icon: ClockIcon,
                text: t("plans.status.draft"),
                color: "bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-lg shadow-yellow-500/30",
                bgGradient:
                    "bg-gradient-to-br from-yellow-500/10 to-orange-400/10 dark:from-yellow-500/20 dark:to-orange-400/20",
            },
            completed: {
                icon: CheckCircleIcon,
                text: t("plans.status.completed"),
                color: "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30",
                bgGradient:
                    "bg-gradient-to-br from-green-500/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-400/20",
            },
            generating: {
                icon: PlayIcon,
                text: t("plans.status.generating"),
                color: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30",
                bgGradient:
                    "bg-gradient-to-br from-blue-500/10 to-cyan-400/10 dark:from-blue-500/20 dark:to-cyan-400/20",
            },
            failed: {
                icon: ClockIcon,
                text: t("plans.status.failed"),
                color: "bg-gradient-to-r from-red-500 to-pink-400 text-white shadow-lg shadow-red-500/30",
                bgGradient:
                    "bg-gradient-to-br from-red-500/10 to-pink-400/10 dark:from-red-500/20 dark:to-pink-400/20",
            },
            premium: {
                icon: SparklesIcon,
                text: t("plans.status.premium"),
                color: "bg-gradient-to-r from-purple-500 to-indigo-400 text-white shadow-lg shadow-purple-500/30",
                bgGradient:
                    "bg-gradient-to-br from-purple-500/10 to-indigo-400/10 dark:from-purple-500/20 dark:to-indigo-400/20",
            },
        };

        return (
            statusMap[plan.status] || {
                icon: ClockIcon,
                text: t("plans.status.unknown"),
                color: "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30",
                bgGradient:
                    "bg-gradient-to-br from-gray-500/10 to-gray-400/10 dark:from-gray-500/20 dark:to-gray-400/20",
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

    // Format dates based on language
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const locale = i18n.language === "ar" ? "ar-SA" : "en-US";
        return new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
        },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.6,
                bounce: 0.3,
            },
        },
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                duration: 0.5,
            },
        },
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Top Right Tools */}
            <TopTools />

            <Head title={plan.title} />

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
                <motion.div
                    className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <div className="min-h-screen my-10 py-8 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mb-12 relative"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            <div className="relative">
                                <motion.div
                                    className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                <div className="flex items-center gap-4 mb-4">
                                    <motion.button
                                        onClick={handleBack}
                                        whileHover={{
                                            scale: 1.05,
                                            x: isRTL ? 5 : -5,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                                        title={t("common.back")}
                                    >
                                        <ArrowLeftIcon
                                            size={24}
                                            className={
                                                isRTL ? "rotate-180" : ""
                                            }
                                        />
                                    </motion.button>
                                    <motion.span
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${statusInfo.color}`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <StatusIcon size={16} />
                                        {statusInfo.text}
                                    </motion.span>
                                </div>
                                <motion.h1
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {plan.title}
                                </motion.h1>
                                <motion.p
                                    className="mt-3 text-gray-600 dark:text-gray-400 text-lg"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {t("plans.business_plan_details") ||
                                        "Business Plan Overview"}
                                </motion.p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {canGeneratePDF && (
                                    <motion.button
                                        onClick={handleGeneratePDF}
                                        disabled={isGeneratingPDF}
                                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 disabled:opacity-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            type: "spring",
                                        }}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-3">
                                            <DocumentArrowDownIcon className="h-5 w-5" />
                                            <span className="font-semibold">
                                                {isGeneratingPDF
                                                    ? t("plans.generating_pdf")
                                                    : t("plans.download_pdf")}
                                            </span>
                                            <PlayIcon className="h-4 w-4 text-yellow-300" />
                                        </div>
                                    </motion.button>
                                )}
                                <Link
                                    href={`/plans/${plan.id}/edit`}
                                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25"
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        textDecoration: "none",
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: 0.6,
                                            type: "spring",
                                        }}
                                        className="w-full"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-3">
                                            <PencilIcon className="h-5 w-5" />
                                            <span className="font-semibold">
                                                {t("common.edit")}
                                            </span>
                                            <BoltIcon className="h-4 w-4 text-yellow-300" />
                                        </div>
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {/* Progress Overview Section - Left Side */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Progress Card */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                            <AcademicCapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {t("plans.overall_progress") ||
                                                    "Overall Progress"}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {completedSections} of{" "}
                                                {totalSections} sections
                                                completed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <motion.div
                                            className="relative"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                delay: 0.5,
                                                type: "spring",
                                            }}
                                        >
                                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                {completionPercentage}%
                                            </div>
                                            <motion.div
                                                className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-lg"
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    opacity: [0.3, 0.6, 0.3],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="relative mb-4">
                                    <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
                                        <motion.div
                                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${completionPercentage}%`,
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 0.5,
                                                ease: "easeOut",
                                            }}
                                        />
                                    </div>
                                    <motion.div
                                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/30 to-transparent rounded-full"
                                        animate={{
                                            x: ["-100%", "100%"],
                                            opacity: [0, 0.5, 0],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50/80 dark:bg-green-900/30 rounded-xl border border-green-200/50 dark:border-green-700/50">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                Completed
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-green-800 dark:text-green-200">
                                            {completedSections}
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50/80 dark:bg-orange-900/30 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                                        <div className="flex items-center justify-center gap-2 mb-1">
                                            <ClockIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                                Remaining
                                            </span>
                                        </div>
                                        <div className="text-xl font-bold text-orange-800 dark:text-orange-200">
                                            {totalSections - completedSections}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Business Plan Sections */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 20,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <LightBulbIcon className="h-8 w-8 text-white" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                                Business Plan Sections
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Explore your comprehensive
                                                business strategy
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-2xl border border-green-200/50 dark:border-green-700/50"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <FireIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-bold text-green-700 dark:text-green-300">
                                            {completionPercentage}% Complete
                                        </span>
                                    </motion.div>
                                </div>

                                {/* Sections Grid */}
                                <div className="space-y-4">
                                    {Object.entries(sectionsData).map(
                                        ([key, section], index) => {
                                            const SectionIcon =
                                                sectionIcons[key] ||
                                                ChartBarIcon;
                                            const isExpanded =
                                                expandedSection === key;
                                            const isPremiumSection = false;
                                            const isLocked = false;

                                            return (
                                                <motion.div
                                                    key={key}
                                                    variants={cardVariants}
                                                    initial="hidden"
                                                    animate="show"
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                    className="group border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm"
                                                >
                                                    <motion.button
                                                        onClick={() =>
                                                            setExpandedSection(
                                                                isExpanded
                                                                    ? null
                                                                    : key
                                                            )
                                                        }
                                                        className="w-full flex justify-between items-center p-6 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
                                                        disabled={isLocked}
                                                        whileHover={{
                                                            scale: 1.01,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.99,
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <motion.div
                                                                className={`p-3 rounded-xl transition-all duration-300 ${
                                                                    section.completed
                                                                        ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/25"
                                                                        : "bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
                                                                }`}
                                                                animate={
                                                                    section.completed
                                                                        ? {
                                                                              rotate: [
                                                                                  0,
                                                                                  5,
                                                                                  -5,
                                                                                  0,
                                                                              ],
                                                                              scale: [
                                                                                  1,
                                                                                  1.1,
                                                                                  1,
                                                                              ],
                                                                          }
                                                                        : {}
                                                                }
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    repeatDelay: 5,
                                                                }}
                                                            >
                                                                <SectionIcon className="h-6 w-6 text-white" />
                                                            </motion.div>
                                                            <div className="text-left">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                        {
                                                                            section.title
                                                                        }
                                                                    </span>
                                                                    {section.completed &&
                                                                        !isLocked && (
                                                                            <motion.span
                                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                                                                                initial={{
                                                                                    scale: 0,
                                                                                    rotate: -180,
                                                                                }}
                                                                                animate={{
                                                                                    scale: 1,
                                                                                    rotate: 0,
                                                                                }}
                                                                                transition={{
                                                                                    type: "spring",
                                                                                    duration: 0.6,
                                                                                    delay:
                                                                                        index *
                                                                                        0.1,
                                                                                }}
                                                                            >
                                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                                Completed
                                                                            </motion.span>
                                                                        )}
                                                                    {!section.completed && (
                                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg">
                                                                            <ClockIcon className="h-3 w-3 mr-1" />
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {section.completed
                                                                        ? "Click to view detailed analysis"
                                                                        : "Complete your project details to generate this section"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <motion.div
                                                            animate={{
                                                                rotate: isExpanded
                                                                    ? 180
                                                                    : 0,
                                                            }}
                                                            transition={{
                                                                duration: 0.3,
                                                            }}
                                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors"
                                                        >
                                                            <ChevronDownIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                                        </motion.div>
                                                    </motion.button>

                                                    {/* Expanded Content */}
                                                    <motion.div
                                                        initial={false}
                                                        animate={{
                                                            height: isExpanded
                                                                ? "auto"
                                                                : 0,
                                                            opacity: isExpanded
                                                                ? 1
                                                                : 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="overflow-hidden"
                                                    >
                                                        {isExpanded &&
                                                            !isLocked && (
                                                                <motion.div
                                                                    initial={{
                                                                        y: -20,
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        y: 0,
                                                                        opacity: 1,
                                                                    }}
                                                                    transition={{
                                                                        delay: 0.1,
                                                                    }}
                                                                    className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 border-t border-gray-200/50 dark:border-gray-600/50"
                                                                >
                                                                    {section.completed &&
                                                                    section.content ? (
                                                                        <div className="prose prose-gray dark:prose-invert max-w-none">
                                                                            <div
                                                                                className="text-gray-800 dark:text-gray-200 leading-relaxed"
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: section.content,
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center py-12">
                                                                            <motion.div
                                                                                initial={{
                                                                                    scale: 0,
                                                                                }}
                                                                                animate={{
                                                                                    scale: 1,
                                                                                }}
                                                                                transition={{
                                                                                    type: "spring",
                                                                                    duration: 0.6,
                                                                                }}
                                                                                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center"
                                                                            >
                                                                                <ClockIcon className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                                                                            </motion.div>
                                                                            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                                                                                Section
                                                                                Not
                                                                                Completed
                                                                            </h4>
                                                                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                                                                Complete
                                                                                your
                                                                                project
                                                                                information
                                                                                to
                                                                                generate
                                                                                AI-powered
                                                                                insights
                                                                                for
                                                                                this
                                                                                section
                                                                            </p>
                                                                            <Link
                                                                                href={`/plans/${plan.id}/edit`}
                                                                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                                                            >
                                                                                <PencilIcon className="h-5 w-5 mr-2" />
                                                                                Complete
                                                                                Section
                                                                                <SparklesIcon className="h-4 w-4 ml-2 text-yellow-300" />
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        }
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right Sidebar */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            {/* Status Overview */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                                        <StarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Plan Status
                                </h3>
                                <div
                                    className={`p-4 rounded-2xl ${statusInfo.bgGradient} border border-white/20 dark:border-gray-600/30`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 dark:bg-gray-800/50 rounded-lg">
                                            <StatusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                {statusInfo.text}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {plan.status === "completed"
                                                    ? "Ready to download"
                                                    : plan.status ===
                                                      "generating"
                                                    ? "AI is working..."
                                                    : plan.status === "draft"
                                                    ? "In progress"
                                                    : "Needs attention"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Project Information */}
                            {plan.project && (
                                <motion.div
                                    variants={cardVariants}
                                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                            <BuildingOffice2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        {t("plans.project_info") ||
                                            "Project Information"}
                                    </h2>

                                    <div className="space-y-4">
                                        <motion.div variants={cardVariants}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {t("plans.project_name") ||
                                                    "Project Name"}
                                            </label>
                                            <div className="flex items-center gap-3 bg-indigo-50/80 dark:bg-indigo-900/30 rounded-2xl p-4 border border-indigo-200/50 dark:border-indigo-700/50">
                                                <div className="p-1.5 bg-indigo-100 dark:bg-indigo-800/50 rounded-lg">
                                                    <BuildingOffice2Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                </div>
                                                <span className="font-bold text-indigo-900 dark:text-indigo-100 truncate">
                                                    {plan.project.name}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={cardVariants}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {t("plans.industry") ||
                                                    "Industry"}
                                            </label>
                                            <div className="flex items-center gap-3 bg-green-50/80 dark:bg-green-900/30 rounded-2xl p-4 border border-green-200/50 dark:border-green-700/50">
                                                <div className="p-1.5 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                                    <ChartPieIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <span className="font-bold text-green-900 dark:text-green-100 truncate">
                                                    {plan.project?.industry
                                                        ?.industry_name ||
                                                        t(
                                                            "common.not_specified"
                                                        )}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={cardVariants}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Business Type
                                            </label>
                                            <div className="flex items-center gap-3 bg-purple-50/80 dark:bg-purple-900/30 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                                                <div className="p-1.5 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                                    <UserGroupIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <span className="font-bold text-purple-900 dark:text-purple-100 truncate">
                                                    {plan.project?.business_type
                                                        ?.business_type_name ||
                                                        t(
                                                            "common.not_specified"
                                                        )}
                                                </span>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={cardVariants}>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {t("plans.location") ||
                                                    "Location"}
                                            </label>
                                            <div className="flex items-center gap-3 bg-orange-50/80 dark:bg-orange-900/30 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-700/50">
                                                <div className="p-1.5 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                                                    <MapPinIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <span className="font-bold text-orange-900 dark:text-orange-100 truncate">
                                                    {plan.project.location ||
                                                        t(
                                                            "common.not_specified"
                                                        )}
                                                </span>
                                            </div>
                                        </motion.div>

                                        {plan.project.team_size && (
                                            <motion.div variants={cardVariants}>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Team Size
                                                </label>
                                                <div className="flex items-center gap-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                        <UsersIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="font-bold text-blue-900 dark:text-blue-100">
                                                        {plan.project.team_size}{" "}
                                                        {plan.project
                                                            .team_size === 1
                                                            ? "person"
                                                            : "people"}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}

                                        {plan.project.revenue_model && (
                                            <motion.div variants={cardVariants}>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    Revenue Model
                                                </label>
                                                <div className="flex items-center gap-3 bg-emerald-50/80 dark:bg-emerald-900/30 rounded-2xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                                                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg">
                                                        <BanknotesIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="font-bold text-emerald-900 dark:text-emerald-100 truncate">
                                                        {
                                                            plan.project
                                                                .revenue_model
                                                        }
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Plan Timestamps */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <CalendarIcon
                                            className="text-indigo-600 dark:text-indigo-400"
                                            size={20}
                                        />
                                    </div>
                                    Plan Details
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                <ClockIcon
                                                    className="text-blue-600 dark:text-blue-400"
                                                    size={16}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Created At
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {formatDate(plan.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                                <CalendarIcon
                                                    className="text-green-600 dark:text-green-400"
                                                    size={16}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Updated At
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {formatDate(plan.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Enhanced CSS for content display */}
            <style jsx>{`
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
                .prose ul,
                .prose ol {
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
