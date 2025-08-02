<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::with(['category', 'store']);

        // Filter by user role
        if (auth()->user()->role === 'store_owner') {
            $storeIds = auth()->user()->ownedStores->pluck('id');
            $query->whereIn('store_id', $storeIds);
        } elseif (auth()->user()->role === 'cashier' && auth()->user()->store_id) {
            $query->where('store_id', auth()->user()->store_id);
        }

        $products = $query->latest()->paginate(20);
        
        return Inertia::render('products/index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $query = Category::query();

        // Filter categories by user role
        if (auth()->user()->role === 'store_owner') {
            $storeIds = auth()->user()->ownedStores->pluck('id');
            $query->whereIn('store_id', $storeIds);
        } elseif (auth()->user()->role === 'cashier' && auth()->user()->store_id) {
            $query->where('store_id', auth()->user()->store_id);
        }

        $categories = $query->get();

        return Inertia::render('products/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'store']);

        return Inertia::render('products/show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $query = Category::query();

        // Filter categories by user role
        if (auth()->user()->role === 'store_owner') {
            $storeIds = auth()->user()->ownedStores->pluck('id');
            $query->whereIn('store_id', $storeIds);
        } elseif (auth()->user()->role === 'cashier' && auth()->user()->store_id) {
            $query->where('store_id', auth()->user()->store_id);
        }

        $categories = $query->get();

        return Inertia::render('products/edit', [
            'product' => $product->load(['category', 'store']),
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()->route('products.show', $product)
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }
}