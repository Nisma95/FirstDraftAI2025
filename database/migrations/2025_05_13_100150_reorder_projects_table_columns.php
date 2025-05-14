<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ننسخ الجدول بالترتيب الجديد
        DB::statement('
            CREATE TABLE projects_new AS
            SELECT 
                id,
                user_id,
                name,
                description,
                status,
                industry_id,
                business_type_id,
                main_product_service,
                project_scale,
                team_size,
                revenue_model,
                main_differentiator,
                target_market,
                location,
                created_at,
                updated_at
            FROM projects
        ');

        // نغير اسم الجدول القديم
        Schema::rename('projects', 'projects_old');

        // نغير اسم الجدول الجديد ليصبح الأصلي
        Schema::rename('projects_new', 'projects');

        // نضيف المفاتيح والفهارس مرة تانية
        DB::statement('ALTER TABLE projects MODIFY id bigint(20) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY');
        DB::statement('ALTER TABLE projects ADD INDEX(user_id)');
        DB::statement('ALTER TABLE projects ADD INDEX(industry_id)');
        DB::statement('ALTER TABLE projects ADD INDEX(business_type_id)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // نحذف الجدول الحالي
        Schema::dropIfExists('projects');

        // نعيد تسمية الجدول القديم
        Schema::rename('projects_old', 'projects');
    }
};
