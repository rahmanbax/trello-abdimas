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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
    <link rel="icon" href="{{ asset('assets/images/procodecg-icon.png') }}" type="image/png">
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
            <h2 class="text-2xl font-semibold">Daftar Project Saya</h2>
            <div class="flex items-center gap-3">
                <input id="project-search" type="search" placeholder="Cari project..." 
                    class="px-3 py-2 border border-gray-300 rounded-md w-64 focus:ring-blue-500 focus:border-blue-500" />

                <button id="open-modal-create" class="font-medium flex items-center gap-2 py-2 px-3 text-white bg-blue-600 hover:bg-blue-500 shadow-sm rounded-md">
                    <i class="ph-bold ph-plus"></i>Tambah Project
                </button>
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

    <script src="{{ asset('assets/js/owner-dashboard.js') }}"></script>
    <x-loading-overlay />
</body>
</html>