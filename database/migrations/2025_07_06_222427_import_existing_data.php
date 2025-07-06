<?php
// database/migrations/2025_06_10_170100_import_existing_data.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Import Business Types
        DB::table('business_types')->insert([
            ['id' => 1, 'business_type_name' => 'Product-based', 'business_type_image' => 'Products.jpg', 'business_type_description' => 'E.g. clothing, food, furniture, etc.', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
            ['id' => 2, 'business_type_name' => 'Service-based', 'business_type_image' => 'Services.jpg', 'business_type_description' => 'Consultancy, repair, design, etc.', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
            ['id' => 3, 'business_type_name' => 'Software-or-App', 'business_type_image' => 'Software.jpg', 'business_type_description' => 'Web, mobile or desktop application', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
            ['id' => 4, 'business_type_name' => 'Hybrid', 'business_type_image' => 'Hybrid.jpg', 'business_type_description' => 'Both physical goods and services', 'created_at' => '2025-05-12 20:29:24', 'updated_at' => '2025-05-12 20:29:24'],
        ]);

        // Import Industries
        $industries = [
            [1, 'Technology/Software', 'mobile apps, SaaS platforms, AI/ML services, e-commerce websites, and fintech solutions', 'technology.webp'],
            [2, 'Food & Beverage', 'cafes, food trucks, catering services, meal delivery, and specialty food products', 'Food.webp'],
            [3, 'Health & Wellness', 'fitness centers, wellness clinics, mental health services, nutritional consulting, and personal training.', 'Health.webp'],
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

        // Import User
        DB::table('users')->insert([
            'id' => 1,
            'name' => 'Nisma95',
            'email' => 'nisma95@breezes95.com',
            'password' => '$2y$12$f9e92UEXJ0QEnz4XLbiziusoZss5YIZ4G2575Wk7TJuhH3/Gx3n.6',
            'type' => 'beginner',
            'language' => 'ar',
            'subscription_type' => 'premium',
            'created_at' => '2025-05-10 05:34:10',
            'updated_at' => '2025-05-30 20:29:16'
        ]);

        // Import Projects
        DB::table('projects')->insert([
            [
                'id' => 11,
                'user_id' => 1,
                'name' => 'breezes95',
                'description' => 'BREEZES95: It\'s like having a travel buddy in your pocket! Breezes95 is a web and mobile app that helps you plan trips, find places nearby, connect with other travelers, and discover events.',
                'status' => 'new_project',
                'industry_id' => 1,
                'business_type_id' => 3,
                'main_product_service' => '1. Trip planning\n2. Nearby places\n3. Connect with travelers\n4. Discover events\n5. Explore destinations',
                'project_scale' => 'medium',
                'team_size' => 5,
                'revenue_model' => '1. Subscription Model\n2. In-App Purchases Model\n3. Freemium Model\n4. Ad-Based Model',
                'main_differentiator' => '1. User-Friendly Interface\n2. Enhanced Security Features\n3. Customizable Solutions',
                'target_market' => '1. Solo female travelers\n2. Adventure seekers\n3. Digital nomads\n4. Foodies\n5. Backpackers',
                'location' => 'Global digital presence.',
                'created_at' => '2025-05-21 07:26:02',
                'updated_at' => '2025-05-21 07:26:02'
            ]
        ]);

        // Import Conversations
        DB::table('conversations')->insert([
            'id' => 1,
            'user_id' => 1,
            'title' => 'hey',
            'created_at' => '2025-05-11 18:15:57',
            'updated_at' => '2025-05-11 23:14:32'
        ]);

        // Import some chat messages
        $messages = [
            [4, 1, 'user', 'hey', '2025-05-11 18:22:22', '2025-05-11 18:22:22'],
            [5, 1, 'assistant', 'Hello! How can I assist you today?', '2025-05-11 18:22:24', '2025-05-11 18:22:24'],
        ];

        foreach ($messages as $msg)
        {
            DB::table('chat_messages')->insert([
                'id' => $msg[0],
                'conversation_id' => $msg[1],
                'role' => $msg[2],
                'content' => $msg[3],
                'created_at' => $msg[4],
                'updated_at' => $msg[5]
            ]);
        }

        // Import Subscriptions
        DB::table('subscriptions')->insert([
            'id' => 7,
            'user_id' => 1,
            'plan_type' => 'paid',
            'start_date' => '2025-05-31',
            'end_date' => '2025-07-01',
            'status' => 'active',
            'payment_method' => 'credit_card',
            'amount' => 0.00,
            'created_at' => '2025-05-30 20:33:44',
            'updated_at' => '2025-05-30 20:33:44'
        ]);

        // Import Plans with sample data
        DB::table('plans')->insert([
            'id' => 52,
            'project_id' => 11,
            'title' => 'Breezes95 Travel Companion',
            'summary' => 'AI-generated business plan based on interview questions',
            'status' => 'premium',
            'progress_percentage' => 100,
            'created_at' => '2025-05-27 00:33:17',
            'updated_at' => '2025-05-30 20:29:16'
        ]);
    }

    public function down()
    {
        DB::table('plans')->where('id', 52)->delete();
        DB::table('subscriptions')->where('id', 7)->delete();
        DB::table('chat_messages')->whereIn('id', [4, 5])->delete();
        DB::table('conversations')->where('id', 1)->delete();
        DB::table('projects')->where('id', 11)->delete();
        DB::table('users')->where('id', 1)->delete();
        DB::table('industries')->whereIn('id', [1, 2, 3, 4])->delete();
        DB::table('business_types')->whereIn('id', [1, 2, 3, 4])->delete();
    }
};
