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
    Zap,
    Shield,
    Check,
    X,
    ArrowLeft,
    Home,
    Heart,
    Sparkles,
    Star,
    CheckCircle,
} from "lucide-react";

export default function SubscriptionPlans({
    plans,
    currentSubscription,
    user,
    locale,
}) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

    const currentLocale = locale || i18n.language || "ar";

    const handleSubscribe = (planType) => {
        setSelectedPlan(planType);
        console.log("Subscribing to plan:", planType);

        if (planType === "free") {
            setLoading(true);
            router.post(
                "/subscriptions/free",
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => {
                        setLoading(false);
                        setSelectedPlan(null);
                    },
                    onError: (errors) => {
                        console.error("Free subscription error:", errors);
                        setLoading(false);
                        setSelectedPlan(null);
                        alert(t("plans.errors.freePlanFailed"));
                    },
                    onSuccess: () => {
                        console.log("Free subscription activated");
                    },
                }
            );
        } else {
            console.log("Redirecting to checkout with plan:", planType);
            router.get(
                "/payments/checkout",
                { plan: planType },
                {
                    preserveState: false,
                    onError: (errors) => {
                        console.error("Checkout redirect error:", errors);
                        alert(t("plans.errors.checkoutFailed"));
                    },
                }
            );
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
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

    return (
        <>
            <Head
                title={t("plans.title", "Choose the Right Subscription Plan")}
            />
            <StarBackground />

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

            <div
                className="min-h-screen relative z-10"
                dir={currentLocale === "ar" ? "rtl" : "ltr"}
                style={{
                    fontFamily:
                        currentLocale === "ar"
                            ? "'Cairo', 'Tajawal', sans-serif"
                            : "inherit",
                }}
            >
                <TopTools />

                <motion.div
                    className="max-w-7xl mx-auto px-4 py-16 mt-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div
                        variants={cardVariants}
                        className="text-center mb-12 relative"
                    >
                        <div className="flex items-center justify-start gap-6 relative max-w-6xl mx-auto mb-8">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-shrink-0"
                            >
                                <Link
                                    href="/subscriptions"
                                    className="group relative w-14 h-14 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full border border-white/30 dark:border-gray-700/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center overflow-hidden z-50"
                                    style={{ pointerEvents: "auto" }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                                    <motion.div
                                        className="relative z-10"
                                        whileHover={{
                                            x: currentLocale === "ar" ? 2 : -2,
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                        }}
                                    >
                                        <ArrowLeft
                                            size={22}
                                            className={`text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 ${
                                                currentLocale === "ar"
                                                    ? "rotate-180"
                                                    : ""
                                            }`}
                                        />
                                    </motion.div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                                </Link>
                            </motion.div>

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
                                    {t(
                                        "plans.title",
                                        currentLocale === "ar"
                                            ? "اختر خطة الاشتراك المناسبة"
                                            : "Choose the Right Subscription Plan"
                                    )}
                                </h1>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Heart
                                        size={20}
                                        className="text-pink-500"
                                    />
                                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                                        {t(
                                            "plans.subtitle",
                                            currentLocale === "ar"
                                                ? "اختر الخطة التي تناسب احتياجاتك وابدأ في إنشاء خطط عمل احترافية بمساعدة الذكاء الاصطناعي"
                                                : "Select the plan that fits your needs and start creating professional business plans with AI assistance"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content Layout */}
                    <div className="grid lg:grid-cols-10 gap-8 mb-16">
                        {/* Left Column - Package Cards */}
                        <div className="lg:col-span-3 flex flex-col">
                            <div className="space-y-6 flex flex-col h-full">
                                {Object.entries(plans || {}).map(
                                    ([planKey, plan]) => (
                                        <motion.div
                                            key={planKey}
                                            variants={cardVariants}
                                            whileHover={{ scale: 1.02, y: -5 }}
                                            className={`relative group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border shadow-lg overflow-hidden p-6 flex-1 min-h-0 ${
                                                plan.highlight
                                                    ? "border-yellow-400/50 ring-2 ring-yellow-400/20 shadow-yellow-500/20"
                                                    : "border-white/20 dark:border-gray-700/30"
                                            } ${
                                                plan.current
                                                    ? "ring-2 ring-green-400/30"
                                                    : ""
                                            }`}
                                            onMouseEnter={() =>
                                                setHoveredCard(planKey)
                                            }
                                            onMouseLeave={() =>
                                                setHoveredCard(null)
                                            }
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />

                                            {plan.highlight && (
                                                <motion.div
                                                    className="absolute top-3 right-3 z-10"
                                                    animate={{
                                                        rotate: [0, 3, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                    }}
                                                >
                                                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg">
                                                        {currentLocale === "ar"
                                                            ? "الأكثر شعبية"
                                                            : t(
                                                                  "plans.mostPopular",
                                                                  "Most Popular"
                                                              )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {plan.current && (
                                                <motion.div
                                                    className="absolute top-3 right-3 z-10"
                                                    animate={{
                                                        scale: [1, 1.02, 1],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                    }}
                                                >
                                                    <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1">
                                                        <CheckCircle
                                                            size={10}
                                                        />
                                                        {currentLocale === "ar"
                                                            ? "الخطة الحالية"
                                                            : t(
                                                                  "plans.current",
                                                                  "Current"
                                                              )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="relative">
                                                <h3
                                                    className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center"
                                                    style={{
                                                        fontFamily:
                                                            currentLocale ===
                                                            "ar"
                                                                ? "'Cairo', 'Tajawal', sans-serif"
                                                                : "inherit",
                                                    }}
                                                >
                                                    {/* Force Arabic translation regardless of locale detection */}
                                                    {currentLocale === "ar" ||
                                                    locale === "ar" ||
                                                    i18n.language === "ar"
                                                        ? // Force Arabic names
                                                          plan.name ===
                                                              "Free Plan" ||
                                                          planKey === "free"
                                                            ? "الخطة المجانية"
                                                            : plan.name ===
                                                                  "Monthly Plan" ||
                                                              planKey ===
                                                                  "monthly"
                                                            ? "الخطة الشهرية"
                                                            : plan.name ===
                                                                  "Yearly Plan" ||
                                                              planKey ===
                                                                  "yearly"
                                                            ? "الخطة السنوية"
                                                            : "خطة " + plan.name
                                                        : plan.name}
                                                </h3>

                                                <div className="text-center mb-4">
                                                    <div className="mb-2">
                                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                            {plan.price}
                                                        </span>
                                                        {currentLocale ===
                                                            "ar" ||
                                                        locale === "ar" ||
                                                        i18n.language ===
                                                            "ar" ? (
                                                            <>
                                                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                                                    {" "}
                                                                    ريال
                                                                </span>
                                                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                                                    /
                                                                </span>
                                                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                                                    {plan.billing_cycle ===
                                                                        "month" ||
                                                                    plan.billing_cycle ===
                                                                        "Monthly"
                                                                        ? "شهرياً"
                                                                        : plan.billing_cycle ===
                                                                              "year" ||
                                                                          plan.billing_cycle ===
                                                                              "Yearly"
                                                                        ? "سنوياً"
                                                                        : plan.billing_cycle ===
                                                                              "Free" ||
                                                                          plan.billing_cycle ===
                                                                              "free"
                                                                        ? "مجاناً"
                                                                        : plan.billing_cycle}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-lg text-gray-600 dark:text-gray-400 ml-1">
                                                                    {
                                                                        plan.currency
                                                                    }
                                                                </span>
                                                                <span className="text-lg text-gray-600 dark:text-gray-400">
                                                                    /
                                                                    {
                                                                        plan.billing_cycle
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {plan.discount && (
                                                    <motion.div
                                                        className="text-center mb-4"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                    >
                                                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-md">
                                                            {currentLocale ===
                                                            "ar"
                                                                ? `خصم ${plan.discount}`
                                                                : `${t(
                                                                      "plans.discount",
                                                                      "Save"
                                                                  )} ${
                                                                      plan.discount
                                                                  }`}
                                                        </span>
                                                        {plan.original_price && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {currentLocale ===
                                                                "ar"
                                                                    ? `بدلاً من ${plan.original_price} ريال`
                                                                    : `${t(
                                                                          "plans.insteadOf",
                                                                          "Instead of"
                                                                      )} ${
                                                                          plan.original_price
                                                                      } ${
                                                                          plan.currency
                                                                      }`}
                                                            </p>
                                                        )}
                                                    </motion.div>
                                                )}

                                                <div className="text-center mb-4">
                                                    {plan.current ? (
                                                        <motion.button
                                                            disabled
                                                            className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-xl cursor-not-allowed shadow-md flex items-center justify-center gap-2 text-sm"
                                                            whileHover={{
                                                                scale: 1.02,
                                                            }}
                                                            style={{
                                                                fontFamily:
                                                                    currentLocale ===
                                                                    "ar"
                                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                                        : "inherit",
                                                            }}
                                                        >
                                                            <CheckCircle
                                                                size={16}
                                                            />
                                                            {currentLocale ===
                                                            "ar"
                                                                ? "الخطة الحالية"
                                                                : t(
                                                                      "plans.current",
                                                                      "Current Plan"
                                                                  )}
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            onClick={() =>
                                                                handleSubscribe(
                                                                    planKey
                                                                )
                                                            }
                                                            disabled={loading}
                                                            className={`w-full py-3 font-bold rounded-xl transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${
                                                                plan.highlight
                                                                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-yellow-500/30"
                                                                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/30"
                                                            }`}
                                                            whileHover={{
                                                                scale: 1.02,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.98,
                                                            }}
                                                            style={{
                                                                fontFamily:
                                                                    currentLocale ===
                                                                    "ar"
                                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                                        : "inherit",
                                                            }}
                                                        >
                                                            {loading &&
                                                            selectedPlan ===
                                                                planKey ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                                    {currentLocale ===
                                                                    "ar"
                                                                        ? "جاري التحميل..."
                                                                        : t(
                                                                              "plans.loading",
                                                                              "Loading..."
                                                                          )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {planKey ===
                                                                    "free" ? (
                                                                        <>
                                                                            <Zap
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            {currentLocale ===
                                                                            "ar"
                                                                                ? "تفعيل الخطة المجانية"
                                                                                : t(
                                                                                      "plans.activateFree",
                                                                                      "Activate Free Plan"
                                                                                  )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Crown
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            {currentLocale ===
                                                                            "ar"
                                                                                ? "اشترك الآن"
                                                                                : t(
                                                                                      "plans.subscribeNow",
                                                                                      "Subscribe Now"
                                                                                  )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </motion.button>
                                                    )}
                                                </div>

                                                {plan.savings && (
                                                    <motion.div
                                                        className="text-center"
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                    >
                                                        <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                                                            <p
                                                                className="text-xs text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-1"
                                                                style={{
                                                                    fontFamily:
                                                                        currentLocale ===
                                                                        "ar"
                                                                            ? "'Cairo', 'Tajawal', sans-serif"
                                                                            : "inherit",
                                                                }}
                                                            >
                                                                <TrendingUp
                                                                    size={12}
                                                                />
                                                                {currentLocale ===
                                                                "ar"
                                                                    ? `توفير ${plan.savings} سنوياً`
                                                                    : t(
                                                                          "plans.saveYearly",
                                                                          "Save {amount} yearly"
                                                                      ).replace(
                                                                          "{amount}",
                                                                          plan.savings
                                                                      )}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Right Column - Comparison */}
                        <div className="lg:col-span-7 flex">
                            <motion.div
                                variants={cardVariants}
                                className="flex-1"
                            >
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden h-full flex flex-col">
                                    <div className="p-8 flex-1">
                                        <motion.h2
                                            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                                <TrendingUp
                                                    size={24}
                                                    className="text-white"
                                                />
                                            </div>
                                            {t("plans.comparison.title")}
                                        </motion.h2>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b-2 border-gradient-to-r from-indigo-500 to-purple-500">
                                                        <th
                                                            className={`py-6 px-4 font-bold text-gray-900 dark:text-white text-lg ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.feature"
                                                            )}
                                                        </th>
                                                        <th className="text-center py-6 px-4 font-bold text-gray-900 dark:text-white">
                                                            {t(
                                                                "plans.planNames.free"
                                                            )}
                                                        </th>
                                                        <th className="text-center py-6 px-4 font-bold text-gray-900 dark:text-white">
                                                            {t(
                                                                "plans.planNames.monthly"
                                                            )}
                                                        </th>
                                                        <th className="text-center py-6 px-4 font-bold text-gray-900 dark:text-white">
                                                            {t(
                                                                "plans.planNames.yearly"
                                                            )}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.numberOfPlans"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center text-gray-600 dark:text-gray-400">
                                                            {t(
                                                                "plans.comparison.plans3"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.unlimited"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.unlimited"
                                                                )}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.aiAnalysis"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                                                {t(
                                                                    "plans.comparison.basic"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.advanced"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.advanced"
                                                                )}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.pdfExport"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <Check
                                                                size={20}
                                                                className="text-green-600 dark:text-green-400 mx-auto"
                                                            />
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.advanced"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.advanced"
                                                                )}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.technicalSupport"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                                                {t(
                                                                    "plans.comparison.limited"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.advanced"
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.priority"
                                                                )}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.swotAnalysis"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <X
                                                                size={20}
                                                                className="text-red-600 dark:text-red-400 mx-auto"
                                                            />
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <Check
                                                                size={20}
                                                                className="text-green-600 dark:text-green-400 mx-auto"
                                                            />
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <Check
                                                                size={20}
                                                                className="text-green-600 dark:text-green-400 mx-auto"
                                                            />
                                                        </td>
                                                    </motion.tr>
                                                    <motion.tr
                                                        whileHover={{
                                                            backgroundColor:
                                                                "rgba(99, 102, 241, 0.05)",
                                                        }}
                                                    >
                                                        <td
                                                            className={`py-6 px-4 text-gray-700 dark:text-gray-300 font-medium ${
                                                                currentLocale ===
                                                                "ar"
                                                                    ? "text-right"
                                                                    : "text-left"
                                                            }`}
                                                        >
                                                            {t(
                                                                "plans.comparison.personalConsultations"
                                                            )}
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <X
                                                                size={20}
                                                                className="text-red-600 dark:text-red-400 mx-auto"
                                                            />
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <Check
                                                                size={20}
                                                                className="text-green-600 dark:text-green-400 mx-auto"
                                                            />
                                                        </td>
                                                        <td className="py-6 px-4 text-center">
                                                            <span className="text-green-600 dark:text-green-400 font-bold">
                                                                {t(
                                                                    "plans.comparison.monthly"
                                                                )}
                                                            </span>
                                                        </td>
                                                    </motion.tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Money Back Guarantee */}
                    <motion.div variants={cardVariants} className="mb-8">
                        <motion.div
                            className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl border border-green-200/50 dark:border-green-700/50 p-8 text-center shadow-xl overflow-hidden relative"
                            variants={floatingVariants}
                            animate="floating"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 to-transparent" />
                            <div className="relative">
                                <motion.div
                                    className="flex justify-center mb-6"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-xl">
                                        <Shield
                                            size={32}
                                            className="text-white"
                                        />
                                    </div>
                                </motion.div>
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {t(
                                        "plans.guarantee.title",
                                        currentLocale === "ar"
                                            ? "ضمان استرداد الأموال"
                                            : "Money-Back Guarantee"
                                    )}
                                </h3>
                                <p
                                    className={`text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto ${
                                        currentLocale === "ar"
                                            ? "text-center"
                                            : "text-center"
                                    }`}
                                >
                                    {t(
                                        "plans.guarantee.description",
                                        currentLocale === "ar"
                                            ? "جرب خدمتنا لمدة 30 يوماً. إذا لم تكن راضياً، سنسترد أموالك بالكامل دون أسئلة."
                                            : "Try our service for 30 days. If you're not satisfied, we'll refund your money completely, no questions asked."
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div variants={cardVariants} className="mb-8">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/30 shadow-xl overflow-hidden">
                            <div className="p-8">
                                <motion.h2
                                    className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                        <Check
                                            size={24}
                                            className="text-white"
                                        />
                                    </div>
                                    {t("plans.faq.title")}
                                </motion.h2>

                                <div className="space-y-6">
                                    <motion.div
                                        className="border-b border-gray-200 dark:border-gray-700 pb-6"
                                        whileHover={{
                                            x: currentLocale === "ar" ? -5 : 5,
                                        }}
                                    >
                                        <h3
                                            className={`text-lg font-semibold text-gray-900 dark:text-white mb-3 ${
                                                currentLocale === "ar"
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}
                                            style={{
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "هل يمكنني تغيير خطة الاشتراك الخاصة بي لاحقاً؟"
                                                : t(
                                                      "plans.faq.questions.changePlan",
                                                      "Can I change my plan later?"
                                                  )}
                                        </h3>
                                        <p
                                            className={`text-gray-600 dark:text-gray-400 leading-relaxed ${
                                                currentLocale === "ar"
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}
                                            style={{
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "نعم، يمكنك ترقية أو تخفيض خطة الاشتراك الخاصة بك في أي وقت تشاء. التغييرات الجديدة ستطبق تلقائياً في دورة الفوترة التالية."
                                                : t(
                                                      "plans.faq.answers.changePlan",
                                                      "Yes, you can upgrade or downgrade your plan at any time. Changes will apply to your next billing period."
                                                  )}
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        className="border-b border-gray-200 dark:border-gray-700 pb-6"
                                        whileHover={{
                                            x: currentLocale === "ar" ? -5 : 5,
                                        }}
                                        style={{
                                            direction:
                                                currentLocale === "ar"
                                                    ? "rtl"
                                                    : "ltr",
                                        }}
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "ما الفرق بين الخطة الشهرية والخطة السنوية؟"
                                                : t(
                                                      "plans.faq.questions.planDifference",
                                                      "What's the difference between monthly and yearly plans?"
                                                  )}
                                        </h3>
                                        <p
                                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "الخطة السنوية توفر لك خصماً يصل إلى 17% مع جميع مزايا الخطة الشهرية، بالإضافة إلى استشارة مجانية شهرية وأولوية في خدمة الدعم الفني المتخصص."
                                                : t(
                                                      "plans.faq.answers.planDifference",
                                                      "The yearly plan offers a 17% discount with all monthly plan features plus free monthly consultations and priority support."
                                                  )}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        className="border-b border-gray-200 dark:border-gray-700 pb-6"
                                        whileHover={{
                                            x: currentLocale === "ar" ? -5 : 5,
                                        }}
                                        style={{
                                            direction:
                                                currentLocale === "ar"
                                                    ? "rtl"
                                                    : "ltr",
                                        }}
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "هل الخطة المجانية محدودة بفترة زمنية معينة؟"
                                                : t(
                                                      "plans.faq.questions.freeTimeLimited",
                                                      "Is the free plan time-limited?"
                                                  )}
                                        </h3>
                                        <p
                                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "لا، الخطة المجانية متاحة دائماً بدون قيود زمنية، وتتيح لك إنشاء حتى 3 خطط عمل كاملة مع جميع الميزات الأساسية المطلوبة."
                                                : t(
                                                      "plans.faq.answers.freeTimeLimited",
                                                      "No, the free plan is always available and allows you to create up to 3 business plans with basic features."
                                                  )}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{
                                            x: currentLocale === "ar" ? -5 : 5,
                                        }}
                                        style={{
                                            direction:
                                                currentLocale === "ar"
                                                    ? "rtl"
                                                    : "ltr",
                                        }}
                                    >
                                        <h3
                                            className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "كيف يمكنني إلغاء الاشتراك الخاص بي؟"
                                                : t(
                                                      "plans.faq.questions.cancelSubscription",
                                                      "How can I cancel my subscription?"
                                                  )}
                                        </h3>
                                        <p
                                            className="text-gray-600 dark:text-gray-400 leading-relaxed"
                                            style={{
                                                direction: "rtl",
                                                textAlign: "right",
                                                fontFamily:
                                                    currentLocale === "ar"
                                                        ? "'Cairo', 'Tajawal', sans-serif"
                                                        : "inherit",
                                                unicodeBidi: "embed",
                                            }}
                                        >
                                            {currentLocale === "ar"
                                                ? "يمكنك إلغاء اشتراكك بسهولة في أي وقت من خلال صفحة إدارة الاشتراك في حسابك. ستحتفظ بالوصول إلى جميع مزايا الخطة المدفوعة حتى انتهاء فترة الفوترة الحالية."
                                                : t(
                                                      "plans.faq.answers.cancelSubscription",
                                                      "You can cancel your subscription anytime from the subscription management page. You'll retain access to paid features until the end of your current billing period."
                                                  )}
                                        </p>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation */}
                    <motion.div variants={cardVariants} className="text-center">
                        <div className="flex flex-wrap justify-center gap-4">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/subscriptions"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80 text-gray-700 dark:text-gray-300 font-medium rounded-2xl transition-all duration-300 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 shadow-lg"
                                >
                                    <ArrowLeft
                                        size={20}
                                        className={
                                            currentLocale === "ar"
                                                ? "rotate-180"
                                                : ""
                                        }
                                    />
                                    {t(
                                        "plans.navigation.backToSubscription",
                                        currentLocale === "ar"
                                            ? "العودة لإدارة الاشتراك"
                                            : "Back to Subscription Management"
                                    )}
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-blue-100/80 hover:bg-blue-200/80 dark:bg-blue-900/80 dark:hover:bg-blue-800/80 text-blue-700 dark:text-blue-300 font-medium rounded-2xl transition-all duration-300 backdrop-blur-sm border border-blue-200/50 dark:border-blue-600/50 shadow-lg"
                                >
                                    <Home size={20} />
                                    {t(
                                        "plans.navigation.backToDashboard",
                                        currentLocale === "ar"
                                            ? "العودة للوحة التحكم"
                                            : "Back to Dashboard"
                                    )}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
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
            `}</style>
        </>
    );
}
