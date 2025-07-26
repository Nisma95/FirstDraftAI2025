// resources/js/Pages/WelcomeComponents/Pricing.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { Check } from "lucide-react";

const Pricing = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";
    const [yearlyBilling, setYearlyBilling] = useState(false);
    const pricingRef = useRef(null);

    useEffect(() => {
        // Animate the pricing cards when they come into view
        const cards = gsap.utils.toArray(".pricing-card");

        gsap.fromTo(
            cards,
            {
                y: 30,
                opacity: 0,
                stagger: 0.15,
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                scrollTrigger: {
                    trigger: pricingRef.current,
                    start: "top 70%",
                },
            }
        );
    }, []);

    // Pricing data
    const plans = [
        {
            id: "basic",
            name: "pricing_basic",
            description: "pricing_basic_desc",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: [
                "pricing_feature_1",
                "pricing_feature_2",
                "pricing_feature_3",
            ],
            recommended: false,
            buttonText: "pricing_start_free",
        },
        {
            id: "pro",
            name: "pricing_pro",
            description: "pricing_pro_desc",
            monthlyPrice: 29,
            yearlyPrice: 290,
            features: [
                "pricing_feature_1",
                "pricing_feature_2",
                "pricing_feature_3",
                "pricing_feature_4",
                "pricing_feature_5",
            ],
            recommended: true,
            buttonText: "pricing_get_started",
        },
        {
            id: "business",
            name: "pricing_business",
            description: "pricing_business_desc",
            monthlyPrice: 79,
            yearlyPrice: 790,
            features: [
                "pricing_feature_1",
                "pricing_feature_2",
                "pricing_feature_3",
                "pricing_feature_4",
                "pricing_feature_5",
                "pricing_feature_6",
                "pricing_feature_7",
            ],
            recommended: false,
            buttonText: "pricing_contact_us",
        },
    ];

    return (
        <section ref={pricingRef} className="py-16" id="pricing">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="fdGradientColorzTX mb-4">
                        {t("pricing_title")}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t("pricing_subtitle")}
                    </p>

                    {/* Billing toggle */}
                    <div className="flex items-center justify-center mt-8">
                        <span
                            className={`text-sm text-gray-500 ${
                                !yearlyBilling ? "font-bold" : ""
                            }`}
                        >
                            {t("pricing_monthly")}
                        </span>
                        <button
                            className="mx-4 relative inline-flex h-6 w-12 items-center rounded-full bg-gray-200"
                            onClick={() => setYearlyBilling(!yearlyBilling)}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                    yearlyBilling
                                        ? "translate-x-7"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                        <span
                            className={`text-sm text-gray-500 ${
                                yearlyBilling ? "font-bold" : ""
                            }`}
                        >
                            {t("pricing_yearly")}
                        </span>
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                            {t("pricing_save")}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`pricing-card fdDiveCard p-8 rounded-xl relative ${
                                plan.recommended
                                    ? "border-2 border-indigo-500 dark:border-indigo-400"
                                    : ""
                            }`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 text-sm font-semibold bg-indigo-500 text-white rounded-full">
                                    {t("pricing_recommended")}
                                </div>
                            )}

                            <h3 className="text-xl font-bold mb-2">
                                {t(plan.name)}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                {t(plan.description)}
                            </p>

                            <div className="mb-8">
                                <span className="text-4xl font-bold">
                                    $
                                    {yearlyBilling
                                        ? plan.yearlyPrice
                                        : plan.monthlyPrice}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-2">
                                    {yearlyBilling
                                        ? t("pricing_per_year")
                                        : t("pricing_per_month")}
                                </span>
                            </div>

                            <ul className="mb-8 space-y-4">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <Check
                                            className="h-5 w-5 fdColor mr-2"
                                            aria-hidden="true"
                                        />
                                        <span>{t(feature)}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 px-4 rounded-lg transition-colors ${
                                    plan.recommended
                                        ? "fdButton hover:bg-indigo-700"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            >
                                {t(plan.buttonText)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
