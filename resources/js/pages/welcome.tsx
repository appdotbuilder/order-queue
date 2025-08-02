import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Welcome() {
    const features = [
        {
            icon: '📱',
            title: 'Scan & Order',
            description: 'Simply scan the store QR code to browse menu and place your order instantly'
        },
        {
            icon: '⚡',
            title: 'Real-time Queue',
            description: 'Track your order status and get live updates on preparation time'
        },
        {
            icon: '💳',
            title: 'Secure Payment',
            description: 'Pay safely with integrated payment gateway - card, cash, or digital wallet'
        },
        {
            icon: '🏪',
            title: 'Multi-Store Management',
            description: 'Store owners can manage multiple locations and monitor all orders'
        },
        {
            icon: '👥',
            title: 'Role-Based Access',
            description: 'Different interfaces for customers, store owners, and cashiers'
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description: 'View sales reports, popular items, and customer insights'
        }
    ];

    const userRoles = [
        {
            icon: '👤',
            title: 'Customers',
            description: 'Scan store codes, browse menus, place orders, and track queue status',
            color: 'bg-blue-50 border-blue-200 text-blue-800'
        },
        {
            icon: '🏪',
            title: 'Store Owners',
            description: 'Manage menus, view all orders, monitor sales, and track performance',
            color: 'bg-green-50 border-green-200 text-green-800'
        },
        {
            icon: '💰',
            title: 'Cashiers',
            description: 'Confirm orders, update status, assist customers, and process payments',
            color: 'bg-purple-50 border-purple-200 text-purple-800'
        }
    ];

    return (
        <>
            <Head title="QueueEats - Smart Food Ordering System" />
            
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="text-3xl">🍽️</div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">QueueEats</h1>
                                    <p className="text-xs text-gray-500">Smart Food Ordering</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href="/scan">
                                    <Button variant="outline" size="sm">
                                        📱 Scan Store Code
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="outline" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="text-6xl mb-6">🍽️📱⚡</div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Skip the Line,<br />
                            <span className="text-orange-600">Order Ahead</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Revolutionary food ordering system that lets customers scan store codes, 
                            place orders instantly, and track their queue position in real-time.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link href="/scan">
                                <Button size="lg" className="text-lg px-8 py-4">
                                    📱 Start Ordering Now
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                                    🏪 Register Your Store
                                </Button>
                            </Link>
                        </div>

                        {/* Demo Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                            {[
                                { number: '500+', label: 'Orders Processed' },
                                { number: '25+', label: 'Partner Stores' },
                                { number: '1,200+', label: 'Happy Customers' },
                                { number: '4.9★', label: 'Average Rating' }
                            ].map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                🚀 How It Works
                            </h2>
                            <p className="text-lg text-gray-600">
                                Get your food faster with our simple 4-step process
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { step: '1', icon: '📱', title: 'Scan QR Code', description: 'Find the store QR code and scan it with your phone' },
                                { step: '2', icon: '🍕', title: 'Browse Menu', description: 'View the full menu with prices and descriptions' },
                                { step: '3', icon: '💳', title: 'Pay Securely', description: 'Complete payment with your preferred method' },
                                { step: '4', icon: '⏰', title: 'Track Order', description: 'Monitor your order status and pickup time' }
                            ].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <span className="text-2xl">{item.icon}</span>
                                        </div>
                                        <Badge variant="secondary" className="absolute -top-2 -right-2">
                                            {item.step}
                                        </Badge>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                ✨ Powerful Features
                            </h2>
                            <p className="text-lg text-gray-600">
                                Everything you need for modern food service management
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <span className="text-2xl">{feature.icon}</span>
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* User Roles */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                👥 Built for Everyone
                            </h2>
                            <p className="text-lg text-gray-600">
                                Tailored experiences for different user types
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {userRoles.map((role, index) => (
                                <Card key={index} className={`border-2 ${role.color} hover:shadow-lg transition-shadow`}>
                                    <CardHeader className="text-center">
                                        <div className="text-4xl mb-3">{role.icon}</div>
                                        <CardTitle className="text-xl">{role.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-center text-gray-700">
                                            {role.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Transform Your Food Service? 🚀
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join hundreds of stores already using QueueEats to serve customers faster
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                                    🏪 Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/scan">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-orange-600">
                                    📱 Try as Customer
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="text-2xl">🍽️</div>
                            <div className="text-xl font-bold">QueueEats</div>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Making food ordering faster, smarter, and more convenient.
                        </p>
                        <div className="flex justify-center space-x-6 text-sm text-gray-400">
                            <span>© 2024 QueueEats</span>
                            <span>•</span>
                            <span>Built with Laravel & React</span>
                            <span>•</span>
                            <span>Made with ❤️</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}