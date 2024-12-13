<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>My Website</title>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <div class="h-screen p-2">
    <div class="grid lg:grid-cols-7 md:grid-cols-4 sm:grid-cols-2 gap-5">
      <!-- To-do -->
      <div class="connectedSortable bg-white rounded px-2 py-2">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-red-100 text-sm w-max px-1 rounded mr-2 text-gray-700">To-do</h2>
            <p class="text-gray-400 text-sm">3</p>
          </div>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <!-- board card -->
        <div id="sortable1" class="grid grid-rows-2 gap-2">
          <!-- Example Task 1 -->
          <div class="draggable-item p-2 rounded shadow-sm border-gray-100 border-2">
            <h3 class="text-sm mb-3 text-gray-700">Social media</h3>
            <p class="bg-red-100 text-xs w-max p-1 rounded mr-2 text-gray-700">To-do</p>
            <div class="flex flex-row items-center mt-2">
              <div class="bg-gray-300 rounded-full w-4 h-4 mr-3"></div>
              <a href="#" class="text-xs text-gray-500">Sophie Worso</a>
            </div>
            <p class="text-xs text-gray-500 mt-2">2</p>
          </div>
        </div>
      </div>

      <!-- WIP Kanban -->
      <div class="connectedSortable bg-white rounded px-2 py-2">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-yellow-100 text-sm w-max px-1 rounded mr-2 text-gray-700">WIP</h2>
            <p class="text-gray-400 text-sm">2</p>
          </div>
          <div class="flex items-center text-gray-300">
            <p class="mr-2 text-2xl">---</p>
            <p class="text-2xl">+</p>
          </div>
        </div>
        <div id="sortable2" class="grid grid-rows-2 gap-2">
          <!-- Example Task 1 -->
          <div class="draggable-item p-2 rounded shadow-sm border-gray-100 border-2">
            <h3 class="text-sm mb-3 text-gray-700">Blog post live</h3>
            <p class="bg-yellow-100 text-xs w-max p-1 rounded mr-2 text-gray-700">WIP</p>
            <div class="flex flex-row items-center mt-2">
              <div class="bg-gray-300 rounded-full w-4 h-4 mr-3"></div>
              <a href="#" class="text-xs text-gray-500">Sophie Worso</a>
            </div>
            <p class="text-xs text-gray-500 mt-2">Jun 21, 2019</p>
            <p class="text-xs text-gray-500 mt-2">2</p>
          </div>
        </div>
      </div>

      <!-- Complete Kanban -->
      <div class="connectedSortable bg-white rounded px-2 py-2">
        <div class="flex flex-row justify-between items-center mb-2 mx-1">
          <div class="flex items-center">
            <h2 class="bg-green-100 text-sm w-max px-1 rounded mr-2 text-gray-700">Complete</h2>
            <p class="text-gray-400 text-sm">4</p>
          </div>
          <div class="flex items-center">
            <p class="text-gray-300 mr-2 text-2xl">---</p>
            <p class="text-gray-300 text-2xl">+</p>
          </div>
        </div>
        <div id="sortable3" class="grid grid-rows-2 gap-2">
          <!-- Example Task 1 -->
          <div class="draggable-item p-2 rounded shadow-sm border-gray-100 border-2">
            <h3 class="text-sm mb-3 text-gray-700">TESTT</h3>
            <p class="bg-yellow-100 text-xs w-max p-1 rounded mr-2 text-gray-700">WIP</p>
            <div class="flex flex-row items-center mt-2">
              <div class="bg-gray-300 rounded-full w-4 h-4 mr-3"></div>
              <a href="#" class="text-xs text-gray-500">Sophie Worso</a>
            </div>
            <p class="text-xs text-gray-500 mt-2">Jun 21, 2019</p>
            <p class="text-xs text-gray-500 mt-2">2</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    $(document).ready(function() {
      // Enable sortable functionality for all connected lists
      $(".connectedSortable").sortable({
        connectWith: ".connectedSortable",
        items: ".draggable-item", // Only make items with this class draggable
        placeholder: "ui-state-highlight", // Add a placeholder during the drag operation
        start: function(event, ui) {
          ui.item.css('background', '#f0f0f0'); // Change background on drag start
        },
        stop: function(event, ui) {
          ui.item.css('background', ''); // Reset background on drag stop
        },
        update: function(event, ui) {
          // You can handle the update event here, for example by sending AJAX requests
          console.log("Item moved:", ui.item);
        }
      }).disableSelection();
    });
  </script>
</body>

</html>