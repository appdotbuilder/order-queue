import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    payment_status: string;
    estimated_completion_time: number;
    created_at: string;
    customer?: { name: string; email: string };
    store?: { name: string };
    items?: Array<{
        id: number;
        quantity: number;
        product: {
            name: string;
            price: number;
        };
    }>;
}

interface Store {
    id: number;
    name: string;
    code: string;
    is_active: boolean;
    orders?: Order[];
}

interface Props {
    role: string;
    stats: {
        total_orders?: number;
        active_orders?: number;
        completed_orders?: number;
        total_stores?: number;
        today_orders?: number;
        pending_orders?: number;
        today_revenue?: number;
        queue_orders?: number;
        completed_today?: number;
    };
    recent_orders?: Order[];
    active_orders?: Order[];
    stores?: Store[];
    today_orders?: Order[];
    pending_orders?: Order[];
    queue_orders?: Order[];
    store?: Store;
    error?: string;
    [key: string]: unknown;
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
};

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString();

export default function Dashboard(props: Props) {
    const { role, stats, recent_orders, active_orders, stores, today_orders, queue_orders, store, error } = props;

    // Customer Dashboard
    if (role === 'customer') {
        return (
            <AppShell>
                <Head title="Customer Dashboard - QueueEats" />
                
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">👋 Welcome back!</h1>
                        <p className="text-gray-600 mt-2">Track your orders and discover new places to eat</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">📦</div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">⏳</div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">{stats.active_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Active Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">✅</div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{stats.completed_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Completed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🚀 Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link href="/scan">
                                    <Button className="w-full text-lg py-6">
                                        📱 Scan Store Code
                                    </Button>
                                </Link>
                                <Link href="/orders">
                                    <Button variant="outline" className="w-full text-lg py-6">
                                        📋 View All Orders
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Orders */}
                    {active_orders && active_orders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>⏳ Active Orders</CardTitle>
                                <CardDescription>Orders currently being prepared</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {active_orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <div className="font-semibold">{order.order_number}</div>
                                            <div className="text-sm text-gray-600">{order.store?.name}</div>
                                            <div className="text-xs text-gray-500">{formatTime(order.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                {order.status}
                                            </Badge>
                                            <div className="text-sm font-medium mt-1">{formatCurrency(order.total_amount)}</div>
                                            <div className="text-xs text-gray-500">~{order.estimated_completion_time}min</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Orders */}
                    {recent_orders && recent_orders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>📋 Recent Orders</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {recent_orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <div className="font-semibold">{order.order_number}</div>
                                            <div className="text-sm text-gray-600">{order.store?.name}</div>
                                            <div className="text-xs text-gray-500">{formatTime(order.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                {order.status}
                                            </Badge>
                                            <div className="text-sm font-medium mt-1">{formatCurrency(order.total_amount)}</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppShell>
        );
    }

    // Store Owner Dashboard
    if (role === 'store_owner') {
        return (
            <AppShell>
                <Head title="Store Owner Dashboard - QueueEats" />
                
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🏪 Store Management</h1>
                        <p className="text-gray-600 mt-2">Monitor your stores and manage orders</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">🏪</div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.total_stores || 0}</div>
                                        <p className="text-sm text-gray-600">Stores</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">📦</div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">📅</div>
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600">{stats.today_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Today's Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">⏳</div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">{stats.pending_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Pending</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">💰</div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.today_revenue || 0)}</div>
                                        <p className="text-sm text-gray-600">Today's Revenue</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Link href="/stores/create">
                            <Button className="w-full">+ New Store</Button>
                        </Link>
                        <Link href="/products/create">
                            <Button variant="outline" className="w-full">+ Add Product</Button>
                        </Link>
                        <Link href="/orders">
                            <Button variant="outline" className="w-full">📋 All Orders</Button>
                        </Link>
                        <Link href="/stores">
                            <Button variant="outline" className="w-full">🏪 Manage Stores</Button>
                        </Link>
                    </div>

                    {/* Stores Overview */}
                    {stores && stores.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>🏪 Your Stores</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stores.map(store => (
                                        <Card key={store.id} className="border">
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold">{store.name}</h4>
                                                    <Badge variant={store.is_active ? "default" : "secondary"}>
                                                        {store.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-2">Code: {store.code}</p>
                                                <div className="text-xs text-gray-500">
                                                    {store.orders?.length || 0} orders
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recent Orders */}
                    {today_orders && today_orders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>📅 Today's Orders</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {today_orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                                        <div>
                                            <div className="font-semibold">{order.order_number}</div>
                                            <div className="text-sm text-gray-600">{order.customer?.name}</div>
                                            <div className="text-xs text-gray-500">{formatTime(order.created_at)}</div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                {order.status}
                                            </Badge>
                                            <div className="text-sm font-medium mt-1">{formatCurrency(order.total_amount)}</div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AppShell>
        );
    }

    // Cashier Dashboard
    if (role === 'cashier') {
        if (error) {
            return (
                <AppShell>
                    <Head title="Cashier Dashboard - QueueEats" />
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-xl font-semibold mb-2">No Store Assigned</h2>
                        <p className="text-gray-600">Please contact your manager to assign you to a store.</p>
                    </div>
                </AppShell>
            );
        }

        return (
            <AppShell>
                <Head title="Cashier Dashboard - QueueEats" />
                
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">💰 Cashier Dashboard</h1>
                        <p className="text-gray-600 mt-2">
                            Managing orders for {store?.name}
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">📅</div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">{stats.today_orders || 0}</div>
                                        <p className="text-sm text-gray-600">Today's Orders</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">⏳</div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-600">{stats.queue_orders || 0}</div>
                                        <p className="text-sm text-gray-600">In Queue</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">✅</div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{stats.completed_today || 0}</div>
                                        <p className="text-sm text-gray-600">Completed</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="text-2xl mr-3">💰</div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.today_revenue || 0)}</div>
                                        <p className="text-sm text-gray-600">Today's Revenue</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Queue */}
                    {queue_orders && queue_orders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>🔥 Order Queue</CardTitle>
                                <CardDescription>Orders that need attention</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {queue_orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg bg-yellow-50">
                                        <div>
                                            <div className="font-semibold">{order.order_number}</div>
                                            <div className="text-sm text-gray-600">{order.customer?.name}</div>
                                            <div className="text-xs text-gray-500">{formatTime(order.created_at)}</div>
                                            {order.items && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right space-y-2">
                                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                {order.status}
                                            </Badge>
                                            <div className="text-sm font-medium">{formatCurrency(order.total_amount)}</div>
                                            <div className="space-x-2">
                                                {order.status === 'pending' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => router.patch(`/orders/${order.id}`, { status: 'confirmed' })}
                                                    >
                                                        Confirm
                                                    </Button>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => router.patch(`/orders/${order.id}`, { status: 'preparing' })}
                                                    >
                                                        Start Prep
                                                    </Button>
                                                )}
                                                {order.status === 'preparing' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => router.patch(`/orders/${order.id}`, { status: 'ready' })}
                                                    >
                                                        Ready
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/orders">
                            <Button variant="outline" className="w-full">📋 All Orders</Button>
                        </Link>
                        <Link href="/products">
                            <Button variant="outline" className="w-full">🍕 Manage Menu</Button>
                        </Link>
                        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                            🔄 Refresh Queue
                        </Button>
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <Head title="Dashboard - QueueEats" />
            <div className="text-center py-12">
                <div className="text-4xl mb-4">🤔</div>
                <h2 className="text-xl font-semibold mb-2">Unknown Role</h2>
                <p className="text-gray-600">Please contact support to resolve this issue.</p>
            </div>
        </AppShell>
    );
}