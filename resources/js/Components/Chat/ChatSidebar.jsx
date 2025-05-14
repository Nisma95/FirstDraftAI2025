import React, { useState } from "react";

const ChatSidebar = ({
    conversations,
    currentConversation,
    onSelectConversation,
    onNewConversation,
    onDeleteConversation,
    isOpen,
    onToggle,
    theme = "glassmorphism",
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const handleDeleteConversation = (conversationId) => {
        if (showDeleteConfirm === conversationId) {
            onDeleteConversation(conversationId);
            setShowDeleteConfirm(null);
        } else {
            setShowDeleteConfirm(conversationId);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isOpen) return null;

    const themeClasses =
        theme === "glassmorphism" ? "glassmorphism chat-sidebar" : "";

    return (
        <div
            className={`w-80 flex flex-col animate-slide-right ${
                theme === "glassmorphism"
                    ? themeClasses
                    : "bg-gray-50 border-r border-gray-200"
            }`}
        >
            {/* Sidebar Header */}
            <div
                className={`p-4 ${
                    theme === "glassmorphism" ? "" : "border-b border-gray-200"
                }`}
            >
                <div className="flex items-center justify-between">
                    <h2
                        className={`font-semibold ${
                            theme === "glassmorphism"
                                ? "text-gray-800 dark:text-white"
                                : "text-gray-800"
                        }`}
                    >
                        Conversations
                    </h2>
                    <button
                        onClick={onToggle}
                        className={`p-1 rounded transition-colors ${
                            theme === "glassmorphism"
                                ? "hover:bg-white/10 dark:hover:bg-black/10"
                                : "hover:bg-gray-200"
                        }`}
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* New Conversation Button */}
                <button
                    onClick={onNewConversation}
                    className={`new-chat-button w-full mt-3 px-3 py-2 rounded-lg transition-colors flex items-center justify-center ${
                        theme === "glassmorphism"
                            ? "text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    New Chat
                </button>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        <p>No conversations yet</p>
                        <p className="text-sm mt-1">Start a new chat</p>
                    </div>
                ) : (
                    <div className="p-2">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`conversation-item relative cursor-pointer transition-all ${
                                    currentConversation?.id === conversation.id
                                        ? `active ${
                                              theme === "glassmorphism"
                                                  ? ""
                                                  : "bg-blue-50 border-blue-200"
                                          }`
                                        : `${
                                              theme === "glassmorphism"
                                                  ? ""
                                                  : "bg-white border-gray-100"
                                          }`
                                } ${
                                    theme === "glassmorphism"
                                        ? "glassmorphism"
                                        : "border"
                                }`}
                                onClick={() =>
                                    onSelectConversation(conversation)
                                }
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`font-medium truncate ${
                                                theme === "glassmorphism"
                                                    ? "text-gray-800 dark:text-white"
                                                    : "text-gray-800"
                                            }`}
                                        >
                                            {conversation.title ||
                                                "New Conversation"}
                                        </h3>
                                        <p
                                            className={`text-xs mt-1 ${
                                                theme === "glassmorphism"
                                                    ? "text-gray-500 dark:text-gray-400"
                                                    : "text-gray-500"
                                            }`}
                                        >
                                            {formatDate(
                                                conversation.updated_at
                                            )}
                                        </p>
                                        {conversation.messages &&
                                            conversation.messages.length >
                                                0 && (
                                                <p
                                                    className={`text-sm mt-1 truncate ${
                                                        theme ===
                                                        "glassmorphism"
                                                            ? "text-gray-600 dark:text-gray-300"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {
                                                        conversation.messages[
                                                            conversation
                                                                .messages
                                                                .length - 1
                                                        ].content
                                                    }
                                                </p>
                                            )}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteConversation(
                                                conversation.id
                                            );
                                        }}
                                        className={`ml-2 p-1 rounded transition-colors ${
                                            showDeleteConfirm ===
                                            conversation.id
                                                ? "bg-red-100 text-red-600 hover:bg-red-200"
                                                : `${
                                                      theme === "glassmorphism"
                                                          ? "bg-white/10 text-gray-500 hover:bg-red-100/20 hover:text-red-500 dark:bg-black/10 dark:text-gray-400 dark:hover:bg-red-900/20"
                                                          : "bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                                  }`
                                        }`}
                                    >
                                        {showDeleteConfirm ===
                                        conversation.id ? (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
