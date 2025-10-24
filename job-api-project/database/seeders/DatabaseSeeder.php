<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    
    public function run(): void
    {
        
        $this->call([
            RoleSeeder::class, 
        ]);
        
        

        
        if (! \App\Models\User::where('email', 'admin@example.com')->exists()) {
             $admin = \App\Models\User::factory()->create([
                 'name' => 'Admin User',
                 'email' => 'admin@example.com',
                 'password' => bcrypt('password'), 
             ]);
             $admin->assignRole('admin');
        }
        
        if (! \App\Models\User::where('email', 'employer@example.com')->exists()) {
             $employer = \App\Models\User::factory()->create([
                 'name' => 'Employer User',
                 'email' => 'employer@example.com',
                 'password' => bcrypt('password'),
             ]);
             $employer->assignRole('employer');
        }
    }
}