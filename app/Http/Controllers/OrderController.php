<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Order::with(['customer', 'store', 'items.product']);

        // Filter by user role
        if (auth()->user()->role === 'customer') {
            $query->where('customer_id', auth()->id());
        } elseif (auth()->user()->role === 'cashier' && auth()->user()->store_id) {
            $query->where('store_id', auth()->user()->store_id);
        } elseif (auth()->user()->role === 'store_owner') {
            $storeIds = auth()->user()->ownedStores->pluck('id');
            $query->whereIn('store_id', $storeIds);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(15);
        
        return Inertia::render('orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['status'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $store = null;
        if ($request->filled('store_code')) {
            $store = Store::where('code', $request->store_code)
                ->with(['categories.products' => function ($query) {
                    $query->where('is_available', true)->orderBy('sort_order');
                }])
                ->first();
        }

        return Inertia::render('orders/create', [
            'store' => $store,
            'store_code' => $request->store_code
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        
        // Generate order number
        $orderNumber = 'ORD-' . str_pad((string)(Order::count() + 1), 4, '0', STR_PAD_LEFT);
        
        $order = Order::create([
            'order_number' => $orderNumber,
            'total_amount' => $validated['total_amount'],
            'status' => 'pending',
            'payment_status' => 'pending',
            'estimated_completion_time' => $validated['estimated_completion_time'] ?? 15,
            'notes' => $validated['notes'] ?? null,
            'customer_id' => auth()->id(),
            'store_id' => $validated['store_id'],
        ]);

        // Create order items
        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total_price' => $item['quantity'] * $item['unit_price'],
                'special_instructions' => $item['special_instructions'] ?? null,
                'product_id' => $item['product_id'],
            ]);
        }

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        $order->load(['customer', 'store', 'cashier', 'items.product.category']);

        return Inertia::render('orders/show', [
            'order' => $order
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        return Inertia::render('orders/edit', [
            'order' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateOrderRequest $request, Order $order)
    {
        $validated = $request->validated();
        
        // Update cashier if status is being changed from pending
        if ($order->status === 'pending' && $validated['status'] !== 'pending') {
            $validated['cashier_id'] = auth()->id();
        }

        // Set completed timestamp if status is completed
        if ($validated['status'] === 'completed') {
            $validated['completed_at'] = now();
        }

        $order->update($validated);

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('orders.index')
            ->with('success', 'Order deleted successfully.');
    }
}