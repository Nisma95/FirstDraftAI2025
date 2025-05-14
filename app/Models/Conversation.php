<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the conversation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the messages for the conversation.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class);
    }

    /**
     * Generate a title for the conversation based on the first message.
     */
    public function generateTitle(): void
    {
        if (!$this->title && $this->messages()->count() > 0) {
            $firstMessage = $this->messages()->where('role', 'user')->first();
            if ($firstMessage) {
                // Create a title from the first 5 words of the first message
                $title = Str::limit($firstMessage->content, 50, '...');
                $this->update(['title' => $title]);
            }
        }
    }

    /**
     * Get the conversation history in OpenAI format.
     */
    public function getMessageHistory(): array
    {
        return $this->messages()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'role' => $message->role,
                    'content' => $message->content,
                ];
            })
            ->toArray();
    }
}
