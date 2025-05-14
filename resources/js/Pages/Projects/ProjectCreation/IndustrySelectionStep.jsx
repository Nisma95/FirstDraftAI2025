// Components/ProjectCreation/IndustrySelectionStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";

export default function IndustrySelectionStep({
    industries,
    selectedIndustryId,
    onIndustrySelect,
    onBack,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="industry"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <ProjectCreationHeader
                showBackButton={true}
                onBack={onBack}
                title={t("select_industry")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                {industries.map((industry) => (
                    <motion.div
                        key={industry.id}
                        onClick={() => onIndustrySelect(industry.id)}
                        className={`p-6 rounded-lg cursor-pointer text-center transition-all duration-300
                            ${
                                selectedIndustryId === industry.id
                                    ? "Fdbg text-white"
                                    : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                            }
                            hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            {industry.industry_name}
                        </h3>
                        {industry.industry_description && (
                            <p className="text-sm">
                                {industry.industry_description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
