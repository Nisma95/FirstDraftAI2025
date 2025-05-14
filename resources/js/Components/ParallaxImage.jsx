import React, { useEffect, useRef } from "react";
// Note: You'll need to install these GSAP dependencies in your project:
// npm install gsap

const ParallaxImage = ({
    src,
    alt,
    height = "100vh",
    width = "100%",
    containerStyle = {},
    className = "", // Add className prop to handle additional classes
}) => {
    const containerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        // Make sure GSAP and ScrollTrigger are available in your project
        if (typeof window !== "undefined") {
            // Dynamically import GSAP to avoid SSR issues
            const importGSAP = async () => {
                const gsap = (await import("gsap")).default;
                const ScrollTrigger = (await import("gsap/ScrollTrigger"))
                    .default;

                gsap.registerPlugin(ScrollTrigger);

                // Simple parallax effect for the image
                if (containerRef.current && imageRef.current) {
                    ScrollTrigger.create({
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        onUpdate: (self) => {
                            // Calculate parallax movement (moving slower than scroll)
                            const yPos = -self.progress * 50; // 30% movement rate
                            gsap.set(imageRef.current, { y: yPos + "%" });
                        },
                        scrub: true,
                    });
                }
            };

            importGSAP();
        }

        return () => {
            // Clean up any ScrollTrigger instances to prevent memory leaks
            if (typeof window !== "undefined") {
                if (window.ScrollTrigger) {
                    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
                }
            }
        };
    }, []);

    const containerStyles = {
        position: "relative",
        height: height,
        overflow: "hidden",
        borderRadius: "0.5rem", // Apply rounded corners to container
        ...containerStyle,
    };

    const imageStyles = {
        position: "absolute",
        bottom: 0,
        width: width,
        height: "140%", // Larger than container for parallax movement
        objectFit: "cover",
        borderRadius: "0.5rem", // Apply rounded corners to image
    };

    return (
        <div ref={containerRef} style={containerStyles} className={className}>
            <img
                ref={imageRef}
                src={src}
                alt={alt || ""}
                style={imageStyles}
                className="rounded-lg" // Add Tailwind class for rounded corners
            />
        </div>
    );
};

export default ParallaxImage;
