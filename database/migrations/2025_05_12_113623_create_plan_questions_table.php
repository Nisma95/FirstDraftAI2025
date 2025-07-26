<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plan_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_question_id')->nullable()->constrained('plan_questions')->onDelete('cascade');

            $table->string('question_type'); // business_model, target_market, etc.
            $table->text('question_text');
            $table->json('question_context')->nullable(); // Additional context for AI
            $table->json('validation_rules')->nullable(); // Validation rules for answers

            $table->integer('order')->default(0);
            $table->boolean('is_required')->default(true);
            $table->enum('status', ['pending', 'answered', 'skipped'])->default('pending');

            $table->json('ai_metadata')->nullable(); // Store AI generation data
            $table->timestamp('ai_generated_at')->nullable();

            $table->timestamps();

            $table->index(['plan_id', 'status']);
            $table->index(['plan_id', 'order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('plan_questions');
    }
};
