// Components/ProjectCreation/BusinessTypeSelectionStep.jsx
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ProjectCreationHeader from "./ProjectCreationHeader";

export default function BusinessTypeSelectionStep({
    businessTypes,
    selectedBusinessTypeId,
    onBusinessTypeSelect,
    onBack,
}) {
    const { t } = useTranslation();

    return (
        <motion.div
            key="businessType"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <ProjectCreationHeader
                showBackButton={true}
                onBack={onBack}
                title={t("select_business_type")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                {businessTypes.map((businessType) => (
                    <motion.div
                        key={businessType.id}
                        onClick={() => onBusinessTypeSelect(businessType.id)}
                        className={`p-6 rounded-lg cursor-pointer text-center transition-all duration-300
                            ${
                                selectedBusinessTypeId === businessType.id
                                    ? "Fdbg text-white"
                                    : "bg-gray-100 dark:bg-[#111214] dark:text-gray-200"
                            }
                            hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white `}
                        whileTap={{ scale: 0.95 }}
                    >
                        <h3 className="text-lg font-semibold mb-2">
                            {businessType.business_type_name}
                        </h3>
                        {businessType.business_type_description && (
                            <p className="text-sm">
                                {businessType.business_type_description}
                            </p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
