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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('contract_type')->nullable();
            $table->longText('content'); // AI generated contract content
            $table->json('contract_data')->nullable(); // Store form data used to generate contract
            $table->enum('status', ['draft', 'completed', 'signed'])->default('draft');
            $table->string('file_path')->nullable(); // Path to generated PDF
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
