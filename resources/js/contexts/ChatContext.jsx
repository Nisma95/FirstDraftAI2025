import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [chatConfig, setChatConfig] = useState({
        enabled: true,
        position: "bottom-right",
        size: "medium",
        autoOpen: false,
        showNotification: false,
    });

    const updateChatConfig = (newConfig) => {
        setChatConfig((prev) => ({ ...prev, ...newConfig }));
    };

    const disableChat = () =>
        setChatConfig((prev) => ({ ...prev, enabled: false }));
    const enableChat = () =>
        setChatConfig((prev) => ({ ...prev, enabled: true }));

    return (
        <ChatContext.Provider
            value={{
                chatConfig,
                updateChatConfig,
                disableChat,
                enableChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
