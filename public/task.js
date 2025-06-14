// const API_BASE_URL = "https://trelloapp.id/api";
const API_BASE_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("access_token"); // Mengambil token
const projectId = window.location.pathname.split("/").pop();

document.getElementById('projectId').value=projectId

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
};

// drag and drop functionality for tasks in a kanban board
// jangan diubah2

// Store original positions to track changes
let originalPositions = new Map();
let originalBoardId = null;

// Function to store original position when drag starts
const storeOriginalPosition = (taskElement) => {
    const boardId = taskElement.closest(".swim-lane")?.id;
    if (boardId) {
        const tasksInBoard = Array.from(
            document.querySelectorAll(`#${boardId} .task`)
        );
        const originalIndex = tasksInBoard.indexOf(taskElement);
        originalPositions.set(taskElement.dataset.id, {
            boardId: boardId,
            index: originalIndex,
        });
    }
};

// Function to check if order changed within the same board
const checkIfOrderChanged = (boardId, taskElement) => {
    const taskId = taskElement.dataset.id;
    const originalData = originalPositions.get(taskId);

    if (!originalData || originalData.boardId !== boardId) {
        return true; // Changed board, so order update is needed
    }

    const currentTasks = Array.from(
        document.querySelectorAll(`#${boardId} .task`)
    );
    const currentIndex = currentTasks.indexOf(taskElement);

    const orderChanged = originalData.index !== currentIndex;
    // console.log(
    //     `Task ${taskId}: Original index ${originalData.index}, Current index ${currentIndex}, Order changed: ${orderChanged}`
    // );

    return orderChanged;
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Mengambil daftar tugas
        const apiEndpoint = `${API_BASE_URL}/tasks?idproject=${projectId}`;
        const taskResponse = await fetch(apiEndpoint, { headers: headers });
        const taskData = await taskResponse.json();

        if (Array.isArray(taskData) && taskData.length > 0) {
            const todo = document.getElementById("todo");
            const inProgress = document.getElementById("in-progress");
            const completed = document.getElementById("completed");

            taskData.forEach((task) => {
                const taskDiv = document.createElement("div");
                taskDiv.classList.add("task", "task-card");
                taskDiv.setAttribute("draggable", "true");
                taskDiv.dataset.id = task.idtask;
                taskDiv.dataset.projectId = task.idproject;

                // Inner content (task title + description)
                taskDiv.innerHTML = `
            <h5 class="text-lg font-medium text-black">${task.nama_task}</h5>
    `;

                const editDeleteDiv = document.createElement("div");
                editDeleteDiv.classList.add("edit-delete");

                const editButton = document.createElement("button");
                editButton.classList.add("edit-btn", "btn");
                editButton.innerHTML =
                    '<i class="ph-bold ph-pencil-simple"></i>';

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-btn", "btn");
                deleteButton.innerHTML = '<i class="ph-bold ph-trash"></i>';

                editDeleteDiv.appendChild(editButton);
                editDeleteDiv.appendChild(deleteButton);
                taskDiv.appendChild(editDeleteDiv);

                taskDiv.addEventListener("dragstart", (e) => {
                    taskDiv.classList.add("is-dragging");
                    // Store the original board ID when drag starts
                    originalBoardId = taskDiv.closest(".swim-lane")?.id;
                    // Store original position for order comparison
                    storeOriginalPosition(taskDiv);

                    // Improve drag image appearance
                    const dragImage = taskDiv.cloneNode(true);
                    dragImage.style.cssText = `
                        position: absolute;
                        top: -1000px;
                        left: -1000px;
                        width: ${taskDiv.offsetWidth}px;
                        opacity: 0.9;
                        pointer-events: none;
                        z-index: 1000;
                    `;
                    document.body.appendChild(dragImage);
                    e.dataTransfer.setDragImage(
                        dragImage,
                        e.offsetX,
                        e.offsetY
                    );

                    // Clean up drag image after a short delay
                    setTimeout(() => {
                        if (document.body.contains(dragImage)) {
                            document.body.removeChild(dragImage);
                        }
                    }, 0);

                    // Style the original card while dragging
                    taskDiv.style.opacity = "0.9";
                    taskDiv.style.transform = "scale(0.95)";

                    taskDiv.style.transition = "all 0.5s ease";
                });
                taskDiv.addEventListener("dragend", () => {
                    taskDiv.classList.remove("is-dragging");
                    // Reset original board ID
                    originalBoardId = null;
                    // Clean up original position data
                    originalPositions.delete(taskDiv.dataset.id);

                    // Reset card appearance
                    taskDiv.style.opacity = "";
                    taskDiv.style.transform = "";
                    taskDiv.style.transition = "";
                });

                // Append to appropriate board
                if (task.status === "1") {
                    todo.appendChild(taskDiv);
                } else if (task.status === "2") {
                    inProgress.appendChild(taskDiv);
                } else if (task.status === "3") {
                    completed.appendChild(taskDiv);
                }
            });
        } else {
            console.log("Data kosong");
        }
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
});

