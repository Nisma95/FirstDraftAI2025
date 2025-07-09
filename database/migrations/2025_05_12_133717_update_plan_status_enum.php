<?php
// File: database/migrations/2025_05_12_133717_update_plan_status_enum.php

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
        // SQLite doesn't support ALTER COLUMN with constraints
        // We'll recreate the table with the new enum values

        // First, create a new temporary table with the updated enum
        Schema::create('plans_temp', function (Blueprint $table)
        {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('ai_analysis')->nullable();
            $table->string('pdf_path')->nullable();
            $table->enum('status', ['draft', 'generating', 'partially_completed', 'completed', 'premium', 'failed'])->default('draft');
            $table->integer('progress_percentage')->default(0);
            $table->string('questioning_status')->nullable();
            $table->text('ai_conversation_context')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->index('questioning_status');
        });

        // Copy data from old table to new table
        DB::statement('INSERT INTO plans_temp SELECT * FROM plans');

        // Drop old table
        Schema::dropIfExists('plans');

        // Rename new table
        Schema::rename('plans_temp', 'plans');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Recreate with original enum values
        Schema::create('plans_temp', function (Blueprint $table)
        {
            $table->id();
            $table->unsignedBigInteger('project_id');
            $table->string('title');
            $table->text('summary')->nullable();
            $table->longText('ai_analysis')->nullable();
            $table->string('pdf_path')->nullable();
            $table->enum('status', ['draft', 'completed', 'premium'])->default('draft');
            $table->integer('progress_percentage')->default(0);
            $table->string('questioning_status')->nullable();
            $table->text('ai_conversation_context')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->index('questioning_status');
        });

        // Copy data (only compatible statuses)
        DB::statement("INSERT INTO plans_temp SELECT id, project_id, title, summary, ai_analysis, pdf_path, 
                      CASE 
                        WHEN status IN ('generating', 'partially_completed', 'failed') THEN 'draft'
                        ELSE status 
                      END as status,
                      progress_percentage, questioning_status, ai_conversation_context, created_at, updated_at 
                      FROM plans");

        Schema::dropIfExists('plans');
        Schema::rename('plans_temp', 'plans');
    }
};
