<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use App\Models\AiChatConversation;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
        'language',
        'phone',
        'profile_photo',
        'subscription_type',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the projects for the user.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the subscriptions for the user.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Check if user is premium subscriber.
     */
    public function isPremium(): bool
    {
        return $this->subscription_type === 'premium';
    }

    /**
     * Check if user is owner type.
     */
    public function isOwner(): bool
    {
        return $this->type === 'owner';
    }

    /**
     * Get user's active subscription.
     */
    public function activeSubscription()
    {
        return $this->subscriptions()->where('status', 'active')->latest()->first();
    }

    // Add these methods to your existing User model class

    public function aiChatConversations()
    {
        return $this->hasMany(AiChatConversation::class);
    }

    public function activeAiChats()
    {
        return $this->aiChatConversations()->where('is_active', true);
    }

    public function recentAiChats($limit = 5)
    {
        return $this->aiChatConversations()->latest()->limit($limit);
    }

    public function getAiChatCountAttribute()
    {
        return $this->aiChatConversations()->count();
    }
}
