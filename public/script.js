// Inisialisasi draggable untuk semua elemen yang memiliki kelas .draggable-item
init_draggable($('.draggable-item'));

// Konfigurasi untuk sortable2
$('#sortable2').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3', // Tambahkan #sortable3 untuk koneksi
  items: '.draggable-item, .sortable-item',
  start: function(event, ui) {
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      // Hancurkan draggable agar bisa drag keluar dari container sortable
      ui.item.draggable("destroy");
    }
    console.log(ui);
  }
});

// Konfigurasi untuk sortable1
$('#sortable1').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3', // Tambahkan #sortable3 untuk koneksi
  items: '.draggable-item, .sortable-item',
  receive: function(event, ui) {
    $('#sortable1').sortable('disable');
    var widget = ui.item;
    init_draggable(widget);
  }
});

// Konfigurasi untuk sortable3
$('#sortable3').sortable({
  connectWith: '#sortable1, #sortable2, #sortable3', // Tambahkan #sortable1 dan #sortable2
  items: '.draggable-item, .sortable-item',
  start: function(event, ui) {
    $('#sortable1, #sortable2, #sortable3').sortable('enable');
  },
  receive: function(event, ui) {
    if (ui.item.hasClass('ui-draggable')) {
      // Hancurkan draggable agar bisa drag keluar dari container sortable
      ui.item.draggable("destroy");
    }
    console.log(ui);
  }
});

// Fungsi untuk menginisialisasi draggable pada widget
function init_draggable(widget) {
  widget.draggable({
    connectToSortable: '#sortable1, #sortable2, #sortable3', // Tambahkan #sortable3
    stack: '.draggable-item',
    revert: true,
    revertDuration: 200,
    start: function(event, ui) {
      $('#sortable1, #sortable2, #sortable3').sortable('disable');
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
  // API endpoint untuk mengambil data
  const apiEndpoint = 'http://127.0.0.1:8000/api/tasks'; // Ganti dengan URL API yang sesuai

  // Ambil data dari API
  fetch(apiEndpoint)
    .then(response => response.json()) // Mengubah respons menjadi JSON
    .then(data => {
      // Memeriksa apakah data berupa array
      if (Array.isArray(data) && data.length > 0) {
        // Ambil elemen <ul> untuk masing-masing status
        const sortable1 = document.getElementById('sortable1');
        const sortable2 = document.getElementById('sortable2');
        const sortable3 = document.getElementById('sortable3');

        // Iterasi data dan pisahkan berdasarkan status
        data.forEach(task => {
          // Buat elemen <li> untuk setiap task
          const liElement = document.createElement('li');
          liElement.classList.add('ui-state-default', 'draggable-item');
          liElement.textContent = `${task.nama_task} (Project: ${task.project.nama_project})`;

          // Masukkan task ke dalam <ul> berdasarkan status
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
