// Inisialisasi draggable untuk semua elemen yang memiliki kelas .draggable-item
init_draggable($('.draggable-item'));

// Konfigurasi untuk sortable1
$('#sortable1').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item',
  receive: function(event, ui) {
    // Pastikan draggable kembali diaktifkan setelah item dipindahkan
    var widget = ui.item;
    init_draggable(widget); // Inisialisasi ulang draggable pada widget

    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '1');
  },
  update: function(event, ui) {
    // Cek apakah sortable1 kosong dan enable jika perlu
    if ($('#sortable1').children().length === 0) {
      $('#sortable1').sortable('enable');
    }
  }
});

// Konfigurasi untuk sortable2
$('#sortable2').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item',
  start: function(event, ui) {
    // Enable semua sortable
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      ui.item.draggable("destroy"); // Hancurkan draggable yang sudah ada
    }

    // Inisialisasi draggable kembali untuk item yang dipindahkan
    init_draggable(ui.item);

    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '2');
  },
  update: function(event, ui) {
    // Cek apakah sortable2 kosong dan enable jika perlu
    if ($('#sortable2').children().length === 0) {
      $('#sortable2').sortable('enable');
    }
  }
});

// Konfigurasi untuk sortable3
$('#sortable3').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item',
  start: function(event, ui) {
    // Enable semua sortable
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      ui.item.draggable("destroy"); // Hancurkan draggable yang sudah ada
    }

    // Inisialisasi draggable kembali untuk item yang dipindahkan
    init_draggable(ui.item);

    // Update status melalui AJAX setelah item dipindahkan
    updateStatus(ui.item, '3');
  },
  update: function(event, ui) {
    // Cek apakah sortable3 kosong dan enable jika perlu
    if ($('#sortable3').children().length === 0) {
      $('#sortable3').sortable('enable');
    }
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
      // Disable sortable untuk semua elemen ketika drag dimulai
      $('#sortable1, #sortable2, #sortable3').sortable('disable');
    },
    stop: function(event, ui) {
      // Enable semua sortable setelah drag selesai
      $('#sortable1, #sortable2, #sortable3').sortable('enable');
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
  // Ambil ID proyek dari URL
  const projectId = window.location.pathname.split('/').pop(); // Mengambil ID dari URL

  // Endpoint untuk mendapatkan nama proyek
  const projectApiEndpoint = `http://127.0.0.1:8000/api/projects/${projectId}`;

  // Mengambil nama proyek menggunakan fetch
  fetch(projectApiEndpoint)
    .then(response => response.json())
    .then(data => {
      if (data && data.nama_project) {
        // Update nama proyek di halaman
        document.getElementById('project-name').textContent = data.nama_project;
      } else {
        console.error('Nama proyek tidak ditemukan');
      }
    })
    .catch(error => {
      console.error('Gagal mengambil nama proyek:', error);
    });

  const apiEndpoint = `http://127.0.0.1:8000/api/tasks?idproject=${projectId}`;

  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const sortable1 = document.getElementById('sortable1');
        const sortable2 = document.getElementById('sortable2');
        const sortable3 = document.getElementById('sortable3');

        data.forEach(task => {
          const liElement = document.createElement('div');
          liElement.classList.add('draggable-item', 'task-card');
          liElement.textContent = `${task.nama_task}`;
          liElement.dataset.taskId = task.idtask; // Menyimpan ID task dalam data-task-id
          liElement.dataset.projectId = task.idproject; // Menyimpan ID project dalam data-project-id

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

$('#add-task-btn').click(function() {
  $('#modal').removeClass('hidden');
});

// Menutup modal ketika tombol "Batal" diklik
$('#close-modal-btn').click(function() {
  $('#modal').addClass('hidden');
});

// Fungsi untuk menambahkan tugas baru
function addNewTask(taskName, projectId) {
  // Kirim permintaan POST ke API untuk menambahkan tugas baru
  $.ajax({
    url: 'http://127.0.0.1:8000/api/tasks',  // Endpoint API untuk menambahkan task
    type: 'POST',
    data: JSON.stringify({
      nama_task: taskName,  // Nama tugas
      status: '1',  // Status awal tugas adalah "To-do"
      idproject: projectId,  // ID proyek yang dipilih
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Task berhasil ditambahkan:', response);

      // Tambahkan tugas ke dalam kanban di halaman
      addTaskToKanban(response.idtask, taskName, projectId);
      
      // Tutup modal setelah berhasil menambahkan
      $('#modal').addClass('hidden');
    },
    error: function(xhr, status, error) {
      console.error('Gagal menambahkan tugas:', error);
      console.log('Respons dari server:', xhr.responseText); // Tampilkan detail error
    }
  });
}

// Fungsi untuk menambahkan task ke dalam kanban di halaman
function addTaskToKanban(taskId, taskName, projectId) {
  const sortable1 = document.getElementById('sortable1');  // Kanban To-do

  // Membuat elemen baru untuk tugas
  const newTask = document.createElement('div');
  newTask.classList.add('draggable-item', 'task-card');
  newTask.dataset.taskId = taskId;
  newTask.textContent = taskName;  // Menyimpan ID task dalam data-task-id
  newTask.dataset.projectId = projectId;  // Menyimpan ID project dalam data-project-id

  // Menambahkan task ke kanban yang sesuai (To-do dalam hal ini)
  sortable1.appendChild(newTask);

  // Menginisialisasi draggable pada task baru
  init_draggable($(newTask));
}

$('#tambah-btn').click(function() {
  // Ambil nama tugas dari input
  const taskName = $('#taskname').val().trim();

  // Cek jika nama tugas tidak kosong
  if (taskName) {
    // Ambil ID proyek dari URL (seperti yang dilakukan sebelumnya)
    const projectId = window.location.pathname.split('/').pop(); // ID proyek

    // Panggil fungsi untuk menambahkan tugas baru
    addNewTask(taskName, projectId);
  } else {
    alert('Nama tugas tidak boleh kosong!');
  }
});