import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import {
    Plus,
    Eye,
    Folder,
    Building2,
    Star,
    Sparkles,
    Zap,
    Heart,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TopTools from "@/Components/TopTools";

export default function Index({ auth, projects }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const [hoveredCard, setHoveredCard] = useState(null);

    // Show all projects
    const visibleProjects = projects;

    const handleCreatePlan = (projectId) => {
        router.get(route("plans.create"), { project_id: projectId });
    };

    // Status colors and translations with enhanced styling
    const getStatusInfo = (status) => {
        const statusMap = {
            new_project: {
                color: "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30",
                icon: Sparkles,
                label: t("new_project_status", "جديد"),
                bgGradient:
                    "bg-gradient-to-br from-green-500/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-400/20",
            },
            existed_project: {
                color: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30",
                icon: Star,
                label: t("existing_project_status", "قائم"),
                bgGradient:
                    "bg-gradient-to-br from-blue-500/10 to-cyan-400/10 dark:from-blue-500/20 dark:to-cyan-400/20",
            },
        };
        return (
            statusMap[status] || {
                color: "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30",
                icon: Folder,
                label: status,
                bgGradient:
                    "bg-gradient-to-br from-gray-500/10 to-gray-400/10 dark:from-gray-500/20 dark:to-gray-400/20",
            }
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -10,
            scale: 0.9,
        },
        show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.6,
                bounce: 0.3,
            },
        },
    };

    const floatingVariants = {
        floating: {
            y: [-10, 10, -10],
            rotate: [-1, 1, -1],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            {/* Top Right Tools - Mode and Language Switchers */}
            <div className="mb-20">
                <TopTools />
            </div>

            <Head title={t("my_projects", "مشاريعي")} />

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
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            <div className="min-h-screen py-8 px-2 relative">
                <div className="max-w-[88rem] mx-auto">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mb-12 relative"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
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
                                <motion.h1
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {t("my_projects", "مشاريعي")}
                                </motion.h1>
                                <motion.div
                                    className="mt-3 flex items-center gap-2"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <Heart
                                        size={20}
                                        className="text-pink-500"
                                    />
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                                        {t(
                                            "projects_subtitle",
                                            "إدارة وتطوير مشاريعك"
                                        )}
                                    </p>
                                </motion.div>
                            </div>
                            <motion.button
                                onClick={() =>
                                    router.get(route("projects.create"))
                                }
                                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-indigo-500/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6, type: "spring" }}
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: [0, 90, 0] }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.6,
                                        }}
                                    >
                                        <Plus size={20} />
                                    </motion.div>
                                    <span className="font-semibold">
                                        {t("new_project", "مشروع جديد")}
                                    </span>
                                    <Sparkles
                                        size={16}
                                        className="text-yellow-300"
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Projects Grid */}
                    {visibleProjects.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-3xl flex items-center justify-center shadow-xl"
                                variants={floatingVariants}
                                animate="floating"
                            >
                                <Folder
                                    size={48}
                                    className="text-indigo-600 dark:text-indigo-400"
                                />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                                {t("no_projects", "لا توجد مشاريع حالياً")}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                                {t(
                                    "start_first_project",
                                    "ابدأ مشروعك الأول الآن"
                                )}
                            </p>
                            <motion.button
                                onClick={() =>
                                    router.get(route("projects.create"))
                                }
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30"
                            >
                                <Plus size={20} />
                                {t("create_project", "إنشاء مشروع")}
                                <Zap size={16} className="text-yellow-300" />
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {visibleProjects.map((project, index) => {
                                const statusInfo = getStatusInfo(
                                    project.status
                                );
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <motion.div
                                        key={project.id}
                                        variants={itemVariants}
                                        whileHover={{
                                            y: -10,
                                            rotateY: 5,
                                            scale: 1.02,
                                        }}
                                        className="relative group"
                                        onMouseEnter={() =>
                                            setHoveredCard(project.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredCard(null)
                                        }
                                        style={{ isolation: "isolate" }}
                                    >
                                        <div
                                            className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/30 ${statusInfo.bgGradient}`}
                                        >
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                                            {/* Project Header */}
                                            <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 pr-4">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-4">
                                                            {project.name}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            {project.industry && (
                                                                <motion.div
                                                                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                                    whileHover={{
                                                                        x: 5,
                                                                    }}
                                                                >
                                                                    <Building2
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-blue-500"
                                                                    />
                                                                    <span className="font-medium">
                                                                        {project
                                                                            .industry
                                                                            ?.industry_name ||
                                                                            t(
                                                                                "no_industry",
                                                                                "غير محدد"
                                                                            )}
                                                                    </span>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <motion.span
                                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${statusInfo.color}`}
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        variants={pulseVariants}
                                                        animate="pulse"
                                                    >
                                                        <StatusIcon size={14} />
                                                        {statusInfo.label}
                                                    </motion.span>
                                                </div>
                                            </div>

                                            {/* Project Description */}
                                            {project.description && (
                                                <div className="px-8 py-6">
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 font-medium leading-relaxed">
                                                        {project.description}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Additional Project Info */}
                                            {(project.business_type ||
                                                project.location) && (
                                                <div className="px-8 py-4 space-y-2 bg-gray-50/50 dark:bg-gray-700/30">
                                                    {project.business_type && (
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                                                                {t(
                                                                    "business_type",
                                                                    "نوع العمل"
                                                                )}
                                                                :
                                                            </span>
                                                            <span className="ml-2">
                                                                {project
                                                                    .business_type
                                                                    ?.business_type_name ||
                                                                    "غير محدد"}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {project.location && (
                                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                                {t(
                                                                    "location",
                                                                    "الموقع"
                                                                )}
                                                                :
                                                            </span>
                                                            <span className="ml-2">
                                                                {
                                                                    project.location
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="px-8 py-6 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-600/30 flex gap-3">
                                                <motion.button
                                                    onClick={() =>
                                                        handleCreatePlan(
                                                            project.id
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20"
                                                >
                                                    <Plus
                                                        size={16}
                                                        className="flex-shrink-0"
                                                    />
                                                    <span className="truncate text-center">
                                                        {t(
                                                            "create_plan",
                                                            "إنشاء خطة"
                                                        )}
                                                    </span>
                                                    <Sparkles
                                                        size={14}
                                                        className="text-yellow-300 flex-shrink-0"
                                                    />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                "projects.show",
                                                                project.id
                                                            )
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md border bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white border-gray-200 dark:border-gray-600"
                                                >
                                                    <Eye
                                                        size={16}
                                                        className="flex-shrink-0"
                                                    />
                                                    <span className="truncate text-center">
                                                        {t(
                                                            "view_project",
                                                            "عرض المشروع"
                                                        )}
                                                    </span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </div>

            <style jsx="true">{`
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%) skewX(-12deg);
                    }
                    100% {
                        transform: translateX(200%) skewX(-12deg);
                    }
                }

                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
