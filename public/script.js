init_draggable($('.draggable-item'));

$('#sortable2').sortable({
	connectWith: '#sortable1, #sortable2',
  items: '.draggable-item, .sortable-item',
  start: function(event, ui) {
    $('#sortable1').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      // destroy draggable so that we can drag outside the sortable container
      ui.item.draggable( "destroy" ); 
    }
    console.log(ui)
  }
});

$('#sortable1').sortable({
  connectWith: '#sortable1, #sortable2',
  items: '.draggable-item, .sortable-item',
  receive: function(event, ui) {
    $('#sortable1').sortable('disable');
    var widget = ui.item;
    init_draggable(widget);
  }
});

function init_draggable(widget) {
	widget.draggable({
    connectToSortable: '#sortable2',
    stack: '.draggable-item',
    revert: true,
    revertDuration: 200,
    start: function(event, ui) {
      $('#sortable1').sortable('disable');
    }
  });
}
