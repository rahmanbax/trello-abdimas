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

    const token = localStorage.getItem("access_token"); // Ambil token
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`,
        type: "PUT",
        data: JSON.stringify(data),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            console.log("Status berhasil diperbarui:", response);
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui status:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        },
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const projectId = window.location.pathname.split("/").pop(); // Mengambil ID dari URL
    const token = localStorage.getItem("access_token"); // Mengambil token
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const userEndpoint = "http://127.0.0.1:8000/api/users";

    try {
        // Ambil data pengguna yang sedang login
        const userResponse = await fetch(userEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Menambahkan token ke header
            },
        });

        if (!userResponse.ok) {
            throw new Error(
                `Error ${userResponse.status}: ${userResponse.statusText}`
            );
        }

        const userData = await userResponse.json();
        // Menampilkan nama pengguna di halaman
        document.getElementById("user-name").textContent = `${userData.name}`;

        // Mengambil nama proyek
        const projectApiEndpoint = `http://127.0.0.1:8000/api/projects/${projectId}`;
        const projectResponse = await fetch(projectApiEndpoint, {
            headers: headers,
        });
        const projectData = await projectResponse.json();

        if (projectData && projectData.nama_project) {
            document.getElementById("project-name").textContent =
                projectData.nama_project;
            document.title = `${projectData.nama_project} | ProCodeCG`;
        } else {
            console.error("Nama proyek tidak ditemukan");
        }

        // Mengambil daftar tugas
        const apiEndpoint = `http://127.0.0.1:8000/api/tasks?idproject=${projectId}`;
        const taskResponse = await fetch(apiEndpoint, { headers: headers });
        const taskData = await taskResponse.json();

        if (Array.isArray(taskData) && taskData.length > 0) {
            const sortable1 = document.getElementById("sortable1");
            const sortable2 = document.getElementById("sortable2");
            const sortable3 = document.getElementById("sortable3");

            taskData.forEach((task) => {
                const liElement = document.createElement("div");
                liElement.classList.add("draggable-item", "task-card");
                liElement.textContent = `${task.nama_task}`;
                liElement.dataset.taskId = task.idtask;
                liElement.dataset.projectId = task.idproject;

                const editDeleteDiv = document.createElement("div");
                editDeleteDiv.classList.add("edit-delete");

                const editButton = document.createElement("button");
                editButton.classList.add("edit-btn");
                editButton.innerHTML =
                    '<i class="ph-bold ph-pencil-simple"></i>';

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn");
                deleteButton.innerHTML = '<i class="ph-bold ph-trash"></i>';

                editDeleteDiv.appendChild(editButton);
                editDeleteDiv.appendChild(deleteButton);
                liElement.appendChild(editDeleteDiv);

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
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
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

    const data = {
        nama_task: taskName,
        status: status,
        idproject: projectId,
    };

    console.log("Data yang dikirim ke API:", data); // Debugging

    const token = localStorage.getItem("access_token"); // Ambil token
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    $.ajax({
        url: "http://127.0.0.1:8000/api/tasks",
        type: "POST",
        data: JSON.stringify(data),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            console.log("Task berhasil ditambahkan:", response);
            location.reload();
            $("#modal").addClass("hidden");
            $("#taskname").val("");
        },
        error: function (xhr, status, error) {
            console.error("Gagal menambahkan tugas:", error);
            console.log("Respons dari server:", xhr.responseText);
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
    const token = localStorage.getItem("access_token"); // Ambil token
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`,
        type: "DELETE",
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            console.log("Task berhasil dihapus:", response);
            $(`[data-task-id=${taskId}]`).remove();
        },
        error: function (xhr, status, error) {
            console.error("Gagal menghapus task:", error);
            console.log("Respons dari server:", xhr.responseText);
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

    const data = {
        nama_task: taskName,
        idproject: projectId,
    };

    const token = localStorage.getItem("access_token"); // Ambil token
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    $.ajax({
        url: `http://127.0.0.1:8000/api/tasks/${taskId}`,
        type: "PUT",
        data: JSON.stringify(data),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            console.log("Task berhasil diperbarui:", response);
            const taskElement = $(`[data-task-id=${taskId}]`);
            taskElement.text(taskName); // Update nama task
            addEditDeleteButtons(taskElement);
            init_draggable(taskElement);
            $("#modal-edit").addClass("hidden");
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui task:", error);
            console.log("Respons dari server:", xhr.responseText);
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

// Ambil referensi ke tombol dan dropdown menu
const menuButton = document.getElementById("menu-button");
const dropdownMenu = document.getElementById("dropdown-menu");

// Fungsi untuk toggle visibility dari dropdown menu
menuButton.addEventListener("click", function () {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";

    // Toggle dropdown visibility
    dropdownMenu.classList.toggle("hidden", isExpanded);

    // Update atribut aria-expanded
    menuButton.setAttribute("aria-expanded", !isExpanded);
});

// Klik di luar dropdown menu untuk menutup menu
document.addEventListener("click", function (event) {
    if (
        !menuButton.contains(event.target) &&
        !dropdownMenu.contains(event.target)
    ) {
        dropdownMenu.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
    }
});

// Menambahkan event listener untuk tombol edit proyek
$(document).on("click", "#menu-item-0", function () {
    const projectId = window.location.pathname.split("/").pop(); // Ambil ID proyek dari URL
    const projectName = $("#project-name").text().trim(); // Ambil nama proyek dari tampilan

    // Isi modal edit dengan nama proyek yang dipilih
    $("#proyek-edit").val(projectName);

    // Simpan ID proyek di modal untuk referensi saat update
    $("#modal-edit-proyek").data("project-id", projectId);

    // Tampilkan modal edit proyek
    $("#modal-edit-proyek").removeClass("hidden");
});

// Event listener untuk tombol simpan pada modal edit proyek
$("#simpan-btn-proyek").click(function () {
    const projectId = $("#modal-edit-proyek").data("project-id"); // Ambil ID proyek dari data di modal
    const projectName = $("#proyek-edit").val().trim(); // Ambil nama proyek baru dari input field

    // Validasi nama proyek tidak kosong
    if (projectName) {
        updateProject(projectId, projectName); // Panggil fungsi untuk update proyek
    } else {
        alert("Nama proyek tidak boleh kosong"); // Tampilkan pesan jika input kosong
    }
});

// Fungsi untuk memperbarui proyek menggunakan AJAX
function updateProject(projectId, projectName) {
    const token = localStorage.getItem("access_token"); // Ambil token
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    $.ajax({
        url: `http://127.0.0.1:8000/api/projects/${projectId}`,
        type: "PUT",
        data: JSON.stringify({ nama_project: projectName }),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            console.log("Proyek berhasil diperbarui:", response);
            $("#modal-edit-proyek").addClass("hidden");
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui proyek:", error);
            console.log("Respons dari server:", xhr.responseText);
        },
    });
}

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-edit-proyek").click(function () {
    $("#modal-edit-proyek").addClass("hidden");
});

// Fungsi untuk menghapus proyek
function deleteProject(projectId) {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
        const token = localStorage.getItem("access_token"); // Ambil token
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        $.ajax({
            url: `http://127.0.0.1:8000/api/projects/${projectId}`, // Endpoint API untuk delete proyek
            type: "DELETE",
            headers: headers,
            success: function (response) {
                console.log("Proyek berhasil dihapus:", response);

                // Redirect ke halaman utama atau halaman lain setelah proyek dihapus
                window.location.href = "/project"; // Sesuaikan URL sesuai kebutuhan
            },
            error: function (xhr, status, error) {
                console.error("Gagal menghapus proyek:", error);
                console.log("Respons dari server:", xhr.responseText); // Debugging error
            },
        });
    }
}

// Menambahkan event listener untuk tombol delete proyek
$(document).on("click", "#menu-item-1", function () {
    const projectId = window.location.pathname.split("/").pop(); // Ambil ID proyek dari URL
    deleteProject(projectId); // Panggil fungsi deleteProject
});

// Ambil referensi ke tombol dan dropdown menu
const userButton = document.getElementById("user-button");
const dropdownUser = document.getElementById("dropdown-user");

// Fungsi untuk toggle visibility dari dropdown menu
userButton.addEventListener("click", function () {
    const isExpanded = userButton.getAttribute("aria-expanded") === "true";

    // Toggle dropdown visibility
    dropdownUser.classList.toggle("hidden", isExpanded);

    // Update atribut aria-expanded
    userButton.setAttribute("aria-expanded", !isExpanded);
});

// Klik di luar dropdown menu untuk menutup menu
document.addEventListener("click", function (event) {
    if (
        !userButton.contains(event.target) &&
        !dropdownUser.contains(event.target)
    ) {
        dropdownUser.classList.add("hidden");
        userButton.setAttribute("aria-expanded", "false");
    }
});

document
    .getElementById("logout-btn")
    .addEventListener("click", async function () {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                console.log("User tidak terautentikasi");
                return;
            }

            const response = await fetch(
                "http://127.0.0.1:8000/api/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Mengirimkan token untuk autentikasi
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Logout gagal");
            }

            // Hapus token dari localStorage
            localStorage.removeItem("access_token");

            // Redirect ke halaman login
            window.location.href = "/login"; // Ganti dengan route login yang sesuai
        } catch (error) {
            console.error("Terjadi kesalahan saat logout:", error);
        }
    });
