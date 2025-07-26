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
        Schema::create('audiences', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('plan_id'); // مرتبط بـ plans.id
            $table->string('age_range')->nullable(); // الفئة العمرية
            $table->enum('gender', ['male', 'female', 'both'])->default('both'); // الجنس
            $table->string('location')->nullable(); // الموقع الجغرافي
            $table->text('interests')->nullable(); // الاهتمامات
            $table->string('income_level')->nullable(); // مستوى الدخل
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('plan_id')
                ->references('id')
                ->on('plans')
                ->onDelete('cascade'); // حذف بيانات الجمهور عند حذف الخطة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audiences');
    }
};
