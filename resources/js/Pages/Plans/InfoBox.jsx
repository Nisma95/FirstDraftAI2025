import React from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

const InfoBox = ({ currentField }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    if (currentField !== "summary") return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
            <div className="flex">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div className={`${isRTL ? "mr-3" : "ml-3"}`}>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400">
                        {t("what_to_expect")}
                    </h4>
                    <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• {t("expect_1")}</li>
                        <li>• {t("expect_2")}</li>
                        <li>• {t("expect_3")}</li>
                        <li>• {t("expect_4")}</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default InfoBox;
