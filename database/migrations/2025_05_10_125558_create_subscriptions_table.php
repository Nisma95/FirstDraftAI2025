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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('user_id'); // مرتبط بـ users.id
            $table->enum('plan_type', ['free', 'paid'])->default('free'); // نوع الاشتراك
            $table->date('start_date'); // تاريخ بداية الاشتراك
            $table->date('end_date')->nullable(); // تاريخ نهاية الاشتراك
            $table->enum('status', ['active', 'inactive', 'expired'])->default('active'); // حالة الاشتراك
            $table->string('payment_method')->nullable(); // طريقة الدفع
            $table->decimal('amount', 10, 2)->nullable(); // المبلغ المدفوع
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade'); // حذف الاشتراكات عند حذف المستخدم
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
