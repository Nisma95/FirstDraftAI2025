<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $plan_id
 * @property string $suggestion_type_new
 * @property string $suggestion_content
 * @property string $priority
 * @property bool $is_implemented
 * @property \Illuminate\Support\Carbon|null $implemented_at
 * @property int|null $impact_score Score from 1-10
 * @property string|null $category
 * @property string|null $related_section Related business plan section
 * @property array<array-key, mixed>|null $action_items
 * @property string|null $user_feedback
 * @property array<array-key, mixed>|null $metadata
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int $action_items_count
 * @property-read int $action_items_progress
 * @property-read string $category_display
 * @property-read int $completed_action_items_count
 * @property-read int|null $implementation_time
 * @property-read string $priority_display
 * @property-read string $status
 * @property-read string $suggestion_type_display
 * @property-read \App\Models\Plan $plan
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion byCategory(string $category)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion bySection(string $section)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion byType(string $type)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion highPriority()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion implemented()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion notImplemented()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion recent()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereActionItems($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereCategory($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereImpactScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereImplementedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereIsImplemented($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereMetadata($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereRelatedSection($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereSuggestionContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereSuggestionTypeNew($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|AiSuggestion whereUserFeedback($value)
 */
	class AiSuggestion extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $plan_id
 * @property string|null $age_range
 * @property string $gender
 * @property string|null $location
 * @property array<array-key, mixed>|null $interests
 * @property string|null $income_level
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $age_range_display
 * @property-read string $gender_display
 * @property-read string $income_level_display
 * @property-read \App\Models\Plan $plan
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereAgeRange($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereIncomeLevel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereInterests($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Audience whereUpdatedAt($value)
 */
	class Audience extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $business_type_name
 * @property string|null $business_type_image
 * @property string|null $business_type_description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereBusinessTypeDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereBusinessTypeImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereBusinessTypeName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BusinessType whereUpdatedAt($value)
 */
	class BusinessType extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $conversation_id
 * @property string $role
 * @property string $content
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Conversation $conversation
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage assistantMessages()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage userMessages()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereConversationId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ChatMessage whereUpdatedAt($value)
 */
	class ChatMessage extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $contract_type
 * @property string $content
 * @property array<array-key, mixed>|null $contract_data
 * @property string|null $file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $status
 * @property-read string|null $file_url
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereContent($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereContractData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereContractType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Contract whereUserId($value)
 */
	class Contract extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string|null $title
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ChatMessage> $messages
 * @property-read int|null $messages_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Conversation whereUserId($value)
 */
	class Conversation extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $plan_id
 * @property numeric|null $initial_budget
 * @property numeric|null $expected_income
 * @property numeric|null $monthly_expenses
 * @property numeric|null $profit_estimate
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int|null $break_even_months
 * @property-read string $formatted_expected_income
 * @property-read string $formatted_initial_budget
 * @property-read string $formatted_monthly_expenses
 * @property-read string $formatted_profit_estimate
 * @property-read float|null $profit_margin
 * @property-read float|null $return_on_investment
 * @property-read \App\Models\Plan $plan
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereExpectedIncome($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereInitialBudget($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereMonthlyExpenses($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereProfitEstimate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Finance whereUpdatedAt($value)
 */
	class Finance extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $plan_id
 * @property string $title
 * @property string|null $description
 * @property string $priority
 * @property \Illuminate\Support\Carbon|null $due_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int|null $days_remaining
 * @property-read bool $is_overdue
 * @property-read string $priority_display
 * @property-read int $progress_percentage
 * @property-read string $status_display
 * @property-read string $timeline_status
 * @property-read \App\Models\Plan $plan
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Task> $tasks
 * @property-read int|null $tasks_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal dueThisWeek()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal highPriority()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal inProgress()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal overdue()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Goal whereUpdatedAt($value)
 */
	class Goal extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $industry_name
 * @property string|null $industry_description
 * @property string|null $industry_image
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $display_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereIndustryDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereIndustryImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereIndustryName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Industry whereUpdatedAt($value)
 */
	class Industry extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $plan_id
 * @property string|null $industry
 * @property string|null $target_market
 * @property string|null $market_size
 * @property array<array-key, mixed>|null $trends
 * @property array<array-key, mixed>|null $competitors
 * @property string|null $competitive_advantage
 * @property array<array-key, mixed>|null $risks
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read array $competitors_list
 * @property-read array $risks_list
 * @property-read array $trends_list
 * @property-read \App\Models\Plan $plan
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereCompetitiveAdvantage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereCompetitors($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereIndustry($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereMarketSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereRisks($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereTargetMarket($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereTrends($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Market whereUpdatedAt($value)
 */
	class Market extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $subscription_id
 * @property \Illuminate\Support\Carbon $payment_date
 * @property string $payment_method
 * @property numeric $amount
 * @property string $transaction_id
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $formatted_amount
 * @property-read bool $is_refundable
 * @property-read float $net_amount
 * @property-read string $payment_method_display
 * @property-read float $processing_fee
 * @property-read string $status_display
 * @property-read \App\Models\Subscription $subscription
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment byMethod($method)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment byMonth($year, $month)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment failed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment recent()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaymentDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereSubscriptionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Payment whereUpdatedAt($value)
 */
	class Payment extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $project_id
 * @property string $title
 * @property string|null $summary
 * @property array<array-key, mixed>|null $ai_analysis
 * @property string|null $ai_analysis_path
 * @property string|null $pdf_path
 * @property string $status
 * @property int $progress_percentage
 * @property string|null $conversation_file_path
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\AiSuggestion> $aiSuggestions
 * @property-read int|null $ai_suggestions_count
 * @property-read string|null $executive_summary
 * @property-read string|null $financial_plan
 * @property-read string $formatted_status
 * @property-read string|null $market_analysis
 * @property-read string|null $marketing_strategy
 * @property-read string|null $operational_plan
 * @property-read string $status_color
 * @property-read string|null $swot_analysis
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan draft()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan generating()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan premium()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereAiAnalysis($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereAiAnalysisPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereConversationFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan wherePdfPath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereProgressPercentage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereSummary($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Plan whereUpdatedAt($value)
 */
	class Plan extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $description
 * @property string $status
 * @property int|null $industry_id
 * @property int|null $business_type_id
 * @property string|null $main_product_service
 * @property string|null $project_scale
 * @property int|null $team_size
 * @property string|null $revenue_model
 * @property string|null $main_differentiator
 * @property string $target_market
 * @property string|null $location
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\BusinessType|null $business_type
 * @property-read string $business_type_name
 * @property-read string $formatted_project_scale
 * @property-read string $formatted_team_size
 * @property-read string $industry_name
 * @property-read \App\Models\Industry|null $industry
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Plan> $plans
 * @property-read int|null $plans_count
 * @property-read \App\Models\User|null $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereBusinessTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereIndustryId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereMainDifferentiator($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereMainProductService($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereProjectScale($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereRevenueModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereTargetMarket($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereTeamSize($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUserId($value)
 */
	class Project extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $plan_type
 * @property \Illuminate\Support\Carbon $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string $status
 * @property string|null $payment_method
 * @property numeric|null $amount
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read int|null $days_remaining
 * @property-read bool $is_active
 * @property-read bool $is_canceled
 * @property-read bool $is_expired
 * @property-read float $monthly_price
 * @property-read \Carbon\Carbon|null $next_payment_date
 * @property-read string $plan_type_display
 * @property-read string $status_display
 * @property-read float $total_amount_paid
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Payment> $payments
 * @property-read int|null $payments_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription canceled()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription expired()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription paid()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereEndDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription wherePlanType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Subscription whereUserId($value)
 */
	class Subscription extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property int $goal_id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $due_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $assignee
 * @property-read int|null $days_remaining
 * @property-read float|null $efficiency_rate
 * @property-read bool $is_overdue
 * @property-read string $priority_display
 * @property-read int $progress_percentage
 * @property-read string $status_display
 * @property-read string $time_description
 * @property-read \App\Models\Goal $goal
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task assignedTo($userId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task completed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task dueThisWeek()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task dueToday()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task inProgress()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task overdue()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereGoalId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Task whereUpdatedAt($value)
 */
	class Task extends \Eloquent {}
}

namespace App\Models{
/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string $type
 * @property string $language
 * @property string|null $phone
 * @property string|null $profile_photo
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $subscription_type
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $remember_token
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Contract> $contracts
 * @property-read int|null $contracts_count
 * @property-read mixed $ai_chat_count
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subscription> $subscriptions
 * @property-read int|null $subscriptions_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereProfilePhoto($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereSubscriptionType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

