<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['customer', 'store_owner', 'cashier'])->default('customer');
            $table->foreignId('store_id')->nullable()->constrained();
            
            $table->index('role');
            $table->index(['role', 'store_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'store_id']);
            $table->dropIndex(['role']);
            $table->dropForeign(['store_id']);
            $table->dropColumn(['role', 'store_id']);
        });
    }
};