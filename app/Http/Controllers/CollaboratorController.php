<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Project;
use App\Models\Collaborator;

class CollaboratorController extends Controller
{

    public function show(Project $project)
    {
        // Kirim data project ke view
        return view('projects.show', compact('project'));
    }

   public function invite(Request $request)
{
    $request->validate([
        'username' => 'required|string',
        'project_id' => 'required|exists:projects,id',
    ]);

    $user = User::where('username', $request->username)->first();

    if (!$user) {
        return back()->with('error', 'User tidak ditemukan.');
    }

    $exists = Collaborator::where('project_id', $request->project_id)
        ->where('user_id', $user->id)
        ->exists();

    if ($exists) {
        return back()->with('info', 'User sudah menjadi kolaborator.');
    }

    Collaborator::create([
        'project_id' => $request->project_id,
        'user_id' => $user->id,
    ]);

    return back()->with('success', 'User berhasil diundang.');
}
}