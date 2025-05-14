<?php

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
        Schema::table('plans', function (Blueprint $table) {
            // Add new fields for dynamic questioning
            $table->integer('progress_percentage')->default(0)->after('status');
            $table->enum('questioning_status', ['pending', 'active', 'completed', 'paused'])->nullable()->after('progress_percentage');
            $table->json('ai_conversation_context')->nullable()->after('questioning_status');

            // Convert ai_analysis to JSON if it's not already
            // Note: This might need adjustment based on your current data
            $table->json('ai_analysis')->change();

            // Add index for questioning status
            $table->index('questioning_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['progress_percentage', 'questioning_status', 'ai_conversation_context']);
            $table->dropIndex(['questioning_status']);
        });
    }
};
