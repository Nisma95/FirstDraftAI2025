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
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('subscription_id'); // مرتبط بـ subscriptions.id
            $table->date('payment_date'); // تاريخ الدفع
            $table->string('payment_method'); // طريقة الدفع
            $table->decimal('amount', 10, 2); // المبلغ المدفوع
            $table->string('transaction_id')->unique(); // رقم المعاملة
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending'); // حالة الدفع
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('subscription_id')
                ->references('id')
                ->on('subscriptions')
                ->onDelete('cascade'); // حذف الدفعات عند حذف الاشتراك

            // فهرس للبحث السريع عن المعاملات
            $table->index('transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
