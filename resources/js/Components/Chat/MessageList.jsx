import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, isLoading, theme = "glassmorphism" }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const renderMessage = (message, index) => {
        const isUser = message.role === "user";
        const themeClasses = theme === "glassmorphism" ? "glassmorphism" : "";

        return (
            <div
                key={message.id || index}
                className={`flex ${
                    isUser ? "justify-end" : "justify-start"
                } mb-4 message-appear`}
            >
                <div
                    className={`${
                        isUser
                            ? "order-2 max-w-[85%] min-w-[200px] w-auto"
                            : "order-1 max-w-[80%]"
                    }`}
                >
                    {!isUser && (
                        <div className="flex items-center mb-1">
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                                    theme === "glassmorphism"
                                        ? "backdrop-blur-lg bg-gradient-to-r from-violet-500/30 to-blue-500/30"
                                        : "bg-blue-500"
                                }`}
                            >
                                <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4M7 12H3a1 1 0 01-1-1V6a1 1 0 011-1h16a1 1 0 011 1v5a1 1 0 01-1 1h-4"
                                    />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                AI Assistant
                            </span>
                        </div>
                    )}

                    <div
                        className={`message-bubble ${
                            isUser ? "user" : "assistant"
                        } ${themeClasses} px-4 py-3 ${
                            theme === "glassmorphism"
                                ? ""
                                : isUser
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                    >
                        <p
                            className={`text-sm whitespace-pre-wrap ${
                                theme === "glassmorphism"
                                    ? isUser
                                        ? "text-white"
                                        : "text-gray-800 dark:text-gray-100"
                                    : isUser
                                    ? "text-white"
                                    : "text-gray-800"
                            }`}
                        >
                            {message.content}
                        </p>
                        <p
                            className={`text-xs mt-1 ${
                                theme === "glassmorphism"
                                    ? isUser
                                        ? "text-white/70"
                                        : "text-gray-600 dark:text-gray-400"
                                    : isUser
                                    ? "text-blue-100"
                                    : "text-gray-500"
                            }`}
                        >
                            {formatTime(message.created_at)}
                        </p>
                    </div>
                </div>

                {isUser && (
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 order-1 ${
                            theme === "glassmorphism"
                                ? "backdrop-blur-sm bg-white/10 dark:bg-black/10"
                                : "bg-gray-300"
                        }`}
                    >
                        <svg
                            className={`w-4 h-4 ${
                                theme === "glassmorphism"
                                    ? "text-white dark:text-gray-300"
                                    : "text-gray-600"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    const LoadingIndicator = () => (
        <div className="flex justify-start mb-4">
            <div className="max-w-[80%]">
                <div className="flex items-center mb-1">
                    <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                            theme === "glassmorphism"
                                ? "backdrop-blur-lg bg-gradient-to-r from-violet-500/30 to-blue-500/30 animate-pulse"
                                : "bg-blue-500 animate-pulse"
                        }`}
                    >
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7 12H3a1 1 0 01-1-1V6a1 1 0 011-1h16a1 1 0 011 1v5a1 1 0 01-1 1h-4"
                            />
                        </svg>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        AI Assistant
                    </span>
                </div>

                <div
                    className={`typing-indicator ${
                        theme === "glassmorphism"
                            ? "glassmorphism"
                            : "bg-gray-100"
                    }`}
                >
                    <div className="flex space-x-1">
                        <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === "glassmorphism"
                                    ? "bg-gray-500 dark:bg-gray-400"
                                    : "bg-gray-400"
                            }`}
                            style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === "glassmorphism"
                                    ? "bg-gray-500 dark:bg-gray-400"
                                    : "bg-gray-400"
                            }`}
                            style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                            className={`w-2 h-2 rounded-full animate-bounce ${
                                theme === "glassmorphism"
                                    ? "bg-gray-500 dark:bg-gray-400"
                                    : "bg-gray-400"
                            }`}
                            style={{ animationDelay: "300ms" }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div
            className={`flex-1 overflow-y-auto p-4 chat-messages ${
                theme === "glassmorphism" ? "" : "bg-gray-50"
            }`}
            onWheel={(e) => {
                // Prevent parent page scrolling when scrolling in chat
                e.stopPropagation();
            }}
            style={{
                // Ensure the chat area is scrollable
                height: "100%",
                maxHeight: "100%",
                overflowY: "auto",
            }}
        >
            {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                        <svg
                            className={`w-12 h-12 mx-auto mb-4 ${
                                theme === "glassmorphism"
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-gray-300"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <p>Start a conversation</p>
                        <p className="text-sm">
                            Ask anything and I'll be happy to help!
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map(renderMessage)}
                    {isLoading && <LoadingIndicator />}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
