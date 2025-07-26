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
        Schema::table('projects', function (Blueprint $table) {
            $table->text('main_product_service')->nullable();
            $table->integer('team_size')->nullable();
            $table->enum('project_scale', ['small', 'medium', 'large'])->nullable();
            $table->string('revenue_model')->nullable();
            $table->text('main_differentiator')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn([
                'main_product_service',
                'team_size',
                'project_scale',
                'revenue_model',
                'main_differentiator'
            ]);
        });
    }
};
