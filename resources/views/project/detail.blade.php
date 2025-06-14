<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="{{ asset('assets/images/procodecg-logo2.png') }}" type="image/png">
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css"
        href="https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/bold/style.css" />
    @vite('resources/css/app.css')
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

</head>

<body class="bg-slate-50">
    <x-header-nav />


    <div class="my-6 mx-5 lg:mx-20 ">
        <div class="flex justify-between bg-white p-4 outline outline-1 outline-slate-200 shadow-md rounded-lg">
            <h1 id="project-name" class="font-semibold text-3xl"></h1>
            <div class="flex gap-3 items-center ">

                <button id="invite-member-btn"
                    class="font-medium flex items-center gap-2 py-2 px-3 text-white bg-green-600 hover:bg-green-500 shadow-sm">
                    <i class="ph-bold ph-user-plus"></i>Share
                </button>

                <button id="add-task-btn"
                    class="font-medium flex items-center gap-2 py-2 px-3 text-white bg-blue-600 hover:bg-blue-500 shadow-sm rounded-md"><i
                        class="ph-bold ph-plus"></i>Tambah tugas</button>

                <div class="relative inline-block">
                    <div>
                        <button type="button"
                            class="h-10 w-10 items-center justify-center flex border-slate-200 bg-white hover:bg-slate-100 border-2 rounded-md"
                            id="menu-button" aria-expanded="false" aria-haspopup="true">
                            <i class="ph-bold ph-dots-three "></i>
                        </button>
                    </div>

                    <!-- Dropdown menu -->
                    <div id="dropdown-menu"
                        class="hidden absolute right-0 z-10 mt-3 w-44 origin-top-right bg-white shadow-lg ring-1 ring-black/5 focus:outline-none rounded-md"
                        role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                        <div class="p-1" role="none">
                            <button
                                class="font-medium flex gap-2 items-center text-slate-700 text-base px-4 py-2 hover:bg-slate-100 w-full rounded-md"
                                role="menuitem" tabindex="-1" id="menu-item-0"><i
                                    class="ph-bold ph-pencil-simple"></i>Edit proyek</button>
                            <button
                                class="font-medium flex gap-2 items-center text-red-500 text-base px-4 py-2 hover:bg-slate-100 w-full rounded-md"
                                role="menuitem" tabindex="-1" id="menu-item-1"><i class="ph-bold ph-trash"></i>Hapus
                                proyek</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Kanban Board -->
        <div class="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-12">

            <!-- <div
                class="mt-9 grid grid-cols-1 gap-7.5 sm:grid-cols-2 xl:grid-cols-3 bg-red-500"> -->
            <!-- Todo list -->
            <div id="todo"
                class="swim-lane flex flex-col gap-2 p-4 h-fit bg-white shadow-md outline outline-1 outline-slate-200 rounded-lg">
                <h4 class="text-xl font-bold text-black text-center my-4">
                    To Do's
                </h4>
            </div>

            <!-- Progress list -->
            <div id="in-progress"
                class="swim-lane flex flex-col gap-2 p-4 h-fit bg-white shadow-md outline outline-1 outline-slate-200 rounded-lg">
                <h4 class="text-xl font-bold text-black text-center my-4">
                    In Progress
                </h4>
            </div>

            <!-- Completed list -->
            <div id="completed"
                class="swim-lane flex flex-col gap-2 p-4 h-fit bg-white shadow-md outline outline-1 outline-slate-200 rounded-lg">
                <h4 class="text-xl font-bold text-black text-center my-4">
                    Completed
                </h4>
            </div>
            <!-- </div> -->


        </div>
    </div>

    <!-- MODAL Share -->
    <div id="modal-invite" class="fixed inset-0 z-50 hidden bg-black/50 flex items-center justify-center" role="dialog"
        aria-modal="true">
        <!-- Notification Messages -->
        @if (session('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-3">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3">
                {{ session('error') }}
            </div>
        @endif

        @if (session('info'))
            <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded mb-3">
                {{ session('info') }}
            </div>
        @endif

        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
            <!-- Close Button -->
            <button id="close-modal-invite"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>

            <!-- Modal Title -->
            <h2 class="text-2xl font-semibold mb-6">Share Board</h2>

            <!-- Invite Section -->
            <form id="invite-form" action="{{ route('project.invite') }}" method="POST" autocomplete="off">
                @csrf

                <input type="hidden" name="project_id" id="projectId" value="{{ $project->id }}">

                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Undang Anggota (Email)</label>
                    <div class="flex items-center gap-2">
                        <!-- Email Input -->
                        <input type="email" id="email-input" name="email"
                            class="w-full px-3 py-2 border rounded-md text-sm" placeholder="Masukkan email" required>

                        <!-- Role Selection -->
                        <select name="role" class="form-control w-full border rounded px-3 py-2">
                            <option value="anggota">Anggota</option>
                            <option value="author">Author</option>
                        </select>

                        <!-- Submit Button -->
                        <button type="submit"
                            class="btn btn-primary bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm">Share</button>
                    </div>
                    <!-- Pesan ketersediaan -->
                    <span id="email-status" class="text-sm ml-2 flex items-center gap-1"></span>
                </div>
            </form>

            <script>
                $(document).ready(function() {
                    $('#email-input').on('input', function() {
                        var email = $(this).val();
                        var status = $('#email-status');

                        if (email.length > 3 && email.includes('@')) { // validasi sederhana
                            $.ajax({
                                url: "{{ route('check.email') }}",
                                method: 'POST',
                                data: {
                                    email: email,
                                    _token: '{{ csrf_token() }}'
                                },
                                success: function(response) {
                                    if (response.available) {
                                        status.text('Email Available').css('color', 'green');
                                    } else {
                                        status.text('Email Not Available').css('color', 'red');
                                    }
                                },
                                error: function() {
                                    status.text('Error cek email').css('color', 'orange');
                                }
                            });
                        } else {
                            status.text('');
                        }
                    });
                });
            </script>

            <!-- Shareable Link -->
            <div class="mb-6">
                <label class="block text-sm font-medium mb-1">Link yang dapat dibagikan</label>
                <div class="flex items-center gap-2">
                    <input id="share-link" type="text"
                        class="w-full px-3 py-2 border rounded-md bg-gray-100 text-sm"
                        value="https://example.com/board/abc123" readonly>
                    <button id="copy-share-link"
                        class="px-3 py-2 text-sm text-white bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer">Copy</button>
                </div>
            </div>

            <!-- Divider -->
            <hr class="my-4 border-gray-300" />

            <!-- Member List -->
            <div>
                <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span class="font-medium text-black">Board Members (1)</span>
                    <a href="#" class="text-blue-500 hover:underline">Join requests</a>
                </div>

                <!-- Member Card -->
                <div class="flex items-center justify-between py-3 px-4 bg-gray-100 rounded-md">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        </div>
                        <div>
                            <div class="font-medium text-sm">{{ Auth::user()->name }} (you)</div>
                            <div class="text-xs text-gray-500">{{ Auth::user()->email }} • Workspace admin</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL BUAT TUGAS -->
    <div id="modal" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden bg-white text-left shadow-xl transition-all p-4 w-[400px] rounded-lg">
                    <div class="">

                        <div class="text-left">
                            <label for="taskname" class="text-base font-semibold text-gray-900"
                                id="modal-title">Tambah
                                tugas baru</label>
                            <div class="mt-2">
                                <input type="text" id="taskname" name="taskname"
                                    class="block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                    placeholder="Nama tugas" aria-labelledby="taskname" autocomplete="off" />
                            </div>
                        </div>

                    </div>
                    <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
                        <button id="tambah-btn" type="button"
                            class="inline-flex w-full justify-center bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto rounded-md">Tambah</button>
                        <button id="close-modal-btn" type="button"
                            class="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto rounded-md">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL EDIT -->
    <div id="modal-edit" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden bg-white text-left shadow-xl transition-all p-4 w-[400px] rounded-lg">
                    <div class="">
                        <div class="text-left">
                            <label class="text-base font-semibold text-gray-900" for="taskname-edit"
                                id="modal-title">Edit nama tugas</label>
                            <div class="mt-2">
                                <input type="text" id="taskname-edit" name="taskname-edit"
                                    class="block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                    placeholder="Nama tugas" aria-labelledby="taskname-edit" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
                        <button id="simpan-btn" type="button"
                            class="inline-flex w-full justify-center bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto rounded-md">Simpan</button>
                        <button id="close-modal-edit" type="button"
                            class="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto rounded-md">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- MODAL EDIT PROYEK -->
    <div id="modal-edit-proyek" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog"
        aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden bg-white text-left shadow-xl transition-all p-4 w-[400px] rounded-lg">
                    <div class="">
                        <div class="text-left">
                            <label for="proyek-edit" class="text-base font-semibold text-gray-900"
                                id="modal-title">Edit nama proyek</label>
                            <div class="mt-2">
                                <input type="text" id="proyek-edit" name="proyek-edit"
                                    class="block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
                                    placeholder="Nama tugas" aria-labelledby="proyek-edit" autocomplete="off" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
                        <button id="simpan-btn-proyek" type="button"
                            class="inline-flex w-full justify-center bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto rounded-md">Simpan</button>
                        <button id="close-modal-edit-proyek" type="button"
                            class="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto rounded-md">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/task.js"></script>

    <x-loading-overlay />
</body>

</html>
