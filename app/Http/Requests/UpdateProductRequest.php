<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        $product = $this->product;
        
        // Store owners can update products in their stores
        if ($user->role === 'store_owner' && $user->ownedStores->contains($product->store)) {
            return true;
        }
        
        // Cashiers can update products in their store
        if ($user->role === 'cashier' && $user->store_id === $product->store_id) {
            return true;
        }
        
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0|max:999.99',
            'image_url' => 'nullable|url',
            'preparation_time' => 'required|integer|min:1|max:120',
            'is_available' => 'boolean',
            'sort_order' => 'integer|min:0',
            'category_id' => 'required|exists:categories,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'price.required' => 'Product price is required.',
            'price.min' => 'Product price cannot be negative.',
            'price.max' => 'Product price cannot exceed $999.99.',
            'preparation_time.required' => 'Preparation time is required.',
            'preparation_time.min' => 'Preparation time must be at least 1 minute.',
            'preparation_time.max' => 'Preparation time cannot exceed 2 hours.',
            'category_id.required' => 'Please select a category.',
        ];
    }
}