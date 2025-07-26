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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->string('name'); // اسم المستخدم
            $table->string('email')->unique(); // البريد الإلكتروني، فريد
            $table->string('password'); // كلمة المرور (مشفرة)
            $table->enum('type', ['beginner', 'owner'])->default('beginner'); // نوع المستخدم
            $table->enum('language', ['en', 'ar'])->default('ar'); // لغة الواجهة المفضلة
            $table->string('phone')->nullable(); // رقم الهاتف (اختياري)
            $table->string('profile_photo')->nullable(); // رابط صورة المستخدم (اختياري)
            $table->timestamp('email_verified_at')->nullable(); // وقت تأكيد البريد
            $table->enum('subscription_type', ['free', 'premium'])->default('free'); // نوع الاشتراك
            $table->timestamps(); // created_at و updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
