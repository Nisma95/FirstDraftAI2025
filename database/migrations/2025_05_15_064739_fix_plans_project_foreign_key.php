<?php
// File: database/migrations/2025_05_15_064739_fix_plans_project_foreign_key.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // SQLite doesn't support dropping foreign keys by name
        // Since the foreign key already exists and points to the correct table,
        // we don't need to do anything here for SQLite

        // For other databases (PostgreSQL/MySQL), you would drop and recreate
        if (config('database.default') !== 'sqlite')
        {
            Schema::table('plans', function (Blueprint $table)
            {
                $table->dropForeign('plans_project_id_foreign');
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            });
        }

        // For SQLite, the foreign key constraint is already correct
        // from the original create_plans_table migration
    }

    public function down()
    {
        // Similarly, for rollback, only do something for non-SQLite databases
        if (config('database.default') !== 'sqlite')
        {
            Schema::table('plans', function (Blueprint $table)
            {
                $table->dropForeign(['project_id']);
                // Note: We can't really revert to 'projects_old' since that table doesn't exist
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->onDelete('cascade');
            });
        }
    }
};
