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
  <div class="my-6 mx-5 lg:mx-20">
    <div class="flex justify-between">
      <h1 id="project-name" class="font-semibold text-xl"></h1>
      <div class="flex gap-2 items-center ">
        <button id="add-task-btn" class="flex items-center gap-2 py-2 px-3 rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-sm"><i class="ph-bold ph-plus"></i>Tambah tugas</button>
        <div class="h-full w-10 items-center rounded-lg justify-center flex border-slate-200 bg-white hover:bg-slate-100 border-2">
          <i class="ph-bold ph-dots-three "></i>
        </div>

      </div>
    </div>
    <div class="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- To-do -->
      <div class="connectedSortable ease-in rounded-lg bg-slate-100 border-2 border-slate-200  p-3 h-fit">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <h2 class="bg-red-100 text-base font-medium w-max px-2 rounded mr-2 text-gray-700">To-do</h2>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <!-- board card -->
        <div id="sortable1" class="grid grid-rows-2 gap-2">
          <!-- Card -->
        </div>
      </div>

      <!-- WIP Kanban -->
      <div class="connectedSortable  rounded-lg bg-slate-100 border-2 border-slate-200 p-3 h-fit">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <h2 class="bg-yellow-100 text-base font-medium w-max px-2 rounded mr-2 text-gray-700">On Progress</h2>

          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <div id="sortable2" class="grid grid-rows-2 gap-2">
          <!-- Card -->

        </div>
      </div>

      <!-- Complete Kanban -->
      <div class="connectedSortable rounded-lg bg-slate-100 border-2 border-slate-200  p-3 h-fit">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <h2 class="bg-green-100 text-base font-medium w-max px-2 rounded mr-2 text-gray-700">Completed</h2>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <div id="sortable3" class="grid grid-rows-2 gap-2">
          <!-- Card -->
          <!-- <div class="task-card"></div> -->
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL BUAT -->
  <div id="modal" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-4 w-[400px]">
          <div class="">

            <div class="text-left">
              <h3 class="text-base font-semibold text-gray-900" id="modal-title">Tambah tugas baru</h3>
              <div class="mt-2">
                <input
                  type="text"
                  id="taskname"
                  name="taskname"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nama tugas"
                  aria-labelledby="taskname"
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

  <!-- MODAL EDIT -->
  <div id="modal-edit" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all p-4 w-[400px]">
          <div class="">
            <div class="text-left">
              <h3 class="text-base font-semibold text-gray-900" id="modal-title">Edit nama tugas</h3>
              <div class="mt-2">
                <input
                  type="text"
                  id="taskname-edit"
                  name="taskname-edit"
                  class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Nama tugas"
                  aria-labelledby="taskname-edit"
                  autocomplete="off" />
              </div>
            </div>
          </div>
          <div class="bg-gray-50 flex sm:flex-row-reverse mt-4">
            <button id="simpan-btn" type="button" class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto">Simpan</button>
            <button id="close-modal-edit" type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 sm:mt-0 sm:w-auto">Batal</button>
          </div>
        </div>
      </div>
    </div>
  </div>


  <script src="/task.js"></script>

</body>

</html>