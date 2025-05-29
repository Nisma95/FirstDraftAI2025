import React from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    FileText,
    Download,
    ArrowLeft,
    ChevronLeft,
    Calendar,
    User,
    FileCheck,
    Sparkles,
} from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";

export default function ShowContract({ auth, contract }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const handleDownload = () => {
        window.location.href = route("contracts.download", contract.id);
    };

    const getStatusColor = (status) => {
        const colors = {
            draft: "bg-gradient-to-r from-yellow-500 to-orange-400 text-white",
            completed:
                "bg-gradient-to-r from-green-500 to-emerald-400 text-white",
            signed: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
        };
        return (
            colors[status] ||
            "bg-gradient-to-r from-gray-500 to-gray-400 text-white"
        );
    };

    const getContractTypeLabel = (type) => {
        const types = {
            employment: "Employment Contract",
            service: "Service Agreement",
            rental: "Rental Agreement",
            nda: "Non-Disclosure Agreement",
            freelance: "Freelance Contract",
            partnership: "Partnership Agreement",
            sale: "Sale Agreement",
            consulting: "Consulting Agreement",
        };
        return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={contract.title} />

            {/* Top Tools */}
            <div className="mb-8">
                <TopTools />
            </div>

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
            </div>

            <div className="min-h-screen py-8 px-4 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <Link
                                href={route("contracts.index")}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <motion.div
                                    whileHover={{ x: isRTL ? 5 : -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2"
                                >
                                    {isRTL ? (
                                        <ChevronLeft size={20} />
                                    ) : (
                                        <ArrowLeft size={20} />
                                    )}
                                    <span className="font-medium">
                                        {t(
                                            "back_to_contracts",
                                            "Back to Contracts"
                                        )}
                                    </span>
                                </motion.div>
                            </Link>
                        </div>

                        <div className="text-center">
                            <motion.div
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-xl"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    duration: 0.8,
                                    delay: 0.2,
                                }}
                            >
                                <FileCheck className="w-8 h-8 text-white" />
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {contract.title}
                            </motion.h1>

                            <motion.p
                                className="text-gray-600 dark:text-gray-400 text-lg font-medium"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                {getContractTypeLabel(contract.contract_type)}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Contract Details Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 overflow-hidden mb-6"
                    >
                        <div className="p-8">
                            {/* Status and Info */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                <motion.div
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold ${getStatusColor(
                                        contract.status
                                    )} shadow-lg`}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Sparkles size={14} />
                                    {contract.status.charAt(0).toUpperCase() +
                                        contract.status.slice(1)}
                                </motion.div>

                                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(
                                                contract.created_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {contract.user && (
                                        <div className="flex items-center gap-2">
                                            <User size={16} />
                                            <span>{contract.user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contract Details */}
                            {contract.contract_data && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                        {t(
                                            "contract_details",
                                            "Contract Details"
                                        )}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl">
                                        {Object.entries(
                                            contract.contract_data
                                        ).map(([key, value]) => (
                                            <motion.div
                                                key={key}
                                                className="space-y-1"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                <dt className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {key
                                                        .replace(/_/g, " ")
                                                        .replace(/\b\w/g, (l) =>
                                                            l.toUpperCase()
                                                        )}
                                                    :
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-white">
                                                    {Array.isArray(value)
                                                        ? value.join(", ")
                                                        : value}
                                                </dd>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contract Content Preview */}
                            {contract.content && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        {t(
                                            "contract_content",
                                            "Contract Content"
                                        )}
                                    </h3>
                                    <div
                                        className="contract-content-scroll p-6 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl"
                                        onWheel={(e) => {
                                            e.stopPropagation();
                                            const element = e.currentTarget;
                                            element.scrollTop += e.deltaY;
                                        }}
                                    >
                                        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed select-text">
                                            {contract.content}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 justify-center">
                                {contract.file_path && (
                                    <motion.button
                                        onClick={handleDownload}
                                        className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-indigo-500/30"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-3">
                                            <Download className="w-5 h-5" />
                                            <span>
                                                {t(
                                                    "download_pdf",
                                                    "Download PDF"
                                                )}
                                            </span>
                                        </div>
                                    </motion.button>
                                )}

                                <motion.button
                                    onClick={() => {
                                        fetch(
                                            route(
                                                "contracts.regenerate",
                                                contract.id
                                            ),
                                            {
                                                method: "POST",
                                                headers: {
                                                    "X-CSRF-TOKEN": document
                                                        .querySelector(
                                                            'meta[name="csrf-token"]'
                                                        )
                                                        .getAttribute(
                                                            "content"
                                                        ),
                                                    "Content-Type":
                                                        "application/json",
                                                },
                                            }
                                        )
                                            .then((response) => response.json())
                                            .then((data) => {
                                                if (data.success) {
                                                    alert(
                                                        "PDF regenerated! You can now download it."
                                                    );
                                                    window.location.reload();
                                                }
                                            });
                                    }}
                                    className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-green-500/30"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="relative flex items-center gap-3">
                                        <Sparkles className="w-5 h-5" />
                                        <span>Regenerate PDF</span>
                                    </div>
                                </motion.button>

                                <Link
                                    href={route("contracts.create")}
                                    className="group relative overflow-hidden bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl border border-gray-200 dark:border-gray-600"
                                >
                                    <motion.div
                                        className="relative flex items-center gap-3"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        <span>
                                            {t(
                                                "create_new_contract",
                                                "Create New Contract"
                                            )}
                                        </span>
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