const draggables = document.querySelectorAll(".task");
const droppables = document.querySelectorAll(".swim-lane");
const boardStatusMap = {
    todo: "1",
    "in-progress": "2",
    completed: "3",
};

draggables.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
        task.classList.add("is-dragging");
        // Store the original board ID when drag starts
        originalBoardId = task.closest(".swim-lane")?.id;
        // Store original position for order comparison
        storeOriginalPosition(task);

        // Improve drag image appearance
        const dragImage = task.cloneNode(true);
        dragImage.style.cssText = `
            position: absolute;
            top: -1000px;
            left: -1000px;
            width: ${task.offsetWidth}px;
            opacity: 0.9;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);

        // Clean up drag image after a short delay
        setTimeout(() => {
            if (document.body.contains(dragImage)) {
                document.body.removeChild(dragImage);
            }
        }, 0);

        // Style the original card while dragging
        task.style.opacity = "0.8";
        task.style.transition = "all 0.2s ease";
    });
    task.addEventListener("dragend", () => {
        task.classList.remove("is-dragging");
        // Reset original board ID
        originalBoardId = null;
        // Clean up original position data
        originalPositions.delete(task.dataset.id);

        // Reset card appearance
        task.style.opacity = "";
        task.style.transform = "";
        task.style.transition = "";
    });
});

// Ambil semua task di board setelah drop
const updateOrderInBoard = (boardId) => {
    const tasksInBoard = document.querySelectorAll(`#${boardId} .task`);
    tasksInBoard.forEach((task, index) => {
        const taskId = task.dataset.id;
        const newOrder = index + 1;

        $.ajax({
            url: `${API_BASE_URL}/tasks/${taskId}`,
            type: "PUT",
            data: JSON.stringify({
                order: newOrder,
                idproject: task.dataset.projectId,
            }),
            contentType: "application/json",
            headers: headers,
            success: function () {
                // console.log(`Task ${taskId} order updated to ${newOrder}`);
            },
            error: function (xhr, status, error) {
                console.error(`Gagal update order task ${taskId}:`, error);
            },
        });
    });
};

droppables.forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();

        // Remove any existing drop indicators
        const existingIndicators = zone.querySelectorAll(".drop-indicator");
        existingIndicators.forEach((indicator) => indicator.remove());

        const nextTask = insertAboveTask(zone, e.clientY);
        const curTask = document.querySelector(".is-dragging");

        if (!curTask) return;

        if (!nextTask) {
            // Insert at the end
            // zone.appendChild(dropIndicator);
            zone.appendChild(curTask);
        } else {
            // Insert before the next task
            // zone.insertBefore(dropIndicator, nextTask);
            zone.insertBefore(curTask, nextTask);
        }
    });

    zone.addEventListener("drop", () => {
        // Remove any drop indicators
        const existingIndicators = zone.querySelectorAll(".drop-indicator");
        existingIndicators.forEach((indicator) => indicator.remove());

        const curTask = document.querySelector(".is-dragging");
        if (!curTask) return;

        const taskId = curTask.dataset.id;

        const newBoard = zone.id;
        const previousBoard = originalBoardId; // Use the stored original board ID

        const newStatus = boardStatusMap[newBoard];

        // console.log(`Previous board: ${previousBoard}, New board: ${newBoard}`);

        let statusChanged = false;
        let orderChanged = false;

        // Check if status actually changed
        if (newBoard !== previousBoard) {
            statusChanged = true;
            const data = {
                status: newStatus,
                idproject: projectId,
            };

            $.ajax({
                url: `${API_BASE_URL}/tasks/${taskId}`,
                type: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json",
                headers: headers,
                success: function (response) {
                    // console.log(
                    //     `Status task ${taskId} diperbarui ke ${newStatus}`
                    // );
                },
                error: function (xhr, status, error) {
                    console.error("Gagal memperbarui status:", error);
                },
            });
        }

        // Check if order actually changed within the same board
        if (!statusChanged) {
            orderChanged = checkIfOrderChanged(newBoard, curTask);
        }

        // Update order only if status changed (moved to different board) or order changed within same board
        if (statusChanged || orderChanged) {
            updateOrderInBoard(newBoard);
        } else {
            // console.log("No changes detected - skipping API calls");
        }
    });

    zone.addEventListener("dragleave", (e) => {
        // Only remove indicators if we're actually leaving the zone
        if (!zone.contains(e.relatedTarget)) {
            const existingIndicators = zone.querySelectorAll(".drop-indicator");
            existingIndicators.forEach((indicator) => indicator.remove());
        }
    });
});

