<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plan_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_question_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->text('answer_text');
            $table->json('answer_data')->nullable(); // Structured data from answer
            $table->integer('confidence_score')->default(100); // AI confidence in answer
            $table->json('ai_analysis')->nullable(); // AI analysis of the answer
            $table->text('ai_suggestions')->nullable(); // Suggestions based on answer

            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();

            $table->index(['plan_question_id']);
            $table->index(['user_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('plan_answers');
    }
};
