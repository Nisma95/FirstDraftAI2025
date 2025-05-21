<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Industry extends Model
{
    use HasFactory;

    protected $table = 'industries';

    protected $fillable = [
        'industry_name',
        'industry_description',
        'industry_image',
    ];

    /**
     * Get all projects that belong to this industry.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Get the display name for the industry.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->industry_name;
    }
}
