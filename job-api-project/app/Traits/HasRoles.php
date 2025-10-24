<?php

namespace App\Traits;

use App\Models\Role;

trait HasRoles
{
    
     
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

   
    public function hasRole(string $roleName): bool
    {
        return $this->roles->contains('name', $roleName);
    }

    
    public function assignRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            if (!$this->roles->contains($role)) {
                $this->roles()->attach($role);
            }
        }
    }

    public function can($ability, $arguments = []): bool
    {
        $permissionName = is_array($ability) ? $ability[0] : $ability;
        
        if ($this->hasRole('admin')) {
            return true;
        }

        
        switch ($permissionName) {
            case 'manage-users':
            case 'manage-roles':
                return $this->hasRole('admin');
            case 'create-job':
            case 'manage-own-jobs':
            case 'manage-applications':
                return $this->hasRole('employer') || $this->hasRole('admin');
            case 'apply-to-job':
            case 'view-own-applications':
                return $this->hasRole('user') || $this->hasRole('admin');
            default:
                return false;
        }
    }
}