<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>My Website</title>
  <script src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/ui/1.14.0/jquery-ui.js" integrity="sha256-u0L8aA6Ev3bY2HI4y0CAyr9H8FRWgX4hZ9+K7C2nzdc=" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css" ></link>
  <link rel="stylesheet" href="styles.css" ></link>
  
</head>

<body>
  <ul id="sortable1" class="connectedSortable">
    <li class="ui-state-default draggable-item">Item 1</li>
    <li class="ui-state-default draggable-item">Item 2</li>
    <li class="ui-state-default draggable-item">Item 3</li>
    <li class="ui-state-default draggable-item">Item 4</li>
    <li class="ui-state-default draggable-item">Item 5</li>
  </ul>

  <ul id="sortable2" class="connectedSortable">
    <li class="ui-state-highlight sortable-item">Item 1</li>
    <li class="ui-state-highlight sortable-item">Item 2</li>
    <li class="ui-state-highlight sortable-item">Item 3</li>
    <li class="ui-state-highlight sortable-item">Item 4</li>
    <li class="ui-state-highlight sortable-item">Item 5</li>
  </ul>


  <script src="script.js"></script>
</body>

</html>