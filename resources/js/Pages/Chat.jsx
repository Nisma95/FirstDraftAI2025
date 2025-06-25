import React from "react";
import ChatWidget from "../../Components/Chat/ChatWidget";

const Chat = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Example content */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Chat System Demo
                </h1>
                <p className="text-gray-600 mb-8">
                    The chat widget is now available in the bottom-right corner.
                    You can click on it to start chatting with the AI assistant.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Features</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li>✅ Real-time AI chat</li>
                            <li>✅ Multiple conversations</li>
                            <li>✅ Message history</li>
                            <li>✅ Responsive design</li>
                            <li>✅ Smooth animations</li>
                            <li>✅ Auto-generated titles</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Usage</h2>
                        <ol className="space-y-2 text-gray-600">
                            <li>1. Click the chat button in the corner</li>
                            <li>2. Type your message</li>
                            <li>3. Press Enter to send</li>
                            <li>4. Wait for AI response</li>
                            <li>5. Continue the conversation</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Chat Widget */}
            <ChatWidget
                position="bottom-right"
                size="medium"
                autoOpen={false}
                showNotification={false}
            />
        </div>
    );
};

export default Chat;
