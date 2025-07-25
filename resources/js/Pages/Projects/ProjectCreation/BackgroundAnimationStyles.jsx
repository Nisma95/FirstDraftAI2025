// Components/ProjectCreation/BackgroundAnimationStyles.jsx
import React from "react";

export default function BackgroundAnimationStyles() {
    return (
        <style jsx="true">{`
            .background-animate {
                background-size: 400%;
                animation: gradient 3s ease infinite;
            }

            @keyframes gradient {
                0%,
                100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }
        `}</style>
    );
}
