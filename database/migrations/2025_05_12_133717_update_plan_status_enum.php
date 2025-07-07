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
        Schema::table('plans', function (Blueprint $table)
        {
            // Update status column to include new values
            DB::statement("ALTER TABLE plans DROP CONSTRAINT IF EXISTS plans_status_check");
            DB::statement("ALTER TABLE plans ALTER COLUMN status TYPE varchar(255)");
            DB::statement("ALTER TABLE plans ADD CONSTRAINT plans_status_check CHECK (status IN ('draft', 'generating', 'partially_completed', 'completed', 'premium', 'failed'))");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table)
        {
            $table->enum('status', ['draft', 'completed', 'premium'])->change();
        });
    }
};
