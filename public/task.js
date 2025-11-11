const API_BASE_URL = "https://trelloapp.id/api";
// const API_BASE_URL = "http://127.0.0.1:8000/api";

const token = localStorage.getItem("access_token"); // Mengambil token
const projectId = window.location.pathname.split("/").pop();

document.getElementById("projectId").value = projectId;

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
};

// Panggil fungsi ini saat modal "Bagikan Board" dibuka
$("#invite-member-btn").click(function () {
    fetchProjectUsers();
    $("#modal-invite").removeClass("hidden");
});

$(document).ready(function () {
    fetchProjectUsers();
});

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
        // Kode untuk fetch dan render task di sini
        const apiEndpoint = `${API_BASE_URL}/tasks?idproject=${projectId}`;
        const taskResponse = await fetch(apiEndpoint, { headers: headers });

        if (!taskResponse.ok) {
            const errorData = await taskResponse.json();
            alert(errorData.message || "Akses ditolak.");
            window.location.href = "/project"; // Redirect ke halaman daftar project
            return; // Stop eksekusi selanjutnya
        }

        const taskData = await taskResponse.json();

        // console.log("Data tugas:", taskData); // Debugging data tugas

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

                let userAvatars = '';
                if (Array.isArray(task.users)) {
                    userAvatars = task.users.map(u => `
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white border-2 border-white mr-2"
                              style="background: ${generateGradient()};"
                              title="${u.name} (${u.email})">
                            ${getInitials(u.name)}
                        </span>
                    `).join('');
                }
                taskDiv.innerHTML = `
                    <div class="flex items-center gap-2 mb-1">
                        ${userAvatars}
                        <h5 class="text-lg font-medium text-black">${task.nama_task}</h5>
                    </div>
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
        order: lastOrder + 1,
    };

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
const inviteMemberBtn = document.getElementById("invite-member-btn");
const modalInvite = document.getElementById("modal-invite");
const closeModalInviteBtn = document.getElementById("close-modal-invite");

// Buka modal saat tombol diklik
if (inviteMemberBtn) {
    inviteMemberBtn.addEventListener("click", () => {
        modalInvite.classList.remove("hidden");
    });
}

// Tutup modal saat tombol close diklik
if (closeModalInviteBtn) {
    closeModalInviteBtn.addEventListener("click", () => {
        modalInvite.classList.add("hidden");
    });
}

// Tutup modal jika klik di luar konten modal
window.addEventListener("click", (e) => {
    if (e.target === modalInvite) {
        modalInvite.classList.add("hidden");
    }
});

// Jika mau langsung buka modal untuk demo
function openModal() {
    modalInvite.classList.remove("hidden");
}
// openModal(); // uncomment jika ingin langsung buka modal saat load halaman

document.addEventListener("DOMContentLoaded", function () {
    $("#email-input").on("input", function () {
        const email = $(this).val();
        const projectId = $("#projectId").val();
        const status = $("#email-status");
        const inviteButton = $("#invite-button");

        if (email.length > 3 && email.includes("@")) {
            // validasi sederhana
            status.text("Mencari...").css("color", "orange");
            inviteButton.prop("disabled", true);
            inviteButton
                .removeClass("bg-blue-600 hover:bg-blue-500")
                .addClass("bg-gray-300 cursor-not-allowed");

            $.ajax({
                url: `${API_BASE_URL}/check-email`,
                method: "POST",
                headers: headers,
                data: JSON.stringify({
                    email: email,
                    project_id: projectId,
                }),
                success: function (response) {
                    status
                        .text(response.message)
                        .css("color", response.available ? "green" : "red");

                    if (response.available) {
                        inviteButton.prop("disabled", false); // Aktifkan tombol
                        inviteButton
                            .removeClass("bg-gray-300 cursor-not-allowed")
                            .addClass("bg-blue-600 hover:bg-blue-500");
                    } else {
                        inviteButton.prop("disabled", true); // Nonaktifkan tombol
                        inviteButton
                            .removeClass("bg-blue-600 hover:bg-blue-500")
                            .addClass("bg-gray-300 cursor-not-allowed");
                    }
                },
                error: function () {
                    status.text("Error cek email").css("color", "orange");

                    inviteButton.prop("disabled", true);
                    inviteButton
                        .removeClass("bg-blue-600 hover:bg-blue-500")
                        .addClass("bg-gray-300 cursor-not-allowed");
                },
            });
        } else {
            status.text("");
            inviteButton.prop("disabled", true);
            inviteButton
                .removeClass("bg-blue-600 hover:bg-blue-500")
                .addClass("bg-gray-300 cursor-not-allowed");
        }
    });
});

    fetch(`${API_BASE_URL}/projects/${projectId}/users`, {
    // ← koma di sini, bukan di luar
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("member-container");
        const bubbles = document.getElementById("user-bubbles");
        
        bubbles.innerHTML = "";

        const maxVisibleBubbles = 4;
        const totalUsers = 1 + data.users.length; 
        const remainingUsers = totalUsers - maxVisibleBubbles;

        // Owner bubble
        const ownerBubble = document.createElement("div");
        ownerBubble.classList.add(
            "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center",
            "text-white", "font-bold", "text-xs", "border-2", "border-white", "shadow"
        );
        ownerBubble.style.background = generateGradient();
        ownerBubble.textContent = getInitials(data.owner.name);
        bubbles.appendChild(ownerBubble);

        ownerBubble.addEventListener('mouseenter', (e) => showTooltip(e, data.owner.name + " (Pemilik)"));
        ownerBubble.addEventListener('mousemove', (e) => showTooltip(e, data.owner.name + " (Pemilik)"));
        ownerBubble.addEventListener('mouseleave', hideTooltip);

        // User bubbles
        const visibleUsers = data.users.slice(0, maxVisibleBubbles - 1);
        
        visibleUsers.forEach((user) => {
            const userBubble = document.createElement("div");
            userBubble.classList.add(
                "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center",
                "text-white", "font-bold", "text-xs", "border-2", "border-white", "shadow",
                "-ml-2"
            );
            userBubble.style.background = generateGradient();
            userBubble.textContent = getInitials(user.name);
            bubbles.appendChild(userBubble);

            userBubble.addEventListener('mouseenter', (e) => showTooltip(e, user.name));
            userBubble.addEventListener('mousemove', (e) => showTooltip(e, user.name));
            userBubble.addEventListener('mouseleave', hideTooltip);
        });

        // Jika ada user lebih dari maksimal, tampilkan bubble "+N"
        if (remainingUsers > 0) {
            const moreBubble = document.createElement("div");
            moreBubble.classList.add(
                "w-8", "h-8", "rounded-full", "flex", "items-center", "justify-center",
                "bg-gray-400", "text-white", "font-bold", "text-xs", "border-2", "border-white", "shadow",
                "-ml-2"
            );
            moreBubble.textContent = `+${remainingUsers}`;
            bubbles.appendChild(moreBubble);

            // Tooltip untuk bubble +N
            const hiddenUserNames = data.users.slice(maxVisibleBubbles - 1).map(u => u.name).join(', ');
            moreBubble.addEventListener('mouseenter', (e) => showTooltip(e, hiddenUserNames));
            moreBubble.addEventListener('mousemove', (e) => showTooltip(e, hiddenUserNames));
            moreBubble.addEventListener('mouseleave', hideTooltip);
        }

        // --- Generate Card untuk Owner ---
        const owner = data.owner;

        const ownerCard = document.createElement("div");
        ownerCard.classList.add(
            "flex",
            "items-center",
            "justify-between",
            "py-3",
            "px-4",
            "bg-gray-100",
            "rounded-md",
            "mt-2"
        );

        const ownerInitial = document.createElement("div");
        ownerInitial.classList.add(
            "w-9",
            "h-9",
            "rounded-full",
            "flex",
            "items-center",
            "justify-center",
            "text-white",
            "text-sm",
            "font-bold"
        );
        ownerInitial.style.background = generateGradient();
        ownerInitial.textContent = getInitials(owner.name);

        const ownerInfo = document.createElement("div");
        const ownerName = document.createElement("div");
        ownerName.classList.add("font-medium", "text-sm");
        ownerName.textContent =
            owner.name +
            (`${owner.id}` === loggedInUserId ? " (Anda)" : "") +
            " - Pemilik";

        const ownerEmail = document.createElement("div");
        ownerEmail.classList.add("text-xs", "text-gray-500");
        ownerEmail.textContent = owner.email ?? "-";

        ownerInfo.appendChild(ownerName);
        ownerInfo.appendChild(ownerEmail);

        const ownerSection = document.createElement("div");
        ownerSection.classList.add("flex", "items-center", "gap-3");
        ownerSection.appendChild(ownerInitial);
        ownerSection.appendChild(ownerInfo);

        ownerCard.appendChild(ownerSection);
        container.appendChild(ownerCard);

        data.users.forEach((user) => {
            const card = document.createElement("div");
            card.classList.add(
                "flex",
                "items-center",
                "justify-between",
                "py-3",
                "px-4",
                "bg-gray-100",
                "rounded-md",
                "mt-2"
            );

            const userInitial = document.createElement("div");
            userInitial.classList.add(
                "w-9",
                "h-9",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "text-white",
                "text-sm",
                "font-bold"
            );
            userInitial.style.background = generateGradient();
            userInitial.textContent = getInitials(user.name);

            const userInfo = document.createElement("div");
            const userName = document.createElement("div");
            userName.classList.add("font-medium", "text-sm");
            userName.textContent =
                user.name + (`${user.id}` === loggedInUserId ? " (Anda)" : "");

            const userEmail = document.createElement("div");
            userEmail.classList.add("text-xs", "text-gray-500");
            userEmail.textContent = user.email ?? "-";

            userInfo.appendChild(userName);
            userInfo.appendChild(userEmail);

            const leftSection = document.createElement("div");
            leftSection.classList.add("flex", "items-center", "gap-3");
            leftSection.appendChild(userInitial);
            leftSection.appendChild(userInfo);

            card.appendChild(leftSection);

            if (`${data.owner.id}` === loggedInUserId) {
                const removeButton = document.createElement("button");
                removeButton.textContent = "Hapus";
                removeButton.classList.add(
                    "text-gray-500", "text-sm", "font-medium",
                    "hover:text-red-500", "transition", "ease-in-out"
                );
                removeButton.onclick = () => removeUser(user.id); // ← MEMANGGIL FUNGSI HAPUS
                card.appendChild(removeButton);
            }

            container.appendChild(card);
        });
    });

// Fungsi untuk mengambil inisial
function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
}
function generateGradient() {
    const colors = [
        ['#6EE7B7', '#3B82F6'],
        ['#FDE68A', '#FCA5A5'],
        ['#A5B4FC', '#F472B6'],
        ['#F9A8D4', '#F87171'],
        ['#FCD34D', '#34D399'],
    ];
    const idx = Math.floor(Math.random() * colors.length);
    return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
}

function removeUser(userId) {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini dari project?"))
        return;

    fetch(`${API_BASE_URL}/project/${projectId}/remove/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        .then(async (response) => {
            const data = await response.json();

            if (!response.ok) {
                // jika response tidak ok, tampilkan pesan error
                alert(data.message || "Gagal menghapus user");
                return;
            }

            alert(data.message || "User berhasil dihapus");
            window.location.reload(); // Reload halaman untuk memperbarui daftar anggota
        })
        .catch((error) => console.error("Gagal menghapus user:", error));
}

// Functin buat nampilin bubble

function showTooltip(e, text) {
    let tooltip = document.getElementById('bubble-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'bubble-tooltip';
        tooltip.className = 'bubble-tooltip';
        document.body.appendChild(tooltip);
    }
    tooltip.textContent = text;
    tooltip.style.opacity = 1;

    // Tunggu browser render ukuran tooltip
    setTimeout(() => {
        const bubbleRect = e.target.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = bubbleRect.left + window.scrollX + bubbleRect.width / 2 - tooltipRect.width / 2 + 'px';
        tooltip.style.top = bubbleRect.top + window.scrollY - tooltipRect.height - 12 + 'px';
    }, 0);
}

function hideTooltip() {
    const tooltip = document.getElementById('bubble-tooltip');
    if (tooltip) {
        tooltip.style.opacity = 0;
    }
}
