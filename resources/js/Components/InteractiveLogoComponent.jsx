import React, { useEffect, useRef, useState } from "react";

const InteractiveLogoComponent = () => {
    const containerRef = useRef(null);
    const requestRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Variables
        let isMouseDown = false;
        let mouseX = 0,
            mouseY = 0;
        let lastMouseX = 0,
            lastMouseY = 0;
        let targetRotationX = 0,
            targetRotationY = 0;
        let currentRotationX = 0,
            currentRotationY = 0;
        let zoomLevel = 1;
        let autoRotate = true;
        let autoRotateSpeed = 0.005;

        // DOM elements
        const container = containerRef.current;
        const img = container.querySelector("img");

        // Mouse event handlers
        function onMouseDown(event) {
            event.preventDefault();
            isMouseDown = true;
            setIsDragging(true);
            autoRotate = false; // Stop auto-rotation when user interacts

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }

        function onMouseMove(event) {
            mouseX = event.clientX;
            mouseY = event.clientY;

            if (isMouseDown) {
                // Calculate rotation based on mouse movement
                targetRotationY += (mouseX - lastMouseX) * 0.01;
                targetRotationX += (mouseY - lastMouseY) * 0.01;

                // Limit vertical rotation to prevent flipping
                targetRotationX = Math.max(
                    -Math.PI / 2,
                    Math.min(Math.PI / 2, targetRotationX)
                );

                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }
        }

        function onMouseUp() {
            isMouseDown = false;
            setIsDragging(false);

            // Resume auto-rotation after a short delay
            setTimeout(() => {
                autoRotate = true;
            }, 2000);
        }

        function onWheel(event) {
            event.preventDefault();

            // Adjust zoom based on wheel direction
            if (event.deltaY > 0) {
                // Zoom out
                zoomLevel = Math.max(0.6, zoomLevel - 0.05);
            } else {
                // Zoom in
                zoomLevel = Math.min(2.0, zoomLevel + 0.05);
            }
        }

        // Update rotation
        function updateAnimation() {
            // Auto rotate when not being dragged
            if (autoRotate) {
                targetRotationY += autoRotateSpeed;
            }

            // Apply rotation with smoothing
            currentRotationX += (targetRotationX - currentRotationX) * 0.05;
            currentRotationY += (targetRotationY - currentRotationY) * 0.05;

            // Apply 3D transform with rotation
            container.style.transform = `
        perspective(1000px) 
        rotateX(${(currentRotationX * 180) / Math.PI}deg) 
        rotateY(${(currentRotationY * 180) / Math.PI}deg)
      `;

            // Apply zoom and 3D parallax effect
            img.style.transform = `
        scale(${zoomLevel}) 
        translateX(${currentRotationY * 15}px) 
        translateY(${-currentRotationX * 15}px)
      `;

            requestRef.current = requestAnimationFrame(updateAnimation);
        }

        // Start animation
        requestRef.current = requestAnimationFrame(updateAnimation);

        // Add event listeners
        container.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        container.addEventListener("wheel", onWheel);

        // Clean up
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            container.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            container.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div
                ref={containerRef}
                className={`relative w-full max-w-md overflow-hidden ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                }}
            >
                <img
                    src="/images/3dLogoImg.png"
                    alt="Interactive Logo"
                    className="w-full h-full object-contain pointer-events-none"
                    style={{
                        opacity: 0.97,
                        transition: "transform 0.05s ease-out",
                    }}
                />

                {/* Removed the 3D lighting effect div completely */}
            </div>
        </div>
    );
};

export default InteractiveLogoComponent;
