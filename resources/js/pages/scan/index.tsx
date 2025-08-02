import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ScanIndex() {
    const [storeCode, setStoreCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeCode.trim()) return;

        setIsSubmitting(true);
        router.post('/scan', { store_code: storeCode.trim().toUpperCase() }, {
            onFinish: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false)
        });
    };

    const handleDemoStore = () => {
        setStoreCode('COFFEE01');
        setIsSubmitting(true);
        router.post('/scan', { store_code: 'COFFEE01' }, {
            onFinish: () => setIsSubmitting(false),
            onError: () => setIsSubmitting(false)
        });
    };

    return (
        <>
            <Head title="Scan Store Code - QueueEats" />
            
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center space-x-3">
                                <div className="text-2xl">🍽️</div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">QueueEats</h1>
                                    <p className="text-xs text-gray-500">Smart Food Ordering</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="sm" onClick={() => router.visit('/')}>
                                    ← Back to Home
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    {/* Main Scanner Card */}
                    <Card className="shadow-lg border-0">
                        <CardHeader className="text-center pb-6">
                            <div className="text-6xl mb-4">📱</div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Scan Store Code
                            </CardTitle>
                            <CardDescription className="text-base">
                                Find the QR code at your table or counter and enter the store code below
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="store-code" className="block text-sm font-medium text-gray-700 mb-2">
                                        Store Code
                                    </label>
                                    <Input
                                        id="store-code"
                                        type="text"
                                        value={storeCode}
                                        onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
                                        placeholder="Enter store code (e.g., COFFEE01)"
                                        className="text-lg text-center font-mono tracking-wider"
                                        maxLength={20}
                                        required
                                    />
                                </div>
                                
                                <Button 
                                    type="submit" 
                                    className="w-full text-lg py-6"
                                    disabled={isSubmitting || !storeCode.trim()}
                                >
                                    {isSubmitting ? (
                                        <>⏳ Finding Store...</>
                                    ) : (
                                        <>🔍 Find Store Menu</>
                                    )}
                                </Button>
                            </form>

                            {/* Demo Section */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">or try our demo</span>
                                </div>
                            </div>

                            <Button 
                                variant="outline" 
                                className="w-full text-lg py-6"
                                onClick={handleDemoStore}
                                disabled={isSubmitting}
                            >
                                ☕ Try Demo Store (COFFEE01)
                            </Button>
                        </CardContent>
                    </Card>

                    {/* How it Works */}
                    <div className="mt-12 space-y-6">
                        <h3 className="text-xl font-semibold text-center text-gray-900">
                            🎯 How to Find Your Store Code
                        </h3>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: '🏪',
                                    title: 'Look for QR Code',
                                    description: 'Find the QR code displayed at your table, counter, or store entrance'
                                },
                                {
                                    icon: '📱',
                                    title: 'Scan or Read Code',
                                    description: 'Use your phone camera to scan the QR code or read the store code manually'
                                },
                                {
                                    icon: '🍕',
                                    title: 'Start Ordering',
                                    description: 'Enter the code above to access the menu and place your order'
                                }
                            ].map((step, index) => (
                                <Card key={index} className="text-center border-0 shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="text-3xl mb-3">{step.icon}</div>
                                        <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Benefits */}
                    <Alert className="mt-8 border-green-200 bg-green-50">
                        <div className="text-green-600 text-lg">✨</div>
                        <AlertDescription className="text-green-800">
                            <strong>Why scan first?</strong> By entering the store code, you'll see the exact menu, 
                            current prices, and real-time availability for that specific location. Plus, your order 
                            goes directly to the right kitchen!
                        </AlertDescription>
                    </Alert>

                    {/* Need Help */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">Can't find a store code?</p>
                        <div className="space-x-4">
                            <Button variant="outline" size="sm">
                                🏪 Browse All Stores
                            </Button>
                            <Button variant="outline" size="sm">
                                💬 Get Help
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}