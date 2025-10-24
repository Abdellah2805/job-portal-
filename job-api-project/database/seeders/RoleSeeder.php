<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    
    public function run(): void
    {
        
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Role::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $roles = [
            ['name' => 'admin', 'description' => 'Administrateur de la plateforme, accès total.'],
            ['name' => 'employer', 'description' => 'Employeur, peut publier et gérer les offres d\'emploi.'],
            ['name' => 'user', 'description' => 'Utilisateur standard, peut rechercher et postuler aux offres.'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}