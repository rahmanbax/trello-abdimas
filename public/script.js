// Inisialisasi draggable untuk semua elemen yang memiliki kelas .draggable-item
init_draggable($('.draggable-item'));

// Konfigurasi untuk sortable1
$('#sortable1').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3',
  items: '.draggable-item',
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
  items: '.draggable-item',
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
  items: '.draggable-item',
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
// Fungsi untuk memuat daftar project ke dalam dropdown
function loadProjects() {
  const apiEndpoint = 'http://127.0.0.1:8000/api/projects'; // Endpoint untuk mengambil daftar project

  // Mengambil daftar project dari API
  $.ajax({
    url: apiEndpoint,
    type: 'GET',
    success: function(response) {
      const projectSelect = document.getElementById('project-id');

      // Clear existing options
      projectSelect.innerHTML = '';

      // Menambahkan opsi "Pilih Project"
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Pilih Project';
      projectSelect.appendChild(defaultOption);

      // Menambahkan opsi project yang diambil dari API
      response.forEach(project => {
        const option = document.createElement('option');
        option.value = project.idproject;  // Set value ke ID project
        option.textContent = project.nama_project;  // Set teks ke nama project
        projectSelect.appendChild(option);
      });
    },
    error: function(xhr, status, error) {
      console.error('Gagal mengambil data project:', error);
      console.log('Respons dari server:', xhr.responseText);
    }
  });
}

// Fungsi untuk membuat task baru
function createTask(taskName, projectId) {
  const apiEndpoint = 'http://127.0.0.1:8000/api/tasks';  // Endpoint API untuk membuat task baru

  // Mengirim permintaan POST untuk membuat task baru
  $.ajax({
    url: apiEndpoint,
    type: 'POST',
    data: JSON.stringify({
      nama_task: taskName,      // Nama task
      status: '1',              // Status default (1: Todo)
      idproject: projectId      // ID project terkait
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Task berhasil dibuat:', response);

      // Setelah task berhasil dibuat, tambahkan item ke daftar Todo
      const newTask = response; // Asumsi response berisi data task yang baru dibuat
      const liElement = document.createElement('li');
      liElement.classList.add('ui-state-default', 'draggable-item');
      liElement.textContent = newTask.nama_task;
      liElement.dataset.taskId = newTask.idtask;  // Menyimpan ID task dalam data-task-id
      liElement.dataset.projectId = newTask.idproject;  // Menyimpan ID project

      // Menambahkan task ke #sortable1 (Todo list)
      document.getElementById('sortable1').appendChild(liElement);

      // Inisialisasi draggable pada task yang baru
      init_draggable($(liElement));

      location.reload();  // Reload halaman
    },
    error: function(xhr, status, error) {
      console.error('Gagal membuat task:', error);
      console.log('Respons dari server:', xhr.responseText); // Tampilkan detail error
    }
  });
}

// Menangani submit form untuk membuat task baru
document.getElementById('create-task-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Ambil data dari form
  const taskName = document.getElementById('task-name').value;
  const projectId = document.getElementById('project-id').value;

  // Validasi data
  if (!taskName || !projectId) {
    alert('Nama task dan ID project harus diisi');
    return;
  }

  // Buat task baru
  createTask(taskName, projectId);

  // Kosongkan form setelah submit
  document.getElementById('create-task-form').reset();
});

// Muat daftar project saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  loadProjects(); // Memuat daftar project ke dropdown
});

// Fungsi untuk membuat project baru
function createProject(projectName) {
  const apiEndpoint = 'http://127.0.0.1:8000/api/projects'; // Endpoint API untuk membuat project baru

  // Mengirim permintaan POST untuk membuat project baru
  $.ajax({
    url: apiEndpoint,
    type: 'POST',
    data: JSON.stringify({
      nama_project: projectName,  // Nama project yang diterima dari form
    }),
    contentType: 'application/json',
    success: function(response) {
      console.log('Project berhasil dibuat:', response);
      
      // location.reload();  // Reload halaman
    },
    error: function(xhr, status, error) {
      console.error('Gagal membuat project:', error);
      console.log('Respons dari server:', xhr.responseText); // Tampilkan detail error
    }
  });
}

// Menangani submit form untuk membuat project baru
document.getElementById('create-project-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Ambil data dari form
  const projectName = document.getElementById('project-name').value;

  // Validasi data
  if (!projectName) {
    alert('Nama project harus diisi');
    return;
  }

  // Buat project baru
  createProject(projectName);

  // Kosongkan form setelah submit
  document.getElementById('create-project-form').reset();
});