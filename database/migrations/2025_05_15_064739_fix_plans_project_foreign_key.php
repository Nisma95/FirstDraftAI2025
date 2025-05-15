<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('plans', function (Blueprint $table) {
            // Drop the old foreign key constraint
            $table->dropForeign('plans_project_id_foreign');

            // Add the new foreign key constraint pointing to the correct table
            $table->foreign('project_id')
                ->references('id')
                ->on('projects')  // Changed from 'projects_old' to 'projects'
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('plans', function (Blueprint $table) {
            // Revert back to the old constraint (if needed)
            $table->dropForeign(['project_id']);
            $table->foreign('project_id')
                ->references('id')
                ->on('projects_old')
                ->onDelete('cascade');
        });
    }
};
