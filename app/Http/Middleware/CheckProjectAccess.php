<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Collaborator;
use App\Models\Project;
use Illuminate\Support\Facades\Log;

class CheckProjectAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $projectId = $request->route('id'); // atau sesuaikan dengan parameter URL kamu
        $userId = auth()->user()->id;

        Log::info("=============== CHECK PROJECT ACCESS - START ================");
        Log::info("User ID: " . $userId);
        Log::info("Project ID: " . $projectId);
        Log::info("=============== CHECK PROJECT ACCESS - END ================");

        // Cek apakah user adalah owner project
        $project = Project::find($projectId);
        if ($project && $project->iduser == $userId) {
            return $next($request);
        }

        // Cek apakah user adalah collaborator project
        $isCollaborator = Collaborator::where('project_id', $projectId)
            ->where('user_id', $userId)
            ->exists();

        if ($isCollaborator) {
            return $next($request);
        }

        // Jika bukan owner maupun collaborator
        return redirect('/project')->with('error', 'Maaf, Anda tidak memiliki izin untuk mengakses proyek tersebut. Silahkan hubungi pemilik proyek untuk mendapatkan akses.');
    }
}
