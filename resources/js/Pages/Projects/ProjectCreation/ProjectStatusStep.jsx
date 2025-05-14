// Components/ProjectCreation/ProjectStatusStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";

export default function ProjectStatusStep({ 
    projectStatus, 
    onStatusSelect 
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <ProjectCreationHeader
                showBackButton={false}
                title={t("project_type")}
            />

            <div className="font-arabic flex flex-col sm:flex-row gap-6 justify-center w-full">
                {/* New Project Card */}
                <motion.div
                    onClick={() => onStatusSelect(false)}
                    className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300 
                        ${
                            projectStatus === false
                                ? "Fdbg text-white"
                                : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                        }
                        hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
                    whileTap={{ scale: 0.95 }}
                >
                    <h2 className="text-xl font-semibold">
                        {t("new_business")}
                    </h2>
                    <p className="text-sm mt-2">
                        {t("new_business_desc")}
                    </p>
                </motion.div>

                {/* Existing Project Card */}
                <motion.div
                    onClick={() => onStatusSelect(true)}
                    className={`p-10 rounded-lg cursor-pointer w-full text-center transition-all duration-300
                        ${
                            projectStatus === true
                                ? "Fdbg text-white"
                                : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                        }
                        hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
                    whileTap={{ scale: 0.95 }}
                >
                    <h2 className="text-xl font-semibold">
                        {t("existing_business")}
                    </h2>
                    <p className="text-sm mt-2">
                        {t("existing_business_desc")}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}