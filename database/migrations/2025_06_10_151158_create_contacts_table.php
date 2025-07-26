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
        Schema::create('contacts', function (Blueprint $table)
        {
            $table->id();
            $table->string('name');
            $table->string('company')->nullable();
            $table->string('email');
            $table->text('message');
            $table->enum('status', ['new', 'read', 'replied', 'archived'])->default('new');
            $table->json('metadata')->nullable(); // For storing additional data like IP, user agent, etc.
            $table->timestamp('read_at')->nullable();
            $table->timestamp('replied_at')->nullable();
            $table->timestamps();

            // Add indexes for performance
            $table->index('status');
            $table->index('email');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
