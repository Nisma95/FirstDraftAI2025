import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const FormField = ({
    field,
    value,
    onChange,
    onKeyPress,
    error,
    showHelp = false,
}) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const inputClasses = `${
        field.type === "textarea" ? "h-[8rem]" : "h-[4rem]"
    } w-full ${
        isRTL ? "pr-4 pl-4" : "pl-4 pr-4"
    } py-2 rounded-lg focus:outline-none focus:border-0 focus:ring-2 focus:ring-[#7a7a7a] bg-white dark:bg-transparent text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 autofill:bg-transparent dark:autofill:bg-transparent ${
        isRTL ? "text-right" : "text-left"
    }`;

    return (
        <motion.div
            key={`${field.key}-${value}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full"
        >
            {field.type === "textarea" ? (
                <textarea
                    name={field.key}
                    value={value || ""}
                    onChange={onChange}
                    onKeyDown={onKeyPress}
                    className={inputClasses}
                    placeholder={field.placeholder}
                    dir={isRTL ? "rtl" : "ltr"}
                    autoFocus
                />
            ) : (
                <input
                    type="text"
                    name={field.key}
                    value={value || ""}
                    onChange={onChange}
                    onKeyDown={onKeyPress}
                    className={inputClasses}
                    placeholder={field.placeholder}
                    dir={isRTL ? "rtl" : "ltr"}
                    autoFocus
                />
            )}

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            {/* Help text for summary field */}
            {showHelp && field.key === "summary" && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t("summary_help")}
                </p>
            )}
        </motion.div>
    );
};

export default FormField;
