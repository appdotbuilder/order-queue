<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Store>
 */
class StoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company() . ' ' . fake()->randomElement(['Cafe', 'Restaurant', 'Diner', 'Bistro']),
            'code' => strtoupper(fake()->unique()->lexify('??????')),
            'description' => fake()->sentence(),
            'address' => fake()->address(),
            'phone' => fake()->phoneNumber(),
            'opening_time' => '08:00:00',
            'closing_time' => '22:00:00',
            'is_active' => true,
            'owner_id' => User::factory()->create(['role' => 'store_owner']),
        ];
    }
}