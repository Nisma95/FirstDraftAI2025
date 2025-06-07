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

    // Constants for status values
    const STATUS_NEW_PROJECT = 'new_project';
    const STATUS_EXISTED_PROJECT = 'existed_project';

    // Constants for project scale values
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

    /**
     * Get the industry associated with the project.
     */
    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }

    public function businessType()  // Change this to camelCase
    {
        return $this->belongsTo(BusinessType::class);
    }



    // Helper methods for status
    public function isNewProject(): bool
    {
        return $this->status === self::STATUS_NEW_PROJECT;
    }

    public function isExistingProject(): bool
    {
        return $this->status === self::STATUS_EXISTED_PROJECT;
    }

    // New helper methods for project scale
    public function isSmallProject(): bool
    {
        return $this->project_scale === self::SCALE_SMALL;
    }

    public function isMediumProject(): bool
    {
        return $this->project_scale === self::SCALE_MEDIUM;
    }

    public function isLargeProject(): bool
    {
        return $this->project_scale === self::SCALE_LARGE;
    }

    // Helper method to check if project has all required details
    public function hasAllRequiredDetails(): bool
    {
        return !empty($this->main_product_service) &&
            !empty($this->revenue_model) &&
            !empty($this->main_differentiator);
    }

    // Accessor for formatted team size
    public function getFormattedTeamSizeAttribute(): string
    {
        if (!$this->team_size)
        {
            return 'غير محدد';
        }

        return $this->team_size . ' شخص';
    }

    // Accessor for formatted project scale
    public function getFormattedProjectScaleAttribute(): string
    {
        return match ($this->project_scale)
        {
            self::SCALE_SMALL => 'مشروع صغير',
            self::SCALE_MEDIUM => 'مشروع متوسط',
            self::SCALE_LARGE => 'مشروع كبير',
            default => 'غير محدد'
        };
    }

    // Get industry name
    public function getIndustryNameAttribute(): string
    {
        return $this->industry ? $this->industry->industry_name : 'Not specified';
    }

    // Get business type name
    public function getBusinessTypeNameAttribute(): string
    {
        return $this->businessType ? $this->businessType->business_type_name : 'Not specified';
    }
}
