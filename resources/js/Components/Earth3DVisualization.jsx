import React, { useEffect, useRef, useState } from "react";

const Earth3DVisualization = () => {
    const containerRef = useRef(null);
    const logoContainerRef = useRef(null);
    const [showLogo, setShowLogo] = useState(true);

    // Logo interaction with GSAP-like animation
    useEffect(() => {
        if (!logoContainerRef.current) return;

        const container = logoContainerRef.current;

        const handleMouseMove = (e) => {
            const { left, top, width, height } =
                container.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateY = (x / width - 0.5) * 40; // rotate between -20 and +20 degrees
            const rotateX = (y / height - 0.5) * -40;

            // Animate without GSAP dependency
            container.style.transition = "transform 0.4s ease";
            container.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        };

        const resetRotation = () => {
            container.style.transition = "transform 0.6s ease";
            container.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        };

        // Handle click to toggle between logo and Earth
        const handleClick = () => {
            setShowLogo(false);
        };

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", resetRotation);
        container.addEventListener("click", handleClick);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", resetRotation);
            container.removeEventListener("click", handleClick);
        };
    }, []);

    // Earth 3D visualization
    useEffect(() => {
        if (showLogo || !containerRef.current) return;

        // Add a script tag to load Three.js from CDN
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
        script.async = true;

        script.onload = () => {
            const THREE = window.THREE;

            // Constants
            const TEXTURE_PATH =
                "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/";
            const earthRadius = 80;
            const degreeOffset = 90;

            // Set up variables
            let camera, scene, renderer, element;
            let sphere, sphereCloud, rotationPoint;
            let baseRotationPoint, worldRotationPoint;
            let isMouseDown = false;
            let mouseX = 0,
                mouseY = 0;
            let lastMouseX = 0,
                lastMouseY = 0;
            let targetRotationX = 0,
                targetRotationY = 0;
            let windowHalfX = window.innerWidth / 2;
            let windowHalfY = window.innerHeight / 2;

            // Get Earth's rotation based on UTC time
            const getEarthRotation = () => {
                const d = new Date();
                const h = d.getUTCHours();
                const m = d.getUTCMinutes();

                // Calculate total minutes
                const minutes = h * 60 + m;

                // Convert to degrees
                let degrees = minutes / 3.9907;

                // Add offset
                degrees += degreeOffset;
                return degrees;
            };

            let degrees = getEarthRotation();

            // Update every minute
            const rotationInterval = setInterval(() => {
                degrees = getEarthRotation();
            }, 60000);

            function init() {
                // Create scene
                scene = new THREE.Scene();

                // Create rotation points
                baseRotationPoint = new THREE.Object3D();
                baseRotationPoint.position.set(0, 0, 0);
                scene.add(baseRotationPoint);

                worldRotationPoint = new THREE.Object3D();
                worldRotationPoint.position.set(0, 0, 0);
                scene.add(worldRotationPoint);

                rotationPoint = new THREE.Object3D();
                rotationPoint.position.set(0, 0, earthRadius * 4);
                baseRotationPoint.add(rotationPoint);

                // Create camera
                camera = new THREE.PerspectiveCamera(
                    45,
                    window.innerWidth / window.innerHeight,
                    1,
                    10000
                );
                rotationPoint.add(camera);

                // Create renderer
                renderer = new THREE.WebGLRenderer({ alpha: true });
                element = renderer.domElement;
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                containerRef.current.appendChild(element);

                // Ambient light
                const ambient = new THREE.AmbientLight(0x222222);
                scene.add(ambient);

                // The sun
                const light = new THREE.PointLight(0xffeecc, 1, 5000);
                light.position.set(-400, 0, 100);
                scene.add(light);

                // Sun fillers
                const light2 = new THREE.PointLight(0xffffff, 0.6, 4000);
                light2.position.set(-400, 0, 250);
                scene.add(light2);

                const light3 = new THREE.PointLight(0xffffff, 0.6, 4000);
                light3.position.set(-400, 0, -150);
                scene.add(light3);

                const light4 = new THREE.PointLight(0xffffff, 0.6, 4000);
                light4.position.set(-400, 150, 100);
                scene.add(light4);

                const light5 = new THREE.PointLight(0xffffff, 0.6, 4000);
                light5.position.set(-400, -150, 100);
                scene.add(light5);

                // Earth sphere
                const geometry = new THREE.SphereGeometry(
                    earthRadius,
                    128,
                    128
                );

                // Earth textures
                const loader = new THREE.TextureLoader();
                loader.setCrossOrigin("https://s.codepen.io");
                const texture = loader.load(TEXTURE_PATH + "ColorMap.jpg");
                const bump = loader.load(TEXTURE_PATH + "Bump.jpg");
                const spec = loader.load(TEXTURE_PATH + "SpecMask.jpg");

                // Earth material
                const material = new THREE.MeshPhongMaterial({
                    color: "#ffffff",
                    shininess: 5,
                    map: texture,
                    specularMap: spec,
                    specular: "#666666",
                    bumpMap: bump,
                });

                // Create Earth mesh
                sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(0, 0, 0);
                sphere.rotation.y = Math.PI;
                sphere.rotation.y = -1 * ((8.7 * Math.PI) / 17); // Focus on prime meridian
                worldRotationPoint.add(sphere);

                // Cloud layer
                const geometryCloud = new THREE.SphereGeometry(
                    earthRadius + 0.2,
                    128,
                    128
                );
                const alpha = loader.load(TEXTURE_PATH + "alphaMap.jpg");
                const materialCloud = new THREE.MeshPhongMaterial({
                    alphaMap: alpha,
                    transparent: true,
                });

                sphereCloud = new THREE.Mesh(geometryCloud, materialCloud);
                scene.add(sphereCloud);

                // Glow effect
                const glowMap = loader.load(TEXTURE_PATH + "glow.png");
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: glowMap,
                    color: 0x0099ff,
                    transparent: false,
                    blending: THREE.AdditiveBlending,
                });

                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(earthRadius * 2.5, earthRadius * 2.5, 1.0);
                sphereCloud.add(sprite);

                // Simple black skybox
                const skyboxSize = 2000;
                const skyboxGeometry = new THREE.BoxGeometry(
                    skyboxSize,
                    skyboxSize,
                    skyboxSize
                );
                const skyboxMaterial = new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    side: THREE.BackSide,
                });

                const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
                scene.add(skybox);

                // Add sun
                createSun();

                // Add event listeners for mouse interaction
                document.addEventListener(
                    "mousedown",
                    onDocumentMouseDown,
                    false
                );
                document.addEventListener(
                    "mousemove",
                    onDocumentMouseMove,
                    false
                );
                document.addEventListener("mouseup", onDocumentMouseUp, false);
                document.addEventListener("wheel", onDocumentMouseWheel, false);
                window.addEventListener("resize", onWindowResize, false);
            }

            function createSun() {
                const sunGeometry = new THREE.SphereGeometry(100, 16, 16);
                const sunMaterial = new THREE.MeshLambertMaterial({
                    color: "#ffff55",
                    emissive: "#ffff55",
                });

                const sun = new THREE.Mesh(sunGeometry, sunMaterial);
                sun.castShadow = false;
                sun.receiveShadow = false;
                sun.position.set(-9500, 0, 0);
                sun.rotation.y = Math.PI;

                scene.add(sun);
            }

            // Mouse event handlers
            function onDocumentMouseDown(event) {
                event.preventDefault();
                isMouseDown = true;

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }

            function onDocumentMouseMove(event) {
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

            function onDocumentMouseUp() {
                isMouseDown = false;
            }

            function onDocumentMouseWheel(event) {
                event.preventDefault();

                // Get camera position relative to the origin
                const distance = camera.position.z;

                // Adjust based on wheel direction
                if (event.deltaY > 0) {
                    // Zoom out
                    camera.position.z = Math.min(
                        earthRadius * 8,
                        distance * 1.1
                    );
                } else {
                    // Zoom in
                    camera.position.z = Math.max(
                        earthRadius * 2,
                        distance * 0.9
                    );
                }
            }

            function onWindowResize() {
                windowHalfX = window.innerWidth / 2;
                windowHalfY = window.innerHeight / 2;

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            function update() {
                // Update Earth rotation based on time
                worldRotationPoint.rotation.y = (degrees * Math.PI) / 180;

                // Update cloud rotation
                sphereCloud.rotation.y += 0.00025;

                // Apply mouse rotation with smoothing
                baseRotationPoint.rotation.x +=
                    (targetRotationX - baseRotationPoint.rotation.x) * 0.05;
                baseRotationPoint.rotation.y +=
                    (targetRotationY - baseRotationPoint.rotation.y) * 0.05;
            }

            function render() {
                renderer.render(scene, camera);
            }

            function animate() {
                requestAnimationFrame(animate);
                update();
                render();
            }

            // Initialize and start animation
            init();
            animate();

            // Clean up function
            return () => {
                clearInterval(rotationInterval);
                document.removeEventListener("mousedown", onDocumentMouseDown);
                document.removeEventListener("mousemove", onDocumentMouseMove);
                document.removeEventListener("mouseup", onDocumentMouseUp);
                document.removeEventListener("wheel", onDocumentMouseWheel);
                window.removeEventListener("resize", onWindowResize);

                if (containerRef.current && element) {
                    containerRef.current.removeChild(element);
                }
            };
        };

        // Add script to document
        document.body.appendChild(script);

        // Clean up function
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [showLogo]);

    // Toggle back to logo view
    const handleBackToLogo = () => {
        setShowLogo(true);
    };

    return (
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
            {/* Logo Container */}
            {showLogo ? (
                <div className="flex items-center justify-center w-full">
                    <div
                        ref={logoContainerRef}
                        className="relative w-full max-w-md aspect-square rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
                        style={{
                            transformStyle: "preserve-3d",
                            willChange: "transform",
                        }}
                    >
                        <img
                            src="/images/3dLogoImg.png"
                            alt="Interactive Earth"
                            className="w-full h-full object-contain pointer-events-none"
                            style={{ opacity: 0.97 }}
                        />
                        {/* Glow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl" />

                        {/* Instructions overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black/70 p-4 rounded-lg text-white text-center">
                                <p>Click to explore the interactive 3D Earth</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Earth Container */}
                    <div
                        id="container"
                        ref={containerRef}
                        className="absolute inset-0"
                        style={{
                            background: "#000",
                            margin: 0,
                            padding: 0,
                            overflow: "hidden",
                        }}
                    />

                    {/* Back button */}
                    <button
                        onClick={handleBackToLogo}
                        className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-full z-10 transition-colors"
                    >
                        Back to Logo
                    </button>

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white p-4 rounded-lg z-10">
                        <p className="text-center font-semibold">
                            Mouse Controls:
                        </p>
                        <ul className="text-sm mt-2">
                            <li>• Click and drag to rotate the Earth</li>
                            <li>• Scroll to zoom in/out</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default Earth3DVisualization;
