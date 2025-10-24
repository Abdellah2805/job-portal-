<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = [
        'employer_id',
        'title',
        'company',
        'location',
        'description',
        'contract_type',
        'salary',
        'is_active'
    ];

    
    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }

   
    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}