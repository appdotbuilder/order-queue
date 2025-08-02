<?php

namespace Database\Factories;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
        $paymentStatuses = ['pending', 'paid'];
        
        return [
            'order_number' => 'ORD-' . strtoupper(fake()->unique()->bothify('##??##')),
            'total_amount' => fake()->randomFloat(2, 5, 50),
            'status' => fake()->randomElement($statuses),
            'payment_status' => fake()->randomElement($paymentStatuses),
            'payment_method' => fake()->randomElement(['card', 'cash', 'digital_wallet']),
            'payment_reference' => fake()->uuid(),
            'estimated_completion_time' => fake()->numberBetween(5, 30),
            'completed_at' => null,
            'notes' => fake()->optional()->sentence(),
            'customer_id' => User::factory()->create(['role' => 'customer']),
            'store_id' => Store::factory(),
            'cashier_id' => null,
        ];
    }
}