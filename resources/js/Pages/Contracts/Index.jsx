import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import TopTools from "@/Components/TopTools";
import {
    FileText,
    Download,
    Eye,
    Plus,
    Calendar,
    User,
    Trash2,
    Filter,
    Search,
    Copy,
    BarChart3,
    Settings,
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    MoreVertical,
    Archive,
    Star,
} from "lucide-react";

export default function ContractIndex({ auth, contracts }) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showBulkActions, setShowBulkActions] = useState(false);

    const handleDownload = (contractId) => {
        window.location.href = route("contracts.download", contractId);
    };

    const handleDelete = (contractId) => {
        if (confirm("Are you sure you want to delete this contract?")) {
            router.delete(route("contracts.destroy", contractId));
        }
    };

    const handleDuplicate = (contractId) => {
        router.post(route("contracts.duplicate", contractId));
    };

    const handleStatusUpdate = (contractId, newStatus) => {
        router.patch(route("contracts.updateStatus", contractId), {
            status: newStatus,
        });
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            draft: {
                color: "bg-gradient-to-r from-yellow-500 to-orange-400 text-white",
                icon: Clock,
                label: "Draft",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                textColor: "text-yellow-700 dark:text-yellow-300",
            },
            completed: {
                color: "bg-gradient-to-r from-green-500 to-emerald-400 text-white",
                icon: CheckCircle,
                label: "Completed",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                textColor: "text-green-700 dark:text-green-300",
            },
            signed: {
                color: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
                icon: CheckCircle,
                label: "Signed",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
                textColor: "text-blue-700 dark:text-blue-300",
            },
            cancelled: {
                color: "bg-gradient-to-r from-red-500 to-pink-400 text-white",
                icon: XCircle,
                label: "Cancelled",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                textColor: "text-red-700 dark:text-red-300",
            },
        };
        return statusMap[status] || statusMap.draft;
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

    // Filter contracts based on search and filters
    const filteredContracts = contracts.data
        ? contracts.data.filter((contract) => {
              const matchesSearch =
                  contract.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                  getContractTypeLabel(contract.contract_type)
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
              const matchesStatus =
                  filterStatus === "all" || contract.status === filterStatus;
              const matchesType =
                  filterType === "all" || contract.contract_type === filterType;

              return matchesSearch && matchesStatus && matchesType;
          })
        : [];

    const handleBulkAction = (action) => {
        if (selectedContracts.length === 0) return;

        switch (action) {
            case "delete":
                if (
                    confirm(
                        `Delete ${selectedContracts.length} selected contracts?`
                    )
                ) {
                    router.post(route("contracts.bulk.delete"), {
                        contract_ids: selectedContracts,
                    });
                }
                break;
            case "export":
                router.post(route("contracts.bulk.export"), {
                    contract_ids: selectedContracts,
                });
                break;
        }
        setSelectedContracts([]);
        setShowBulkActions(false);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t("my_contracts", "My Contracts")} />

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
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
                            <div>
                                <motion.h1
                                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {t("my_contracts", "My Contracts")}
                                </motion.h1>
                                <motion.p
                                    className="text-gray-600 dark:text-gray-300 text-lg"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Manage and download your AI-generated
                                    contracts
                                </motion.p>
                            </div>

                            <div className="flex gap-3">
                                <Link href={route("contracts.analytics")}>
                                    <motion.button
                                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <BarChart3 className="w-5 h-5" />
                                        Analytics
                                    </motion.button>
                                </Link>

                                <Link href={route("contracts.create")}>
                                    <motion.button
                                        className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-xl shadow-indigo-500/30"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="relative flex items-center gap-2">
                                            <Plus className="w-5 h-5" />
                                            Create Contract
                                        </div>
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 mb-8"
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search contracts..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="draft">Draft</option>
                                    <option value="completed">Completed</option>
                                    <option value="signed">Signed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                <select
                                    value={filterType}
                                    onChange={(e) =>
                                        setFilterType(e.target.value)
                                    }
                                    className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="employment">
                                        Employment
                                    </option>
                                    <option value="service">Service</option>
                                    <option value="rental">Rental</option>
                                    <option value="nda">NDA</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bulk Actions Bar */}
                    <AnimatePresence>
                        {selectedContracts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-indigo-600 text-white rounded-xl p-4 mb-6 flex items-center justify-between"
                            >
                                <span>
                                    {selectedContracts.length} contracts
                                    selected
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleBulkAction("export")
                                        }
                                        className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                                    >
                                        Export
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleBulkAction("delete")
                                        }
                                        className="px-4 py-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Contracts Grid */}
                    {filteredContracts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredContracts.map((contract, index) => {
                                const statusInfo = getStatusInfo(
                                    contract.status
                                );
                                const StatusIcon = statusInfo.icon;

                                return (
                                    <motion.div
                                        key={contract.id}
                                        initial={{
                                            opacity: 0,
                                            y: 50,
                                            scale: 0.9,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{
                                            delay: index * 0.1,
                                            type: "spring",
                                        }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/30 overflow-hidden"
                                    >
                                        {/* Selection Checkbox */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <input
                                                type="checkbox"
                                                checked={selectedContracts.includes(
                                                    contract.id
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedContracts([
                                                            ...selectedContracts,
                                                            contract.id,
                                                        ]);
                                                    } else {
                                                        setSelectedContracts(
                                                            selectedContracts.filter(
                                                                (id) =>
                                                                    id !==
                                                                    contract.id
                                                            )
                                                        );
                                                    }
                                                }}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4">
                                            <motion.div
                                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} shadow-lg`}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <StatusIcon size={12} />
                                                {statusInfo.label}
                                            </motion.div>
                                        </div>

                                        <div className="p-6 pt-12">
                                            {/* Contract Title */}
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {contract.title}
                                            </h3>

                                            {/* Contract Type */}
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <Filter className="w-4 h-4" />
                                                {getContractTypeLabel(
                                                    contract.contract_type
                                                )}
                                            </div>

                                            {/* Created Date */}
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(
                                                    contract.created_at
                                                ).toLocaleDateString()}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route(
                                                        "contracts.show",
                                                        contract.id
                                                    )}
                                                    className="flex-1"
                                                >
                                                    <motion.button
                                                        className="w-full flex items-center justify-center gap-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </motion.button>
                                                </Link>

                                                {contract.file_path && (
                                                    <motion.button
                                                        onClick={() =>
                                                            handleDownload(
                                                                contract.id
                                                            )
                                                        }
                                                        className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </motion.button>
                                                )}

                                                <motion.button
                                                    onClick={() =>
                                                        handleDuplicate(
                                                            contract.id
                                                        )
                                                    }
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </motion.button>

                                                <motion.button
                                                    onClick={() =>
                                                        handleDelete(
                                                            contract.id
                                                        )
                                                    }
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-3xl flex items-center justify-center shadow-xl"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <FileText
                                    size={48}
                                    className="text-indigo-600 dark:text-indigo-400"
                                />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">
                                {searchTerm ||
                                filterStatus !== "all" ||
                                filterType !== "all"
                                    ? "No contracts match your filters"
                                    : "No contracts yet"}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
                                {searchTerm ||
                                filterStatus !== "all" ||
                                filterType !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Create your first AI-powered contract to get started"}
                            </p>
                            <Link href={route("contracts.create")}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-500/30"
                                >
                                    <Plus size={20} />
                                    Create Your First Contract
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {contracts.data &&
                        contracts.data.length > 0 &&
                        contracts.last_page > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="flex justify-center mt-12"
                            >
                                <div className="flex space-x-2">
                                    {contracts.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                                                link.active
                                                    ? "bg-indigo-600 text-white shadow-lg"
                                                    : link.url
                                                    ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
