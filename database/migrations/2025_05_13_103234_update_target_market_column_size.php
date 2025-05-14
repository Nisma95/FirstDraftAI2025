<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            // Change from VARCHAR(255) to TEXT or increase VARCHAR size
            $table->text('target_market')->change();
            // OR if you prefer a specific size:
            // $table->string('target_market', 1000)->change();
        });
    }

    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            // Revert back if needed
            $table->string('target_market', 255)->change();
        });
    }
};
