<?php
namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Collaborator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{

    /**
     * Fetch all projects with their associated tasks.
     */
    public function index()
    {
        $user     = auth()->user();
        $userid = $user->id;
        // $projects = Project::with('colaborators')->where('iduser', $user->id)->get();
        $projects = DB::select("SELECT DISTINCT idproject,nama_project FROM projects
INNER JOIN collaborators ON projects.idproject = collaborators.project_id
WHERE projects.iduser = $userid or collaborators.user_id = $userid;");
        return response()->json($projects, 200);
    }

    /**
     * Create a new project.
     */
    public function store(Request $request)
    {
        try {
            // Validasi hanya untuk nama_project
            $validated = $request->validate([
                'nama_project' => 'required|string|max:255',
            ]);

            // Mengambil ID pengguna yang sedang login
            $user = auth()->user();

            // Memastikan ID pengguna valid
            if (! $user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Membuat proyek baru dengan ID pengguna otomatis
            $project = Project::create([
                'nama_project' => $validated['nama_project'],
                'iduser'       => $user->id, // Menggunakan ID pengguna yang sedang login
            ]);

            return response()->json([
                'message' => 'Project created successfully',
                'project' => $project,
            ], 201);
        } catch (\Exception $e) {
            // Menangani error dengan memberikan informasi lebih jelas
            return response()->json([
                'error'   => 'Failed to create project',
                'message' => $e->getMessage(), // Tambahkan pesan error
            ], 500);
        }
    }

    /**
     * Retrieve a single project by its ID.
     */
    public function show($id)
    {
        $project = Project::with('tasks')->find($id);

        if (! $project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        return response()->json($project, 200);
    }

    /**
     * Update an existing project.
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (! $project) {
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
        $project = Project::find($id);

        if (! $project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }

       public function showDetail($id)
    {
        $project = Project::with('tasks')->find($id);

        if (! $project) {
            return redirect()->route('projects.index')->with('error', 'Project not found');
        }

        return view('project.detail', compact('project'));
    }

    public function invite(Request $request)
    {
        Log::info('Invite method dipanggil', ['request' => $request->all()]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            Log::warning('User tidak ditemukan', ['email' => $request->email]);
            return redirect()->back()->with('error', 'User dengan email tersebut tidak ditemukan.');
        }

        $created = Collaborator::create([
            'project_id' => $request->project_id,
            'user_id'    => $user->id,
            'role'       => $request->role,
        ]);

        Log::info('Kolaborator berhasil ditambahkan', ['collaborator' => $created]);

        return redirect()->back()->with('success', 'User berhasil diundang.');
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input('email');

        $exists = User::where('email', $email)->exists();

        return response()->json(['available' => $exists]);
    }


}