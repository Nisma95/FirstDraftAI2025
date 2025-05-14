import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatSidebar from "./ChatSidebar";

const ChatContainer = ({
    isOpen,
    onClose,
    position = "bottom-right",
    theme = "glassmorphism",
}) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const chatRef = useRef(null);

    // Position classes based on prop
    const positionClasses = {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
    };

    useEffect(() => {
        if (isOpen) {
            loadConversations();
        }
    }, [isOpen]);

    useEffect(() => {
        if (currentConversation) {
            loadMessages(currentConversation.id);
        }
    }, [currentConversation]);

    const loadConversations = async () => {
        try {
            const response = await axios.get("/chat/conversations");
            setConversations(response.data);

            // If no conversations exist, create a new one
            if (response.data.length === 0) {
                await createNewConversation();
            } else {
                // Select the most recent conversation
                setCurrentConversation(response.data[0]);
            }
        } catch (error) {
            console.error("Error loading conversations:", error);
        }
    };

    const loadMessages = async (conversationId) => {
        try {
            const response = await axios.get(
                `/chat/conversations/${conversationId}`
            );
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error("Error loading messages:", error);
        }
    };

    const createNewConversation = async () => {
        try {
            const response = await axios.post("/chat/conversations");
            const newConversation = response.data;
            setConversations((prev) => [newConversation, ...prev]);
            setCurrentConversation(newConversation);
            setMessages([]);
            setSidebarOpen(false);
        } catch (error) {
            console.error("Error creating conversation:", error);
        }
    };

    const sendMessage = async (content) => {
        if (!currentConversation) {
            await createNewConversation();
        }

        if (!content.trim()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(
                `/chat/conversations/${currentConversation.id}/messages`,
                {
                    message: content,
                }
            );

            // Update messages with both user and assistant messages
            setMessages((prev) => [
                ...prev,
                response.data.user_message,
                response.data.assistant_message,
            ]);

            // Update conversation in the list
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === currentConversation.id
                        ? response.data.conversation
                        : conv
                )
            );
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            await axios.delete(`/chat/conversations/${conversationId}`);
            setConversations((prev) =>
                prev.filter((conv) => conv.id !== conversationId)
            );

            if (
                currentConversation &&
                currentConversation.id === conversationId
            ) {
                const remainingConversations = conversations.filter(
                    (conv) => conv.id !== conversationId
                );
                if (remainingConversations.length > 0) {
                    setCurrentConversation(remainingConversations[0]);
                } else {
                    await createNewConversation();
                }
            }
        } catch (error) {
            console.error("Error deleting conversation:", error);
        }
    };

    if (!isOpen) return null;

    // Apply theme classes
    const themeClasses = theme === "glassmorphism" ? "glassmorphism" : "";

    return (
        <div
            className={`fixed ${
                positionClasses[position]
            } z-50 chat-container ${themeClasses} ${
                isOpen ? "animate-slide-up" : ""
            }`}
            ref={chatRef}
        >
            <div className="overflow-hidden flex">
                {/* Sidebar */}
                <ChatSidebar
                    conversations={conversations}
                    currentConversation={currentConversation}
                    onSelectConversation={setCurrentConversation}
                    onNewConversation={createNewConversation}
                    onDeleteConversation={deleteConversation}
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    theme={theme}
                />

                {/* Main Chat Area */}
                <div className="flex flex-col w-96 h-[500px]">
                    {/* Chat Header */}
                    <div
                        className={`chat-header text-white p-4 flex items-center justify-between ${
                            theme === "glassmorphism" ? "" : "bg-blue-600"
                        }`}
                    >
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`mr-3 p-1 rounded transition-colors ${
                                    theme === "glassmorphism"
                                        ? "hover:bg-white/10"
                                        : "hover:bg-blue-700"
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
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p
                                    className={`text-sm ${
                                        theme === "glassmorphism"
                                            ? "text-white/70"
                                            : "text-blue-100"
                                    }`}
                                >
                                    Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className={`p-1 rounded transition-colors ${
                                theme === "glassmorphism"
                                    ? "hover:bg-white/10"
                                    : "hover:bg-blue-700"
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

                    {/* Messages */}
                    <MessageList
                        messages={messages}
                        isLoading={isLoading}
                        theme={theme}
                    />

                    {/* Message Input */}
                    <MessageInput
                        onSendMessage={sendMessage}
                        disabled={isLoading}
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
