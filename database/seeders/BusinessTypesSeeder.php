<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('business_types')->insert([
            [
                'id' => 1,
                'business_type_name' => 'Product-based',
                'business_type_image' => 'Products.jpg',
                'business_type_description' => 'E.g. clothing, food, furniture, etc.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2,
                'business_type_name' => 'Service-based',
                'business_type_image' => 'Services.jpg',
                'business_type_description' => 'Consultancy, repair, design, etc.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 3,
                'business_type_name' => 'Software-or-App',
                'business_type_image' => 'Software.jpg',
                'business_type_description' => 'Web, mobile or desktop application',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 4,
                'business_type_name' => 'Hybrid',
                'business_type_image' => 'Hybrid.jpg',
                'business_type_description' => 'Both physical goods and services',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
