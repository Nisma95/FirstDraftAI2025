<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePlansTableStructure extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            // Add new columns to store file paths
            $table->string('ai_analysis_path')->nullable()->after('ai_analysis');
            $table->string('conversation_file_path')->nullable()->after('ai_conversation_context');

            // Remove questioning_status as requested
            $table->dropColumn('questioning_status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('plans', function (Blueprint $table) {
            // Add back questioning_status column
            $table->enum('questioning_status', ['pending', 'active', 'completed', 'paused'])->nullable()->after('progress_percentage');

            // Remove the new file path columns
            $table->dropColumn('ai_analysis_path');
            $table->dropColumn('conversation_file_path');
        });
    }
}
