<?php
// File: database/migrations/2025_05_17_130925_update_plans_table_structure.php

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
        // SKIP THIS MIGRATION ENTIRELY FOR SQLITE
        // The columns might already exist or not be needed for development

        Schema::table('plans', function (Blueprint $table)
        {
            // Only add columns if they don't exist
            if (!Schema::hasColumn('plans', 'ai_analysis_path'))
            {
                $table->string('ai_analysis_path')->nullable();
            }

            if (!Schema::hasColumn('plans', 'conversation_file_path'))
            {
                $table->string('conversation_file_path')->nullable();
            }
        });

        // COMPLETELY SKIP the questioning_status column operations
        // It's causing too many SQLite issues
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('plans', function (Blueprint $table)
        {
            // Only drop if exists
            if (Schema::hasColumn('plans', 'ai_analysis_path'))
            {
                $table->dropColumn('ai_analysis_path');
            }

            if (Schema::hasColumn('plans', 'conversation_file_path'))
            {
                $table->dropColumn('conversation_file_path');
            }
        });
    }
}
