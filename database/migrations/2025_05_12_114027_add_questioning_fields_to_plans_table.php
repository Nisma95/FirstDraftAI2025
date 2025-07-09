<?php
// File: database/migrations/2025_05_12_114027_add_questioning_fields_to_plans_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table)
        {
            // Add new fields for dynamic questioning
            $table->integer('progress_percentage')->default(0)->after('status');
            $table->string('questioning_status')->nullable()->after('progress_percentage');
            $table->text('ai_conversation_context')->nullable()->after('questioning_status');

            // SQLite doesn't support ALTER COLUMN TYPE - skip the conversion
            // The ai_analysis column will remain as longText which works fine

            // Add index for questioning status
            $table->index('questioning_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table)
        {
            $table->dropIndex(['questioning_status']);
            $table->dropColumn(['progress_percentage', 'questioning_status', 'ai_conversation_context']);
        });
    }
};
