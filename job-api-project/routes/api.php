<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\JobOfferController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\Admin\UserController; 

Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

Route::get('jobs', [JobOfferController::class, 'index']);
Route::get('jobs/{jobOffer}', [JobOfferController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user()->load('roles');
    });

    Route::get('jobs/mine', [JobOfferController::class, 'myJobs']);
    Route::post('jobs', [JobOfferController::class, 'store']);
    Route::put('jobs/{jobOffer}', [JobOfferController::class, 'update']);
    Route::delete('jobs/{jobOffer}', [JobOfferController::class, 'destroy']);

    Route::post('applications/job-offers/{jobOffer}', [ApplicationController::class, 'store']);
    Route::get('applications/mine', [ApplicationController::class, 'userApplications']);
    Route::get('applications/employer', [ApplicationController::class, 'employerApplications']);
    Route::get('jobs/{jobOffer}/applications', [ApplicationController::class, 'jobApplications']);
    Route::put('applications/{application}/status', [ApplicationController::class, 'updateStatus']);

    
    Route::group(['prefix' => 'admin/users'], function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('{user}', [UserController::class, 'show']);
        Route::put('{user}', [UserController::class, 'update']);
        Route::delete('{user}', [UserController::class, 'destroy']);
        Route::put('{user}/roles', [UserController::class, 'updateRoles']);
    });
});