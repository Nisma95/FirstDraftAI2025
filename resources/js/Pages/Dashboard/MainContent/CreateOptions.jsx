import React from "react";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

export default function CreateOptions() {
    const { t } = useTranslation();

    return (
        <div className="font-arabic flex flex-col sm:flex-row gap-6 justify-center w-full">
            {/* New Project Card */}
            <motion.div
                className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 
        bg-gray-100 dark:bg-dark-card dark:text-gray-200
        hover:bg-Fdbg-hover hover:text-white`}
                whileTap={{ scale: 0.95 }}
            >
                <Link
                    href={route("projects.create")}
                    className="block h-full group"
                >
                    <div className="group-hover:Fdbg rounded-lg p-4 transition-all duration-300">
                        <h2 className="text-xl font-semibold">
                            {t("new_project")}
                        </h2>
                        <p className="text-sm mt-2">{t("new_project_desc")}</p>
                        <div className="mt-4">
                            <span className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
                                {t("project")}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* Create Plan Card */}
            <motion.div
                className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 
        bg-gray-100 dark:bg-dark-card dark:text-gray-200
        hover:bg-Fdbg-hover hover:text-white`}
                whileTap={{ scale: 0.95 }}
            >
                <Link
                    href={route("plans.create")}
                    className="block h-full group"
                >
                    <div className="group-hover:Fdbg rounded-lg p-4 transition-all duration-300">
                        <h2 className="text-xl font-semibold">
                            {t("create_plan")}
                        </h2>
                        <p className="text-sm mt-2">{t("create_plan_desc")}</p>
                        <div className="mt-4">
                            <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-full">
                                {t("business_plan")}
                            </span>
                        </div>
                    </div>
                </Link>
            </motion.div>
        </div>
    );
}
