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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('goal_id'); // مرتبط بـ goals.id
            $table->string('title'); // عنوان المهمة
            $table->text('description')->nullable(); // وصف المهمة
            $table->date('due_date')->nullable(); // التاريخ المتوقع لإتمام المهمة
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending'); // حالة المهمة
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('goal_id')
                ->references('id')
                ->on('goals')
                ->onDelete('cascade'); // حذف المهام عند حذف الهدف
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
