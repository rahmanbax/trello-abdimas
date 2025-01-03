// Inisialisasi draggable untuk semua elemen yang memiliki kelas .draggable-item
init_draggable($(".draggable-item"));

// Konfigurasi untuk sortable1
$("#sortable1").sortable({
    connectWith: "#sortable1, #sortable2, #sortable3",
    items: ".draggable-item",
    receive: function (event, ui) {
        // Pastikan draggable kembali diaktifkan setelah item dipindahkan
        var widget = ui.item;
        init_draggable(widget); // Inisialisasi ulang draggable pada widget

        // Update status melalui AJAX setelah item dipindahkan
        updateStatus(ui.item, "1");
    },
    update: function (event, ui) {
        // Cek apakah sortable1 kosong dan enable jika perlu
        if ($("#sortable1").children().length === 0) {
            $("#sortable1").sortable("enable");
        }
    },
});

// Konfigurasi untuk sortable2
$("#sortable2").sortable({
    connectWith: "#sortable1, #sortable2, #sortable3",
    items: ".draggable-item",
    start: function (event, ui) {
        // Enable semua sortable
        $("#sortable1, #sortable2, #sortable3").sortable("enable");
    },
    receive: function (event, ui) {
        if (ui.item.hasClass("ui-draggable")) {
            if (ui.item.data("ui-draggable")) {
                // Periksa apakah draggable telah diinisialisasi
                ui.item.draggable("destroy"); // Hancurkan draggable yang ada
            }
        }

        // Inisialisasi draggable kembali untuk item yang dipindahkan
        init_draggable(ui.item);

        // Update status melalui AJAX setelah item dipindahkan
        updateStatus(ui.item, "2");
    },
    update: function (event, ui) {
        // Cek apakah sortable2 kosong dan enable jika perlu
        if ($("#sortable2").children().length === 0) {
            $("#sortable2").sortable("enable");
        }
    },
});

// Konfigurasi untuk sortable3
$("#sortable3").sortable({
    connectWith: "#sortable1, #sortable2, #sortable3",
    items: ".draggable-item",
    start: function (event, ui) {
        // Enable semua sortable
        $("#sortable1, #sortable2, #sortable3").sortable("enable");
    },
    receive: function (event, ui) {
        if (ui.item.hasClass("ui-draggable")) {
            if (ui.item.data("ui-draggable")) {
                // Periksa apakah draggable telah diinisialisasi
                ui.item.draggable("destroy"); // Hancurkan draggable yang ada
            }
        }

        // Inisialisasi draggable kembali untuk item yang dipindahkan
        init_draggable(ui.item);

        // Update status melalui AJAX setelah item dipindahkan
        updateStatus(ui.item, "3");
    },
    update: function (event, ui) {
        // Cek apakah sortable3 kosong dan enable jika perlu
        if ($("#sortable3").children().length === 0) {
            $("#sortable3").sortable("enable");
        }
    },
});

// Fungsi untuk menginisialisasi draggable pada widget
function init_draggable(widget) {
    if (widget.data("ui-draggable")) {
        widget.draggable("destroy"); // Hancurkan instans draggable sebelumnya
    }

    widget.draggable({
        connectToSortable: "#sortable1, #sortable2, #sortable3",
        stack: ".draggable-item",
        revert: true,
        revertDuration: 200,
        start: function (event, ui) {
            // Disable sortable untuk semua elemen ketika drag dimulai
            $("#sortable1, #sortable2, #sortable3").sortable("disable");
        },
        stop: function (event, ui) {
            // Enable semua sortable setelah drag selesai
            $("#sortable1, #sortable2, #sortable3").sortable("enable");
        },
    });
}

