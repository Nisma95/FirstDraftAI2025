<?php
// File: database/migrations/2025_07_06_222427_import_existing_data.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Import Business Types (only if they don't exist)
        if (DB::table('business_types')->count() == 0)
        {
            DB::table('business_types')->insert([
                ['id' => 1, 'business_type_name' => 'Product-based', 'business_type_image' => 'Products.jpg', 'business_type_description' => 'E.g. clothing, food, furniture, etc.', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
                ['id' => 2, 'business_type_name' => 'Service-based', 'business_type_image' => 'Services.jpg', 'business_type_description' => 'Consultancy, repair, design, etc.', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
                ['id' => 3, 'business_type_name' => 'Software-or-App', 'business_type_image' => 'Software.jpg', 'business_type_description' => 'Web, mobile or desktop application', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
                ['id' => 4, 'business_type_name' => 'Hybrid', 'business_type_image' => 'Hybrid.jpg', 'business_type_description' => 'Both physical goods and services', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
            ]);
        }

        // Import Industries (only if they don't exist)
        if (DB::table('industries')->count() == 0)
        {
            $industries = [
                [1, 'Technology/Software', 'mobile apps, SaaS platforms, AI/ML services, e-commerce websites, and fintech solutions', 'technology.webp'],
                [2, 'Food & Beverage', 'cafes, food trucks, catering services, meal delivery, and specialty food products', 'Food.webp'],
                [3, 'Health & Wellness', 'fitness centers, wellness clinics, mental health services, nutritional consulting, and personal training', 'Health.webp'],
                [4, 'Pets', 'pet grooming services, veterinary clinics, pet training, pet boarding, pet products, and pet accessories', 'Pets.webp'],
            ];

            foreach ($industries as $industry)
            {
                DB::table('industries')->insert([
                    'id' => $industry[0],
                    'industry_name' => $industry[1],
                    'industry_description' => $industry[2],
                    'industry_image' => $industry[3],
                    'created_at' => '2025-01-07 16:15:10',
                    'updated_at' => '2025-01-07 16:15:10'
                ]);
            }
        }

        // SKIP USER IMPORT - User already exists from manual creation
        // Check if the test user already exists and update if needed
        $existingUser = DB::table('users')->where('email', 'nisma95@nisma95.com')->first();
        if ($existingUser)
        {
            // Update the existing user with additional data if needed
            DB::table('users')->where('id', $existingUser->id)->update([
                'type' => 'beginner',
                'language' => 'ar',
                'subscription_type' => 'premium',
                'updated_at' => now()
            ]);
        }

        // Skip other data imports that depend on specific user ID for now
        // This is sample data that's not critical for testing authentication
    }

    public function down()
    {
        // Only remove data we added, not the manually created user
        DB::table('industries')->whereIn('id', [1, 2, 3, 4])->delete();
        DB::table('business_types')->whereIn('id', [1, 2, 3, 4])->delete();
    }
};
