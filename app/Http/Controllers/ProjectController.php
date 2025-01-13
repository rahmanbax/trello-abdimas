<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Fetch all project with their associated tasks.
     */
    public function index()
    {
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'User not authenticated'], 401); // Pastikan ID pengguna ada
        }

        $project = Project::where('iduser', $userId)->with('tasks')->get();
        return response()->json($project, 200);
    }



    public function store(Request $request)
    {
        // Validasi input untuk nama proyek
        $validated = $request->validate([
            'nama_project' => 'required|string|max:255',
        ]);

        // Menambahkan iduser yang berasal dari user yang sedang login
        $validated['iduser'] = Auth::id();

        // Membuat proyek baru dengan data yang telah divalidasi
        $project = Project::create($validated);

        // Mengirimkan respons JSON dengan status sukses
        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project,
        ], 201);
    }


    /**
     * Retrieve a single project by its ID.
     */
    public function show($id)
    {
        $userId = Auth::id();
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)
            ->with('tasks')
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found or you do not have access to this project'], 404);
        }

        // Debugging: Cek proyek yang diambil
        dd($project);

        return response()->json($project, 200);
    }



    /**
     * Update an existing project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $validated = $request->validate([
            'nama_project' => 'required|string|max:255',
        ]);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project,
        ]);
    }


    /**
     * Delete a project.
     */
    public function destroy($id)
    {
        $userId = Auth::id(); // Mengambil ID user yang sedang login
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)  // Memastikan proyek milik user yang login
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found or you do not have access to this project'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }


    public function showDetail($id)
    {
        $userId = Auth::id(); // Mengambil ID user yang sedang login
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)  // Memastikan proyek milik user yang login
            ->with('tasks')
            ->first();

        if (!$project) {
            return redirect()->route('project.index')->with('error', 'Project not found or you do not have access to this project');
        }

        return view('project.detail', compact('project'));
    }
}