// Fungsi untuk mengupdate status menggunakan AJAX
function updateStatus(item, status) {
    const taskId = item.data("task-id");
    const taskName = item.text();
    const taskProjectId = item.data("project-id");

    const data = {
        nama_task: taskName,
        status: status,
        idproject: taskProjectId,
    };

    console.log("Data yang dikirim untuk update status:", data); // Debugging

    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`,
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
            console.log("Status berhasil diperbarui:", response);
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui status:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        },
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Ambil ID proyek dari URL
    const projectId = window.location.pathname.split("/").pop(); // Mengambil ID dari URL

    // Endpoint untuk mendapatkan nama proyek
    const projectApiEndpoint = `http://127.0.0.1:8000/api/projects/${projectId}`;

    // Mengambil nama proyek menggunakan fetch
    fetch(projectApiEndpoint)
        .then((response) => response.json())
        .then((data) => {
            if (data && data.nama_project) {
                // Update nama proyek di halaman
                document.getElementById("project-name").textContent =
                    data.nama_project;
                // Update tag <title> dengan nama proyek
                document.title = data.nama_project;
            } else {
                console.error("Nama proyek tidak ditemukan");
            }
        })
        .catch((error) => {
            console.error("Gagal mengambil nama proyek:", error);
        });

    const apiEndpoint = `http://127.0.0.1:8000/api/tasks?idproject=${projectId}`;

    fetch(apiEndpoint)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                const sortable1 = document.getElementById("sortable1");
                const sortable2 = document.getElementById("sortable2");
                const sortable3 = document.getElementById("sortable3");

                data.forEach((task) => {
                    const liElement = document.createElement("div");
                    liElement.classList.add("draggable-item", "task-card");
                    liElement.textContent = `${task.nama_task}`;
                    liElement.dataset.taskId = task.idtask; // Menyimpan ID task dalam data-task-id
                    liElement.dataset.projectId = task.idproject; // Menyimpan ID project dalam data-project-id

                    // Membuat elemen div untuk edit dan delete
                    const editDeleteDiv = document.createElement("div");
                    editDeleteDiv.classList.add("edit-delete");

                    // Membuat tombol untuk ikon edit
                    const editButton = document.createElement("button");
                    editButton.classList.add("edit-btn");
                    const editIcon = document.createElement("i");
                    editIcon.classList.add("ph-bold", "ph-pencil-simple");
                    editButton.appendChild(editIcon);

                    // Membuat tombol untuk ikon delete
                    const deleteButton = document.createElement("button");
                    deleteButton.classList.add("delete-btn");
                    const trashIcon = document.createElement("i");
                    trashIcon.classList.add("ph-bold", "ph-trash");
                    deleteButton.appendChild(trashIcon);

                    // Menambahkan tombol ke dalam div edit-delete
                    editDeleteDiv.appendChild(editButton);
                    editDeleteDiv.appendChild(deleteButton);

                    // Menambahkan div edit-delete ke dalam task-card (liElement)
                    liElement.appendChild(editDeleteDiv);

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
                console.log("Data tidak valid atau kosong");
            }
        })
        .catch((error) => {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        });
});

$("#add-task-btn").click(function () {
    $("#modal").removeClass("hidden");
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
});

