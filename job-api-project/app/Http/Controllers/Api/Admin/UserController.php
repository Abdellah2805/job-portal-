<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (! $request->user() || ! $request->user()->hasRole('admin')) {
                return response()->json(['message' => 'Accès refusé. Nécessite le rôle d\'administrateur.'], 403);
            }
            return $next($request);
        });
    }

    /**
     * @OA\Get(
     * path="/api/admin/users",
     * operationId="adminGetUsers",
     * tags={"Admin - Users"},
     * summary="Liste tous les utilisateurs (Rôle : admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Response(response=200, description="Liste des utilisateurs."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function index()
    {
        $users = User::with('roles:id,name')->paginate(15);

        return response()->json($users);
    }

    /**
     * @OA\Get(
     * path="/api/admin/users/{user}",
     * operationId="adminShowUser",
     * tags={"Admin - Users"},
     * summary="Affiche les détails d'un utilisateur (Rôle : admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'utilisateur"),
     * @OA\Response(response=200, description="Détails de l'utilisateur."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function show(User $user)
    {
        return response()->json($user->load('roles:id,name'));
    }

    /**
     * @OA\Put(
     * path="/api/admin/users/{user}",
     * operationId="adminUpdateUser",
     * tags={"Admin - Users"},
     * summary="Met à jour les informations d'un utilisateur (Rôle : admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'utilisateur"),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="email", type="string", format="email"),
     * @OA\Property(property="password", type="string", format="password", nullable=true),
     * ),
     * ),
     * @OA\Response(response=200, description="Utilisateur mis à jour."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function update(Request $request, User $user)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json([
            'message' => 'Utilisateur mis à jour avec succès.',
            'user' => $user->only(['id', 'name', 'email'])
        ]);
    }

    /**
     * @OA\Delete(
     * path="/api/admin/users/{user}",
     * operationId="adminDeleteUser",
     * tags={"Admin - Users"},
     * summary="Supprime un utilisateur (Rôle : admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'utilisateur"),
     * @OA\Response(response=204, description="Utilisateur supprimé."),
     * @OA\Response(response=403, description="Accès refusé (impossible de supprimer un admin).")
     * )
     */
    public function destroy(User $user)
    {
        if ($user->hasRole('admin')) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer un administrateur via cette route. Veuillez modifier son rôle d\'abord.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès.'], 204);
    }

    /**
     * @OA\Put(
     * path="/api/admin/users/{user}/roles",
     * operationId="adminUpdateUserRoles",
     * tags={"Admin - Users"},
     * summary="Met à jour les rôles d'un utilisateur (Rôle : admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="user", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'utilisateur"),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"roles"},
     * @OA\Property(property="roles", type="array", @OA\Items(type="string", enum={"admin", "employer", "user"}), example={"employer", "user"}),
     * ),
     * ),
     * @OA\Response(response=200, description="Rôles mis à jour."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function updateRoles(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => ['required', 'string', Rule::in(['admin', 'employer', 'user'])],
        ]);
        
        $rolesToAssign = Role::whereIn('name', $request->roles)->get();

        if ($rolesToAssign->isEmpty()) {
            return response()->json(['message' => 'Aucun rôle valide n\'a été spécifié.'], 422);
        }

        $user->roles()->sync($rolesToAssign->pluck('id'));

        return response()->json([
            'message' => 'Rôles de l\'utilisateur mis à jour avec succès.',
            'user' => $user->load('roles:id,name')
        ]);
    }
}