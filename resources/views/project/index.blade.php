<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>ProCodeCG</title>
    @vite('resources/css/app.css')
    <link href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
    <link rel="icon" href="{{ asset('assets/images/procodecg-logo2.png') }}" type="image/png">
</head>

<body class="bg-slate-100">
    <header class="bg-white py-4 border-b-2 border-slate-200">
        <div class="mx-20 flex justify-between items-center">
            <a href=""><img src="{{ asset('assets/images/procodecg-logo.png') }}" alt="ProCodeCG Logo" width="140"></a>
            <div class="flex gap-4 items-center">

                <div class="relative inline-block">
                    <div>
                        <div class="">
                            <button type="button" class="px-4 py-2 items-center justify-center flex rounded-full gap-2 bg-white hover:bg-slate-100 font-medium" id="user-button" aria-expanded="false" aria-haspopup="true">
                                <p id="user-name"></p><i class="ph ph-caret-down"></i>
                            </button>
                        </div>

                        <!-- Dropdown user -->
                        <div id="dropdown-user" class="hidden absolute right-0 z-10 mt-3 w-44 origin-top-right bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" role="user" aria-orientation="vertical" aria-labelledby="user-button" tabindex="-1">
                            <div class="p-1" role="none">
                                <button class="font-medium flex gap-2 items-center text-red-500 text-base px-4 py-2 hover:bg-slate-100 w-full" role="menuitem" tabindex="-1" id="logout-btn"><i class="ph ph-sign-out"></i>Log out</button>
                            </div>
                        </div>

                    </div>
    </header>

    <div class="my-6 mx-5 lg:mx-20">
        <div class="flex justify-between">
            <h2 class="text-2xl font-semibold">Daftar Proyek</h2><button id="add-project-btn" class="font-medium place-self-end flex items-center gap-2 py-2 px-3 text-white bg-blue-600 hover:bg-blue-500 shadow-sm"><i class="ph-bold ph-plus"></i>Tambah proyek</button>
        </div>


        <div id="project-container" class="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 gap-y-6">
            <!-- <div class="project-card"></div> -->


        </div>
    </div>

    <!-- MODAL -->
    <div id="modal" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden bg-white text-left shadow-xl transition-all p-4 w-[400px]">
                    <div class="">

                        <div class="text-left">
                            <h3 class="text-base font-semibold text-gray-900" id="modal-title">Tambah proyek baru</h3>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    id="projectname"
                                    name="projectname"
                                    class="block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nama proyek"
                                    aria-labelledby="projectname"
                                    autocomplete="off" />
                            </div>
                        </div>

                    </div>
                    <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
                        <button id="tambah-btn" type="button" class="inline-flex w-full justify-center bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Tambah</button>
                        <button id="close-modal-btn" type="button" class="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/project.js"></script>

</body>

</html>