// Fungsi untuk menambahkan tugas baru
function addNewTask(taskName, projectId) {
    const status = "1"; // Status "To-do"

    // Data yang dikirim
    const data = {
        nama_task: taskName,
        status: status, // Harus berisi nilai yang sesuai
        idproject: projectId, // Harus berisi nilai yang valid untuk ID proyek
    };

    console.log("Data yang dikirim ke API:", data); // Debugging: menampilkan data yang dikirim

    $.ajax({
        url: "http://127.0.0.1:8000/api/tasks",
        type: "POST",
        data: JSON.stringify(data), // Pastikan mengirimkan data dalam format JSON
        contentType: "application/json",
        success: function (response) {
            console.log("Task berhasil ditambahkan:", response);
            location.reload(); // Me-refresh halaman setelah sukses
            $("#modal").addClass("hidden"); // Menyembunyikan modal
            $("#taskname").val(""); // Mengosongkan input field
        },
        error: function (xhr, status, error) {
            console.error("Gagal menambahkan tugas:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        },
    });
}

// Fungsi untuk menambahkan task ke dalam kanban di halaman
function addTaskToKanban(taskId, taskName, projectId) {
    const sortable1 = document.getElementById("sortable1"); // Kanban To-do

    // Membuat elemen baru untuk tugas
    const newTask = document.createElement("div");
    newTask.classList.add("draggable-item", "task-card");
    newTask.dataset.taskId = taskId;
    newTask.textContent = taskName; // Menyimpan ID task dalam data-task-id
    newTask.dataset.projectId = projectId; // Menyimpan ID project dalam data-project-id

    // Menambahkan task ke kanban yang sesuai (To-do dalam hal ini)
    sortable1.appendChild(newTask);
}

$("#tambah-btn").click(function () {
    // Ambil nama tugas dari input
    const taskName = $("#taskname").val().trim();

    // Cek jika nama tugas tidak kosong
    if (taskName) {
        // Ambil ID proyek dari URL (seperti yang dilakukan sebelumnya)
        const projectId = window.location.pathname.split("/").pop(); // ID proyek

        // Panggil fungsi untuk menambahkan tugas baru
        addNewTask(taskName, projectId);
    } else {
        alert("Nama tugas tidak boleh kosong");
    }
});

// Fungsi untuk menghapus task
function deleteTask(taskId) {
    // Kirim permintaan DELETE ke API untuk menghapus task
    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`, // Endpoint API untuk menghapus task
        type: "DELETE",
        success: function (response) {
            console.log("Task berhasil dihapus:", response);

            // Hapus elemen task dari tampilan
            $(`[data-task-id=${taskId}]`).remove();
        },
        error: function (xhr, status, error) {
            console.error("Gagal menghapus task:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        },
    });
}

// Menambahkan event listener untuk tombol delete
$(document).on("click", ".delete-btn", function () {
    const taskId = $(this).closest(".draggable-item").data("task-id"); // Ambil task ID
    if (confirm("Hapus tugas ini?")) {
        deleteTask(taskId); // Panggil fungsi untuk menghapus task
    }
});

// Menambahkan event listener untuk tombol edit
$(document).on("click", ".edit-btn", function () {
    const taskId = $(this).closest(".draggable-item").data("task-id"); // Ambil task ID
    const taskName = $(this).closest(".draggable-item").text().trim(); // Ambil nama task
    const status = $(this).closest(".draggable-item").data("status");

    // Isi modal edit dengan nama tugas yang dipilih
    $("#taskname-edit").val(taskName);

    // Simpan ID tugas yang akan diupdate
    $("#modal-edit").data("task-id", taskId);

    $("#modal-edit").data("status", status); // Simpan status di modal

    // Tampilkan modal edit
    $("#modal-edit").removeClass("hidden");
});

// Menutup modal edit ketika tombol "Batal" diklik
$("#close-modal-edit").click(function () {
    $("#modal-edit").addClass("hidden");
});

// Menambahkan event listener untuk tombol simpan pada modal edit
$("#simpan-btn").click(function () {
    const taskId = $("#modal-edit").data("task-id"); // Ambil ID tugas dari data-modal-edit
    const taskName = $("#taskname-edit").val().trim(); // Ambil nama tugas dari input field

    // Cek jika nama tugas tidak kosong
    if (taskName) {
        // Panggil fungsi untuk memperbarui tugas
        updateTask(taskId, taskName);


    } else {
        alert("Nama tugas tidak boleh kosong");
    }
});

// Fungsi untuk memperbarui tugas
function updateTask(taskId, taskName) {
    const projectId = window.location.pathname.split("/").pop(); // ID proyek

    // Kirim permintaan PUT ke API untuk memperbarui tugas
    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`, // Endpoint API untuk update task
        type: "PUT",
        data: JSON.stringify({
            nama_task: taskName, // Nama tugas baru
            idproject: projectId, // ID proyek
        }),
        contentType: "application/json",
        success: function (response) {
            console.log("Task berhasil diperbarui:", response);

            // Perbarui task card di UI setelah berhasil update
            const taskElement = $(`[data-task-id=${taskId}]`);
            taskElement.text(taskName); // Update nama task

            // Pastikan tombol edit dan delete tetap ada
            addEditDeleteButtons(taskElement); // Fungsi untuk menambahkan tombol edit/delete

            // Inisialisasi ulang draggable untuk task yang diperbarui
            init_draggable(taskElement);

            // Tutup modal setelah berhasil update
            $("#modal-edit").addClass("hidden");

            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui task:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        },
    });
}

// Fungsi untuk menambahkan tombol edit dan delete pada task
function addEditDeleteButtons(taskElement) {
    // Cek apakah div edit-delete sudah ada
    if (!taskElement.find(".edit-delete").length) {
        const editDeleteDiv = document.createElement("div");
        editDeleteDiv.classList.add("edit-delete");

        // Membuat tombol untuk ikon edit
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn");
        const editIcon = document.createElement("i");
        editIcon.classList.add("ph-bold", "ph-pencil-simple");
        editButton.appendChild(editIcon);

        // Membuat tombol untuk ikon delete
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("ph-bold", "ph-trash");
        deleteButton.appendChild(trashIcon);

        // Menambahkan tombol ke dalam div edit-delete
        editDeleteDiv.appendChild(editButton);
        editDeleteDiv.appendChild(deleteButton);

        // Menambahkan div edit-delete ke dalam task-card
        taskElement.append(editDeleteDiv);
    }
}
