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
        Schema::create('markets', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('plan_id'); // مرتبط بـ plans.id
            $table->string('industry')->nullable(); // نوع الصناعة أو القطاع
            $table->text('target_market')->nullable(); // وصف السوق المستهدف
            $table->string('market_size')->nullable(); // حجم السوق
            $table->text('trends')->nullable(); // الاتجاهات الحالية
            $table->text('competitors')->nullable(); // المنافسين الرئيسيين
            $table->text('competitive_advantage')->nullable(); // الميزة التنافسية
            $table->text('risks')->nullable(); // التحديات والمخاطر
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('plan_id')
                ->references('id')
                ->on('plans')
                ->onDelete('cascade'); // حذف بيانات السوق عند حذف الخطة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('markets');
    }
};
