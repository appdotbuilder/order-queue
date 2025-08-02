<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $products = [
            // Coffee
            ['name' => 'Espresso', 'price' => 2.50, 'prep_time' => 2],
            ['name' => 'Americano', 'price' => 3.00, 'prep_time' => 3],
            ['name' => 'Cappuccino', 'price' => 4.00, 'prep_time' => 4],
            ['name' => 'Latte', 'price' => 4.50, 'prep_time' => 4],
            ['name' => 'Mocha', 'price' => 5.00, 'prep_time' => 5],
            
            // Food
            ['name' => 'Croissant', 'price' => 3.50, 'prep_time' => 2],
            ['name' => 'Blueberry Muffin', 'price' => 3.00, 'prep_time' => 1],
            ['name' => 'Club Sandwich', 'price' => 8.50, 'prep_time' => 8],
            ['name' => 'Caesar Salad', 'price' => 7.00, 'prep_time' => 6],
            ['name' => 'Chicken Wrap', 'price' => 9.00, 'prep_time' => 10],
            
            // Drinks
            ['name' => 'Fresh Orange Juice', 'price' => 4.00, 'prep_time' => 3],
            ['name' => 'Smoothie Bowl', 'price' => 6.50, 'prep_time' => 7],
            ['name' => 'Iced Tea', 'price' => 2.50, 'prep_time' => 2],
            ['name' => 'Milkshake', 'price' => 5.50, 'prep_time' => 5],
        ];

        $product = fake()->randomElement($products);

        return [
            'name' => $product['name'],
            'description' => fake()->sentence(),
            'price' => $product['price'],
            'image_url' => null,
            'preparation_time' => $product['prep_time'],
            'is_available' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(1, 20),
            'category_id' => Category::factory(),
            'store_id' => Store::factory(),
        ];
    }
}