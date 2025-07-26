import React, { useEffect, useRef } from "react";

const EarthVisualization = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Load Three.js script dynamically
        const loadThreeJS = () => {
            return new Promise((resolve) => {
                const script = document.createElement("script");
                script.src =
                    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
                script.async = true;
                script.onload = () => resolve(window.THREE);
                document.body.appendChild(script);
            });
        };

        const initVisualization = async () => {
            const THREE = await loadThreeJS();
            if (!THREE) return;

            // Constants
            const TEXTURE_PATH =
                "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123879/";
            const earthRadius = 80;
            const degreeOffset = 90;

            // Set up global variables
            let camera, scene, renderer, controls, element;
            let sphere, sphereCloud, rotationPoint;
            let baseRotationPoint, worldRotationPoint;
            let degrees = 0;

            // Get Earth's rotation based on current time
            const getEarthRotation = function () {
                const d = new Date();
                const h = d.getUTCHours();
                const m = d.getUTCMinutes();

                // Calculate total minutes
                let minutes = h * 60 + m;

                // Turn minutes into degrees
                let degrees = minutes / 3.9907;

                // Add offset to match UTC time
                degrees += degreeOffset;
                return degrees;
            };

            degrees = getEarthRotation();

            // Update Earth's rotation every minute
            const rotationInterval = setInterval(function () {
                degrees = getEarthRotation();
            }, 60000);

            // Initialize the scene
            function init() {
                // Use our container ref instead of creating new element
                const container = containerRef.current;

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
                    45, // Angle
                    window.innerWidth / window.innerHeight, // Aspect Ratio
                    1, // Near view
                    10000 // Far view
                );
                rotationPoint.add(camera);

                // Build renderer
                renderer = new THREE.WebGLRenderer();
                element = renderer.domElement;
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                container.appendChild(element);

                // Simplified controls
                // Note: We're not using OrbitControls since it's not included in the main THREE package
                // This is a minimal implementation to avoid errors
                controls = {
                    enablePan: true,
                    enableZoom: true,
                    maxDistance: earthRadius * 8,
                    minDistance: earthRadius * 2,
                    target: new THREE.Vector3(0, 0, -1 * earthRadius * 4),
                };

                // Add lights
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

                // Earth sphere model
                const geometry = new THREE.SphereGeometry(
                    earthRadius,
                    128,
                    128
                );

                // Earth materials
                const loader = new THREE.TextureLoader();
                loader.setCrossOrigin("https://s.codepen.io");
                const texture = loader.load(TEXTURE_PATH + "ColorMap.jpg");
                const bump = loader.load(TEXTURE_PATH + "Bump.jpg");
                const spec = loader.load(TEXTURE_PATH + "SpecMask.jpg");

                const material = new THREE.MeshPhongMaterial({
                    color: "#ffffff",
                    shininess: 5,
                    map: texture,
                    specularMap: spec,
                    specular: "#666666",
                    bumpMap: bump,
                });

                sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(0, 0, 0);
                sphere.rotation.y = Math.PI;

                // Focus on prime meridian
                sphere.rotation.y = -1 * ((8.7 * Math.PI) / 17);

                worldRotationPoint.add(sphere);

                // Cloud layer
                const geometryCloud = new THREE.SphereGeometry(
                    earthRadius + 0.2,
                    128,
                    128
                );

                const cloudLoader = new THREE.TextureLoader();
                cloudLoader.setCrossOrigin("https://s.codepen.io");
                const alpha = cloudLoader.load(TEXTURE_PATH + "alphaMap.jpg");

                const materialCloud = new THREE.MeshPhongMaterial({
                    alphaMap: alpha,
                    transparent: true,
                });

                sphereCloud = new THREE.Mesh(geometryCloud, materialCloud);
                scene.add(sphereCloud);

                // Glow effect
                const glowLoader = new THREE.TextureLoader();
                glowLoader.setCrossOrigin("https://s.codepen.io");
                const glowMap = glowLoader.load(TEXTURE_PATH + "glow.png");

                const spriteMaterial = new THREE.SpriteMaterial({
                    map: glowMap,
                    color: 0x0099ff,
                    transparent: false,
                    blending: THREE.AdditiveBlending,
                });

                const sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(earthRadius * 2.5, earthRadius * 2.5, 1.0);
                sphereCloud.add(sprite);

                // Simplified skybox (avoiding ShaderLib issues)
                addSimpleSkybox();

                window.addEventListener("resize", onWindowResize, false);
            }

            // Simplified skybox that doesn't use ShaderLib
            function addSimpleSkybox() {
                const size = 2000;
                const skyboxGeometry = new THREE.BoxGeometry(size, size, size);

                const skyboxMaterials = [];
                for (let i = 0; i < 6; i++) {
                    // Use a simple color instead of textures to avoid loading issues
                    skyboxMaterials.push(
                        new THREE.MeshBasicMaterial({
                            color: 0x000000, // Black background
                            side: THREE.BackSide,
                        })
                    );
                }

                const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
                scene.add(skybox);
            }

            // Create sun
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

            // Window resize handler
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }

            // Update scene
            function update() {
                camera.updateProjectionMatrix();
                worldRotationPoint.rotation.y = (degrees * Math.PI) / 180;
                sphereCloud.rotation.y += 0.00025;

                // Update orbit controls if available
                if (controls && controls.update) {
                    controls.update();
                } else {
                    // Default slow rotation if no controls
                    baseRotationPoint.rotation.y -= 0.00025;
                }
            }

            // Render scene
            function render() {
                renderer.render(scene, camera);
            }

            // Animation loop
            function animate() {
                requestAnimationFrame(animate);
                update();
                render();
            }

            // Initialize and start animation
            init();
            createSun();
            animate();

            // Clean up function
            return () => {
                clearInterval(rotationInterval);
                window.removeEventListener("resize", onWindowResize);

                // Clean up the controls
                if (controls && controls.dispose) {
                    controls.dispose();
                }

                if (containerRef.current && element) {
                    containerRef.current.removeChild(element);
                }
            };
        };

        // Start visualization
        const cleanup = initVisualization();

        // Return cleanup function
        return () => {
            if (cleanup && typeof cleanup === "function") {
                cleanup();
            }
        };
    }, []);

    return (
        <div
            id="container"
            ref={containerRef}
            style={{
                background: "#000",
                margin: 0,
                padding: 0,
                overflow: "hidden",
                width: "100vw",
                height: "100vh",
            }}
        />
    );
};

export default EarthVisualization;
