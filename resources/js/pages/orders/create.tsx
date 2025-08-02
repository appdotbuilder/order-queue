import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    preparation_time: number;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    products: Product[];
}

interface Store {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    categories: Category[];
}

interface CartItem {
    product: Product;
    quantity: number;
    special_instructions?: string;
}

interface Props {
    store: Store | null;
    store_code: string;
    [key: string]: unknown;
}

export default function OrderCreate({ store, store_code }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!store) {
        return (
            <>
                <Head title="Store Not Found - QueueEats" />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <Card className="max-w-md">
                        <CardContent className="text-center py-8">
                            <div className="text-4xl mb-4">😞</div>
                            <h2 className="text-xl font-semibold mb-2">Store Not Found</h2>
                            <p className="text-gray-600 mb-4">
                                We couldn't find a store with code "{store_code}". 
                                Please check the code and try again.
                            </p>
                            <Button onClick={() => router.visit('/scan')}>
                                ← Try Again
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
            setCart(cart.map(item => 
                item.product.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(cart.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
        ));
    };

    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const getEstimatedTime = () => {
        if (cart.length === 0) return 0;
        return Math.max(...cart.map(item => item.product.preparation_time)) + 5;
    };

    const handleSubmit = () => {
        if (cart.length === 0) return;

        const orderData = {
            store_id: store.id,
            total_amount: getTotalAmount(),
            estimated_completion_time: getEstimatedTime(),
            notes: notes.trim() || null,
            items: cart.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                unit_price: item.product.price,
                special_instructions: item.special_instructions?.trim() || null
            }))
        };

        setIsSubmitting(true);
        router.post('/orders', orderData, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    return (
        <>
            <Head title={`Order from ${store.name} - QueueEats`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-4">
                                <Button variant="ghost" size="sm" onClick={() => router.visit('/scan')}>
                                    ← Back
                                </Button>
                                <div>
                                    <h1 className="font-bold text-gray-900">{store.name}</h1>
                                    <p className="text-xs text-gray-500">{store.address}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-medium">Cart: ${getTotalAmount().toFixed(2)}</div>
                                <div className="text-xs text-gray-500">{cart.length} items</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Menu */}
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu</h2>
                                <p className="text-gray-600">{store.description}</p>
                            </div>

                            {store.categories.map(category => (
                                <div key={category.id}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl">{category.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                                            <p className="text-sm text-gray-600">{category.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                                        {category.products.map(product => (
                                            <Card key={product.id} className={`${!product.is_available ? 'opacity-50' : ''}`}>
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                                        <div className="text-right">
                                                            <div className="font-bold text-green-600">${product.price.toFixed(2)}</div>
                                                            <div className="text-xs text-gray-500">{product.preparation_time}min</div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                                                    
                                                    {product.is_available ? (
                                                        <Button 
                                                            size="sm" 
                                                            className="w-full"
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            + Add to Cart
                                                        </Button>
                                                    ) : (
                                                        <Badge variant="secondary" className="w-full justify-center">
                                                            Unavailable
                                                        </Badge>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Sidebar */}
                        <div className="lg:sticky lg:top-24 lg:h-fit">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        🛒 Your Order
                                        {cart.length > 0 && (
                                            <Badge variant="secondary">{cart.length}</Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="text-3xl mb-2">🛒</div>
                                            <p>Your cart is empty</p>
                                            <p className="text-sm">Add items from the menu</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3">
                                                {cart.map(item => (
                                                    <div key={item.product.id} className="flex justify-between items-center">
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-medium text-sm truncate">{item.product.name}</h5>
                                                            <p className="text-xs text-gray-500">
                                                                ${item.product.price.toFixed(2)} each
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator />

                                            <div>
                                                <label className="block text-sm font-medium mb-2">
                                                    Special Instructions (Optional)
                                                </label>
                                                <Textarea
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Any special requests or dietary requirements..."
                                                    className="resize-none"
                                                    rows={3}
                                                />
                                            </div>

                                            <Separator />

                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Subtotal:</span>
                                                    <span>${getTotalAmount().toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>Est. Time:</span>
                                                    <span>{getEstimatedTime()} minutes</span>
                                                </div>
                                            </div>

                                            <Button 
                                                className="w-full text-lg py-6"
                                                onClick={handleSubmit}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>⏳ Placing Order...</>
                                                ) : (
                                                    <>🚀 Place Order - ${getTotalAmount().toFixed(2)}</>
                                                )}
                                            </Button>

                                            <Alert>
                                                <div className="text-blue-600">ℹ️</div>
                                                <AlertDescription className="text-sm">
                                                    You'll be redirected to payment after placing your order. 
                                                    We accept cards, cash, and digital wallets.
                                                </AlertDescription>
                                            </Alert>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}