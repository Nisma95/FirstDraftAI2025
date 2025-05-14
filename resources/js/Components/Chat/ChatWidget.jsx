import React, { useState, useEffect } from "react";
import ChatContainer from "./ChatContainer";
import ChatToggleButton from "./ChatToggleButton";

const ChatWidget = ({
    position = "bottom-right",
    size = "medium",
    autoOpen = false,
    showNotification = false,
    theme = "glassmorphism", // Add theme prop
}) => {
    const [isOpen, setIsOpen] = useState(autoOpen);
    const [hasNotification, setHasNotification] = useState(showNotification);

    useEffect(() => {
        // Clear notification when chat is opened
        if (isOpen) {
            setHasNotification(false);
        }
    }, [isOpen]);

    const handleToggle = () => {
        console.log("Toggle chat:", !isOpen);
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Chat Container */}
            <ChatContainer
                isOpen={isOpen}
                onClose={() => {
                    console.log("Closing chat");
                    setIsOpen(false);
                }}
                position={position}
                theme={theme}
            />

            {/* Toggle Button - only show when chat is closed */}
            {!isOpen && (
                <ChatToggleButton
                    position={position}
                    size={size}
                    hasNotification={hasNotification}
                    onClick={handleToggle}
                    theme={theme}
                />
            )}
        </>
    );
};

export default ChatWidget;
