import React, { useState, useRef } from "react";

const MessageInput = ({
    onSendMessage,
    disabled = false,
    theme = "glassmorphism",
}) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
            textareaRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleInput = (e) => {
        setMessage(e.target.value);

        // Auto-resize textarea
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            Math.min(textareaRef.current.scrollHeight, 120) + "px";
    };

    const themeClasses = theme === "glassmorphism" ? "glassmorphism" : "";

    return (
        <div
            className={`${
                theme === "glassmorphism"
                    ? ""
                    : "border-t border-gray-200 bg-white"
            } p-4`}
        >
            <style jsx>{`
                .no-focus-ring textarea:focus {
                    outline: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    ring: none !important;
                }
                .no-focus-ring *:focus {
                    outline: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    ring: none !important;
                }
            `}</style>
            <form onSubmit={handleSubmit} className="w-full">
                <div
                    className={`relative chat-input-container no-focus-ring ${themeClasses} ${
                        theme === "glassmorphism"
                            ? ""
                            : "border border-gray-300 rounded-lg"
                    }`}
                >
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className={`chat-input-field resize-none w-full no-outline no-border no-ring ${
                            disabled ? "cursor-not-allowed" : ""
                        } ${
                            theme === "glassmorphism"
                                ? ""
                                : "px-3 py-2 pr-12 text-sm bg-white"
                        }`}
                        disabled={disabled}
                        rows={1}
                        style={{
                            minHeight: "40px",
                            maxHeight: "120px",
                            outline: "none",
                            border: "none",
                            boxShadow: "none",
                        }}
                    />

                    {/* Character count (optional) */}
                    {message.length > 0 && (
                        <div
                            className={`absolute bottom-1 right-12 text-xs ${
                                theme === "glassmorphism"
                                    ? "text-gray-500 dark:text-gray-400"
                                    : "text-gray-400"
                            }`}
                        >
                            {message.length}/5000
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!message.trim() || disabled}
                        className={`send-button ${themeClasses} absolute right-2 bottom-2 transition-all flex items-center justify-center ${
                            message.trim() && !disabled
                                ? `${
                                      theme === "glassmorphism"
                                          ? "text-white"
                                          : "bg-blue-600 text-white hover:bg-blue-700"
                                  } transform hover:scale-105`
                                : `${
                                      theme === "glassmorphism"
                                          ? "text-gray-400 cursor-not-allowed backdrop-blur-sm bg-gray-200/30"
                                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  }`
                        } ${theme === "glassmorphism" ? "" : "rounded-lg"}`}
                        style={{
                            width: "36px",
                            height: "36px",
                        }}
                    >
                        {disabled ? (
                            <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </form>

            {/* Input hints */}
            <div
                className={`mt-2 text-xs flex items-center justify-between ${
                    theme === "glassmorphism"
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-500"
                }`}
            >
                <span>Press Enter to send, Shift+Enter for new line</span>
                {disabled && (
                    <span
                        className={`${
                            theme === "glassmorphism"
                                ? "text-purple-400 dark:text-purple-300"
                                : "text-blue-500"
                        } animate-pulse`}
                    >
                        AI is thinking...
                    </span>
                )}
            </div>
        </div>
    );
};

export default MessageInput;
