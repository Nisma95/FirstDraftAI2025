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
        Schema::table('contracts', function (Blueprint $table) {
            // Change contract_type from text to string and make it not nullable
            $table->string('contract_type')->nullable(false)->change();

            // Update status enum to include 'cancelled'
            $table->dropColumn('status');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->enum('status', ['draft', 'completed', 'signed', 'cancelled'])->default('draft');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->text('contract_type')->nullable()->change();
            $table->enum('status', ['draft', 'completed', 'signed'])->default('draft');
        });
    }
};
