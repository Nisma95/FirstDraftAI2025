<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\ChatMessage;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class ChatController extends Controller
{
    protected OpenAIService $openAIService;

    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }

    /**
     * Get all conversations for the authenticated user.
     */
    public function getConversations(): JsonResponse
    {
        $conversations = Conversation::where('user_id', Auth::id())
            ->with('messages:id,conversation_id,role,content,created_at')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    /**
     * Get a specific conversation with its messages.
     */
    public function getConversation(Conversation $conversation): JsonResponse
    {
        // Check if the conversation belongs to the authenticated user
        if ($conversation->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->load('messages:id,conversation_id,role,content,created_at');

        return response()->json($conversation);
    }

    /**
     * Create a new conversation.
     */
    public function createConversation(): JsonResponse
    {
        $conversation = Conversation::create([
            'user_id' => Auth::id(),
            'title' => null,
        ]);

        return response()->json($conversation);
    }

    /**
     * Send a message to the AI.
     */
    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        // Validate the conversation belongs to the authenticated user
        if ($conversation->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        try {
            DB::beginTransaction();

            // Save the user's message
            $userMessage = $conversation->messages()->create([
                'role' => 'user',
                'content' => $request->message,
            ]);

            // Generate conversation title if it doesn't exist
            $conversation->generateTitle();

            // Prepare message history for OpenAI
            $messageHistory = $conversation->getMessageHistory();

            // Get response from OpenAI
            $aiResponse = $this->openAIService->getResponse($messageHistory);

            // Save the AI's response
            $assistantMessage = $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $aiResponse,
            ]);

            // Update conversation timestamp
            $conversation->touch();

            DB::commit();

            return response()->json([
                'user_message' => $userMessage,
                'assistant_message' => $assistantMessage,
                'conversation' => $conversation->fresh(),
            ]);
        } catch (Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => 'Failed to process message: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a conversation.
     */
    public function deleteConversation(Conversation $conversation): JsonResponse
    {
        // Check if the conversation belongs to the authenticated user
        if ($conversation->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $conversation->delete();

        return response()->json(['message' => 'Conversation deleted successfully']);
    }

    /**
     * Update conversation title.
     */
    public function updateConversationTitle(Request $request, Conversation $conversation): JsonResponse
    {
        // Check if the conversation belongs to the authenticated user
        if ($conversation->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $conversation->update(['title' => $request->title]);

        return response()->json($conversation);
    }
}
