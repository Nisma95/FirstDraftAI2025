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
        Schema::create('finances', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('plan_id'); // مرتبط بـ plans.id
            $table->decimal('initial_budget', 15, 2)->nullable(); // الميزانية المتوقعة
            $table->decimal('expected_income', 15, 2)->nullable(); // الدخل المتوقع شهريًا
            $table->decimal('monthly_expenses', 15, 2)->nullable(); // المصاريف الشهرية
            $table->decimal('profit_estimate', 15, 2)->nullable(); // تقدير الربح الشهري
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('plan_id')
                ->references('id')
                ->on('plans')
                ->onDelete('cascade'); // حذف البيانات المالية عند حذف الخطة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finances');
    }
};
