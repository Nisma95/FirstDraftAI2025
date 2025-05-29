<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'contract_type',
        'content',
        'contract_data',
        'status',
        'file_path',
    ];

    protected $casts = [
        'contract_data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the contract.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full file URL for the PDF
     */
    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? asset('storage/' . $this->file_path) : null;
    }

    /**
     * Check if contract has a generated PDF
     */
    public function hasPdf(): bool
    {
        return !is_null($this->file_path) && file_exists(storage_path('app/public/' . $this->file_path));
    }

    /**
     * Get contract data ensuring it's always an array
     */
    public function getContractDataAttribute($value)
    {
        if (is_string($value)) {
            return json_decode($value, true) ?? [];
        }
        return $value ?? [];
    }
}
