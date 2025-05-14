<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Industry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'industry_name',
        'industry_description',
        'industry_image',
    ];

    /**
     * Get the projects for the industry.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
