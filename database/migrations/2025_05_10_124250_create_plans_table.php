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
        Schema::create('plans', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('project_id'); // مرتبط بـ projects.id
            $table->string('title'); // عنوان الخطة
            $table->text('summary')->nullable(); // ملخص عام لخطة العمل
            $table->longText('ai_analysis')->nullable(); // تحليل الذكاء الاصطناعي
            $table->string('pdf_path')->nullable(); // مسار ملف PDF
            $table->enum('status', ['draft', 'completed', 'premium'])->default('draft'); // حالة الخطة
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('project_id')
                ->references('id')
                ->on('projects')
                ->onDelete('cascade'); // حذف الخطط عند حذف المشروع
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
