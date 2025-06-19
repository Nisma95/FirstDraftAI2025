// resources/js/Pages/MobileHome.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import StarBackground from "@/Components/StarBackground";

export default function MobileHome() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen relative">
            <StarBackground />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {t("welcome") || "Welcome to FirstDraft"}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-white/80">
                        {t("choose_action") ||
                            "Choose an action to get started xxxxxx"}
                    </p>
                </motion.div>

                <div className="font-arabic flex flex-col gap-6 justify-center w-full max-w-md">
                    <motion.div
                        onClick={() =>
                            window.open(route("projects.create"), "_blank")
                        }
                        className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 Fdbg text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white"
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold">
                            {t("create_project") || "Create Project"}
                        </h2>
                        <p className="text-sm mt-2">
                            {t("create_project_desc") ||
                                "Start a new business project"}
                        </p>
                    </motion.div>

                    <motion.div
                        onClick={() =>
                            window.open(route("plans.create"), "_blank")
                        }
                        className="p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 bg-gray-100 dark:bg-[#111214] text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white"
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <h2 className="text-xl font-semibold">
                            {t("create_plan") || "Create Plan"}
                        </h2>
                        <p className="text-sm mt-2">
                            {t("create_plan_desc") ||
                                "Generate AI business plan"}
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
