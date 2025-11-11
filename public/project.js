const API_BASE_URL = "https://trelloapp.id/api";
//  const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", async function () {
    const apiEndpoint = `${API_BASE_URL}/projects`;
    const userEndpoint = `${API_BASE_URL}/users`;

    // Ambil token dari localStorage
    const token = localStorage.getItem("access_token");

    if (!token) {
        console.log("Token tidak ditemukan. Pastikan Anda sudah login.");
        return;
    }

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

        const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Menambahkan token ke header
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        const projects = data.data || data;
        if (Array.isArray(projects) && projects.length > 0) {
            // Referensi ke elemen kontainer di halaman
            const projectContainer =
                document.getElementById("project-container");

            // Loop melalui data proyek yang diterima
            projects.forEach((project) => {
                // Membuat elemen div untuk card proyek
                const projectCard = document.createElement("div");
                projectCard.classList.add("project-card");

                // Membuat elemen a untuk nama proyek
                const projectLink = document.createElement("a");
                projectLink.href = `/project/${project.idproject}`;

                // Membuat elemen p untuk nama proyek
                const projectName = document.createElement("h2");
                projectName.textContent = project.nama_project;

                // Membuat elemen p untuk tanggal update
                const updatedAt = document.createElement("p");
                updatedAt.textContent = `Di update ${timeAgo(
                    new Date(project.updated_at)
                )}`;

                // Menambahkan nama proyek ke dalam card
                projectCard.appendChild(projectName);
                projectCard.appendChild(updatedAt);

                // Membungkus seluruh card dengan link
                projectLink.appendChild(projectCard);

                // Menambahkan card ke dalam kontainer proyek
                projectContainer.appendChild(projectLink);
            });
        } else {
            console.log("Data tidak valid atau kosong");

            const projectContainer =
                document.getElementById("project-container");
            const projectCard = document.createElement("div");
            projectCard.classList.add("project-none");
            const projectName = document.createElement("h2");
            projectName.textContent = "Anda belum membuat proyek";
            const projectDesc = document.createElement("p");
            projectDesc.textContent =
                "Buat proyek baru sekarang untuk mulai berkolaborasi dan menyelesaikan target Anda.";
            const addProjectButton = document.createElement("button");
            addProjectButton.innerHTML = '<i class="ph-bold ph-plus"></i> Buat Proyek';
            addProjectButton.id = "add-project-btn";
            addProjectButton.addEventListener("click", function () {
                $("#modal").removeClass("hidden");
            });
            projectCard.appendChild(projectName);
            projectCard.appendChild(projectDesc);
            projectCard.appendChild(addProjectButton);
            projectContainer.appendChild(projectCard);
        }
    } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data:", error);
    }
});

function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} tahun yang lalu`;

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} bulan yang lalu`;

    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} hari yang lalu`;

    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} jam yang lalu`;

    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} menit yang lalu`;

    return `baru saja`;
}

$("#add-project-btn").click(function () {
    $("#modal").removeClass("hidden");
});

// Menutup modal ketika tombol "Batal" diklik
$("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
});

// Fungsi untuk menambahkan tugas baru
async function addNewProject(projectName) {
    try {
        const token = localStorage.getItem("access_token"); // Ambil token dari localStorage

        // Jika token tidak ada, tampilkan error
        if (!token) {
            throw new Error("User is not authenticated");
        }

        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
            },
            body: JSON.stringify({
                nama_project: projectName, // Nama proyek yang dimasukkan oleh pengguna
            }),
        });

        if (!response.ok) {
            throw new Error("Gagal menambahkan proyek");
        }

        const data = await response.json();
        // console.log("Respons dari server:", data); // Debug respons server

        // Validasi jika ID proyek tersedia
        if (data && data.project && data.project.idproject) {
            // close modal
            $("#modal").addClass("hidden");
            window.location.href = `/project/${data.project.idproject}`; // Redirect ke halaman proyek
        } else {
            throw new Error("Data proyek tidak valid");
        }
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
