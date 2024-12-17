<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{

    public function index(Request $request)
    {
        // Mengambil parameter 'idproject' dari query string
        $idProject = $request->query('idproject');
        
        // Memastikan bahwa idproject ada dalam query dan valid
        if ($idProject) {
            // Menyaring data task berdasarkan 'idproject'
            $tasks = Task::where('idproject', $idProject)->get();
        } else {
            // Jika tidak ada parameter 'idproject', ambil semua data task
            $tasks = Task::all();
        }

        // Kembalikan data dalam format JSON
        return response()->json($tasks);
    }
    /**
     * Fetch all tasks with their related projects.
     */
    // public function index()
    // {
    //     $tasks = Task::with('project')->get();
    //     return response()->json($tasks, 200);
    // }

    /**
     * Create a new task.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_task' => 'required|string|max:255',
            'status' => 'required|in:1,2,3',
            'idproject' => 'required|exists:projects,idproject',
        ]);

        $task = Task::create($validated);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    /**
     * Retrieve a single task by its ID.
     */
    public function show($id)
    {
        $task = Task::with('project')->find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task, 200);
    }

    /**
     * Update a task.
     */
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $validated = $request->validate([
            'nama_task' => 'required|string|max:255',
            'status' => 'required|in:1,2,3',
            'idproject' => 'required|exists:projects,idproject',
        ]);

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ], 200);
    }

    /**
     * Delete a task.
     */
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }

    public function detail(Request $request)
    {
        // Mengambil parameter 'idproject' dari query string
        $idProject = $request->query('idproject');

        // Jika parameter idproject diberikan, kita filter data berdasarkan idproject
        if ($idProject) {
            $tasks = Task::where('idproject', $idProject)->get();
        } else {
            // Jika tidak ada parameter idproject, kembalikan semua data task
            $tasks = Task::all();
        }

        // Kembalikan response dalam format JSON
        return response()->json($tasks);
    }
}
