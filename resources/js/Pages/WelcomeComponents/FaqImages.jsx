import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const FaqImages = () => {
    const imageContainerRef = useRef(null);

    useEffect(() => {
        const container = imageContainerRef.current;

        const handleMouseMove = (e) => {
            const { left, top, width, height } =
                container.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateY = (x / width - 0.5) * 40; // rotate between -20 and +20 degrees
            const rotateX = (y / height - 0.5) * -40;

            gsap.to(container, {
                rotationY,
                rotationX,
                ease: "power2.out",
                duration: 0.4,
                transformPerspective: 1000,
                transformOrigin: "center",
            });
        };

        const resetRotation = () => {
            gsap.to(container, {
                rotationX: 0,
                rotationY: 0,
                ease: "power3.out",
                duration: 0.6,
            });
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", resetRotation);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", resetRotation);
        };
    }, []);

    return (
        <div className="flex items-center justify-center w-full">
            <div
                ref={imageContainerRef}
                className="relative w-full max-w-md aspect-square rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                    transition: "transform 0.2s ease",
                }}
            >
                <img
                    src="/images/3dLogoImg.png"
                    alt="Interactive Earth"
                    className="w-full h-full object-contain pointer-events-none"
                    style={{ opacity: 0.97 }}
                />
                {/* Optional glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl" />
            </div>
        </div>
    );
};

export default FaqImages;
