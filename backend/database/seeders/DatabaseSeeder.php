<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Employee::factory(1000)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // Employee::query()->insert([
        //     [
        //         'name' => 'John Smith',
        //         'email' => 'john@ayp-group.com',
        //         'is_active' => true,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'name' => 'Jane Smith',
        //         'email' => 'jane@ayp-group.com',
        //         'is_active' => false,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'name' => 'Tom Smith',
        //         'email' => 'tom@ayp-group.com',
        //         'is_active' => true,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ]);
    }
}
