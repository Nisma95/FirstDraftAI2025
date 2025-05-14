import React, { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import gsap from "gsap";
import Lenis from "@studio-freight/lenis";
import { useTranslation } from "react-i18next";

const Commitment = () => {
    const { t } = useTranslation();

    const buttonRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        gsap.from(buttonRef.current, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: "power3.out",
            delay: 0.5,
        });
    }, []);

    return (
        <section className="w-full h-screen flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 p-4">
                {/* Image Container */}
                <div className="relative rounded-lg overflow-hidden">
                    <img
                        src="Images/publicContain.webp"
                        alt="Feature"
                        className="w-full h-full object-cover"
                    />
                    {/* Black Circular Button */}
                    <button className="fdIcon absolute top-2 left-2 w-12 h-12 text-white flex items-center justify-center rounded-full shadow-md">
                        <Plus size={16} />
                    </button>
                </div>

                {/* Text Content */}
                <div className="p-3">
                    <span className="text-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 64 64"
                        >
                            <path
                                fill="#4f46e5"
                                d="m62 32l-24.166-2.417l15.379-18.797l-18.797 15.38L32 2l-2.417 24.166l-18.797-15.38l15.38 18.797L2 32l24.166 2.416l-15.38 18.797l18.797-15.379L32 62l2.416-24.166l18.797 15.379l-15.379-18.797z"
                            />
                        </svg>
                    </span>
                    <p className="mt-4 text-lg text-gray-600 dark:text-white font-bold">
                        Our commitment to quality and detail drives us to craft
                        your dream solutions, helping you navigate
                        entrepreneurship with AI-driven insights and essential
                        tools tailored for your success.
                    </p>
                    {/* New Button */}
                    <div className="mt-6" ref={buttonRef}>
                        <a
                            href="/plan"
                            className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded mt-10 shadow-lg flex items-center space-x-2 rtl:space-x-reverse"
                        >
                            <span>{t("get_started")}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="fdColor w-6 h-6 transform transition-transform duration-300 rtl:rotate-180 hover:translate-x-1 rtl:hover:-translate-x-1"
                            >
                                <path
                                    fill="currentColor"
                                    d="M15.187 12L7.47 4.285q-.221-.221-.218-.532q.003-.31.224-.532Q7.698 3 8.009 3q.31 0 .532.221l7.636 7.643q.242.242.354.54t.111.596t-.111.596t-.354.54L8.535 20.78q-.222.221-.53.218q-.307-.003-.528-.224t-.221-.532t.221-.531z"
                                ></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Commitment;
