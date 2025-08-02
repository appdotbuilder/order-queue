<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $data = [];

        if ($user->role === 'customer') {
            $data = $this->getCustomerDashboard($user);
        } elseif ($user->role === 'store_owner') {
            $data = $this->getStoreOwnerDashboard($user);
        } elseif ($user->role === 'cashier') {
            $data = $this->getCashierDashboard($user);
        }

        return Inertia::render('dashboard', $data);
    }

    /**
     * Get customer dashboard data.
     */
    protected function getCustomerDashboard($user): array
    {
        $recentOrders = Order::where('customer_id', $user->id)
            ->with(['store', 'items.product'])
            ->latest()
            ->limit(5)
            ->get();

        $activeOrders = Order::where('customer_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed', 'preparing', 'ready'])
            ->with(['store', 'items.product'])
            ->latest()
            ->get();

        return [
            'role' => 'customer',
            'stats' => [
                'total_orders' => Order::where('customer_id', $user->id)->count(),
                'active_orders' => $activeOrders->count(),
                'completed_orders' => Order::where('customer_id', $user->id)->where('status', 'completed')->count(),
            ],
            'recent_orders' => $recentOrders,
            'active_orders' => $activeOrders,
        ];
    }

    /**
     * Get store owner dashboard data.
     */
    protected function getStoreOwnerDashboard($user): array
    {
        $storeIds = $user->ownedStores->pluck('id');

        $todayOrders = Order::whereIn('store_id', $storeIds)
            ->whereDate('created_at', today())
            ->with(['customer', 'items.product'])
            ->latest()
            ->get();

        $pendingOrders = Order::whereIn('store_id', $storeIds)
            ->where('status', 'pending')
            ->with(['customer', 'items.product'])
            ->latest()
            ->get();

        return [
            'role' => 'store_owner',
            'stats' => [
                'total_stores' => $user->ownedStores->count(),
                'total_orders' => Order::whereIn('store_id', $storeIds)->count(),
                'today_orders' => $todayOrders->count(),
                'pending_orders' => $pendingOrders->count(),
                'today_revenue' => $todayOrders->sum('total_amount'),
            ],
            'stores' => $user->ownedStores->load('orders'),
            'today_orders' => $todayOrders->take(10),
            'pending_orders' => $pendingOrders,
        ];
    }

    /**
     * Get cashier dashboard data.
     */
    protected function getCashierDashboard($user): array
    {
        if (!$user->store_id) {
            return ['role' => 'cashier', 'error' => 'No store assigned'];
        }

        $todayOrders = Order::where('store_id', $user->store_id)
            ->whereDate('created_at', today())
            ->with(['customer', 'items.product'])
            ->latest()
            ->get();

        $queueOrders = Order::where('store_id', $user->store_id)
            ->whereIn('status', ['pending', 'confirmed', 'preparing'])
            ->with(['customer', 'items.product'])
            ->orderBy('created_at')
            ->get();

        return [
            'role' => 'cashier',
            'stats' => [
                'today_orders' => $todayOrders->count(),
                'queue_orders' => $queueOrders->count(),
                'completed_today' => $todayOrders->where('status', 'completed')->count(),
                'today_revenue' => $todayOrders->sum('total_amount'),
            ],
            'store' => $user->store->load(['products', 'categories']),
            'queue_orders' => $queueOrders,
            'recent_orders' => $todayOrders->take(10),
        ];
    }
}