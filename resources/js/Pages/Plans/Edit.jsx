import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    CheckCircleIcon,
    XMarkIcon,
    PlusIcon,
    TrashIcon,
    ArrowLeftIcon,
    SparklesIcon,
    BuildingOffice2Icon,
    ChartPieIcon,
    UserGroupIcon,
    MapPinIcon,
    UsersIcon,
    BanknotesIcon,
    ChartBarIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    BuildingOfficeIcon,
    ClockIcon,
    CloudArrowUpIcon,
    CalendarIcon,
    LightBulbIcon,
    AcademicCapIcon,
    FireIcon,
    StarIcon,
    BoltIcon,
} from "@heroicons/react/24/outline";

export default function EditPlan({
    auth,
    plan,
    onSave,
    onCancel,
    isLoading = false,
}) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    // Form state
    const [formData, setFormData] = useState({
        title: plan.title || "",
        project: {
            name: plan.project?.name || "",
            industry: plan.project?.industry?.industry_name || "",
            business_type:
                plan.project?.business_type?.business_type_name || "",
            location: plan.project?.location || "",
            team_size: plan.project?.team_size || "",
            revenue_model: Array.isArray(plan.project?.revenue_model)
                ? plan.project.revenue_model
                : (plan.project?.revenue_model || "")
                      .split(/[,;|]/)
                      .map((item) => item.trim())
                      .filter(Boolean),
            description: plan.project?.description || "",
            target_market: plan.project?.target_market || "",
            unique_selling_point: plan.project?.unique_selling_point || "",
            funding_requirements: plan.project?.funding_requirements || "",
            competition_analysis: plan.project?.competition_analysis || "",
        },
    });

    const [errors, setErrors] = useState({});
    const [isDirty, setIsDirty] = useState(false);

    // Track changes
    useEffect(() => {
        setIsDirty(true);
    }, [formData]);

    // Handle form field changes
    const handleFieldChange = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));

        // Clear error for this field
        if (errors[`${section}.${field}`]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[`${section}.${field}`];
                return newErrors;
            });
        }
    };

    // Handle revenue model changes
    const addRevenueModel = () => {
        setFormData((prev) => ({
            ...prev,
            project: {
                ...prev.project,
                revenue_model: [...prev.project.revenue_model, ""],
            },
        }));
    };

    const updateRevenueModel = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            project: {
                ...prev.project,
                revenue_model: prev.project.revenue_model.map((item, i) =>
                    i === index ? value : item
                ),
            },
        }));
    };

    const removeRevenueModel = (index) => {
        setFormData((prev) => ({
            ...prev,
            project: {
                ...prev.project,
                revenue_model: prev.project.revenue_model.filter(
                    (_, i) => i !== index
                ),
            },
        }));
    };

    // Validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors["title"] = "Plan title is required";
        }

        if (!formData.project.name.trim()) {
            newErrors["project.name"] = "Project name is required";
        }

        if (!formData.project.industry.trim()) {
            newErrors["project.industry"] = "Industry is required";
        }

        if (
            formData.project.revenue_model.length === 0 ||
            formData.project.revenue_model.every((model) => !model.trim())
        ) {
            newErrors["project.revenue_model"] =
                "At least one revenue model is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle save
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        const cleanedData = {
            ...formData,
            project: {
                ...formData.project,
                revenue_model: formData.project.revenue_model.filter((model) =>
                    model.trim()
                ),
            },
        };

        await onSave(cleanedData);
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
            if (e.key === "Escape") {
                onCancel();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [formData]);

    // Animation variants - SAME AS SHOW
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

    const industries = [
        "Technology",
        "Healthcare",
        "Finance",
        "Education",
        "Retail",
        "Manufacturing",
        "Real Estate",
        "Food & Beverage",
        "Transportation",
        "Entertainment",
        "Other",
    ];

    const businessTypes = [
        "Startup",
        "Small Business",
        "Corporation",
        "Non-Profit",
        "Freelance/Consulting",
        "E-commerce",
        "SaaS",
        "Mobile App",
        "Marketplace",
        "Other",
    ];

    return (
        <>
            {/* SAME ANIMATED BACKGROUND AS SHOW */}
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
                    {/* SAME HEADER STYLE AS SHOW */}
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
                                        onClick={onCancel}
                                        whileHover={{
                                            scale: 1.05,
                                            x: isRTL ? 5 : -5,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                                        title="Cancel Edit"
                                    >
                                        <ArrowLeftIcon
                                            size={24}
                                            className={
                                                isRTL ? "rotate-180" : ""
                                            }
                                        />
                                    </motion.button>
                                    <motion.span
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <SparklesIcon size={16} />
                                        Edit Mode
                                    </motion.span>
                                </div>
                                <motion.h1
                                    className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight"
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Edit Business Plan
                                </motion.h1>
                                <motion.p
                                    className="mt-3 text-gray-600 dark:text-gray-400 text-lg"
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Update your business plan details and
                                    sections
                                </motion.p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    onClick={onCancel}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className="group relative overflow-hidden bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.5,
                                        type: "spring",
                                    }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-3">
                                        <XMarkIcon className="h-5 w-5" />
                                        <span className="font-semibold">
                                            Cancel
                                        </span>
                                    </div>
                                </motion.button>
                                <motion.button
                                    onClick={handleSave}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 disabled:opacity-50"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.6,
                                        type: "spring",
                                    }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="relative flex items-center gap-3">
                                        {isLoading ? (
                                            <>
                                                <CloudArrowUpIcon className="h-5 w-5 animate-spin" />
                                                <span className="font-semibold">
                                                    Saving...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircleIcon className="h-5 w-5" />
                                                <span className="font-semibold">
                                                    Save Changes
                                                </span>
                                                <BoltIcon className="h-4 w-4 text-yellow-300" />
                                            </>
                                        )}
                                    </div>
                                </motion.button>
                            </div>
                        </div>

                        {/* Keyboard shortcuts hint - SAME STYLE */}
                        <motion.div
                            className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                        >
                            <span className="inline-flex items-center gap-4">
                                <span className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded text-xs border border-gray-200/50 dark:border-gray-700/50">
                                        Ctrl+S
                                    </kbd>
                                    <span>to save</span>
                                </span>
                                <span className="flex items-center gap-2">
                                    <kbd className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded text-xs border border-gray-200/50 dark:border-gray-700/50">
                                        Esc
                                    </kbd>
                                    <span>to cancel</span>
                                </span>
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* MAIN CONTENT GRID - SAME LAYOUT AS SHOW */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
                    >
                        {/* LEFT SIDE - MAIN EDIT FORM */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Plan Title Card */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <SparklesIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Plan Title
                                </h3>
                                <div>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        className={`w-full px-6 py-4 bg-gray-50/80 dark:bg-gray-700/50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg font-semibold ${
                                            errors.title
                                                ? "border-red-500"
                                                : "border-gray-200/50 dark:border-gray-600/50"
                                        }`}
                                        placeholder="Enter your business plan title..."
                                    />
                                    {errors.title && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50/80 dark:bg-red-900/30 px-4 py-2 rounded-xl border border-red-200/50 dark:border-red-700/50"
                                        >
                                            <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                            {errors.title}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Project Information Card */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 20,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <BuildingOffice2Icon className="h-8 w-8 text-white" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                                                Project Information
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Basic details about your
                                                business
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <AcademicCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                            Essential Info
                                        </span>
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Project Name */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Project Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.project.name}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                                errors["project.name"]
                                                    ? "border-red-500"
                                                    : "border-gray-200/50 dark:border-gray-600/50"
                                            }`}
                                            placeholder="Enter your project name..."
                                        />
                                        {errors["project.name"] && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors["project.name"]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Industry */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Industry
                                        </label>
                                        <select
                                            value={formData.project.industry}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "industry",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                                                errors["project.industry"]
                                                    ? "border-red-500"
                                                    : "border-gray-200/50 dark:border-gray-600/50"
                                            }`}
                                        >
                                            <option value="">
                                                Select Industry
                                            </option>
                                            {industries.map((industry) => (
                                                <option
                                                    key={industry}
                                                    value={industry}
                                                >
                                                    {industry}
                                                </option>
                                            ))}
                                        </select>
                                        {errors["project.industry"] && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors["project.industry"]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Business Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Business Type
                                        </label>
                                        <select
                                            value={
                                                formData.project.business_type
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "business_type",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                        >
                                            <option value="">
                                                Select Business Type
                                            </option>
                                            {businessTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.project.location}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "location",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter business location..."
                                        />
                                    </div>

                                    {/* Team Size */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Team Size
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.project.team_size}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "team_size",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Number of team members..."
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Revenue Models Card */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 15,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <BanknotesIcon className="h-8 w-8 text-white" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
                                                Revenue Models
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                How your business will make
                                                money
                                            </p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={addRevenueModel}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <PlusIcon className="h-5 w-5" />
                                        Add Model
                                    </motion.button>
                                </div>

                                <div className="space-y-4">
                                    {formData.project.revenue_model.map(
                                        (model, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-lg transition-all duration-300"
                                            >
                                                <div className="flex-shrink-0 p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-xl">
                                                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={model}
                                                    onChange={(e) =>
                                                        updateRevenueModel(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 px-4 py-3 bg-white/80 dark:bg-gray-800/50 border border-emerald-200/50 dark:border-emerald-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                                                    placeholder="Enter revenue model..."
                                                />
                                                {formData.project.revenue_model
                                                    .length > 1 && (
                                                    <motion.button
                                                        onClick={() =>
                                                            removeRevenueModel(
                                                                index
                                                            )
                                                        }
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </motion.button>
                                                )}
                                            </motion.div>
                                        )
                                    )}
                                    {errors["project.revenue_model"] && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2 bg-red-50/80 dark:bg-red-900/30 px-4 py-3 rounded-xl border border-red-200/50 dark:border-red-700/50"
                                        >
                                            <ClockIcon className="h-4 w-4 flex-shrink-0" />
                                            {errors["project.revenue_model"]}
                                        </motion.p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Detailed Information Card */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 lg:p-8 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 25,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <LightBulbIcon className="h-8 w-8 text-white" />
                                            </motion.div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                                                Business Details
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Detailed information about your
                                                business
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/50"
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <FireIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                            Optional
                                        </span>
                                    </motion.div>
                                </div>

                                <div className="space-y-6">
                                    {/* Project Description */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Project Description
                                        </label>
                                        <textarea
                                            value={formData.project.description}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="Describe your business idea, products, or services in detail..."
                                        />
                                    </div>

                                    {/* Target Market */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Target Market
                                        </label>
                                        <textarea
                                            value={
                                                formData.project.target_market
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "target_market",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="Who are your target customers? Demographics, needs, behaviors..."
                                        />
                                    </div>

                                    {/* Unique Selling Point */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Unique Selling Point
                                        </label>
                                        <textarea
                                            value={
                                                formData.project
                                                    .unique_selling_point
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "unique_selling_point",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="What makes your business unique? Competitive advantages..."
                                        />
                                    </div>

                                    {/* Funding Requirements */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Funding Requirements
                                        </label>
                                        <textarea
                                            value={
                                                formData.project
                                                    .funding_requirements
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "funding_requirements",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="How much funding do you need? What will it be used for?"
                                        />
                                    </div>

                                    {/* Competition Analysis */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Competition Analysis
                                        </label>
                                        <textarea
                                            value={
                                                formData.project
                                                    .competition_analysis
                                            }
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    "project",
                                                    "competition_analysis",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-50/80 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 resize-none"
                                            placeholder="Who are your main competitors? How do you differentiate?"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT SIDEBAR - SAME AS SHOW */}
                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            {/* Edit Status */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl">
                                        <StarIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Edit Status
                                </h3>
                                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-white/20 dark:border-gray-600/30">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 dark:bg-gray-800/50 rounded-lg">
                                            <SparklesIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                {isDirty
                                                    ? "Unsaved Changes"
                                                    : "No Changes"}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {isDirty
                                                    ? "Remember to save your work"
                                                    : "All changes saved"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Current Plan Info */}
                            <motion.div
                                variants={cardVariants}
                                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30 p-6 hover:shadow-2xl transition-shadow duration-300"
                            >
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                        <BuildingOffice2Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Current Plan Info
                                </h2>

                                <div className="space-y-4">
                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Original Plan Name
                                        </label>
                                        <div className="flex items-center gap-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                                            <div className="p-1.5 bg-gray-100 dark:bg-gray-600/50 rounded-lg">
                                                <BuildingOffice2Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                                                {plan.title}
                                            </span>
                                        </div>
                                    </motion.div>

                                    <motion.div variants={cardVariants}>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Plan Status
                                        </label>
                                        <div className="flex items-center gap-3 bg-blue-50/80 dark:bg-blue-900/30 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                                <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-blue-900 dark:text-blue-100 capitalize">
                                                {plan.status}
                                            </span>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

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
                                    Plan Timeline
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
                                                Created
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {new Date(
                                                plan.created_at
                                            ).toLocaleDateString()}
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
                                                Last Updated
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                            {new Date(
                                                plan.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Floating Save Button - ALWAYS VISIBLE */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-8 right-8 z-50"
                >
                    <motion.button
                        onClick={handleSave}
                        disabled={isLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform disabled:opacity-50 flex items-center gap-3"
                    >
                        {isLoading ? (
                            <>
                                <CloudArrowUpIcon className="h-6 w-6 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon className="h-6 w-6" />
                                Save Changes
                                <SparklesIcon className="h-5 w-5 text-yellow-300" />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Error Summary - SAME STYLE AS SHOW */}
                {Object.keys(errors).length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed top-8 right-8 z-50 bg-red-50/90 dark:bg-red-900/50 backdrop-blur-xl border border-red-200/50 dark:border-red-700/50 rounded-2xl p-6 shadow-2xl max-w-md"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <ClockIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                            <h4 className="font-bold text-red-800 dark:text-red-200 text-lg">
                                Please Fix Errors
                            </h4>
                        </div>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-2">
                            {Object.values(errors).map((error, index) => (
                                <li
                                    key={index}
                                    className="flex items-center gap-3 p-2 bg-red-100/50 dark:bg-red-800/30 rounded-lg"
                                >
                                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                                    <span>{error}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </div>
        </>
    );
}
