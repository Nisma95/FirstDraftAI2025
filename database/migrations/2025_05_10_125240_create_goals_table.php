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
        Schema::create('goals', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('plan_id'); // مرتبط بـ plans.id
            $table->string('title'); // عنوان الهدف
            $table->text('description')->nullable(); // شرح الهدف
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium'); // أولوية التنفيذ
            $table->date('due_date')->nullable(); // التاريخ المتوقع للإنهاء
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending'); // حالة التقدم
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('plan_id')
                ->references('id')
                ->on('plans')
                ->onDelete('cascade'); // حذف الأهداف عند حذف الخطة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goals');
    }
};
