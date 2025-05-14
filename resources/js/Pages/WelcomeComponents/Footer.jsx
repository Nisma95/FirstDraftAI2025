import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-white py-8 dark:bg-gray-800">
            <div className="container mx-auto text-center text-gray-600 dark:text-gray-300">
                &copy; {new Date().getFullYear()} {t("footer_text")}
            </div>
        </footer>
    );
};

export default Footer;
