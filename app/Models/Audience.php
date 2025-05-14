<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Audience extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'age_range',
        'gender',
        'location',
        'interests',
        'income_level',
        'notes',
    ];

    protected $casts = [
        'interests' => 'array',
    ];

    // العلاقات
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // Accessors
    public function getGenderDisplayAttribute(): string
    {
        $genders = [
            'male' => 'ذكور',
            'female' => 'إناث',
            'both' => 'كلاهما',
        ];

        return $genders[$this->gender] ?? 'غير محدد';
    }

    public function getIncomeLevelDisplayAttribute(): string
    {
        $levels = [
            'low' => 'منخفض',
            'medium_low' => 'متوسط منخفض',
            'medium' => 'متوسط',
            'medium_high' => 'متوسط مرتفع',
            'high' => 'مرتفع',
        ];

        return $levels[$this->income_level] ?? $this->income_level ?? 'غير محدد';
    }

    public function getAgeRangeDisplayAttribute(): string
    {
        if (!$this->age_range) {
            return 'غير محدد';
        }

        $ranges = [
            '13-17' => '13-17 سنة',
            '18-24' => '18-24 سنة',
            '25-34' => '25-34 سنة',
            '35-44' => '35-44 سنة',
            '45-54' => '45-54 سنة',
            '55-64' => '55-64 سنة',
            '65+' => '65 سنة فأكثر',
        ];

        return $ranges[$this->age_range] ?? $this->age_range;
    }

    // Methods
    public function hasCompleteProfile(): bool
    {
        return !empty($this->age_range) &&
            !empty($this->gender) &&
            !empty($this->location) &&
            !empty($this->interests);
    }

    public function getInterestsList(): array
    {
        return is_array($this->interests) ? $this->interests : [];
    }

    public function addInterest(string $interest): void
    {
        $interests = $this->getInterestsList();

        if (!in_array($interest, $interests)) {
            $interests[] = $interest;
            $this->update(['interests' => $interests]);
        }
    }

    public function removeInterest(string $interest): void
    {
        $interests = $this->getInterestsList();

        if (($key = array_search($interest, $interests)) !== false) {
            unset($interests[$key]);
            $this->update(['interests' => array_values($interests)]);
        }
    }

    public function getPersonaDescription(): string
    {
        $description = [];

        if ($this->age_range) {
            $description[] = "الفئة العمرية: {$this->age_range_display}";
        }

        if ($this->gender !== 'both') {
            $description[] = "الجنس: {$this->gender_display}";
        }

        if ($this->location) {
            $description[] = "الموقع: {$this->location}";
        }

        if ($this->income_level) {
            $description[] = "الدخل: {$this->income_level_display}";
        }

        if (!empty($this->interests)) {
            $description[] = "الاهتمامات: " . implode(', ', $this->getInterestsList());
        }

        return implode("\n", $description);
    }

    public function getMarketSize(int $totalMarketSize): float
    {
        // Simplified calculation based on demographics
        $agePercent = $this->getAgePercentage($this->age_range);
        $genderPercent = $this->gender === 'both' ? 1.0 : 0.5;

        return $totalMarketSize * $agePercent * $genderPercent;
    }

    private function getAgePercentage(string $ageRange): float
    {
        // Approximate percentages based on Saudi demographics
        $percentages = [
            '13-17' => 0.15,
            '18-24' => 0.20,
            '25-34' => 0.22,
            '35-44' => 0.18,
            '45-54' => 0.12,
            '55-64' => 0.08,
            '65+' => 0.05,
        ];

        return $percentages[$ageRange] ?? 0.1;
    }

    public function getRecommendedChannels(): array
    {
        $channels = [];

        if ($this->age_range) {
            $channels = array_merge($channels, $this->getChannelsByAge($this->age_range));
        }

        if (!empty($this->interests)) {
            $channels = array_merge($channels, $this->getChannelsByInterests($this->interests));
        }

        return array_unique($channels);
    }

    private function getChannelsByAge(string $ageRange): array
    {
        $channelMap = [
            '13-17' => ['TikTok', 'Snapchat', 'Instagram'],
            '18-24' => ['Instagram', 'Twitter', 'TikTok', 'Snapchat'],
            '25-34' => ['Instagram', 'Facebook', 'LinkedIn', 'Twitter'],
            '35-44' => ['Facebook', 'Instagram', 'LinkedIn', 'WhatsApp'],
            '45-54' => ['Facebook', 'WhatsApp', 'Email'],
            '55-64' => ['Facebook', 'WhatsApp', 'Email'],
            '65+' => ['Facebook', 'WhatsApp', 'Email', 'Traditional Media'],
        ];

        return $channelMap[$ageRange] ?? [];
    }

    private function getChannelsByInterests(array $interests): array
    {
        $channels = [];
        $interestMap = [
            'تكنولوجيا' => ['LinkedIn', 'Twitter', 'YouTube'],
            'رياضة' => ['Instagram', 'Facebook', 'YouTube'],
            'موضة' => ['Instagram', 'Pinterest', 'TikTok'],
            'طعام' => ['Instagram', 'Facebook', 'YouTube'],
            'سفر' => ['Instagram', 'Pinterest', 'Facebook'],
            'تعليم' => ['LinkedIn', 'Facebook', 'YouTube'],
        ];

        foreach ($interests as $interest) {
            if (isset($interestMap[$interest])) {
                $channels = array_merge($channels, $interestMap[$interest]);
            }
        }

        return $channels;
    }
}