const insertAboveTask = (zone, mouseY) => {
    const els = zone.querySelectorAll(".task:not(.is-dragging)");

    let closestTask = null;
    let closestOffset = Number.POSITIVE_INFINITY;

    els.forEach((task) => {
        const { top, bottom, height } = task.getBoundingClientRect();

        // Calculate the middle point of the task
        const taskMiddle = top + height / 2;

        // If mouse is in the upper half of a task, insert above it
        // If mouse is in the lower half, insert below it (return next task or null)
        if (mouseY < taskMiddle) {
            // Mouse is in upper half - insert above this task
            const offset = Math.abs(mouseY - top);
            if (offset < closestOffset) {
                closestOffset = offset;
                closestTask = task;
            }
        } else {
            // Mouse is in lower half - insert below this task (after this task)
            const offset = Math.abs(mouseY - bottom);
            if (offset < closestOffset) {
                closestOffset = offset;
                closestTask = task.nextElementSibling;
            }
        }
    });

    return closestTask;
};

// function to edit and delete task

// Menambahkan event listener untuk tombol delete
$(document).on("click", ".delete-btn", function () {
    const taskId = $(this).closest(".task").data("id"); // Ambil task ID
    if (confirm("Hapus tugas ini?")) {
        deleteTask(taskId); // Panggil fungsi untuk menghapus task
    }
});

// Menambahkan event listener untuk tombol edit
$(document).on("click", ".edit-btn", function () {
    const taskId = $(this).closest(".task").data("id"); // Ambil task ID
    const taskName = $(this).closest(".task").text().trim(); // Ambil nama task
    const status = $(this).closest(".task").data("status");

    // Isi modal edit dengan nama tugas yang dipilih
    $("#taskname-edit").val(taskName);

    // Simpan ID tugas yang akan diupdate
    $("#modal-edit").data("id", taskId);

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
    const taskId = $("#modal-edit").data("id"); // Ambil ID tugas dari modal
    const taskName = $("#taskname-edit").val().trim(); // Ambil nama tugas dari input field

    // Cek jika nama tugas tidak kosong
    if (taskName) {
        // Panggil fungsi untuk memperbarui tugas
        updateTask(taskId, taskName, projectId);
    } else {
        alert("Nama tugas tidak boleh kosong");
    }
});

// Fungsi untuk memperbarui tugas
function updateTask(taskId, taskName, projectId) {
    const data = {
        nama_task: taskName,
        idproject: projectId, // Ambil ID proyek dari modal
    };

    $.ajax({
        url: `${API_BASE_URL}/tasks/${taskId}`,
        type: "PUT",
        data: JSON.stringify(data),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            // console.log("Task berhasil diperbarui:", response);
            // update ui nama task terbaru
            const taskElement = $(`.task[data-id="${taskId}"]`);
            taskElement.find("h5").text(taskName); // Update nama task di UI
            $("#modal-edit").addClass("hidden");
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui task:", error);
            console.log("Respons dari server:", xhr.responseText);
        },
    });
}

// Fungsi untuk menghapus task
function deleteTask(taskId) {
    $.ajax({
        url: `${API_BASE_URL}/tasks/${taskId}`,
        type: "DELETE",
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            // console.log("Task berhasil dihapus:", response);
            $(`.task[data-id="${taskId}"]`).remove(); // Hapus task dari UI
        },
        error: function (xhr, status, error) {
            console.error("Gagal menghapus task:", error);
            console.log("Respons dari server:", xhr.responseText);
        },
    });
}

// ambil nama proyek dari URL dan tampilkan di halaman
const projectNameElement = document.getElementById("project-name");
$.ajax({
    url: `${API_BASE_URL}/projects/${projectId}`,
    type: "GET",
    success: function (response) {
        projectNameElement.textContent = response.nama_project; // Menampilkan nama proyek di halaman
        document.title = `${response.nama_project} | ProCodeCG`;
    },
    error: function (xhr, status, error) {
        console.error("Gagal mengambil data proyek:", error);
        console.log("Respons dari server:", xhr.responseText);
        alert("Halaman yang ingin kamu akses tidak ada");
        window.location.href = "/project";
    },
});

// Dropdown menu untuk detail projek

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
    const projectName = $("#proyek-edit").val().trim(); // Ambil nama proyek baru dari input field

    // Validasi nama proyek tidak kosong
    if (projectName) {
        updateProject(projectId, projectName); // Panggil fungsi untuk update proyek
    } else {
        alert("Nama proyek tidak boleh kosong"); // Tampilkan pesan jika input kosong
    }
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-edit-proyek").click(function () {
    $("#modal-edit-proyek").addClass("hidden");
});

