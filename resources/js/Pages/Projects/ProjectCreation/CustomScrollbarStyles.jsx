// Components/ProjectCreation/CustomScrollbarStyles.jsx
import React from "react";

export default function CustomScrollbarStyles() {
    return (
        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 12px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.05);
                border-radius: 10px;
                margin: 5px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #cbd5e0 0%, #a0aec0 100%);
                border-radius: 10px;
                border: 2px solid transparent;
                background-clip: content-box;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #a0aec0 0%, #718096 100%);
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #718096 0%, #4a5568 100%);
            }

            /* Dark mode scrollbar */
            .dark .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #4a5568 0%, #2d3748 100%);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
            }

            .dark .custom-scrollbar::-webkit-scrollbar-thumb:active {
                background: linear-gradient(180deg, #1a202c 0%, #171923 100%);
            }

            /* Firefox */
            .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #cbd5e0 rgba(0, 0, 0, 0.05);
            }

            .dark .custom-scrollbar {
                scrollbar-color: #4a5568 rgba(255, 255, 255, 0.05);
            }
        `}</style>
    );
}
