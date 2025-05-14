import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function WelcomeSection() {
    const { t, i18n } = useTranslation();
    const user = usePage().props.auth.user;
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Format date for welcome message
    const formattedDate = new Intl.DateTimeFormat(i18n.language, {
        weekday: "long",
        month: "long",
        day: "numeric",
    }).format(currentTime);

    // Get greeting based on time of day
    const getGreeting = () => {
        const hours = currentTime.getHours();
        if (hours < 12) return t("WelcomeSection.good_morning");
        if (hours < 18) return t("WelcomeSection.good_afternoon");
        return t("WelcomeSection.good_evening");
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.15,
            },
        },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            className="pt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            <div
                className={`flex flex-col ${
                    i18n.language === "ar" ? "items-end" : "items-start"
                }`}
            >
                {/* Greeting - now with italic style */}
                <motion.p
                    variants={textVariants}
                    className="text-xl md:text-3xl text-blue-300 dark:text-blue-200 font-medium mb-1 italic"
                >
                    {getGreeting()}
                </motion.p>

                {/* Name - kept original styling */}
                <motion.h1
                    variants={textVariants}
                    className="fdGradientColorzTX !text-[10rem] font-bold mb-2"
                >
                    {user.name.split(" ")[0]}
                </motion.h1>

                {/* Date - now with italic style */}
                <motion.div
                    variants={textVariants}
                    className="flex items-center mt-2"
                >
                    <span className="text-lg md:text-xl text-gray-600 dark:text-gray-300 italic">
                        {formattedDate} • {t("WelcomeSection.welcome_back")}
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
}
