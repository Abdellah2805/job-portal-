<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * @OA\Post(
     * path="/api/auth/register",
     * operationId="registerUser",
     * tags={"Auth"},
     * summary="Enregistrement d'un nouvel utilisateur",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name","email","password","password_confirmation"},
     * @OA\Property(property="name", type="string", example="Jane Doe"),
     * @OA\Property(property="email", type="string", format="email", example="jane.doe@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="secret1234"),
     * @OA\Property(property="password_confirmation", type="string", format="password", example="secret1234"),
     * @OA\Property(property="role", type="string", enum={"user", "employer"}, example="user", description="Rôle optionnel (user par défaut)"),
     * ),
     * ),
     * @OA\Response(
     * response=201,
     * description="Inscription réussie, retourne le jeton d'accès.",
     * @OA\JsonContent(
     * @OA\Property(property="access_token", type="string", example="1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
     * @OA\Property(property="token_type", type="string", example="Bearer"),
     * )
     * ),
     * @OA\Response(response=422, description="Erreurs de validation")
     * )
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|in:user,employer',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $roleName = $request->role === 'employer' ? 'employer' : 'user';
        $user->assignRole($roleName);

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur enregistré avec succès.',
            'user' => $user->only(['id', 'name', 'email']),
            'roles' => $user->roles->pluck('name'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * @OA\Post(
     * path="/api/auth/login",
     * operationId="loginUser",
     * tags={"Auth"},
     * summary="Connexion de l'utilisateur",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"email","password"},
     * @OA\Property(property="email", type="string", format="email", example="admin@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="password"),
     * ),
     * ),
     * @OA\Response(
     * response=200,
     * description="Connexion réussie, retourne le jeton d'accès.",
     * @OA\JsonContent(
     * @OA\Property(property="access_token", type="string", example="1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
     * @OA\Property(property="token_type", type="string", example="Bearer"),
     * )
     * ),
     * @OA\Response(response=401, description="Identifiants invalides"),
     * @OA\Response(response=422, description="Erreurs de validation")
     * )
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis ne correspondent pas à nos enregistrements.'],
            ]);
        }

        $user = $request->user();

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user->only(['id', 'name', 'email']),
            'roles' => $user->roles->pluck('name'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * @OA\Post(
     * path="/api/auth/logout",
     * operationId="logoutUser",
     * tags={"Auth"},
     * summary="Déconnexion de l'utilisateur (révoque le jeton actuel)",
     * security={{"bearerAuth":{}}},
     * @OA\Response(response=200, description="Déconnexion réussie."),
     * @OA\Response(response=401, description="Non authentifié")
     * )
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie. Jeton révoqué.',
        ]);
    }
}