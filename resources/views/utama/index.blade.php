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
    <h1 class="text-xl">My Proyek Terapan</h1>
    <div class="mt-6 grid grid-cols-3 gap-8">
      <!-- To-do -->
      <div class="connectedSortable  rounded-lg bg-slate-100 p-3 h-fit">
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
      <div class="connectedSortable  rounded-lg bg-slate-100 p-3 h-fit">
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
      <div class="connectedSortable rounded-lg bg-slate-100 p-3 h-fit">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <h2 class="bg-green-100 text-base font-medium w-max px-2 rounded mr-2 text-gray-700">Completed</h2>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <div id="sortable3" class="grid grid-rows-2 gap-2">
          <!-- Card -->

        </div>
      </div>
    </div>
  </div>




  <script src="script.js"></script>

</body>

</html>