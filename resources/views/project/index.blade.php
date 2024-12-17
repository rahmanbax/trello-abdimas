<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Project</title>
    @vite('resources/css/app.css')
    <link href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
</head>

<body>
    <div class="my-6 mx-20">
        <h1 class="text-xl font-semibold">Proyek anda</h1>

        <div id="project-container" class="mt-6 grid grid-cols-4 gap-8 gap-y-4">
            <!-- <div class="project-card"></div> -->
            <button id="add-project-btn" class="bg-white hover:bg-slate-300 hover:cursor-pointer text-lg border-2 border- border-slate-300 border-dashed rounded-lg p-3 h-24 flex items-center gap-2 place-content-center">
                <i class="ph-bold ph-plus"></i>
                Tambah proyek
            </button>
        </div>
    </div>

    <!-- MODAL -->
    <div id="modal" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-4 w-[400px]">
                    <div class="">

                        <div class="text-left">
                            <h3 class="text-base font-semibold text-gray-900" id="modal-title">Tambah proyek baru</h3>
                            <div class="mt-2">
                                <input
                                    type="text"
                                    id="projectname"
                                    name="projectname"
                                    class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Nama proyek"
                                    aria-labelledby="projectname"
                                    autocomplete="off" />
                            </div>
                        </div>

                    </div>
                    <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
                        <button id="tambah-btn" type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Tambah</button>
                        <button id="close-modal-btn" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm  ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="project.js"></script>

</body>

</html>