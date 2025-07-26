<?php
// File: database/migrations/2025_05_18_041706_update_ai_suggestions_table_with_enhancements.php

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
        // SIMPLIFIED VERSION FOR SQLITE - Skip enum changes that cause issues

        Schema::table('ai_suggestions', function (Blueprint $table)
        {
            // Add new columns for enhanced functionality (only if they don't exist)
            if (!Schema::hasColumn('ai_suggestions', 'priority'))
            {
                $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium')->after('suggestion_content');
            }

            if (!Schema::hasColumn('ai_suggestions', 'is_implemented'))
            {
                $table->boolean('is_implemented')->default(false)->after('priority');
            }

            if (!Schema::hasColumn('ai_suggestions', 'implemented_at'))
            {
                $table->timestamp('implemented_at')->nullable()->after('is_implemented');
            }

            if (!Schema::hasColumn('ai_suggestions', 'impact_score'))
            {
                $table->integer('impact_score')->nullable()->after('implemented_at')->comment('Score from 1-10');
            }

            if (!Schema::hasColumn('ai_suggestions', 'category'))
            {
                $table->string('category')->nullable()->after('impact_score');
            }

            if (!Schema::hasColumn('ai_suggestions', 'related_section'))
            {
                $table->string('related_section')->nullable()->after('category')->comment('Related business plan section');
            }

            if (!Schema::hasColumn('ai_suggestions', 'action_items'))
            {
                $table->text('action_items')->nullable()->after('related_section'); // Changed from json to text for SQLite
            }

            if (!Schema::hasColumn('ai_suggestions', 'user_feedback'))
            {
                $table->text('user_feedback')->nullable()->after('action_items');
            }

            if (!Schema::hasColumn('ai_suggestions', 'metadata'))
            {
                $table->text('metadata')->nullable()->after('user_feedback'); // Changed from json to text for SQLite
            }
        });

        // Add indexes for better performance (with error handling)
        try
        {
            Schema::table('ai_suggestions', function (Blueprint $table)
            {
                if (!DB::select("SELECT name FROM sqlite_master WHERE type='index' AND name='ai_suggestions_priority_index'"))
                {
                    $table->index('priority');
                }
                if (!DB::select("SELECT name FROM sqlite_master WHERE type='index' AND name='ai_suggestions_is_implemented_index'"))
                {
                    $table->index('is_implemented');
                }
                if (!DB::select("SELECT name FROM sqlite_master WHERE type='index' AND name='ai_suggestions_category_index'"))
                {
                    $table->index('category');
                }
            });
        }
        catch (\Exception $e)
        {
            // Indexes might already exist, that's OK
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop indexes first (with error handling)
        try
        {
            Schema::table('ai_suggestions', function (Blueprint $table)
            {
                $table->dropIndex(['priority']);
                $table->dropIndex(['is_implemented']);
                $table->dropIndex(['category']);
            });
        }
        catch (\Exception $e)
        {
            // Indexes might not exist, that's OK
        }

        // Drop columns
        Schema::table('ai_suggestions', function (Blueprint $table)
        {
            if (Schema::hasColumn('ai_suggestions', 'priority'))
            {
                $table->dropColumn('priority');
            }
            if (Schema::hasColumn('ai_suggestions', 'is_implemented'))
            {
                $table->dropColumn('is_implemented');
            }
            if (Schema::hasColumn('ai_suggestions', 'implemented_at'))
            {
                $table->dropColumn('implemented_at');
            }
            if (Schema::hasColumn('ai_suggestions', 'impact_score'))
            {
                $table->dropColumn('impact_score');
            }
            if (Schema::hasColumn('ai_suggestions', 'category'))
            {
                $table->dropColumn('category');
            }
            if (Schema::hasColumn('ai_suggestions', 'related_section'))
            {
                $table->dropColumn('related_section');
            }
            if (Schema::hasColumn('ai_suggestions', 'action_items'))
            {
                $table->dropColumn('action_items');
            }
            if (Schema::hasColumn('ai_suggestions', 'user_feedback'))
            {
                $table->dropColumn('user_feedback');
            }
            if (Schema::hasColumn('ai_suggestions', 'metadata'))
            {
                $table->dropColumn('metadata');
            }
        });
    }
};
