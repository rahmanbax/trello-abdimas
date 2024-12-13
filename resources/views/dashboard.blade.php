<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Task Management</title>
  
  <!-- jQuery Library -->
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">

  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
    }

    .task-container {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .task-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 260px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 15px;
    }

    .task-column h3 {
      color: #444;
      margin-bottom: 15px;
      font-size: 18px;
    }

    ul {
      padding: 0;
      list-style-type: none;
      width: 100%;
    }

    li {
      text-align: center;
      padding: 10px;
      margin-bottom: 10px;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      cursor: move;
      transition: background-color 0.3s ease;
    }

    .draggable-item {
      background-color: #3498db;
    }

    .sortable-item {
      background-color: #0000;
    }

    .connectedSortable li:hover {
      opacity: 0.9;
    }
  </style>
</head>

<body>
  <h2>Task Management</h2>
  
  <div class="task-container">
    <div class="task-column">
      <h3>Todo</h3>
      <ul id="sortable1" class="connectedSortable">
        <!-- Tasks with status 1 will be added here -->
      </ul>
    </div>

    <div class="task-column">
      <h3>Ongoing</h3>
      <ul id="sortable2" class="connectedSortable">
        <!-- Tasks with status 2 will be added here -->
      </ul>
    </div>

    <div class="task-column">
      <h3>Completed</h3>
      <ul id="sortable3" class="connectedSortable">
        <!-- Tasks with status 3 will be added here -->
      </ul>
    </div>
  </div>

  <!-- External JavaScript file -->
  <script src="script.js"></script>
</body>

</html>
