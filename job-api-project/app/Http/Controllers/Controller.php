<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="API Portail Emploi RESTful",
 * description="API pour la recherche et la gestion d'offres d'emploi, avec gestion des rôles (Admin, Employeur, Utilisateur).",
 * @OA\Contact(
 * email="contact@example.com"
 * ),
 * )
 * @OA\Server(
* url=L5_SWAGGER_CONST_HOST, 
 * description="Serveur API Principal"
 * )
 * @OA\SecurityScheme(
 * securityScheme="bearerAuth",
 * type="http",
 * scheme="bearer",
 * bearerFormat="Personal Access Token",
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}