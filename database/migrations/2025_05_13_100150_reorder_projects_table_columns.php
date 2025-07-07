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
        // PostgreSQL doesn't need column reordering - column order doesn't matter
        // Just ensure indexes exist

        Schema::table('projects', function (Blueprint $table)
        {
            // Add indexes if they don't exist
            $table->index('user_id');
            $table->index('industry_id');
            $table->index('business_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table)
        {
            $table->dropIndex(['user_id']);
            $table->dropIndex(['industry_id']);
            $table->dropIndex(['business_type_id']);
        });
    }
};
