<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class IndustriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear the table first to avoid duplicates
        DB::table('industries')->truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $industries = [
            [
                'id' => 1,
                'industry_name' => 'Technology/Software',
                'industry_description' => 'mobile apps, SaaS platforms, AI/ML services, e-commerce websites, and fintech solutions',
                'industry_image' => 'technology.webp',
                'created_at' => '2025-01-08 00:15:10',
                'updated_at' => '2025-01-08 00:15:10',
            ],
            [
                'id' => 2,
                'industry_name' => 'Food & Beverage',
                'industry_description' => 'cafes, food trucks, catering services, meal delivery, and specialty food products',
                'industry_image' => 'Food.webp',
                'created_at' => '2025-01-08 00:15:10',
                'updated_at' => '2025-01-08 00:15:10',
            ],
            [
                'id' => 3,
                'industry_name' => 'Health & Wellness',
                'industry_description' => 'fitness centers, wellness clinics, mental health services, nutritional consulting, and personal training.',
                'industry_image' => 'Health.webp',
                'created_at' => '2025-01-08 00:15:10',
                'updated_at' => '2025-01-08 00:15:10',
            ],
            [
                'id' => 4,
                'industry_name' => 'Pets',
                'industry_description' => 'pet grooming services, veterinary clinics, pet training, pet boarding, pet products, and pet accessories',
                'industry_image' => 'Pets.webp',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert the data
        DB::table('industries')->insert($industries);

        // Reset the auto increment to 5 (next ID after the last one)
        DB::statement('ALTER TABLE industries AUTO_INCREMENT = 5');
    }
}
