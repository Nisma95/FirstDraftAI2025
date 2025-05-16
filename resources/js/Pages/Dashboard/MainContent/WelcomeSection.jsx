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

    // Get sophisticated time-based visual element
    const getTimeElement = () => {
        const hours = currentTime.getHours();

        if (hours < 6) {
            // Night - Elegant moon with glow
            return (
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-md animate-pulse"></div>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/60 rounded-full animate-ping"></div>
                        <div
                            className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping"
                            style={{ animationDelay: "0.5s" }}
                        ></div>
                    </div>
                </div>
            );
        } else if (hours < 12) {
            // Morning - Fresh sunrise with beautiful colors
            return (
                <div className="relative">
                    <div className="absolute inset-0 bg-rose-300/30 rounded-full blur-md animate-pulse"></div>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-rose-400 via-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="M4.93 4.93l1.41 1.41" />
                            <path d="M17.66 17.66l1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="M6.34 17.66l-1.41 1.41" />
                            <path d="M19.07 4.93l-1.41 1.41" />
                        </svg>
                        <div
                            className="absolute inset-0 bg-rose-200/25 rounded-full animate-ping"
                            style={{ animationDuration: "3s" }}
                        ></div>
                        <div
                            className="absolute inset-0 bg-orange-200/15 rounded-full animate-ping"
                            style={{
                                animationDuration: "2s",
                                animationDelay: "0.5s",
                            }}
                        ></div>
                    </div>
                </div>
            );
        } else if (hours < 18) {
            // Afternoon - Brilliant sun
            return (
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md animate-pulse"></div>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                        <div
                            className="absolute inset-0 bg-yellow-200/20 rounded-full animate-ping"
                            style={{ animationDuration: "2s" }}
                        ></div>
                        <div
                            className="absolute inset-0 bg-orange-200/20 rounded-full animate-ping"
                            style={{
                                animationDuration: "2.5s",
                                animationDelay: "0.3s",
                            }}
                        ></div>
                    </div>
                </div>
            );
        } else {
            // Evening - Magical twilight
            return (
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-md animate-pulse"></div>
                    <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path d="m12 3-1.912 5.813a2 2 0 01-1.275 1.275L3 12l5.813 1.912a2 2 0 011.275 1.275L12 21l1.912-5.813a2 2 0 011.275-1.275L21 12l-5.813-1.912a2 2 0 01-1.275-1.275L12 3z" />
                        </svg>
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-pink-300/60 rounded-full animate-ping"></div>
                        <div
                            className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-purple-300/60 rounded-full animate-ping"
                            style={{ animationDelay: "0.7s" }}
                        ></div>
                        <div
                            className="absolute top-1 left-1 w-1 h-1 bg-white/80 rounded-full animate-ping"
                            style={{ animationDelay: "1s" }}
                        ></div>
                    </div>
                </div>
            );
        }
    };

    // Enhanced animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const greetingVariants = {
        hidden: { opacity: 0, y: -30, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                bounce: 0.3,
            },
        },
    };

    const nameVariants = {
        hidden: { opacity: 0, x: i18n.language === "ar" ? 50 : -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                bounce: 0.25,
            },
        },
    };

    const dateVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                delay: 0.3,
            },
        },
    };

    const sparkleVariants = {
        hidden: { scale: 0, rotate: 0 },
        visible: {
            scale: 1,
            rotate: 360,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.5,
            },
        },
    };

    const waveVariants = {
        wave: {
            rotate: [0, 14, -8, 14, -4, 10, 0],
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 3,
            },
        },
    };

    return (
        <motion.div
            className="relative pt-8 pb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
            {/* Welcome card container - now transparent to blend with dashboard */}
            <div className="relative bg-white/40 dark:bg-gray-900/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/20 shadow-xl shadow-blue-500/5 dark:shadow-purple-500/10 p-8 md:p-12">
                <div
                    className={`flex flex-col ${
                        i18n.language === "ar" ? "items-end" : "items-start"
                    }`}
                >
                    {/* Greeting with time element and sparkle */}
                    <motion.div
                        variants={greetingVariants}
                        className="flex items-center gap-3 mb-3"
                    >
                        <motion.div variants={waveVariants} animate="wave">
                            {getTimeElement()}
                        </motion.div>
                        <motion.p
                            className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            {getGreeting()}
                        </motion.p>
                        <motion.span
                            variants={sparkleVariants}
                            className="text-2xl"
                        >
                            ✨
                        </motion.span>
                    </motion.div>

                    {/* Name with enhanced styling */}
                    <motion.div
                        variants={nameVariants}
                        className="relative mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", bounce: 0.3 }}
                    >
                        <motion.h1
                            className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 dark:from-indigo-400 dark:via-blue-400 dark:to-purple-500 bg-clip-text text-transparent tracking-tight"
                            style={{
                                WebkitTextStroke: "2px rgba(99, 102, 241, 0.1)",
                                textShadow:
                                    "0 4px 20px rgba(99, 102, 241, 0.2)",
                            }}
                        >
                            {user.name.split(" ")[0]}
                        </motion.h1>

                        {/* Decorative underline */}
                        <motion.div
                            className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 1,
                                delay: 0.8,
                                ease: "easeOut",
                            }}
                        />
                    </motion.div>

                    {/* Date with enhanced styling */}
                    <motion.div
                        variants={dateVariants}
                        className="flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-white/40 dark:border-gray-700/30"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                    >
                        <svg
                            className="w-5 h-5 md:w-6 md:h-6 text-blue-500 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <span className="text-lg md:text-xl font-medium text-gray-700 dark:text-gray-200">
                            {formattedDate}
                        </span>
                        <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
                            •
                        </span>
                        <span className="text-lg md:text-xl font-medium bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                            {t("WelcomeSection.welcome_back")}
                        </span>
                        <motion.span
                            className="text-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🎉
                        </motion.span>
                    </motion.div>
                </div>

                {/* Subtle floating particles - reduced for better dashboard integration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-blue-400/20 dark:bg-purple-400/20 rounded-full"
                            style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`,
                            }}
                            animate={{
                                y: [0, -80],
                                opacity: [0, 0.7, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
