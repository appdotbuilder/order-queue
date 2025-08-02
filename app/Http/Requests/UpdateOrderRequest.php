<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = auth()->user();
        
        // Cashiers can update orders in their store
        if ($user->role === 'cashier' && $user->store_id === $this->order->store_id) {
            return true;
        }
        
        // Store owners can update orders in their stores
        if ($user->role === 'store_owner' && $user->ownedStores->contains($this->order->store)) {
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
            'status' => 'required|in:pending,confirmed,preparing,ready,completed,cancelled',
            'payment_status' => 'sometimes|in:pending,paid,failed,refunded',
            'estimated_completion_time' => 'nullable|integer|min:1|max:120',
            'notes' => 'nullable|string|max:500',
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
            'status.required' => 'Order status is required.',
            'status.in' => 'Invalid order status.',
            'estimated_completion_time.min' => 'Completion time must be at least 1 minute.',
            'estimated_completion_time.max' => 'Completion time cannot exceed 2 hours.',
        ];
    }
}