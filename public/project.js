document.addEventListener("DOMContentLoaded", function () {
    const apiEndpoint = "http://127.0.0.1:8000/api/projects";

    fetch(apiEndpoint)
        .then((response) => response.json())
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                // Referensi ke elemen kontainer di halaman
                const projectContainer =
                    document.getElementById("project-container");

                // Loop melalui data proyek yang diterima
                data.forEach((project) => {
                    // Membuat elemen div untuk card proyek
                    const projectCard = document.createElement("div");
                    projectCard.classList.add("project-card");

                    // Membuat elemen p untuk nama proyek
                    const projectLink = document.createElement("a");
                    projectLink.href = `/project/${project.idproject}`;

                    // Membuat elemen p untuk nama proyek
                    const projectName = document.createElement("p");
                    projectName.textContent = project.nama_project; // Menampilkan nama proyek dari API

                    // Menambahkan nama proyek ke dalam card
                    projectCard.appendChild(projectName);

                    // Membungkus seluruh card dengan link
                    projectLink.appendChild(projectCard);

                    // Menambahkan card ke dalam kontainer proyek
                    projectContainer.appendChild(projectLink);
                });
            } else {
                console.log("Data tidak valid atau kosong");
            }
        })
        .catch((error) => {
            console.error("Terjadi kesalahan saat mengambil data:", error);
        });
});

$("#add-project-btn").click(function () {
    $("#modal").removeClass("hidden");
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
});

// Fungsi untuk menambahkan tugas baru
function addNewProject(projectName) {
    // Kirim permintaan POST ke API untuk menambahkan proyek baru
    $.ajax({
        url: "http://127.0.0.1:8000/api/projects", // Endpoint API untuk menambahkan proyek
        type: "POST",
        data: JSON.stringify({
            nama_project: projectName,  // Nama proyek yang dimasukkan oleh pengguna
        }),
        contentType: "application/json",
        success: function (response) {
            console.log("Proyek berhasil ditambahkan:", response);

            // Tambahkan proyek baru ke dalam tampilan
            addProjectToPage(response.idproject, projectName);

            // Tutup modal setelah berhasil menambahkan proyek
            $("#modal").addClass("hidden");

            // Clear input field setelah proyek ditambahkan
            $("#projectname").val("");  // Mengosongkan input projectname
        },
        error: function (xhr, status, error) {
            console.error("Gagal menambahkan proyek:", error);
            console.log("Respons dari server:", xhr.responseText); // Tampilkan detail error
        }
    });
}

// Fungsi untuk menambahkan proyek ke dalam tampilan halaman
function addProjectToPage(projectId, projectName) {
    const projectContainer = document.getElementById("project-container");

    // Membuat elemen div untuk card proyek
    const projectCard = document.createElement("div");
    projectCard.classList.add("project-card");

    // Membuat elemen a untuk link ke proyek
    const projectLink = document.createElement("a");
    projectLink.href = `/project/${projectId}`;

    // Membuat elemen p untuk nama proyek
    const projectText = document.createElement("p");
    projectText.textContent = projectName; // Nama proyek yang baru ditambahkan

    // Menambahkan nama proyek ke dalam card
    projectCard.appendChild(projectText);

    // Membungkus seluruh card dengan link
    projectLink.appendChild(projectCard);

    // Menambahkan card ke dalam kontainer proyek
    projectContainer.appendChild(projectLink);
}

// Ketika tombol "Tambah Proyek" diklik
$("#tambah-btn").click(function () {
    // Ambil nama proyek dari input
    const projectName = $("#projectname").val().trim();

    // Cek jika nama proyek tidak kosong
    if (projectName) {
        // Panggil fungsi untuk menambahkan proyek baru
        addNewProject(projectName);
    } else {
        alert("Nama proyek tidak boleh kosong!");
    }
});