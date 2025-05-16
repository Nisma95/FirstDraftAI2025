import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { motion } from "framer-motion";
import {
    Plus,
    Eye,
    ChevronRight,
    FileText,
    Calendar,
    Target,
    Activity,
    Trash2,
    X,
    Star,
    Sparkles,
    Zap,
    Palette,
    Heart,
    Download,
    Brain,
    TrendingUp,
    CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import TopTools from "@/Components/TopTools";

export default function Index({ auth, plans, projects }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    // State to track deleted plans (front-end only, persisted in localStorage)
    const [deletedPlans, setDeletedPlans] = useState(new Set());
    const [planToDelete, setPlanToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Load deleted plans from localStorage on component mount
    useEffect(() => {
        const savedDeletedPlans = localStorage.getItem(
            `deletedPlans_${auth.user.id}`
        );
        if (savedDeletedPlans) {
            setDeletedPlans(new Set(JSON.parse(savedDeletedPlans)));
        }
    }, [auth.user.id]);

    // Filter out deleted plans from display
    const visiblePlans = plans.filter((plan) => !deletedPlans.has(plan.id));

    const handleCreatePlan = () => {
        router.get(route("plans.create"));
    };

    const handleDeletePlan = (planId) => {
        // Add plan ID to deleted set (front-end only)
        const newDeletedPlans = new Set([...deletedPlans, planId]);
        setDeletedPlans(newDeletedPlans);

        // Save to localStorage to persist across page refreshes
        localStorage.setItem(
            `deletedPlans_${auth.user.id}`,
            JSON.stringify([...newDeletedPlans])
        );

        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    const showDeleteConfirmation = (plan) => {
        setPlanToDelete(plan);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    // Status colors and translations with enhanced styling
    const getStatusInfo = (status) => {
        const statusMap = {
            draft: {
                color: "bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-lg shadow-amber-500/30",
                icon: FileText,
                label: t("draft_status", "مسودة"),
                bgGradient:
                    "bg-gradient-to-br from-amber-500/10 to-orange-400/10 dark:from-amber-500/20 dark:to-orange-400/20",
            },
            completed: {
                color: "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30",
                icon: CheckCircle,
                label: t("completed_status", "مكتملة"),
                bgGradient:
                    "bg-gradient-to-br from-green-500/10 to-emerald-400/10 dark:from-green-500/20 dark:to-emerald-400/20",
            },
            premium: {
                color: "bg-gradient-to-r from-purple-500 to-indigo-400 text-white shadow-lg shadow-purple-500/30",
                icon: Star,
                label: t("premium_status", "متميزة"),
                bgGradient:
                    "bg-gradient-to-br from-purple-500/10 to-indigo-400/10 dark:from-purple-500/20 dark:to-indigo-400/20",
            },
        };
        return (
            statusMap[status] || {
                color: "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30",
                icon: FileText,
                label: status,
                bgGradient:
                    "bg-gradient-to-br from-gray-500/10 to-gray-400/10 dark:from-gray-500/20 dark:to-gray-400/20",
            }
        );
    };

    // Calculate progress
    const getProgress = (plan) => {
        let completed = 0;
        const total = 6; // عدد الأقسام المطلوبة

        if (plan.summary) completed++;
        if (plan.finance) completed++;
        if (plan.market) completed++;
        if (plan.audiences?.length > 0) completed++;
        if (plan.goals?.length > 0) completed++;
        if (plan.ai_analysis) completed++;

        return (completed / total) * 100;
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

            <Head title={t("business_plans", "خطط العمل")} />

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
                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-white/20"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t("delete_plan", "حذف الخطة")}
                                </h3>
                                <motion.button
                                    onClick={cancelDelete}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <X size={20} />
                                </motion.button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {t(
                                    "delete_plan_confirmation",
                                    "هل أنت متأكد من حذف خطة العمل"
                                )}{" "}
                                "{planToDelete?.title}"؟
                                <br />
                                <span className="text-sm text-amber-600 dark:text-amber-400 mt-2 block">
                                    {t(
                                        "delete_frontend_persistent",
                                        "ملاحظة: سيتم حذف الخطة من الواجهة نهائياً ولكن لن يتم حذفها من قاعدة البيانات"
                                    )}
                                </span>
                            </p>
                            <div className="flex gap-3 justify-end">
                                <motion.button
                                    onClick={cancelDelete}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-xl transition-all duration-300"
                                >
                                    {t("cancel", "إلغاء")}
                                </motion.button>
                                <motion.button
                                    onClick={() =>
                                        handleDeletePlan(planToDelete.id)
                                    }
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30"
                                >
                                    {t("delete", "حذف")}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}

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
                                    {t("business_plans", "خطط العمل")}
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
                                            "plans_subtitle",
                                            "إدارة وتطوير خطط العمل"
                                        )}
                                    </p>
                                </motion.div>
                            </div>
                            <motion.button
                                onClick={handleCreatePlan}
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
                                        {t("new_plan", "خطة جديدة")}
                                    </span>
                                    <Sparkles
                                        size={16}
                                        className="text-yellow-300"
                                    />
                                </div>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Plans Grid */}
                    {visiblePlans.length === 0 ? (
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
                                <FileText
                                    size={48}
                                    className="text-indigo-600 dark:text-indigo-400"
                                />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                                {t("no_plans", "لا توجد خطط عمل حالياً")}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                                {t(
                                    "start_first_plan",
                                    "ابدأ خطة عملك الأولى الآن"
                                )}
                            </p>
                            <motion.button
                                onClick={handleCreatePlan}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30"
                            >
                                <Plus size={20} />
                                {t("create_plan", "إنشاء خطة")}
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
                            {visiblePlans.map((plan, index) => {
                                const statusInfo = getStatusInfo(plan.status);
                                const StatusIcon = statusInfo.icon;
                                const progress = getProgress(plan);

                                return (
                                    <motion.div
                                        key={plan.id}
                                        variants={itemVariants}
                                        whileHover={{
                                            y: -10,
                                            rotateY: 5,
                                            scale: 1.02,
                                        }}
                                        className="relative group"
                                        onMouseEnter={() =>
                                            setHoveredCard(plan.id)
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

                                            {/* Delete Button - Positioned in top left corner */}
                                            <motion.button
                                                onClick={() =>
                                                    showDeleteConfirmation(plan)
                                                }
                                                className={`absolute top-4 left-4 z-10 transition-all duration-300 p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 hover:text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 dark:hover:text-red-300 backdrop-blur-sm border border-red-500/20 ${
                                                    hoveredCard === plan.id
                                                        ? "opacity-100 scale-100"
                                                        : "opacity-0 scale-90"
                                                }`}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 size={16} />
                                            </motion.button>

                                            {/* Plan Header */}
                                            <div className="p-8 border-b border-gray-100/50 dark:border-gray-700/50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 pr-4">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-4">
                                                            {plan.title}
                                                        </h3>
                                                        <div className="space-y-3">
                                                            <motion.div
                                                                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                                whileHover={{
                                                                    x: 5,
                                                                }}
                                                            >
                                                                <Target
                                                                    size={16}
                                                                    className="text-blue-500"
                                                                />
                                                                <span className="font-medium">
                                                                    {plan
                                                                        .project
                                                                        ?.name ||
                                                                        t(
                                                                            "no_project",
                                                                            "غير محدد"
                                                                        )}
                                                                </span>
                                                            </motion.div>
                                                            <motion.div
                                                                className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                                                                whileHover={{
                                                                    x: 5,
                                                                }}
                                                            >
                                                                <Calendar
                                                                    size={16}
                                                                    className="text-green-500"
                                                                />
                                                                <span className="font-medium">
                                                                    {new Date(
                                                                        plan.created_at
                                                                    ).toLocaleDateString(
                                                                        "ar-AE"
                                                                    )}
                                                                </span>
                                                            </motion.div>
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

                                            {/* Progress Section */}
                                            <div className="px-8 py-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                            {t(
                                                                "completion_progress",
                                                                "تقدم الإنجاز"
                                                            )}
                                                        </span>
                                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                                            {Math.round(
                                                                progress
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                                            <motion.div
                                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${progress}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 1.5,
                                                                    ease: "easeOut",
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full animate-shimmer" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Suggestions & PDF */}
                                            <div className="px-8 py-4 bg-gray-50/50 dark:bg-gray-700/30">
                                                <div className="flex items-center justify-between">
                                                    <motion.div
                                                        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                                        whileHover={{ x: 5 }}
                                                    >
                                                        <Brain
                                                            size={16}
                                                            className="text-purple-500"
                                                        />
                                                        <span className="font-medium">
                                                            {plan.ai_suggestions
                                                                ?.length ||
                                                                0}{" "}
                                                            {t(
                                                                "ai_suggestions",
                                                                "اقتراح من الذكاء الاصطناعي"
                                                            )}
                                                        </span>
                                                    </motion.div>
                                                    {plan.pdf_path && (
                                                        <motion.a
                                                            href={route(
                                                                "plans.pdf",
                                                                plan.id
                                                            )}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.95,
                                                            }}
                                                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                                                        >
                                                            <Download
                                                                size={14}
                                                            />
                                                            {t(
                                                                "download_pdf",
                                                                "تحميل PDF"
                                                            )}
                                                        </motion.a>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="px-8 py-6 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-700/30 dark:to-gray-600/30 flex gap-4">
                                                <motion.button
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                "plans.show",
                                                                plan.id
                                                            )
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/20"
                                                >
                                                    <Eye size={16} />
                                                    {t(
                                                        "view_plan",
                                                        "عرض الخطة"
                                                    )}
                                                    <Sparkles
                                                        size={14}
                                                        className="text-yellow-300"
                                                    />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() =>
                                                        router.get(
                                                            route(
                                                                "plans.edit",
                                                                plan.id
                                                            )
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-md border border-gray-200 dark:border-gray-600"
                                                >
                                                    <TrendingUp size={16} />
                                                    {t("edit_plan", "تعديل")}
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
