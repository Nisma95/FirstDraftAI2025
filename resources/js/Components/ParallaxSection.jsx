import React, { useEffect, useRef } from "react";
// Note: You'll need to install these GSAP dependencies in your project:
// npm install gsap

const ParallaxSection = ({ title, description, image1, image2 }) => {
    const image1Ref = useRef(null);
    const image2Ref = useRef(null);

    useEffect(() => {
        // Import GSAP and ScrollTrigger (without ScrollSmoother)
        const loadGSAP = async () => {
            const gsap = (await import("gsap")).default;
            const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;

            gsap.registerPlugin(ScrollTrigger);

            // Create parallax effect for first image
            if (image1Ref.current) {
                gsap.fromTo(
                    image1Ref.current,
                    { y: 0 },
                    {
                        y: -100,
                        scrollTrigger: {
                            trigger: image1Ref.current.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            }

            // Create parallax effect for second image
            if (image2Ref.current) {
                gsap.fromTo(
                    image2Ref.current,
                    { y: 0 },
                    {
                        y: -100,
                        scrollTrigger: {
                            trigger: image2Ref.current.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        },
                    }
                );
            }
        };

        loadGSAP();

        return () => {
            // Clean up any ScrollTrigger instances to prevent memory leaks
            if (window.ScrollTrigger) {
                window.ScrollTrigger.getAll().forEach((trigger) =>
                    trigger.kill()
                );
            }
        };
    }, []);

    return (
        <div style={wrapperStyle}>
            <section style={contentStyle}>
                <section
                    className="parallax-images container"
                    style={parallaxImagesStyle}
                >
                    <div className="parallax-text" style={parallaxTextStyle}>
                        <div className="flow content" style={contentTextStyle}>
                            <h2 style={headingStyle}>
                                {title || "Easy parallax image effects"}
                            </h2>
                            <p style={paragraphStyle}>
                                {description ||
                                    "Pop your images in a container with overflow hidden, size them a little larger than the container and set data-speed to auto. GSAP does the rest."}
                            </p>
                        </div>
                    </div>
                    <div className="image_cont" style={imageContStyle}>
                        <img
                            ref={image1Ref}
                            src={image1 || "/images/hospitality.webp"}
                            alt="Parallax image 1"
                            style={imageStyle}
                        />
                    </div>
                </section>
            </section>
        </div>
    );
};

// Inline styles to match the original CSS
const wrapperStyle = {
    overflow: "hidden",
    position: "relative",
};

const contentStyle = {
    overflow: "visible",
    width: "100%",
};

const parallaxImagesStyle = {
    marginTop: "10vh",
    padding: "10rem 1rem",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridColumnGap: "1rem",
    gridRowGap: "20vh",
    alignItems: "center",
    justifyItems: "center",
    maxWidth: "1100px",
    margin: "0 auto",
};

const parallaxTextStyle = {
    gridColumn: "2",
    gridRow: "1",
};

const contentTextStyle = {
    borderLeft: "solid 1px white",
    padding: "0.5rem 2rem",
};

const headingStyle = {
    margin: "0",
    color: "white",
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: "500",
};

const paragraphStyle = {
    margin: "1em 0 0 0",
    color: "white",
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: "300",
    lineHeight: "1.35",
};

const imageContStyle = {
    position: "relative",
    height: "80vh",
    overflow: "hidden",
    gridColumn: "1 / span 1",
    gridRow: "1",
    width: "100%",
};

const imageContStyle2 = {
    position: "relative",
    height: "80vh",
    overflow: "hidden",
    gridColumn: "2 / span 1",
    gridRow: "2",
    width: "100%",
};

const imageStyle = {
    position: "absolute",
    bottom: "0",
    margin: "0 auto",
    height: "140%",
    width: "100%",
    objectFit: "cover",
};

export default ParallaxSection;
