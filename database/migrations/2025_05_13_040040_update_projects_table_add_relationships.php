<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateProjectsTableAddRelationships extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop the existing industry column if it exists
            if (Schema::hasColumn('projects', 'industry')) {
                $table->dropColumn('industry');
            }

            // Add foreign key references
            $table->unsignedInteger('industry_id')->nullable()->after('user_id');
            $table->unsignedBigInteger('business_type_id')->nullable()->after('industry_id');

            // Add foreign key constraints
            $table->foreign('industry_id')->references('id')->on('industries')->onDelete('set null');
            $table->foreign('business_type_id')->references('id')->on('business_types')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('projects', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['industry_id']);
            $table->dropForeign(['business_type_id']);

            // Drop the columns
            $table->dropColumn(['industry_id', 'business_type_id']);

            // Re-add the original industry column
            $table->string('industry')->nullable();
        });
    }
}
