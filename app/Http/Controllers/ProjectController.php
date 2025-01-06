<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Fetch all projects with their associated tasks.
     */
    public function index()
    {
        // Mengambil ID user yang sedang login
        $userId = Auth::id();

        // Mengambil proyek yang dimiliki oleh user yang sedang login
        $projects = Project::where('iduser', $userId)->with('tasks')->get();

        return response()->json($projects, 200);
    }

    /**
     * Create a new project.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_project' => 'required|string|max:255',
        ]);

        // Menambahkan iduser yang berasal dari user yang sedang login
        $validated['iduser'] = Auth::id();

        // Membuat proyek baru dengan ID user
        $project = Project::create($validated);

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
        $userId = Auth::id(); // Mengambil ID user yang sedang login
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)  // Memastikan proyek milik user yang login
            ->with('tasks')
            ->first();

        if (!$project) {
            return response()->json(['message' => 'Project not found or you do not have access to this project'], 404);
        }

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
            return redirect()->route('projects.index')->with('error', 'Project not found or you do not have access to this project');
        }

        return view('project.detail', compact('project'));
    }
}
