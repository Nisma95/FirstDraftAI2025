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
        Schema::create('ai_suggestions', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('plan_id'); // مرتبط بـ plans.id
            $table->enum('suggestion_type', ['business', 'marketing', 'financial', 'other']); // نوع الاقتراح
            $table->text('suggestion_content'); // نص الاقتراح
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('plan_id')
                ->references('id')
                ->on('plans')
                ->onDelete('cascade'); // حذف الاقتراحات عند حذف الخطة

            // فهرس للبحث السريع حسب نوع الاقتراح
            $table->index('suggestion_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_suggestions');
    }
};
