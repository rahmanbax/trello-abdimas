<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>My Website</title>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">
  <link rel="stylesheet" href="styles.css">
</head>

<body>
<div class="project-form">
    <h2>Tambah Project Baru</h2>
    <form id="create-project-form">
      <label for="project-name">Nama Project:</label>
      <input type="text" id="project-name" name="project-name" required>
      
      <button type="submit">Buat Project</button>
    </form>
  </div>

  <!-- Form untuk membuat task baru -->
  <div class="task-form">
    <h2>Tambah Task Baru</h2>
    <form id="create-task-form">
      <label for="task-name">Nama Task:</label>
      <input type="text" id="task-name" name="task-name" required>
      
      <label for="project-id">Pilih Project:</label>
      <select id="project-id" name="project-id" required>
        <!-- Option project akan diisi melalui JavaScript -->
      </select>

      <button type="submit">Buat Task</button>
    </form>
  </div>

  <!-- Daftar Todo, Ongoing, Completed -->
  <h2>Todo</h2>
  <ul id="sortable1" class="connectedSortable">
    <!-- Task dengan status 1 akan muncul di sini -->
  </ul>

  <h2>Ongoing</h2>
  <ul id="sortable2" class="connectedSortable">
    <!-- Task dengan status 2 akan muncul di sini -->
  </ul>

  <h2>Completed</h2>
  <ul id="sortable3" class="connectedSortable">
    <!-- Task dengan status 3 akan muncul di sini -->
  </ul>

  <script src="script.js"></script>
</body>

</html>
