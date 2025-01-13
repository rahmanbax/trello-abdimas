document.addEventListener("DOMContentLoaded", async function () {
    const apiEndpoint = "http://127.0.0.1:8000/api/projects";

    // Ambil token dari localStorage (atau sumber lain yang sesuai)
    const token = localStorage.getItem("authToken");

    try {
        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Menambahkan token ke header
            },
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            // Referensi ke elemen kontainer di halaman
            const projectContainer = document.getElementById("project-container");

            // Loop melalui data proyek yang diterima
            data.forEach((project) => {
                // Membuat elemen div untuk card proyek
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");

                // Membuat elemen a untuk nama proyek
                const projectLink = document.createElement("a");
                projectLink.href = `/project/${project.idproject}`;

                // Membuat elemen p untuk nama proyek
                const projectName = document.createElement("p");
                projectName.textContent = project.nama_project;

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
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
    }
});

$("#add-project-btn").click(function () {
    $("#modal").removeClass("hidden");
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
});

// Fungsi untuk menambahkan tugas baru
async function addNewProject(projectName) {
    const token = localStorage.getItem("authToken"); // Ambil token dari localStorage

    try {
        const response = await fetch("http://127.0.0.1:8000/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Menambahkan token ke header
            },
            body: JSON.stringify({
                nama_project: projectName, // Nama proyek yang dimasukkan oleh pengguna
            }),
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan proyek");
        }

        const data = await response.json();
        console.log("Proyek berhasil ditambahkan:", data);

        // Reload halaman untuk memperbarui daftar proyek
        location.reload();
    } catch (error) {
        console.error("Gagal menambahkan proyek:", error);
    }
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
