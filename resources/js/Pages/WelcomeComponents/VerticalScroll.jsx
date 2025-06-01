// VerticalScroll.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FeatureItem from "./FeatureItem";

gsap.registerPlugin(ScrollTrigger);

const VerticalScroll = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    useEffect(() => {
        // Vertical scroll animation
        const section_1 = document.getElementById("vertical");
        const col_left = document.querySelector(".col_left");
        const timeln = gsap.timeline({ paused: true });

        requestAnimationFrame(() => {
            timeln.fromTo(
                col_left,
                { y: 0 },
                { y: "150vh", duration: 1, ease: "none" },
                0
            );
        });

        ScrollTrigger.create({
            animation: timeln,
            trigger: section_1,
            start: "top top",
            end: "bottom center",
            scrub: true,
        });

        return () => {
            // Clean up ScrollTrigger for this section
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.vars.trigger === section_1) {
                    trigger.kill();
                }
            });
        };
    }, []);

    // Feature data with title key and description key
    const features = [
        { titleKey: "FT01", descKey: "FD01" },
        { titleKey: "FT02", descKey: "FD02" },
        { titleKey: "FT03", descKey: "FD03" },
        { titleKey: "FT04", descKey: "FD04" },
    ];

    return (
        <section id="vertical">
            <div className="container">
                <div className="vertical__content">
                    <div className="col col_left">
                        <h2
                            className="fdGradientColorzTX border-l-5 border-[#5a56e9] text-6xl lg:text-7xl font-bold p-4"
                            style={{
                                direction: "ltr",
                                textAlign: "left",
                                paddingLeft: "3rem",
                            }}
                        >
                            {t("about_title")}
                        </h2>
                    </div>
                    <div
                        className="col col_right"
                        style={{ paddingRight: "3rem" }}
                    >
                        {features.map((feature, index) => (
                            <FeatureItem
                                key={index}
                                titleKey={feature.titleKey}
                                descKey={feature.descKey}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerticalScroll;
