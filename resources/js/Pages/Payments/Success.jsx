import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarBackground from "@/Components/StarBackground";
import TopTools from "@/Components/TopTools";
import Footer from "@/Layouts/Footer";

export default function Success({ payment, subscription }) {
    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language || "ar";

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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    const successVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
            },
        },
    };

    return (
        <>
            <Head
                title={
                    currentLocale === "en"
                        ? "Payment Successful"
                        : "تم الدفع بنجاح"
                }
            />
            <StarBackground />

            {/* Background gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-emerald-50/30 dark:hidden" />
                <div className="hidden dark:block absolute inset-0 bg-gradient-to-br from-green-950/20 via-blue-950/15 to-emerald-950/25" />
            </div>

            <div
                className="min-h-screen relative z-10"
                dir={currentLocale === "ar" ? "rtl" : "ltr"}
            >
                <TopTools />

                <motion.div
                    className="container mx-auto px-4 py-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Success Icon */}
                    <motion.div
                        variants={successVariants}
                        className="text-center mb-8"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                            <svg
                                className="w-12 h-12 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                            {currentLocale === "en"
                                ? "Payment Successful!"
                                : "تم الدفع بنجاح!"}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                            {currentLocale === "en"
                                ? "Your subscription has been activated successfully"
                                : "تم تفعيل اشتراكك بنجاح"}
                        </p>
                        <p className="text-lg text-gray-500 dark:text-gray-500">
                            {currentLocale === "en"
                                ? "Thank you for choosing our premium plan!"
                                : "شكراً لك لاختيار خطتنا المميزة!"}
                        </p>
                    </motion.div>

                    {/* Payment Details Card */}
                    <motion.div
                        variants={itemVariants}
                        className="max-w-2xl mx-auto mb-8"
                    >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                                {currentLocale === "en"
                                    ? "Payment Details"
                                    : "تفاصيل الدفع"}
                            </h2>

                            <div className="space-y-4">
                                {/* Transaction ID */}
                                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        {currentLocale === "en"
                                            ? "Transaction ID"
                                            : "رقم المعاملة"}
                                    </span>
                                    <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                                        {payment?.transaction_id || "N/A"}
                                    </span>
                                </div>

                                {/* Amount */}
                                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        {currentLocale === "en"
                                            ? "Amount Paid"
                                            : "المبلغ المدفوع"}
                                    </span>
                                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {payment?.amount || "0.00"} SAR
                                    </span>
                                </div>

                                {/* Payment Method */}
                                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        {currentLocale === "en"
                                            ? "Payment Method"
                                            : "طريقة الدفع"}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {payment?.payment_method ===
                                        "credit_card"
                                            ? currentLocale === "en"
                                                ? "Credit Card"
                                                : "بطاقة ائتمان"
                                            : payment?.payment_method ===
                                              "meeser"
                                            ? currentLocale === "en"
                                                ? "Meeser Wallet"
                                                : "محفظة ميسر"
                                            : payment?.payment_method || "N/A"}
                                    </span>
                                </div>

                                {/* Payment Date */}
                                <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        {currentLocale === "en"
                                            ? "Payment Date"
                                            : "تاريخ الدفع"}
                                    </span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {payment?.payment_date
                                            ? new Date(
                                                  payment.payment_date
                                              ).toLocaleDateString(
                                                  currentLocale === "en"
                                                      ? "en-US"
                                                      : "ar-SA"
                                              )
                                            : "N/A"}
                                    </span>
                                </div>

                                {/* Subscription Details */}
                                {subscription && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            {currentLocale === "en"
                                                ? "Subscription Details"
                                                : "تفاصيل الاشتراك"}
                                        </h3>

                                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                {currentLocale === "en"
                                                    ? "Plan Type"
                                                    : "نوع الخطة"}
                                            </span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {subscription.plan_type ===
                                                "paid"
                                                    ? currentLocale === "en"
                                                        ? "Premium Plan"
                                                        : "الخطة المميزة"
                                                    : subscription.plan_type ||
                                                      "N/A"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                {currentLocale === "en"
                                                    ? "Valid Until"
                                                    : "صالح حتى"}
                                            </span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {subscription.end_date
                                                    ? new Date(
                                                          subscription.end_date
                                                      ).toLocaleDateString(
                                                          currentLocale === "en"
                                                              ? "en-US"
                                                              : "ar-SA"
                                                      )
                                                    : "N/A"}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center space-y-4"
                    >
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v0"
                                    />
                                </svg>
                                {currentLocale === "en"
                                    ? "Go to Dashboard"
                                    : "انتقل للوحة التحكم"}
                            </Link>

                            <Link
                                href="/payments/history"
                                className="inline-flex items-center px-8 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
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
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                {currentLocale === "en"
                                    ? "View Payment History"
                                    : "عرض تاريخ المدفوعات"}
                            </Link>
                        </div>

                        {/* Receipt Download */}
                        <div className="pt-4">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center px-6 py-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
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
                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                    />
                                </svg>
                                {currentLocale === "en"
                                    ? "Print Receipt"
                                    : "طباعة الإيصال"}
                            </button>
                        </div>
                    </motion.div>

                    {/* Success Celebration Animation */}
                    <motion.div
                        className="fixed inset-0 pointer-events-none z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 2 }}
                    >
                        {/* Confetti-like elements */}
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                    y: [0, -100, 0],
                                    x: [0, Math.random() * 100 - 50, 0],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    delay: Math.random() * 2,
                                    repeat: Infinity,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </>
    );
}
