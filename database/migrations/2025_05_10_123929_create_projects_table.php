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
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); // BIGINT primary key, auto-increment
            $table->unsignedBigInteger('user_id'); // مرتبط بـ users.id
            $table->string('name'); // اسم المشروع
            $table->text('description')->nullable(); // وصف عام للمشروع
            $table->enum('status', ['idea', 'in_progress', 'launched'])->default('idea'); // حالة المشروع
            $table->string('industry')->nullable(); // مجال المشروع
            $table->string('target_market')->nullable(); // الجمهور المستهدف
            $table->string('location')->nullable(); // الموقع الجغرافي
            $table->timestamps(); // created_at و updated_at

            // إضافة مفتاح خارجي
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade'); // حذف المشاريع عند حذف المستخدم
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
