<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use App\Models\Collaborator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


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
        $projects = Project::with('collaborators')
            ->where('iduser', $userid) // project milik user
            ->orWhereHas('collaborators', function ($query) use ($userid) { // project yang dikolaborasikan ke user
                $query->where('user_id', $userid);
            })
            ->orderBy('updated_at', 'desc')
            ->get();

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

    public function getProjectUsers($idproject)
    {
        // Ambil project beserta relasi collaborators dan user dari masing-masing collaborator
        $project = Project::with('collaborators.user')->find($idproject);

        if (!$project) {
            return response()->json(['message' => 'Project not found'], 404);
        }

        // Ambil user dari relasi collaborators
        $users = $project->collaborators->map(function ($collaborator) {
            return [
                'id' => $collaborator->user->id,
                'name' => $collaborator->user->name,
                'email' => $collaborator->user->email,
            ];
        });

        // Ambil informasi pemilik project
        $owner = [
            'id' => $project->iduser, // Kolom iduser adalah id pemilik
            'name' => $project->user->name, // Pastikan project punya relasi ke user
            'email' => $project->user->email,
        ];

        return response()->json([
            'users' => $users,
            'owner' => $owner,
        ]);
    }


    public function removeUser($projectId, $userId)
    {
        $authUserId = auth()->user()->id;

        // Ambil project dulu
        $project = Project::find($projectId);

        Log::info('ID pemilik project: ' . $project->iduser);
        Log::info('ID pengguna yang menghapus: ' . $authUserId);

        // Cek apakah ingin menghapus diri sendiri
        if ($authUserId == $userId) {
            return response()->json(['message' => 'Anda tidak dapat menghapus diri sendiri dari project.'], 403);
        }

        // Cek apakah yang menghapus adalah owner project
        if ($project->iduser != $authUserId) {
            return response()->json(['message' => 'Akses ditolak. Anda bukan pemilik project.'], 403);
        }


        // Hapus user dari tabel collaborator
        $deleted = DB::table('collaborators')
            ->where('project_id', $projectId)
            ->where('user_id', $userId)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'User berhasil dihapus dari project.']);
        }
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
        ]);

        Log::info('Kolaborator berhasil ditambahkan', ['collaborator' => $created]);

        return redirect()->back()->with('success', 'User berhasil diundang.');
    }

    public function checkEmail(Request $request)
    {
        $email = $request->input('email');
        $projectId = $request->input('project_id');

        // Log email dan project id yang dikirim
        Log::info('Cek email diundang: ' . $email . ' untuk project ID: ' . $projectId);

        // Cek jika user mencoba mengundang dirinya sendiri
        if ($email == auth()->user()->email) {
            Log::info('User mencoba mengundang dirinya sendiri.');
            return response()->json(['available' => false, 'message' => 'Anda tidak bisa mengundang diri sendiri']);
        }

        // Cek apakah user dengan email tersebut ada
        $user = User::where('email', $email)->first();

        if (!$user) {
            Log::info('User dengan email ' . $email . ' tidak ditemukan di tabel users.');
            return response()->json(['available' => false, 'message' => 'Email tidak ditemukan']);
        }

        Log::info('User ditemukan: ID = ' . $user->id . ', Email = ' . $user->email);

        // Cek apakah user sudah tergabung dalam project
        $alreadyExists = DB::table('collaborators')
            ->where('project_id', $projectId)
            ->where('user_id', $user->id)
            ->exists();

        Log::info('Query: SELECT * FROM collaborators WHERE project_id = ' . $projectId . ' AND user_id = ' . $user->id);
        Log::info('User sudah tergabung: ' . ($alreadyExists ? 'YA' : 'TIDAK'));

        if ($alreadyExists) {
            return response()->json(['available' => false, 'message' => 'User sudah tergabung di proyek']);
        }

        // Jika semua valid, email tersedia untuk diundang
        return response()->json(['available' => true, 'message' => 'Email tersedia untuk diundang']);
    }
}