// Fungsi untuk memperbarui proyek menggunakan AJAX
function updateProject(projectId, projectName) {
    $.ajax({
        url: `${API_BASE_URL}/projects/${projectId}`,
        type: "PUT",
        data: JSON.stringify({ nama_project: projectName }),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            // console.log("Proyek berhasil diperbarui:", response);
            $("#modal-edit-proyek").addClass("hidden");
            $("#project-name").text(projectName); // Update nama proyek di UI
            document.title = `${projectName} | ProCodeCG`;
        },
        error: function (xhr, status, error) {
            console.error("Gagal memperbarui proyek:", error);
            console.log("Respons dari server:", xhr.responseText);
        },
    });
}

// Menambahkan event listener untuk tombol delete proyek
$(document).on("click", "#menu-item-1", function () {
    deleteProject(projectId); // Panggil fungsi deleteProject
});

// Fungsi untuk menghapus proyek
function deleteProject(projectId) {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
        $.ajax({
            url: `${API_BASE_URL}/projects/${projectId}`, // Endpoint API untuk delete proyek
            type: "DELETE",
            headers: headers,
            success: function (response) {
                // console.log("Proyek berhasil dihapus:", response);

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

// tambah task baru

// Menambahkan event listener untuk tombol "Tambah Tugas"
$("#add-task-btn").click(function () {
    $("#modal").removeClass("hidden");
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
});

$("#tambah-btn").click(function () {
    // Ambil nama tugas dari input
    const taskName = $("#taskname").val().trim();

    // Cek jika nama tugas tidak kosong
    if (taskName) {
        // Panggil fungsi untuk menambahkan tugas baru
        addNewTask(taskName, projectId);
    } else {
        alert("Nama tugas tidak boleh kosong");
    }
});

// Fungsi untuk menambahkan tugas baru
function addNewTask(taskName, projectId) {
    const tasksInTodo = document.querySelectorAll(`#todo .task`);
    const lastOrder = tasksInTodo.length; // index terakhir

    const data = {
        nama_task: taskName,
        idproject: projectId,
        order: lastOrder + 1, // last index +1
    };

    // console.log("Data yang dikirim ke API:", data); // Debugging

    $.ajax({
        url: `${API_BASE_URL}/tasks`,
        type: "POST",
        data: JSON.stringify(data),
        headers: headers, // Menambahkan header authorization
        success: function (response) {
            // console.log("Task berhasil ditambahkan:", response);
            $("#modal").addClass("hidden");
            $("#taskname").val("");
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error("Gagal menambahkan tugas:", error);
            console.log("Respons dari server:", xhr.responseText);
        },
    });
}

  // Pastikan tombol pemicu modal ada di HTML
const inviteMemberBtn = document.getElementById('invite-member-btn');
const modalInvite = document.getElementById('modal-invite');
const closeModalInviteBtn = document.getElementById('close-modal-invite');
const copyShareLinkBtn = document.getElementById('copy-share-link');
const shareLinkInput = document.getElementById('share-link');
const hideJoinReqBtn = document.getElementById('close-join-request');
const joinRequestsSection = modalInvite.querySelector('div.mt-6'); // asumsi join requests ada di sini

// Buka modal saat tombol diklik
if (inviteMemberBtn) {
  inviteMemberBtn.addEventListener('click', () => {
    modalInvite.classList.remove('hidden');
  });
}

// Tutup modal saat tombol close diklik
if (closeModalInviteBtn) {
  closeModalInviteBtn.addEventListener('click', () => {
    modalInvite.classList.add('hidden');
  });
}

// Tutup modal jika klik di luar konten modal
window.addEventListener('click', (e) => {
  if (e.target === modalInvite) {
    modalInvite.classList.add('hidden');
  }
});

// Tombol copy link share modern dan user friendly
if (copyShareLinkBtn && shareLinkInput) {
  copyShareLinkBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(shareLinkInput.value);
      // Ganti teks tombol jadi "Copied!" sementara
      const originalText = copyShareLinkBtn.textContent;
      copyShareLinkBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyShareLinkBtn.textContent = originalText;
      }, 1500);
    } catch (err) {
      alert('Gagal menyalin link.');
    }
  });
}

// Hide/show join requests section
if (hideJoinReqBtn && joinRequestsSection) {
  hideJoinReqBtn.addEventListener('click', () => {
    if (joinRequestsSection.style.display === 'none') {
      joinRequestsSection.style.display = 'block';
      hideJoinReqBtn.textContent = 'Hide';
    } else {
      joinRequestsSection.style.display = 'none';
      hideJoinReqBtn.textContent = 'Show';
    }
  });
}

// Jika mau langsung buka modal untuk demo
function openModal() {
  modalInvite.classList.remove('hidden');
}
// openModal(); // uncomment jika ingin langsung buka modal saat load halaman
