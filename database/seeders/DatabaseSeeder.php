<?php

namespace Database\Seeders;

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
        \App\Models\User::create([
            'name' => 'Demo Account',
            'email' => 'demo@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
        ]);

        \App\Models\User::create([
            'name' => 'Janki Bhatt',
            'email' => 'janki@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'city' => 'Toronto',
            'latitude' => 43.7001,
            'longitude' => -79.4163,
        ]);
    }

}
