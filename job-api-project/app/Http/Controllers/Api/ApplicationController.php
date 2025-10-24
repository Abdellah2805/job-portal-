<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ApplicationController extends Controller
{
    /**
     * @OA\Post(
     * path="/api/applications/job-offers/{jobOffer}",
     * operationId="applyToJob",
     * tags={"Applications"},
     * summary="Postuler à une offre d'emploi (Rôle : user requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="jobOffer", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'offre d'emploi"),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="cover_letter", type="string", nullable=true),
     * ),
     * ),
     * @OA\Response(response=201, description="Candidature soumise avec succès."),
     * @OA\Response(response=403, description="Accès refusé."),
     * @OA\Response(response=409, description="Déjà postulé."),
     * @OA\Response(response=400, description="Offre inactive.")
     * )
     */
    public function store(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();

        if (! $user->can('apply-to-job')) {
            return response()->json(['message' => 'Accès refusé. Seuls les utilisateurs peuvent postuler à une offre.'], 403);
        }

        if (Application::where('user_id', $user->id)
            ->where('job_offer_id', $jobOffer->id)
            ->exists()
        ) {
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre d\'emploi.'], 409);
        }
        
        if (!$jobOffer->is_active) {
             return response()->json(['message' => 'Cette offre d\'emploi n\'est plus active et ne peut recevoir de candidatures.'], 400);
        }


        $validatedData = $request->validate([
            'cover_letter' => 'nullable|string',
        ]);

        $application = Application::create([
            'user_id' => $user->id,
            'job_offer_id' => $jobOffer->id,
            'cover_letter' => $validatedData['cover_letter'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Candidature soumise avec succès.',
            'application' => $application
        ], 201);
    }

    /**
     * @OA\Get(
     * path="/api/applications/mine",
     * operationId="getUserApplications",
     * tags={"Applications"},
     * summary="Affiche les candidatures de l'utilisateur connecté (Rôle : user ou admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Response(response=200, description="Liste des candidatures."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function userApplications(Request $request)
    {
        $user = $request->user();
        
        if (! $user->can('view-own-applications')) {
            return response()->json(['message' => 'Accès refusé. Vous n\'avez pas la permission de voir les candidatures.'], 403);
        }

        $applications = $user->applications()->with('jobOffer:id,title,company')->latest()->paginate(10);

        return response()->json($applications);
    }

    /**
     * @OA\Get(
     * path="/api/jobs/{jobOffer}/applications",
     * operationId="getJobOfferApplications",
     * tags={"Applications"},
     * summary="Affiche les candidatures pour une offre donnée (Rôle : employeur ou admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="jobOffer", in="path", required=true, @OA\Schema(type="integer"), description="ID de l'offre d'emploi"),
     * @OA\Response(response=200, description="Liste des candidatures pour l'offre."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function jobApplications(Request $request, JobOffer $jobOffer)
    {
        $user = $request->user();
        
        if ($jobOffer->employer_id !== $user->id && ! $user->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez voir les candidatures que pour vos propres offres.'], 403);
        }
        
        $applications = $jobOffer->applications()->with('user:id,name,email')->latest()->paginate(10);

        return response()->json($applications);
    }

    /**
     * @OA\Put(
     * path="/api/applications/{application}/status",
     * operationId="updateApplicationStatus",
     * tags={"Applications"},
     * summary="Met à jour le statut d'une candidature (Rôle : employeur ou admin requis)",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(name="application", in="path", required=true, @OA\Schema(type="integer"), description="ID de la candidature"),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="string", enum={"pending", "reviewed", "accepted", "rejected"}),
     * ),
     * ),
     * @OA\Response(response=200, description="Statut mis à jour avec succès."),
     * @OA\Response(response=403, description="Accès refusé.")
     * )
     */
    public function updateStatus(Request $request, Application $application)
    {
        $user = $request->user();
        
        $application->load('jobOffer');
        
        if ($application->jobOffer->employer_id !== $user->id && ! $user->hasRole('admin')) {
            return response()->json(['message' => 'Accès refusé. Vous ne pouvez modifier le statut des candidatures que pour vos propres offres.'], 403);
        }

        $validatedData = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'reviewed', 'accepted', 'rejected'])],
        ]);

        $application->update($validatedData);

        return response()->json([
            'message' => 'Statut de la candidature mis à jour avec succès.',
            'application' => $application
        ]);
    }
}