<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobOffer;
use Illuminate\Http\Request;

class JobOfferController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/jobs",
     * operationId="getJobOffersList",
     * tags={"Job Offers"},
     * summary="Affiche une liste paginée des offres d'emploi (recherche incluse)",
     * @OA\Parameter(name="title", in="query", required=false, @OA\Schema(type="string"), description="Recherche par titre"),
     * @OA\Parameter(name="company", in="query", required=false, @OA\Schema(type="string"), description="Recherche par entreprise"),
     * @OA\Parameter(name="location", in="query", required=false, @OA\Schema(type="string"), description="Recherche par localisation"),
     * @OA\Response(response=200, description="Liste des offres d'emploi."),
     * )
     */
    public function index(Request $request)
    {
        $query = JobOffer::query()->where('is_active', true);

        if ($request->filled('title')) {
            $query->where('title', 'like', '%' . $request->input('title') . '%');
        }
        if ($request->filled('company')) {
            $query->where('company', 'like', '%' . $request->input('company') . '%');
        }
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->input('location') . '%');
        }

        $offers = $query->with('employer:id,name,email')->paginate(10);

        return response()->json($offers);
    }

    /**
     * @OA\Get(
     * path="/api/jobs/{jobOffer}",
     * operationId="getJobOfferById",
     * tags={"Job Offers"},
     * summary="Affiche une offre d'emploi spécifique",
     * @OA\Parameter(name="jobOffer", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'offre d'emploi"),
     * @OA\Response(response=200, description="Détails de l'offre d'emploi."),
     * @OA\Response(response=404, description="Offre non trouvée ou inactive.")
     * )
     */
    public function show(JobOffer $jobOffer)
    {
        if (!$jobOffer->is_active) {
            return response()->json(['message' => 'Offre d\'emploi non trouvée ou inactive.'], 404);
        }
        
        return response()->json($jobOffer->load('employer:id,name,email'));
    }

    /**
     * @OA\Post(
     * path="/api/jobs",
     * operationId="createJobOffer",
     * tags={"Job Offers"},
     * summary="Crée une nouvelle offre d'emploi (Rôle : employer ou admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title","company","location","description"},
     * @OA\Property(property="title", type="string"),
     * @OA\Property(property="company", type="string"),
     * @OA\Property(property="location", type="string"),
     * @OA\Property(property="description", type="string"),
     * @OA\Property(property="contract_type", type="string", nullable=true),
     * @OA\Property(property="salary", type="number", format="float", nullable=true),
     * ),
     * ),
     * @OA\Response(response=201, description="Offre créée avec succès."),
     * @OA\Response(response=403, description="Accès refusé."),
     * @OA\Response(response=422, description="Erreurs de validation")
     * )
     */
    public function store(Request $request)
    {
        if (! $request->user()->can('create-job')) {
            return response()->json(['message' => 'Accès refusé. Vous n\'avez pas la permission de créer une offre d\'emploi.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'contract_type' => 'nullable|string|max:50',
            'salary' => 'nullable|numeric',
        ]);

        $offer = JobOffer::create([
            'employer_id' => $request->user()->id,
            ...$validatedData
        ]);

        return response()->json([
            'message' => 'Offre d\'emploi créée avec succès.',
            'offer' => $offer
        ], 201);
    }

    /**
     * @OA\Put(
     * path="/api/jobs/{jobOffer}",
     * operationId="updateJobOffer",
     * tags={"Job Offers"},
     * summary="Met à jour une offre d'emploi (Rôle : doit être l'employeur OU admin)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="jobOffer", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'offre à mettre à jour"),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string"),
     * @OA\Property(property="is_active", type="boolean"),
     * ),
     * ),
     * @OA\Response(response=200, description="Offre mise à jour avec succès."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function update(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();

        if ($jobOffer->employer_id !== $user->id && ! $user->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez modifier que vos propres offres d\'emploi.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'company' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'contract_type' => 'nullable|string|max:50',
            'salary' => 'nullable|numeric',
            'is_active' => 'sometimes|boolean',
        ]);
        
        $jobOffer->update($validatedData);

        return response()->json([
            'message' => 'Offre d\'emploi mise à jour avec succès.',
            'offer' => $jobOffer
        ]);
    }

    /**
     * @OA\Get(
     * path="/api/jobs/mine",
     * operationId="getMyJobOffers",
     * tags={"Job Offers"},
     * summary="Affiche les offres d'emploi de l'employeur connecté",
     * security={{"bearerAuth":{}}},
     * @OA\Response(response=200, description="Liste des offres de l'employeur."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function myJobs(Request $request)
    {
        $user = $request->user();

        Log::debug();
        if (! $request->user()->can('create-job')) {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        // $offers = JobOffer::where('employer_id', $user->id)
        //     ->withCount('applications')
        //     ->orderBy('created_at', 'desc')
        //     ->get();

        return response()->json([
            'data' => $user
        ]);
    }

    /**
     * @OA\Delete(
     * path="/api/jobs/{jobOffer}",
     * operationId="deleteJobOffer",
     * tags={"Job Offers"},
     * summary="Supprime une offre d'emploi (Rôle : doit être l'employeur OU admin)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="jobOffer", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'offre à supprimer"),
     * @OA\Response(response=204, description="Offre supprimée avec succès."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function destroy(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();

        if ($jobOffer->employer_id !== $user->id && ! $user->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez supprimer que vos propres offres d\'emploi.'], 403);
        }

        $jobOffer->delete();

        return response()->json(['message' => 'Offre d\'emploi supprimée avec succès.'], 204);
    }
}