<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Finance extends Model
{
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'initial_budget',
        'expected_income',
        'monthly_expenses',
        'profit_estimate',
        'notes',
    ];

    protected $casts = [
        'initial_budget' => 'decimal:2',
        'expected_income' => 'decimal:2',
        'monthly_expenses' => 'decimal:2',
        'profit_estimate' => 'decimal:2',
    ];

    // العلاقات
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    // Accessors
    public function getFormattedInitialBudgetAttribute(): string
    {
        return $this->formatCurrency($this->initial_budget);
    }

    public function getFormattedExpectedIncomeAttribute(): string
    {
        return $this->formatCurrency($this->expected_income);
    }

    public function getFormattedMonthlyExpensesAttribute(): string
    {
        return $this->formatCurrency($this->monthly_expenses);
    }

    public function getFormattedProfitEstimateAttribute(): string
    {
        return $this->formatCurrency($this->profit_estimate);
    }

    public function getProfitMarginAttribute(): ?float
    {
        if (!$this->expected_income || $this->expected_income <= 0) {
            return null;
        }

        return ($this->profit_estimate / $this->expected_income) * 100;
    }

    public function getBreakEvenMonthsAttribute(): ?int
    {
        if (!$this->initial_budget || !$this->profit_estimate || $this->profit_estimate <= 0) {
            return null;
        }

        return ceil($this->initial_budget / $this->profit_estimate);
    }

    public function getReturnOnInvestmentAttribute(): ?float
    {
        if (!$this->initial_budget || !$this->profit_estimate || $this->initial_budget <= 0) {
            return null;
        }

        // ROI for first year
        $annualProfit = $this->profit_estimate * 12;
        return ($annualProfit / $this->initial_budget) * 100;
    }

    // Methods
    public function hasBasicFinancials(): bool
    {
        return $this->initial_budget !== null &&
            $this->expected_income !== null &&
            $this->monthly_expenses !== null;
    }

    public function hasCompleteFinancials(): bool
    {
        return $this->hasBasicFinancials() &&
            $this->profit_estimate !== null;
    }

    public function calculateProfitEstimate(): float
    {
        if (!$this->hasBasicFinancials()) {
            return 0;
        }

        return $this->expected_income - $this->monthly_expenses;
    }

    public function updateProfitEstimate(): bool
    {
        $this->profit_estimate = $this->calculateProfitEstimate();
        return $this->save();
    }

    public function isFinanciallyViable(): bool
    {
        if (!$this->hasCompleteFinancials()) {
            return false;
        }

        // Check if profit estimate is positive
        if ($this->profit_estimate <= 0) {
            return false;
        }

        // Check if ROI is reasonable (at least 20% per year)
        if ($this->return_on_investment !== null && $this->return_on_investment < 20) {
            return false;
        }

        // Check if break-even is within reasonable timeframe (2 years max)
        if ($this->break_even_months !== null && $this->break_even_months > 24) {
            return false;
        }

        return true;
    }

    public function getFinancialSummary(): array
    {
        return [
            'initial_budget' => $this->formatted_initial_budget,
            'expected_income' => $this->formatted_expected_income,
            'monthly_expenses' => $this->formatted_monthly_expenses,
            'profit_estimate' => $this->formatted_profit_estimate,
            'profit_margin' => $this->profit_margin ? round($this->profit_margin, 1) . '%' : null,
            'break_even_months' => $this->break_even_months,
            'roi' => $this->return_on_investment ? round($this->return_on_investment, 1) . '%' : null,
            'is_viable' => $this->isFinanciallyViable(),
        ];
    }

    public function getExpenseBreakdown(): array
    {
        // This can be expanded to include detailed expense categories
        return [
            'total_monthly' => $this->formatted_monthly_expenses,
            // Add more detailed categories here in future
        ];
    }

    public function getProjectedCashFlow(int $months = 12): array
    {
        $cashFlow = [];
        $cumulativeBalance = 0;

        for ($month = 1; $month <= $months; $month++) {
            $monthlyNet = $this->expected_income - $this->monthly_expenses;

            if ($month === 1) {
                $monthlyNet -= $this->initial_budget; // Initial investment in first month
            }

            $cumulativeBalance += $monthlyNet;

            $cashFlow[] = [
                'month' => $month,
                'income' => $this->expected_income,
                'expenses' => $this->monthly_expenses,
                'net' => $monthlyNet,
                'cumulative' => $cumulativeBalance,
            ];
        }

        return $cashFlow;
    }

    private function formatCurrency($amount): string
    {
        if ($amount === null) {
            return 'غير محدد';
        }

        return number_format($amount, 2, '.', ',') . ' ر.س';
    }
}
