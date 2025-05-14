import React, { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Lenis from "@studio-freight/lenis";

// Helper function to detect WebGL support
const isWebGLAvailable = () => {
    try {
        const canvas = document.createElement("canvas");
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl"))
        );
    } catch (e) {
        return false;
    }
};

// Stars component for Three.js rendering
function Stars({ isDarkMode }) {
    const groupRef = useRef();

    // Use useMemo to avoid recreating stars array on each render
    const stars = useMemo(() => {
        return new Array(150).fill().map(() => ({
            position: [
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 30,
                Math.random() * -20,
            ],
            moves: Math.random() > 0.3,
            speed: Math.random() * 0.002 + 0.0005,
            direction: [
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.02 - 0.01,
            ],
            waveOffset: Math.random() * Math.PI * 2,
        }));
    }, []);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((star, index) => {
                const starData = stars[index];
                if (starData?.moves) {
                    const time = clock.getElapsedTime();
                    star.position.x +=
                        Math.sin(time * starData.speed + starData.waveOffset) *
                        0.03;
                    star.position.y +=
                        Math.cos(time * starData.speed + starData.waveOffset) *
                        0.03;
                    star.position.z += Math.sin(time * starData.speed) * 0.01;

                    // Keep stars within a range
                    if (star.position.x > 25) star.position.x = -25;
                    if (star.position.y > 15) star.position.y = -15;
                }
            });
        }
    });

    return (
        <group ref={groupRef}>
            {stars.map((star, index) => (
                <mesh key={index} position={star.position}>
                    <sphereGeometry args={[0.02, 8, 8]} />{" "}
                    {/* Reduced geometry complexity */}
                    <meshStandardMaterial
                        emissive={isDarkMode ? "#c5c7ca" : "#000000"}
                        emissiveIntensity={3}
                        color={isDarkMode ? "#c5c7ca" : "#000000"}
                        transparent
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}

// CSS-based fallback star background component
function FallbackStarBackground({ isDarkMode }) {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const newStars = [];
        for (let i = 0; i < 100; i++) {
            newStars.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 5 + 3,
                delay: Math.random() * 5,
            });
        }
        setStars(newStars);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 w-full h-full z-[-1]"
            style={{
                background: isDarkMode ? "#000" : "#b9baba",
            }}
        >
            {stars.map((star) => (
                <div
                    key={star.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        backgroundColor: isDarkMode ? "#b9baba" : "#000",
                        opacity: star.opacity,
                        animation: `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`,
                    }}
                />
            ))}
            <style>
                {`
        @keyframes twinkle {
            0%, 100% {
                opacity: 0.2;
                transform: scale(0.8);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.2);
            }
        }
    `}
            </style>
        </div>
    );
}

// Main component with WebGL detection
export default function StarBackground() {
    const [isDarkMode, setIsDarkMode] = useState(
        typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark")
    );
    const [hasWebGL, setHasWebGL] = useState(false);

    useEffect(() => {
        // Check for WebGL support
        setHasWebGL(isWebGLAvailable());

        // Set up smooth scrolling with Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Listen for dark mode changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    setIsDarkMode(
                        document.documentElement.classList.contains("dark")
                    );
                }
            });
        });

        if (typeof document !== "undefined") {
            observer.observe(document.documentElement, {
                attributes: true,
            });
        }

        return () => {
            lenis.destroy();
            observer.disconnect();
        };
    }, []);

    // Render the fallback if WebGL is not available
    if (!hasWebGL) {
        return <FallbackStarBackground isDarkMode={isDarkMode} />;
    }

    // Otherwise render the Three.js canvas
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: -1,
                background: isDarkMode ? "#000" : "#fff",
                overflow: "hidden",
            }}
        >
            <ErrorBoundary
                fallback={<FallbackStarBackground isDarkMode={isDarkMode} />}
            >
                <Canvas
                    camera={{ position: [0, 0, 10] }}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    dpr={[1, 2]} // Limit pixel ratio for performance
                >
                    <ambientLight intensity={isDarkMode ? 0.3 : 0.7} />
                    <pointLight
                        position={[10, 10, 10]}
                        intensity={isDarkMode ? 0.5 : 1.0}
                        color={isDarkMode ? "#ffffff" : "#000000"}
                    />
                    <Stars isDarkMode={isDarkMode} />
                </Canvas>
            </ErrorBoundary>
        </div>
    );
}

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("StarBackground error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
