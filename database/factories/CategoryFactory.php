<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            ['name' => 'Coffee', 'icon' => '☕', 'description' => 'Fresh brewed coffee and espresso drinks'],
            ['name' => 'Tea', 'icon' => '🫖', 'description' => 'Premium tea selection'],
            ['name' => 'Cold Drinks', 'icon' => '🧊', 'description' => 'Refreshing cold beverages'],
            ['name' => 'Pastries', 'icon' => '🥐', 'description' => 'Fresh baked pastries and desserts'],
            ['name' => 'Sandwiches', 'icon' => '🥪', 'description' => 'Delicious sandwiches and wraps'],
            ['name' => 'Salads', 'icon' => '🥗', 'description' => 'Fresh and healthy salads'],
        ];

        $category = fake()->randomElement($categories);

        return [
            'name' => $category['name'],
            'description' => $category['description'],
            'icon' => $category['icon'],
            'sort_order' => fake()->numberBetween(1, 10),
            'is_active' => true,
            'store_id' => Store::factory(),
        ];
    }
}