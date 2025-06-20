<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'status',
        'industry_id',
        'business_type_id',
        'target_market',
        'location',
        'main_product_service',
        'team_size',
        'project_scale',
        'revenue_model',
        'main_differentiator',
    ];

    protected $casts = [
        'status' => 'string',
        'team_size' => 'integer',
        'project_scale' => 'string',
    ];

    const STATUS_NEW_PROJECT = 'new_project';
    const STATUS_EXISTED_PROJECT = 'existed_project';
    const SCALE_SMALL = 'small';
    const SCALE_MEDIUM = 'medium';
    const SCALE_LARGE = 'large';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class);
    }

    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }

    // Change this method name from business_type to businessType
    public function businessType()
    {
        return $this->belongsTo(BusinessType::class);
    }

    public function isNewProject(): bool
    {
        return $this->status === self::STATUS_NEW_PROJECT;
    }

    public function isExistingProject(): bool
    {
        return $this->status === self::STATUS_EXISTED_PROJECT;
    }

    public function getBusinessTypeNameAttribute(): string
    {
        return $this->businessType ? $this->businessType->business_type_name : 'Not specified';
    }
}
