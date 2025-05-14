<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_type_name',
        'business_type_image',
        'business_type_description',
    ];

    /**
     * Get the projects for the business type.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
