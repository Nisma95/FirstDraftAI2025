import React from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Edit,
    Building2,
    Target,
    MapPin,
    Users,
    DollarSign,
    Package,
    Lightbulb,
    Calendar,
    Star,
    Sparkles,
    Zap,
    Activity,
    BarChart3,
    Briefcase,
    Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TopTools from "@/Components/TopTools";

export default function Show({ auth, project }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const handleEdit = () => {
        router.get(route("projects.edit", project.id));
    };

    const handleBack = () => {
        router.get(route("projects.index"));
    };

    const handleCreatePlan = () => {
        router.get(route("plans.create"), { project_id: project.id });
    };

    // Status configuration with enhanced styling
    const getStatusInfo = (status) => {
        const statusMap = {
            new_project: {
                color: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30",
                icon: Sparkles,
                label: t("projects.new_project_status"),
                bgGradient:
                    "bg-gradient-to-br from-blue-500/10 to-cyan-400/10 dark:from-blue-500/20 dark:to-cyan-400/20",
            },
            existed_project: {
                color: "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30",
                icon: Star,
                label: t("projects.existing_project_status"),
                bgGradient:
                    "bg-gradient-to-br from-green-500/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-400/20",
            },
        };
        return (
            statusMap[status] || {
                color: "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30",
                icon: Activity,
                label: status,
                bgGradient:
                    "bg-gradient-to-br from-gray-500/10 to-gray-400/10 dark:from-gray-500/20 dark:to-gray-400/20",
            }
        );
    };

    // Project scale configuration
    const getScaleInfo = (scale) => {
        const scaleMap = {
            small: {
                label: t("projects.small_project"),
                color: "text-blue-600 dark:text-blue-400",
                icon: BarChart3,
                bgColor: "bg-blue-50/50 dark:bg-blue-900/20",
            },
            medium: {
                label: t("projects.medium_project"),
                color: "text-yellow-600 dark:text-yellow-400",
                icon: BarChart3,
                bgColor: "bg-yellow-50/50 dark:bg-yellow-900/20",
            },
            large: {
                label: t("projects.large_project"),
                color: "text-green-600 dark:text-green-400",
                icon: BarChart3,
                bgColor: "bg-green-50/50 dark:bg-green-900/20",
            },
        };
        return (
            scaleMap[scale] || {
                label: scale,
                color: "text-gray-600 dark:text-gray-400",
                icon: BarChart3,
                bgColor: "bg-gray-50/50 dark:bg-gray-700/30",
            }
        );
    };

    const statusInfo = getStatusInfo(project.status);
    const StatusIcon = statusInfo.icon;

    const scaleInfo = getScaleInfo(project.project_scale);
    const ScaleIcon = scaleInfo.icon;

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

            <Head title={`${t("projects.project")} - ${project.name}`} />

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
                <div className="max-w-7xl mx-auto">
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
                                        title={t("projects.back_to_projects")}
                                    >
                                        <ArrowLeft
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
                                        {statusInfo.label}
                                    </motion.span>
                                </div>
                                <motion.h1
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {project.name}
                                </motion.h1>
                                <motion.p
                                    className="mt-3 text-gray-600 dark:text-gray-400 text-lg"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {t("projects.project_details")}
                                </motion.p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    onClick={handleCreatePlan}
                                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-3">
                                        <Activity size={20} />
                                        <span className="font-semibold">
                                            {t("plans.create_plan")}
                                        </span>
                                        <Sparkles
                                            size={16}
                                            className="text-yellow-300"
                                        />
                                    </div>
                                </motion.button>
                                <motion.button
                                    onClick={handleEdit}
                                    className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-indigo-500/25"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, type: "spring" }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-3">
                                        <Edit size={20} />
                                        <span className="font-semibold">
                                            {t("projects.edit_project")}
                                        </span>
                                        <Zap
                                            size={16}
                                            className="text-yellow-300"
                                        />
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Project Details Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {/* Basic Information Card */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                        >
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
                                {/* Description */}
                                <motion.div variants={cardVariants}>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        {t("common.description")}
                                    </label>
                                    <div className="bg-gray-50/80 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                                        <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                            {project.description || (
                                                <span className="text-gray-500 dark:text-gray-400 italic">
                                                    {t(
                                                        "projects.no_description"
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Industry & Business Type */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            {t("projects.industry")}
                                        </label>
                                        <div className="flex items-center gap-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                <Building2
                                                    className="text-blue-600 dark:text-blue-400"
                                                    size={20}
                                                />
                                            </div>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                {project.industry
                                                    ?.industry_name ||
                                                    t("common.not_specified")}
                                            </span>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            {t("projects.business_type")}
                                        </label>
                                        <div className="flex items-center gap-3 bg-purple-50/80 dark:bg-purple-900/30 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                                <Briefcase
                                                    className="text-purple-600 dark:text-purple-400"
                                                    size={20}
                                                />
                                            </div>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                {project.business_type
                                                    ?.business_type_name ||
                                                    t("common.not_specified")}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Target Market & Location */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            {t("projects.target_market")}
                                        </label>
                                        <div className="flex items-center gap-3 bg-green-50/80 dark:bg-green-900/30 rounded-2xl p-4 border border-green-200/50 dark:border-green-700/50">
                                            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                                <Target
                                                    className="text-green-600 dark:text-green-400"
                                                    size={20}
                                                />
                                            </div>
                                            <div className="text-gray-800 dark:text-gray-200 font-medium">
                                                {project.target_market
                                                    ? project.target_market
                                                          .split("\n")
                                                          .map(
                                                              (item, index) => (
                                                                  <p
                                                                      key={
                                                                          index
                                                                      }
                                                                      className="mb-1"
                                                                  >
                                                                      {item}
                                                                  </p>
                                                              )
                                                          )
                                                    : t("common.not_specified")}
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            {t("projects.location")}
                                        </label>
                                        <div className="flex items-center gap-3 bg-orange-50/80 dark:bg-orange-900/30 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-700/50">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-lg">
                                                <MapPin
                                                    className="text-orange-600 dark:text-orange-400"
                                                    size={20}
                                                />
                                            </div>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                {project.location ||
                                                    t("common.not_specified")}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Sidebar */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            {/* Project Scale & Team */}
                            {(project.project_scale || project.team_size) && (
                                <motion.div
                                    variants={cardVariants}
                                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                                >
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
                                        {project.project_scale && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t(
                                                        "projects.project_scale"
                                                    )}
                                                </label>
                                                <div
                                                    className={`flex items-center gap-3 p-3 rounded-xl ${scaleInfo.bgColor} border border-gray-200/50 dark:border-gray-600/50`}
                                                >
                                                    <ScaleIcon
                                                        className={
                                                            scaleInfo.color
                                                        }
                                                        size={18}
                                                    />
                                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                        {scaleInfo.label}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {project.team_size && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t("projects.team_size")}
                                                </label>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50">
                                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                        <Users
                                                            className="text-blue-600 dark:text-blue-400"
                                                            size={16}
                                                        />
                                                    </div>
                                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                        {project.team_size}{" "}
                                                        {project.team_size === 1
                                                            ? t("common.person")
                                                            : t(
                                                                  "common.people"
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Business Details */}
                            {(project.revenue_model ||
                                project.main_product_service ||
                                project.main_differentiator) && (
                                <motion.div
                                    variants={cardVariants}
                                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                                >
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
                                        {project.revenue_model && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t(
                                                        "projects.revenue_model"
                                                    )}
                                                </label>
                                                <div className="p-3 rounded-xl bg-green-50/80 dark:bg-green-900/30 border border-green-200/50 dark:border-green-700/50">
                                                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                        {project.revenue_model
                                                            .split("\n")
                                                            .map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <p
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="mb-1"
                                                                    >
                                                                        {item}
                                                                    </p>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {project.main_product_service && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t(
                                                        "projects.main_product_service"
                                                    )}
                                                </label>
                                                <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-900/30 border border-blue-200/50 dark:border-blue-700/50">
                                                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                        {project.main_product_service
                                                            .split("\n")
                                                            .map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <p
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="mb-1"
                                                                    >
                                                                        {item}
                                                                    </p>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {project.main_differentiator && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t(
                                                        "projects.main_differentiator"
                                                    )}
                                                </label>
                                                <div className="p-3 rounded-xl bg-yellow-50/80 dark:bg-yellow-900/30 border border-yellow-200/50 dark:border-yellow-700/50">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-1.5 bg-yellow-100 dark:bg-yellow-800/50 rounded-lg mt-0.5">
                                                            <Lightbulb
                                                                className="text-yellow-600 dark:text-yellow-400"
                                                                size={16}
                                                            />
                                                        </div>
                                                        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                                            {project.main_differentiator
                                                                .split("\n")
                                                                .map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <p
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="mb-1"
                                                                        >
                                                                            {
                                                                                item
                                                                            }
                                                                        </p>
                                                                    )
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* Project Timestamps */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <Calendar
                                            className="text-indigo-600 dark:text-indigo-400"
                                            size={20}
                                        />
                                    </div>
                                    {t("projects.timestamps")}
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                <Clock
                                                    className="text-blue-600 dark:text-blue-400"
                                                    size={16}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {t("projects.created_at")}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {formatDate(project.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-green-100 dark:bg-green-800/50 rounded-lg">
                                                <Calendar
                                                    className="text-green-600 dark:text-green-400"
                                                    size={16}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {t("projects.updated_at")}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {formatDate(project.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
