// resources/js/Pages/WelcomeComponents/Statistics.jsx
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Building, BarChart, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Statistics = () => {
    const { t } = useTranslation();
    const statsRef = useRef(null);
    const counterRefs = useRef([]);

    // Initialize counter refs array
    counterRefs.current = [];
    const addToCounterRefs = (el) => {
        if (el && !counterRefs.current.includes(el)) {
            counterRefs.current.push(el);
        }
    };

    // Stats data
    const statsData = [
        {
            icon: <Users className="h-12 w-12 text-indigo-500" />,
            value: 2500,
            label: "stats_users",
            suffix: "+",
        },
        {
            icon: <Building className="h-12 w-12 text-indigo-500" />,
            value: 150,
            label: "stats_businesses",
            suffix: "+",
        },
        {
            icon: <BarChart className="h-12 w-12 text-indigo-500" />,
            value: 10000,
            label: "stats_plans",
            suffix: "+",
        },
        {
            icon: <TrendingUp className="h-12 w-12 text-indigo-500" />,
            value: 89,
            label: "stats_success",
            suffix: "%",
        },
    ];

    useEffect(() => {
        // Animate count up when stats section comes into view
        counterRefs.current.forEach((counter, index) => {
            const statValue = statsData[index].value;
            const countObj = { count: 0 };

            // Create a GSAP animation that increments the count
            const countAnimation = gsap.to(countObj, {
                count: statValue,
                duration: 2,
                ease: "power1.inOut",
                onUpdate: function () {
                    if (counter) {
                        // Format number with commas for thousands
                        counter.innerHTML =
                            Math.floor(countObj.count).toLocaleString() +
                            statsData[index].suffix;
                    }
                },
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            });

            return () => {
                if (countAnimation) {
                    countAnimation.kill();
                }
            };
        });

        // Clean up
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [statsData]);

    return (
        <section
            ref={statsRef}
            className="py-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-indigo-900/30"
        >
            <div className="container mx-auto px-4">
                <h2 className="fdGradientColorzTX text-center mb-12">
                    {t("stats_title")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="fdDiveCard rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex justify-center mb-4">
                                {stat.icon}
                            </div>
                            <div
                                ref={addToCounterRefs}
                                className="text-4xl font-bold mb-2 text-indigo-600 dark:text-indigo-400"
                            >
                                0{stat.suffix}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {t(stat.label)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
