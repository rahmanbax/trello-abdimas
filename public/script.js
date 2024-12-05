// Inisialisasi draggable untuk semua elemen yang memiliki kelas .draggable-item
init_draggable($('.draggable-item'));

// Konfigurasi untuk sortable1
$('#sortable1').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item, .sortable-item',
  receive: function(event, ui) {
    $('#sortable1').sortable('disable');
    var widget = ui.item;
    init_draggable(widget);

    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '1');
  }
});

// Konfigurasi untuk sortable2
$('#sortable2').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item, .sortable-item',
  start: function(event, ui) {
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      ui.item.draggable("destroy");
    }
    
    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '2');
  }
});

// Konfigurasi untuk sortable3
$('#sortable3').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item, .sortable-item',
  start: function(event, ui) {
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      ui.item.draggable("destroy");
    }

    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '3');
  }
});

// Fungsi untuk menginisialisasi draggable pada widget
function init_draggable(widget) {
  widget.draggable({
    connectToSortable: '#sortable1, #sortable2, #sortable3',
    stack: '.draggable-item',
    revert: true,
    revertDuration: 200,
    start: function(event, ui) {
      $('#sortable1, #sortable2, #sortable3').sortable('disable');
    }
  });
}

// Fungsi untuk mengupdate status menggunakan AJAX
function updateStatus(item, status) {
  const taskId = item.data('task-id'); // Ambil task ID dari data-task-id
  const taskName = item.text(); // Ambil nama task dari teks elemen
  const taskProjectId = item.data('project-id'); // Ambil idproject dari data yang terkait dengan item

  // Kirim permintaan PUT ke API untuk memperbarui status task
  $.ajax({
    url: `http://127.0.0.1:8000/api/tasks/${taskId}`, // Endpoint API untuk update task
    type: 'PUT',
    data: JSON.stringify({
      nama_task: taskName, // Nama task
      status: status, // Status yang baru
      idproject: taskProjectId, // ID project
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Status berhasil diperbarui:', response);
    },
    error: function(xhr, status, error) {
      console.error('Gagal memperbarui status:', error);
      console.log('Respons dari server:', xhr.responseText); // Tampilkan detail error
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const apiEndpoint = 'http://127.0.0.1:8000/api/tasks';

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const sortable1 = document.getElementById('sortable1');
        const sortable2 = document.getElementById('sortable2');
        const sortable3 = document.getElementById('sortable3');

        data.forEach(task => {
          const liElement = document.createElement('li');
          liElement.classList.add('ui-state-default', 'draggable-item');
          liElement.textContent = `${task.nama_task}`;
          liElement.dataset.taskId = task.idtask; // Menyimpan ID task dalam data-task-id
          liElement.dataset.projectId = task.idproject; // Menyimpan ID project dalam data-project-id
          liElement.dataset.projectName = task.project.nama_project; // Menyimpan nama project dalam data-project-name

          // Menambahkan item ke sortable berdasarkan statusnya
          if (task.status === "1") {
            sortable1.appendChild(liElement);
          } else if (task.status === "2") {
            sortable2.appendChild(liElement);
          } else if (task.status === "3") {
            sortable3.appendChild(liElement);
          }
        });
      } else {
        console.log('Data tidak valid atau kosong');
      }
    })
    .catch(error => {
      console.error('Terjadi kesalahan saat mengambil data:', error);
    });
});