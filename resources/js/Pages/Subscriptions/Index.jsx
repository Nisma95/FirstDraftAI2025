import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import Footer from "@/Layouts/Footer";
import {
    Crown,
    TrendingUp,
    Calendar,
    Clock,
    BarChart3,
    FileText,
    Zap,
    Settings,
    CreditCard,
    ArrowUpCircle,
    XCircle,
    PlayCircle,
    Eye,
    ArrowLeft,
    CheckCircle,
    Sparkles,
    Heart,
    Star,
} from "lucide-react";

export default function SubscriptionIndex({
    currentSubscription,
    subscriptionHistory,
    usageStats,
    upgradeOptions,
    user,
}) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    const handleCancelSubscription = () => {
        if (confirm(t("subscriptions.messages.confirmCancel"))) {
            setLoading(true);
            router.post(
                "/subscriptions/cancel",
                {},
                {
                    onFinish: () => setLoading(false),
                }
            );
        }
    };

    const handleCreateFreeSubscription = () => {
        setLoading(true);
        router.post(
            "/subscriptions/free",
            {},
            {
                onFinish: () => setLoading(false),
            }
        );
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
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
        <>
            <Head title={t("subscriptions.title")} />
            <StarBackground />

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

            <div className="min-h-screen relative z-10">
                <TopTools />

                <motion.div
                    className="max-w-6xl mx-auto px-4 py-16 mt-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div
                        variants={cardVariants}
                        className="text-center mb-12 relative"
                    >
                        <div className="flex items-center justify-start gap-6 relative max-w-6xl mx-auto">
                            {/* Back to Dashboard - Circle Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0"
                            >
                                <Link
                                    href="/dashboard"
                                    className="group relative w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border border-white/30 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden z-50"
                                    style={{ pointerEvents: "auto" }}
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                                    {/* Icon */}
                                    <motion.div
                                        className="relative z-10"
                                        whileHover={{ x: -2 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                        }}
                                    >
                                        <ArrowLeft
                                            size={22}
                                            className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300"
                                        />
                                    </motion.div>

                                    {/* Gradient Border Effect on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                </Link>
                            </motion.div>

                            {/* Title Section */}
                            <div className="flex-1 text-center">
                                <motion.div
                                    className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                                    {t("subscriptions.title")}
                                </h1>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Heart
                                        size={20}
                                        className="text-pink-500"
                                    />
                                    <p className="text-lg text-gray-600 dark:text-gray-400">
                                        {t("subscriptions.subtitle")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Current Subscription Status */}
                    <motion.div variants={cardVariants} className="mb-8">
                        <div
                            className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden"
                            onMouseEnter={() => setHoveredCard("subscription")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                            <div className="relative p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <motion.h2
                                        className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3"
                                        whileHover={{ x: 5 }}
                                    >
                                        <motion.div
                                            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                                            variants={pulseVariants}
                                            animate="pulse"
                                        >
                                            <CheckCircle
                                                size={20}
                                                className="text-white"
                                            />
                                        </motion.div>
                                        {t("subscriptions.currentSubscription")}
                                    </motion.h2>

                                    {currentSubscription ? (
                                        <motion.span
                                            className={`px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2 ${
                                                currentSubscription.status ===
                                                "active"
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30"
                                                    : "bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30"
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <Star size={14} />
                                            {currentSubscription.status_display}
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            className="px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-500 to-gray-400 text-white shadow-lg shadow-gray-500/30 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <XCircle size={14} />
                                            {t("subscriptions.noSubscription")}
                                        </motion.span>
                                    )}
                                </div>

                                {currentSubscription ? (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Plan Type */}
                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <Crown className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.cards.planTypeTitle"
                                                )}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {currentSubscription.plan_type_display ||
                                                    t("subscriptions.free")}
                                            </p>
                                        </motion.div>

                                        {/* Amount */}
                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100/50 dark:border-green-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <CreditCard className="w-8 h-8 mx-auto mb-3 text-green-600 dark:text-green-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.cards.amountTitle"
                                                )}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {currentSubscription.amount
                                                    ? `${
                                                          currentSubscription.amount
                                                      } ${t(
                                                          "subscriptions.sar"
                                                      )}`
                                                    : t("subscriptions.free")}
                                            </p>
                                        </motion.div>

                                        {/* Start Date */}
                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-100/50 dark:border-orange-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <Calendar className="w-8 h-8 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.cards.startDateTitle"
                                                )}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {new Date(
                                                    currentSubscription.start_date
                                                ).toLocaleDateString(
                                                    i18n.language === "ar"
                                                        ? "ar-SA"
                                                        : "en-US",
                                                    {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </motion.div>

                                        {/* Days Remaining */}
                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100/50 dark:border-purple-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.cards.daysRemainingTitle"
                                                )}
                                            </h3>
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {currentSubscription.days_remaining
                                                    ? `${
                                                          currentSubscription.days_remaining
                                                      } ${t(
                                                          "subscriptions.day"
                                                      )}`
                                                    : t(
                                                          "subscriptions.unlimited"
                                                      )}
                                            </p>
                                        </motion.div>
                                    </div>
                                ) : (
                                    <motion.div
                                        className="text-center py-12"
                                        variants={floatingVariants}
                                        animate="floating"
                                    >
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-3xl flex items-center justify-center shadow-xl">
                                            <CreditCard
                                                size={40}
                                                className="text-indigo-600 dark:text-indigo-400"
                                            />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            {t(
                                                "subscriptions.noActiveSubscriptionTitle"
                                            )}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                                            {t(
                                                "subscriptions.noSubscriptionDescription"
                                            )}
                                        </p>

                                        <div className="flex flex-wrap justify-center gap-4">
                                            <motion.button
                                                onClick={
                                                    handleCreateFreeSubscription
                                                }
                                                disabled={loading}
                                                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/30 disabled:opacity-50"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative flex items-center gap-3">
                                                    <PlayCircle size={20} />
                                                    {loading
                                                        ? t(
                                                              "subscriptions.messages.activating"
                                                          )
                                                        : t(
                                                              "subscriptions.buttons.activateFreeButton"
                                                          )}
                                                    <Sparkles
                                                        size={16}
                                                        className="text-yellow-300"
                                                    />
                                                </div>
                                            </motion.button>

                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Link
                                                    href="/subscriptions/plans"
                                                    className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl shadow-green-500/30 inline-flex items-center gap-3"
                                                >
                                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="relative flex items-center gap-3">
                                                        <Crown size={20} />
                                                        {t(
                                                            "subscriptions.buttons.viewPaidPlansButton"
                                                        )}
                                                        <Zap
                                                            size={16}
                                                            className="text-yellow-300"
                                                        />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Usage Statistics */}
                    {currentSubscription && usageStats && (
                        <motion.div variants={cardVariants} className="mb-8">
                            <div className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                                <div className="relative p-8">
                                    <motion.h2
                                        className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3"
                                        whileHover={{ x: 5 }}
                                    >
                                        <motion.div
                                            className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl"
                                            variants={pulseVariants}
                                            animate="pulse"
                                        >
                                            <BarChart3
                                                size={20}
                                                className="text-white"
                                            />
                                        </motion.div>
                                        {t(
                                            "subscriptions.cards.usageStatsTitle"
                                        )}
                                    </motion.h2>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <FileText className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.plansCreated"
                                                )}
                                            </h3>
                                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {usageStats.plans_created}
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100/50 dark:border-green-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-green-600 dark:text-green-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.plansCompleted"
                                                )}
                                            </h3>
                                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {usageStats.plans_completed}
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border border-orange-100/50 dark:border-orange-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <FileText className="w-8 h-8 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.pdfsGenerated"
                                                )}
                                            </h3>
                                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                {usageStats.pdfs_generated}
                                            </p>
                                        </motion.div>

                                        <motion.div
                                            className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100/50 dark:border-purple-700/30 shadow-lg"
                                            whileHover={{ y: -5, scale: 1.02 }}
                                        >
                                            <Zap className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                {t(
                                                    "subscriptions.aiSuggestions"
                                                )}
                                            </h3>
                                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {usageStats.ai_suggestions_used}
                                            </p>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    {currentSubscription && (
                        <motion.div variants={cardVariants} className="mb-8">
                            <div className="relative group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
                                {/* Shimmer Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                                <div className="relative p-8">
                                    <motion.h2
                                        className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3"
                                        whileHover={{ x: 5 }}
                                    >
                                        <motion.div
                                            className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl"
                                            variants={pulseVariants}
                                            animate="pulse"
                                        >
                                            <Settings
                                                size={20}
                                                className="text-white"
                                            />
                                        </motion.div>
                                        {t(
                                            "subscriptions.cards.subscriptionActionsTitle"
                                        )}
                                    </motion.h2>

                                    <div className="flex flex-wrap gap-4">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link
                                                href="/subscriptions/plans"
                                                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 inline-flex items-center gap-3"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative flex items-center gap-3">
                                                    <Eye size={18} />
                                                    {t(
                                                        "subscriptions.buttons.viewAllPlansButton"
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Link
                                                href="/payments/history"
                                                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/20 inline-flex items-center gap-3"
                                            >
                                                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <div className="relative flex items-center gap-3">
                                                    <CreditCard size={18} />
                                                    {t(
                                                        "subscriptions.buttons.paymentHistoryButton"
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>

                                        {currentSubscription.plan_type ===
                                            "free" &&
                                            upgradeOptions &&
                                            Object.keys(upgradeOptions).length >
                                                0 && (
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Link
                                                        href="/payments/checkout"
                                                        className="group relative overflow-hidden bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-yellow-500/20 inline-flex items-center gap-3"
                                                    >
                                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                        <div className="relative flex items-center gap-3">
                                                            <ArrowUpCircle
                                                                size={18}
                                                            />
                                                            {t(
                                                                "subscriptions.buttons.upgradeButton"
                                                            )}
                                                            <Sparkles
                                                                size={14}
                                                                className="text-yellow-300"
                                                            />
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            )}

                                        {currentSubscription.plan_type ===
                                            "paid" &&
                                            currentSubscription.status ===
                                                "active" && (
                                                <motion.button
                                                    onClick={
                                                        handleCancelSubscription
                                                    }
                                                    disabled={loading}
                                                    className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center gap-3"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="relative flex items-center gap-3">
                                                        <XCircle size={18} />
                                                        {loading
                                                            ? t(
                                                                  "subscriptions.messages.cancelling"
                                                              )
                                                            : t(
                                                                  "subscriptions.buttons.cancelButton"
                                                              )}
                                                    </div>
                                                </motion.button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Back to Dashboard - Remove old location */}
                </motion.div>
            </div>

            <Footer />

            <style jsx="true">{`
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
            `}</style>
        </>
    );
}
