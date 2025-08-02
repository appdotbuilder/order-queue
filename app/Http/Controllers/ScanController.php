<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScanController extends Controller
{
    /**
     * Display the barcode scanner page.
     */
    public function index()
    {
        return Inertia::render('scan/index');
    }

    /**
     * Process scanned store code.
     */
    public function store(Request $request)
    {
        $request->validate([
            'store_code' => 'required|string|exists:stores,code',
        ]);

        $store = Store::where('code', $request->store_code)
            ->where('is_active', true)
            ->with(['categories.products' => function ($query) {
                $query->where('is_available', true)->orderBy('sort_order');
            }])
            ->first();

        if (!$store) {
            return redirect()->route('scan.index')
                ->with('error', 'Store not found or is currently closed.');
        }

        return redirect()->route('orders.create', ['store_code' => $store->code]);
    }
}