// FeatureItem.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const FeatureItem = ({ titleKey, descKey }) => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    return (
        <div className="vertical__item">
            <h3 className="fdGradientColorzTX text-2xl" dir="auto">
                {t(titleKey)}
            </h3>
            <p
                className="mt-4 text-lg text-gray-600 dark:text-white"
                dir="auto"
            >
                {t(descKey)}
            </p>
        </div>
    );
};

export default FeatureItem;
