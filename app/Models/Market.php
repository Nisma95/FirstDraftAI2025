<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Market extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'industry',
        'target_market',
        'market_size',
        'trends',
        'competitors',
        'competitive_advantage',
        'risks',
        'notes',
    ];

    protected $casts = [
        'trends' => 'array',
        'competitors' => 'array',
        'risks' => 'array',
    ];

    // العلاقات
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // Accessors
    public function getTrendsListAttribute(): array
    {
        return $this->trends ?? [];
    }

    public function getCompetitorsListAttribute(): array
    {
        return $this->competitors ?? [];
    }

    public function getRisksListAttribute(): array
    {
        return $this->risks ?? [];
    }

    // Methods
    public function hasBasicData(): bool
    {
        return !empty($this->industry) &&
            !empty($this->target_market) &&
            !empty($this->market_size);
    }

    public function hasDetailedAnalysis(): bool
    {
        return $this->hasBasicData() &&
            !empty($this->trends) &&
            !empty($this->competitors) &&
            !empty($this->competitive_advantage);
    }

    public function hasRiskAssessment(): bool
    {
        return !empty($this->risks);
    }

    public function marketSizeInWords(): string
    {
        if (!$this->market_size) {
            return 'غير محدد';
        }

        $size = strtolower($this->market_size);

        if (is_numeric($size)) {
            return number_format($size) . ' ر.س';
        }

        return $this->market_size;
    }

    public function getCompetitorCount(): int
    {
        return count($this->competitors ?? []);
    }

    public function getTopCompetitors(int $count = 3): array
    {
        $competitors = $this->competitors ?? [];
        return array_slice($competitors, 0, $count);
    }

    public function getCriticalRisks(): array
    {
        $risks = $this->risks ?? [];

        return array_filter($risks, function ($risk) {
            return isset($risk['level']) && in_array($risk['level'], ['high', 'critical']);
        });
    }

    public function updateFromArray(array $data): bool
    {
        return $this->update($data);
    }
}
