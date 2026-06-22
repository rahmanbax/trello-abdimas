<!DOCTYPE html>
<html lang="en">
<head>
    @vite('resources/css/app.css')
    <link rel="stylesheet" type="text/css"
        href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css" />
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
        crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js"
        integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="{{ asset('assets/css/owner.css') }}">
    <link rel="icon" href="{{ asset('assets/images/procodecg-icon.png') }}" type="image/png">
    <!-- Toastr CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css" />
</head>
<body class="bg-slate-50">
    <x-header-nav />

    @if (session('error'))
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 mx-5 lg:mx-20" role="alert">
        <span class="block sm:inline">{{ session('error') }}</span>
    </div>
    @endif

    <div class="my-6 mx-5 lg:mx-20">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Dashboard Daftar Project</h2>
            <div class="flex items-center gap-3">
                <input id="project-search" type="search" placeholder="Cari project..."
                    class="px-3 py-2 border border-gray-300 rounded-md w-64 focus:ring-blue-500 focus:border-blue-500" />

                <div class="relative" id="project-filter-dropdown">
                    <button id="project-filter-btn" class="font-medium flex items-center gap-2 py-2 px-3 text-blue-600 bg-white border border-blue-500 hover:bg-blue-50 shadow-sm rounded-md">
                        <i class="ph-bold ph-funnel"></i>
                        <span id="project-filter-btn-text" class="text-sm">Semua Semester</span>
                        <i class="ph-bold ph-caret-down text-xs"></i>
                    </button>
                    <div id="project-filter-panel" class="semester-filter-panel hidden absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
                        <div id="semester-filter-list" class="py-1 max-h-64 overflow-y-auto">
                            {{-- Semester items will be populated by JS --}}
                        </div>
                    </div>
                    <input type="hidden" id="project-filter-start-date" value="">
                    <input type="hidden" id="project-filter-end-date-iso" value="">
                </div>
                <button id="open-modal-create" class="font-medium flex items-center gap-2 py-2 px-3 text-white bg-blue-600 hover:bg-blue-500 shadow-sm rounded-md">
                    <i class="ph-bold ph-plus"></i>Tambah Project
                </button>
                <button id="global-add-task-btn" class="font-medium flex items-center gap-2 py-2 px-3 text-blue-500 rounded-md bg-white border border-blue-500 hover:bg-gray-100 shadow-sm">
                    <i class="ph-bold ph-plus"></i> Tambah Tugas
                </button>
            </div>
        </div>
            <div class="mb-5">
                <div class="bg-transparent">
                    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-base font-semibold text-gray-900">Task List</h3>
                        <span class="text-xs text-gray-500">Drag task ke board project untuk assign</span>
                    </div>

                    <div id="unassigned-task-list"
                        class="task-list sortable-task-list p-3 min-h-20 flex gap-3 overflow-x-auto overflow-y-hidden whitespace-nowrap"
                        data-status="1"
                        data-project-id="">
                        <div class="w-full text-center py-6 text-gray-400">
                            <i class="ph-bold ph-circle-notch animate-spin text-xl mb-2"></i>
                            <p>Memuat task list...</p>
                        </div>
                    </div>
                </div>
            </div>
        <div class="projects-wrapper">
            <div id="projects-container">
                <div class="text-center py-10 text-gray-500">
                    <i class="ph-bold ph-circle-notch animate-spin text-2xl mb-2"></i>
                    <p>Memuat projects...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Create Project -->
    <div id="modal-create-project" class="fixed inset-0 z-50 hidden flex bg-gray-500/75 items-center justify-center">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <button id="close-modal-create" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>

            <h2 class="text-2xl font-semibold mb-6">Buat Project Baru</h2>

            <form id="create-project-form">
                @csrf
                <div class="mb-4">
                    <label for="project-name" class="block text-sm font-medium mb-2">Nama Project</label>
                    <input type="text" id="project-name" name="nama_project"
                           class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                           placeholder="Masukkan nama project" required>
                </div>

                <div class="flex gap-3 justify-end mt-6">
                    <button type="button" id="cancel-create"
                            class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        Batal
                    </button>
                    <button type="submit"
                            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500">
                        Buat Project
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal Tambah Tugas (global) - minimal -->
    <div id="modal-add-task" class="fixed inset-0 z-50 hidden items-center justify-center bg-gray-900/50" style="z-index:99999; pointer-events:auto;">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative" style="pointer-events:auto;">
            <button id="modal-add-task-close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
            <h2 class="text-2xl font-semibold mb-4">Tambah Tugas</h2>

            <!-- <input type="hidden" id="modal-add-task-project-id" value="" /> -->

            <div class="mb-4">
                <label for="modal-add-task-name" class="block text-sm font-medium mb-2">Nama Tugas</label>
                <input type="text" id="modal-add-task-name" class="w-full px-4 py-2 border rounded-md" placeholder="Masukkan nama tugas" />
            </div>

            <div class="flex justify-end gap-3 mt-6">
                <button id="modal-add-task-cancel" class="px-4 py-2 text-gray-700 bg-white border rounded-md hover:bg-gray-50">Batal</button>
                <button id="modal-add-task-save" class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500">Simpan Tugas</button>
            </div>
        </div>
    </div>


    <script src="{{ asset('assets/js/owner-dashboard.js') }}"></script>

    <!-- Toastr JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>

    <x-loading-overlay />
</body>
</html>
