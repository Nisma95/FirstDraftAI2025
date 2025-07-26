import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import Footer from "@/Layouts/Footer";

export default function Checkout({
    user,
    currentSubscription,
    plans,
    selectedPlan,
    meeserConfig,
    pendingPayment,
}) {
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedPlanKey, setSelectedPlanKey] = useState(
        selectedPlan || "monthly"
    );
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Discount state
    const [discountCode, setDiscountCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountLoading, setDiscountLoading] = useState(false);
    const [discountError, setDiscountError] = useState("");

    const currentLocale = i18n.language || "ar";
    const plan = plans[selectedPlanKey];

    // Calculate final amounts
    const originalAmount = plan?.price || 0;
    const discountAmount = appliedDiscount?.discount_amount || 0;
    const subtotal = originalAmount - discountAmount;
    const vatAmount = subtotal * 0.15;
    const totalAmount = subtotal + vatAmount;

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

    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            setDiscountError(
                currentLocale === "en"
                    ? "Please enter a discount code"
                    : "يرجى إدخال كود الخصم"
            );
            return;
        }

        setDiscountLoading(true);
        setDiscountError("");

        try {
            // Get CSRF token from meta tag or cookie
            const csrfToken =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") ||
                document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("XSRF-TOKEN="))
                    ?.split("=")[1];

            const response = await fetch("/payments/validate-discount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken || "",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    code: discountCode,
                    plan_type: selectedPlanKey,
                    amount: plan.price,
                }),
            });

            const data = await response.json();
            console.log("Discount API response:", data);

            if (response.ok && data.success) {
                setAppliedDiscount(data);
                setDiscountError("");
                console.log("Discount applied successfully:", data);
            } else {
                const errorMsg =
                    data.message_en || data.message || "Invalid discount code";
                setDiscountError(
                    currentLocale === "en" ? errorMsg : data.message || errorMsg
                );
                setAppliedDiscount(null);
                console.log("Discount validation failed:", data);
            }
        } catch (error) {
            console.error("Discount validation error:", error);
            setDiscountError(
                currentLocale === "en"
                    ? "Failed to validate discount code"
                    : "فشل في التحقق من كود الخصم"
            );
            setAppliedDiscount(null);
        } finally {
            setDiscountLoading(false);
        }
    };

    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode("");
        setDiscountError("");
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!agreedToTerms) {
            alert(
                currentLocale === "en"
                    ? "Please agree to the terms and conditions"
                    : "يرجى الموافقة على الشروط والأحكام"
            );
            return;
        }

        setLoading(true);

        try {
            router.post(
                "/payments/process",
                {
                    plan_type: selectedPlanKey,
                    amount: totalAmount,
                    original_amount: originalAmount,
                    discount_code: appliedDiscount?.discount?.code || null,
                    discount_amount: discountAmount,
                    currency: "SAR",
                    payment_method: paymentMethod,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setLoading(false),
                    onError: (errors) => {
                        console.error("Payment error:", errors);
                        setLoading(false);

                        const errorMessage =
                            currentLocale === "en"
                                ? "Payment processing failed. Please try again."
                                : "فشل في معالجة الدفع. يرجى المحاولة مرة أخرى.";
                        alert(errorMessage);
                    },
                    onSuccess: () => {
                        console.log("Payment successful");
                    },
                }
            );
        } catch (error) {
            console.error("Payment processing error:", error);
            setLoading(false);

            const errorMessage =
                currentLocale === "en"
                    ? "An unexpected error occurred. Please try again."
                    : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
            alert(errorMessage);
        }
    };

    const paymentMethods = [
        {
            id: "credit_card",
            name: currentLocale === "en" ? "Credit Card" : "بطاقة ائتمان",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                </svg>
            ),
        },
        {
            id: "meeser",
            name: currentLocale === "en" ? "Meeser Wallet" : "محفظة ميسر",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title={currentLocale === "en" ? "Checkout" : "الدفع"} />
            <StarBackground />

            {/* Background gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:hidden" />
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/15 to-indigo-950/25" />
            </div>

            <div
                className="min-h-screen relative z-10"
                dir={currentLocale === "ar" ? "rtl" : "ltr"}
            >
                <TopTools />

                <motion.div
                    className="container mx-auto px-4 py-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div
                        variants={cardVariants}
                        className="text-center mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            {currentLocale === "en"
                                ? "Complete Your Subscription"
                                : "أكمل اشتراكك"}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {currentLocale === "en"
                                ? "Review your order and proceed with payment"
                                : "راجع طلبك وتابع عملية الدفع"}
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <motion.div variants={cardVariants}>
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    {currentLocale === "en"
                                        ? "Order Summary"
                                        : "ملخص الطلب"}
                                </h2>

                                {/* Plan Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {currentLocale === "en"
                                            ? "Select Plan"
                                            : "اختر الخطة"}
                                    </label>
                                    <div className="space-y-3">
                                        {Object.entries(plans)
                                            .filter(([key]) => key !== "free")
                                            .map(([key, planData]) => (
                                                <div
                                                    key={key}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                        selectedPlanKey === key
                                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedPlanKey(key)
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                                {planData.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {
                                                                    planData.billing_cycle
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                                {planData.price}{" "}
                                                                {
                                                                    planData.currency
                                                                }
                                                            </p>
                                                            {planData.discount && (
                                                                <p className="text-sm text-green-600 dark:text-green-400">
                                                                    {currentLocale ===
                                                                    "en"
                                                                        ? "Save"
                                                                        : "وفر"}{" "}
                                                                    {
                                                                        planData.savings
                                                                    }{" "}
                                                                    {
                                                                        planData.currency
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3">
                                                        <input
                                                            type="radio"
                                                            name="plan"
                                                            checked={
                                                                selectedPlanKey ===
                                                                key
                                                            }
                                                            onChange={() =>
                                                                setSelectedPlanKey(
                                                                    key
                                                                )
                                                            }
                                                            className="text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Selected Plan Details */}
                                {plan && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            {currentLocale === "en"
                                                ? "Plan Features"
                                                : "مميزات الخطة"}
                                        </h3>
                                        <ul className="space-y-2">
                                            {plan.features.map(
                                                (feature, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                                                    >
                                                        <svg
                                                            className="w-4 h-4 text-green-500 mr-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {/* Pricing Breakdown */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {currentLocale === "en"
                                                    ? "Subtotal"
                                                    : "المجموع الفرعي"}
                                            </span>
                                            <span className="text-gray-900 dark:text-white">
                                                {originalAmount}{" "}
                                                {plan?.currency}
                                            </span>
                                        </div>

                                        {appliedDiscount && (
                                            <div className="flex justify-between text-green-600 dark:text-green-400">
                                                <span>
                                                    {currentLocale === "en"
                                                        ? "Discount"
                                                        : "الخصم"}{" "}
                                                    (
                                                    {
                                                        appliedDiscount.discount
                                                            .code
                                                    }
                                                    )
                                                </span>
                                                <span>
                                                    -{discountAmount.toFixed(2)}{" "}
                                                    {plan?.currency}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {currentLocale === "en"
                                                    ? "VAT (15%)"
                                                    : "ضريبة القيمة المضافة (15%)"}
                                            </span>
                                            <span className="text-gray-900 dark:text-white">
                                                {vatAmount.toFixed(2)}{" "}
                                                {plan?.currency}
                                            </span>
                                        </div>

                                        <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <span className="text-gray-900 dark:text-white">
                                                {currentLocale === "en"
                                                    ? "Total"
                                                    : "الإجمالي"}
                                            </span>
                                            <span className="text-gray-900 dark:text-white">
                                                {totalAmount.toFixed(2)}{" "}
                                                {plan?.currency}
                                            </span>
                                        </div>

                                        {appliedDiscount && (
                                            <div className="text-center">
                                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                    {currentLocale === "en"
                                                        ? "You saved"
                                                        : "لقد وفرت"}{" "}
                                                    {discountAmount.toFixed(2)}{" "}
                                                    {plan?.currency}!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Form */}
                        <motion.div variants={cardVariants}>
                            <div className="space-y-6">
                                {/* Discount Code Card */}
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {currentLocale === "en"
                                                ? "Discount Code"
                                                : "كود الخصم"}
                                        </h2>
                                    </div>

                                    {!appliedDiscount ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={discountCode}
                                                    onChange={(e) =>
                                                        setDiscountCode(
                                                            e.target.value.toUpperCase()
                                                        )
                                                    }
                                                    placeholder={
                                                        currentLocale === "en"
                                                            ? "Enter discount code"
                                                            : "أدخل كود الخصم"
                                                    }
                                                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                                    maxLength={20}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleApplyDiscount
                                                    }
                                                    disabled={
                                                        discountLoading ||
                                                        !discountCode.trim()
                                                    }
                                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
                                                >
                                                    {discountLoading ? (
                                                        <div className="flex items-center">
                                                            <svg
                                                                className="animate-spin h-4 w-4 mr-2"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                ></circle>
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                ></path>
                                                            </svg>
                                                            {currentLocale ===
                                                            "en"
                                                                ? "Applying..."
                                                                : "تطبيق..."}
                                                        </div>
                                                    ) : currentLocale ===
                                                      "en" ? (
                                                        "Apply Code"
                                                    ) : (
                                                        "تطبيق الكود"
                                                    )}
                                                </button>
                                            </div>

                                            {discountError && (
                                                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                                        <svg
                                                            className="w-4 h-4 mr-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        {discountError}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Available Discount Codes */}
                                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                                                    {currentLocale === "en"
                                                        ? "🎉 Available Discount Codes:"
                                                        : "🎉 أكواد الخصم المتاحة:"}
                                                </p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                                                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            SAVE10
                                                        </span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? "10% off any plan"
                                                                : "خصم 10% على أي خطة"}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                                                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            SAVE20
                                                        </span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? "20% off yearly plans"
                                                                : "خصم 20% على الخطط السنوية"}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                                                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            NEWUSER
                                                        </span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? "15 SAR off for new users"
                                                                : "15 ريال خصم للمستخدمين الجدد"}
                                                        </p>
                                                    </div>
                                                    <div className="p-2 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-600">
                                                        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                                                            YEARLY50
                                                        </span>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? "50 SAR off yearly plans"
                                                                : "50 ريال خصم على الخطط السنوية"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-3">
                                                        <svg
                                                            className="w-5 h-5 text-green-600 dark:text-green-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-green-800 dark:text-green-200 text-lg">
                                                            {
                                                                appliedDiscount
                                                                    .discount
                                                                    .code
                                                            }
                                                        </p>
                                                        <p className="text-sm text-green-600 dark:text-green-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? appliedDiscount
                                                                      .discount
                                                                      .description_en
                                                                : appliedDiscount
                                                                      .discount
                                                                      .description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="text-right mr-3">
                                                        <p className="text-lg font-bold text-green-800 dark:text-green-200">
                                                            -
                                                            {discountAmount.toFixed(
                                                                2
                                                            )}{" "}
                                                            {plan?.currency}
                                                        </p>
                                                        <p className="text-xs text-green-600 dark:text-green-400">
                                                            {currentLocale ===
                                                            "en"
                                                                ? "You saved!"
                                                                : "لقد وفرت!"}
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleRemoveDiscount
                                                        }
                                                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title={
                                                            currentLocale ===
                                                            "en"
                                                                ? "Remove discount"
                                                                : "إزالة الخصم"
                                                        }
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method Card */}
                                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {currentLocale === "en"
                                                ? "Payment Method"
                                                : "طريقة الدفع"}
                                        </h2>
                                    </div>

                                    <form onSubmit={handlePayment}>
                                        {/* Payment Method Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                                {currentLocale === "en"
                                                    ? "Choose Payment Method"
                                                    : "اختر طريقة الدفع"}
                                            </label>
                                            <div className="space-y-3">
                                                {paymentMethods.map(
                                                    (method) => (
                                                        <div
                                                            key={method.id}
                                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                                paymentMethod ===
                                                                method.id
                                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                            }`}
                                                            onClick={() =>
                                                                setPaymentMethod(
                                                                    method.id
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value={
                                                                        method.id
                                                                    }
                                                                    checked={
                                                                        paymentMethod ===
                                                                        method.id
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setPaymentMethod(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="text-blue-600 focus:ring-blue-500 mr-3"
                                                                />
                                                                <div className="mr-3 text-gray-600 dark:text-gray-400">
                                                                    {
                                                                        method.icon
                                                                    }
                                                                </div>
                                                                <span className="font-medium text-gray-900 dark:text-white">
                                                                    {
                                                                        method.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        {/* Terms and Conditions - Improved Clickable Area */}
                                        <div className="mb-6">
                                            <label className="flex items-start cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={(e) =>
                                                        setAgreedToTerms(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 mr-3 mt-1 flex-shrink-0"
                                                    required
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed select-none">
                                                    {currentLocale === "en" ? (
                                                        <>
                                                            I agree to the{" "}
                                                            <a
                                                                href="/terms"
                                                                target="_blank"
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                Terms and
                                                                Conditions
                                                            </a>{" "}
                                                            and{" "}
                                                            <a
                                                                href="/privacy"
                                                                target="_blank"
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                Privacy Policy
                                                            </a>
                                                        </>
                                                    ) : (
                                                        <>
                                                            أوافق على{" "}
                                                            <a
                                                                href="/terms"
                                                                target="_blank"
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                الشروط والأحكام
                                                            </a>{" "}
                                                            و{" "}
                                                            <a
                                                                href="/privacy"
                                                                target="_blank"
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                سياسة الخصوصية
                                                            </a>
                                                        </>
                                                    )}
                                                </span>
                                            </label>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={loading || !agreedToTerms}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
                                        >
                                            {loading ? (
                                                <div className="flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    {currentLocale === "en"
                                                        ? "Processing..."
                                                        : "جاري المعالجة..."}
                                                </div>
                                            ) : (
                                                <>
                                                    {currentLocale === "en"
                                                        ? "Complete Payment"
                                                        : "أكمل الدفع"}
                                                    {` - ${totalAmount.toFixed(
                                                        2
                                                    )} ${plan?.currency}`}
                                                </>
                                            )}
                                        </button>

                                        {/* Security Notice */}
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-green-600 dark:text-green-400 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                <span className="text-sm text-green-800 dark:text-green-200">
                                                    {currentLocale === "en"
                                                        ? "Your payment is secured with 256-bit SSL encryption"
                                                        : "دفعتك محمية بتشفير SSL 256 بت"}
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Back Navigation */}
                    <motion.div
                        variants={cardVariants}
                        className="text-center mt-8"
                    >
                        <button
                            onClick={() => router.get("/subscriptions/plans")}
                            className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-200"
                        >
                            <svg
                                className={`w-5 h-5 ${
                                    currentLocale === "ar" ? "ml-2" : "mr-2"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={
                                        currentLocale === "ar"
                                            ? "M14 5l7 7m0 0l-7 7m7-7H3"
                                            : "M10 19l-7-7m0 0l7-7m-7 7h18"
                                    }
                                />
                            </svg>
                            {currentLocale === "en"
                                ? "Back to Plans"
                                : "العودة للخطط"}
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </>
    );
}
