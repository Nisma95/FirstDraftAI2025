<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, let's update the enum to include 'operational' 
        if (Schema::hasColumn('ai_suggestions', 'suggestion_type')) {
            // Add a temporary column with the new enum values
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->enum('suggestion_type_temp', ['business', 'marketing', 'financial', 'operational', 'other'])->default('other')->after('suggestion_type');
            });

            // Copy existing data
            DB::statement("UPDATE ai_suggestions SET suggestion_type_temp = suggestion_type");

            // Drop old column
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->dropColumn('suggestion_type');
            });

            // Rename new column
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->renameColumn('suggestion_type_temp', 'suggestion_type');
            });
        }

        // Now add the new columns for enhanced functionality
        Schema::table('ai_suggestions', function (Blueprint $table) {
            // Add priority column if it doesn't exist
            if (!Schema::hasColumn('ai_suggestions', 'priority')) {
                $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium')->after('suggestion_content');
            }

            // Add implementation tracking columns
            if (!Schema::hasColumn('ai_suggestions', 'is_implemented')) {
                $table->boolean('is_implemented')->default(false)->after('priority');
            }

            if (!Schema::hasColumn('ai_suggestions', 'implemented_at')) {
                $table->timestamp('implemented_at')->nullable()->after('is_implemented');
            }

            // Add impact and categorization columns
            if (!Schema::hasColumn('ai_suggestions', 'impact_score')) {
                $table->integer('impact_score')->nullable()->after('implemented_at')->comment('Score from 1-10');
            }

            if (!Schema::hasColumn('ai_suggestions', 'category')) {
                $table->string('category')->nullable()->after('impact_score');
            }

            if (!Schema::hasColumn('ai_suggestions', 'related_section')) {
                $table->string('related_section')->nullable()->after('category')->comment('Related business plan section');
            }

            // Add action items and feedback columns
            if (!Schema::hasColumn('ai_suggestions', 'action_items')) {
                $table->json('action_items')->nullable()->after('related_section');
            }

            if (!Schema::hasColumn('ai_suggestions', 'user_feedback')) {
                $table->text('user_feedback')->nullable()->after('action_items');
            }

            if (!Schema::hasColumn('ai_suggestions', 'metadata')) {
                $table->json('metadata')->nullable()->after('user_feedback');
            }
        });

        // Add indexes for better performance (with error handling)
        try {
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->index('priority');
                $table->index('is_implemented');
                $table->index('category');
                $table->index('created_at');
            });
        } catch (\Exception $e) {
            // Indexes might already exist, that's OK
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes first (with error handling)
        try {
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->dropIndex(['priority']);
                $table->dropIndex(['is_implemented']);
                $table->dropIndex(['category']);
                $table->dropIndex(['created_at']);
            });
        } catch (\Exception $e) {
            // Indexes might not exist, that's OK
        }

        // Drop columns
        Schema::table('ai_suggestions', function (Blueprint $table) {
            $table->dropColumn([
                'priority',
                'is_implemented',
                'implemented_at',
                'impact_score',
                'category',
                'related_section',
                'action_items',
                'user_feedback',
                'metadata'
            ]);
        });

        // Revert enum back to original values
        if (Schema::hasColumn('ai_suggestions', 'suggestion_type')) {
            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->enum('suggestion_type_temp', ['business', 'marketing', 'financial', 'other'])->default('other')->after('suggestion_type');
            });

            DB::statement("UPDATE ai_suggestions SET suggestion_type_temp = CASE WHEN suggestion_type = 'operational' THEN 'other' ELSE suggestion_type END");

            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->dropColumn('suggestion_type');
            });

            Schema::table('ai_suggestions', function (Blueprint $table) {
                $table->renameColumn('suggestion_type_temp', 'suggestion_type');
            });
        }
    }
};
