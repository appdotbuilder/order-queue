<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderQueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo store owner
        $storeOwner = User::create([
            'name' => 'John Cafe Owner',
            'email' => 'owner@example.com',
            'password' => bcrypt('password'),
            'role' => 'store_owner',
        ]);

        // Create demo store
        $store = Store::create([
            'name' => 'The Coffee Corner',
            'code' => 'COFFEE01',
            'description' => 'Your favorite neighborhood coffee shop',
            'address' => '123 Main Street, Downtown',
            'phone' => '+1-555-0123',
            'opening_time' => '07:00:00',
            'closing_time' => '20:00:00',
            'is_active' => true,
            'owner_id' => $storeOwner->id,
        ]);

        // Create cashier for the store
        $cashier = User::create([
            'name' => 'Sarah Cashier',
            'email' => 'cashier@example.com',
            'password' => bcrypt('password'),
            'role' => 'cashier',
            'store_id' => $store->id,
        ]);

        // Create demo customers
        $customers = [];
        for ($i = 1; $i <= 5; $i++) {
            $customers[] = User::create([
                'name' => "Customer $i",
                'email' => "customer$i@example.com",
                'password' => bcrypt('password'),
                'role' => 'customer',
            ]);
        }

        // Create categories
        $categories = [
            ['name' => 'Coffee', 'icon' => '☕', 'description' => 'Fresh brewed coffee and espresso drinks', 'sort_order' => 1],
            ['name' => 'Tea', 'icon' => '🫖', 'description' => 'Premium tea selection', 'sort_order' => 2],
            ['name' => 'Cold Drinks', 'icon' => '🧊', 'description' => 'Refreshing cold beverages', 'sort_order' => 3],
            ['name' => 'Pastries', 'icon' => '🥐', 'description' => 'Fresh baked pastries and desserts', 'sort_order' => 4],
            ['name' => 'Sandwiches', 'icon' => '🥪', 'description' => 'Delicious sandwiches and wraps', 'sort_order' => 5],
            ['name' => 'Salads', 'icon' => '🥗', 'description' => 'Fresh and healthy salads', 'sort_order' => 6],
        ];

        $createdCategories = [];
        foreach ($categories as $categoryData) {
            $createdCategories[] = Category::create([
                ...$categoryData,
                'is_active' => true,
                'store_id' => $store->id,
            ]);
        }

        // Create products for each category
        $products = [
            // Coffee
            ['name' => 'Espresso', 'price' => 2.50, 'prep_time' => 2, 'category' => 0],
            ['name' => 'Americano', 'price' => 3.00, 'prep_time' => 3, 'category' => 0],
            ['name' => 'Cappuccino', 'price' => 4.00, 'prep_time' => 4, 'category' => 0],
            ['name' => 'Latte', 'price' => 4.50, 'prep_time' => 4, 'category' => 0],
            ['name' => 'Mocha', 'price' => 5.00, 'prep_time' => 5, 'category' => 0],
            
            // Tea
            ['name' => 'Earl Grey', 'price' => 2.50, 'prep_time' => 3, 'category' => 1],
            ['name' => 'Green Tea', 'price' => 2.50, 'prep_time' => 3, 'category' => 1],
            ['name' => 'Chamomile', 'price' => 2.75, 'prep_time' => 3, 'category' => 1],
            
            // Cold Drinks
            ['name' => 'Iced Coffee', 'price' => 3.50, 'prep_time' => 3, 'category' => 2],
            ['name' => 'Fresh Orange Juice', 'price' => 4.00, 'prep_time' => 2, 'category' => 2],
            ['name' => 'Smoothie', 'price' => 5.50, 'prep_time' => 4, 'category' => 2],
            
            // Pastries
            ['name' => 'Croissant', 'price' => 3.50, 'prep_time' => 2, 'category' => 3],
            ['name' => 'Blueberry Muffin', 'price' => 3.00, 'prep_time' => 1, 'category' => 3],
            ['name' => 'Chocolate Chip Cookie', 'price' => 2.50, 'prep_time' => 1, 'category' => 3],
            
            // Sandwiches
            ['name' => 'Club Sandwich', 'price' => 8.50, 'prep_time' => 8, 'category' => 4],
            ['name' => 'BLT', 'price' => 7.00, 'prep_time' => 6, 'category' => 4],
            ['name' => 'Chicken Wrap', 'price' => 9.00, 'prep_time' => 10, 'category' => 4],
            
            // Salads
            ['name' => 'Caesar Salad', 'price' => 7.00, 'prep_time' => 6, 'category' => 5],
            ['name' => 'Greek Salad', 'price' => 8.00, 'prep_time' => 5, 'category' => 5],
        ];

        $createdProducts = [];
        foreach ($products as $index => $productData) {
            $createdProducts[] = Product::create([
                'name' => $productData['name'],
                'description' => "Delicious {$productData['name']} made fresh daily",
                'price' => $productData['price'],
                'preparation_time' => $productData['prep_time'],
                'is_available' => true,
                'sort_order' => $index + 1,
                'category_id' => $createdCategories[$productData['category']]->id,
                'store_id' => $store->id,
            ]);
        }

        // Create sample orders
        $orderStatuses = [
            ['status' => 'pending', 'payment_status' => 'pending'],
            ['status' => 'confirmed', 'payment_status' => 'paid'],
            ['status' => 'preparing', 'payment_status' => 'paid'],
            ['status' => 'ready', 'payment_status' => 'paid'],
            ['status' => 'completed', 'payment_status' => 'paid'],
        ];

        for ($i = 0; $i < 10; $i++) {
            $customer = $customers[random_int(0, count($customers) - 1)];
            $orderStatus = $orderStatuses[random_int(0, count($orderStatuses) - 1)];
            
            $order = Order::create([
                'order_number' => 'ORD-' . str_pad((string)($i + 1), 4, '0', STR_PAD_LEFT),
                'total_amount' => 0, // Will be calculated after items
                'status' => $orderStatus['status'],
                'payment_status' => $orderStatus['payment_status'],
                'payment_method' => 'card',
                'payment_reference' => 'ref_' . uniqid(),
                'estimated_completion_time' => random_int(5, 25),
                'customer_id' => $customer->id,
                'store_id' => $store->id,
                'cashier_id' => $orderStatus['status'] !== 'pending' ? $cashier->id : null,
            ]);

            // Add 1-4 items to each order
            $totalAmount = 0;
            $itemCount = random_int(1, 4);
            
            for ($j = 0; $j < $itemCount; $j++) {
                $product = $createdProducts[random_int(0, count($createdProducts) - 1)];
                $quantity = random_int(1, 3);
                $totalPrice = (float)$product->price * $quantity;
                $totalAmount += $totalPrice;

                OrderItem::create([
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'total_price' => $totalPrice,
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                ]);
            }

            $order->update(['total_amount' => $totalAmount]);
        }
    }
}