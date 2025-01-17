<?php
namespace App\Http\Controllers;

use App\Models\Project;
<<<<<<< HEAD
use Illuminate\Support\Facades\Auth;
=======
use Illuminate\Http\Request;
>>>>>>> save

class ProjectController extends Controller
{

    /**
     * Fetch all project with their associated tasks.
     */
    public function index()
    {
<<<<<<< HEAD
        $userId = Auth::id();
        if (!$userId) {
            return response()->json(['message' => 'User not authenticated'], 401); // Pastikan ID pengguna ada
        }

        $project = Project::where('iduser', $userId)->with('tasks')->get();
        return response()->json($project, 200);
=======
        $user     = auth()->user();
        $projects = Project::with('tasks')->where('iduser', $user->id)->get();

        return response()->json($projects, 200);

>>>>>>> save
    }



    public function store(Request $request)
    {
<<<<<<< HEAD
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

=======
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
>>>>>>> save

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

<<<<<<< HEAD
        if (!$project) {
            return response()->json(['message' => 'Project not found or you do not have access to this project'], 404);
=======
        if (! $project) {
            return response()->json(['message' => 'Project not found'], 404);
>>>>>>> save
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
        $userId = Auth::id(); // Mengambil ID user yang sedang login
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)  // Memastikan proyek milik user yang login
            ->first();

<<<<<<< HEAD
        if (!$project) {
            return response()->json(['message' => 'Project not found or you do not have access to this project'], 404);
=======
        if (! $project) {
            return response()->json(['message' => 'Project not found'], 404);
>>>>>>> save
        }

        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }


    public function showDetail($id)
    {
<<<<<<< HEAD
        $userId = Auth::id(); // Mengambil ID user yang sedang login
        $project = Project::where('idproject', $id)
            ->where('iduser', $userId)  // Memastikan proyek milik user yang login
            ->with('tasks')
            ->first();

        if (!$project) {
            return redirect()->route('project.index')->with('error', 'Project not found or you do not have access to this project');
        }

        return view('project.detail', compact('project'));
=======
        $project = Project::with('tasks')->find($id); // Mengambil proyek beserta tugasnya

        if (! $project) {
            return redirect()->route('projects.index')->with('error', 'Project not found');
        }

        return view('project.detail', compact('project')); // Mengirim data proyek ke view detail
>>>>>>> save
    }
}
