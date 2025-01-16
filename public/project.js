document.addEventListener("DOMContentLoaded", async function () {
    const apiEndpoint = "http://127.0.0.1:8000/api/projects";
    const userEndpoint = "http://127.0.0.1:8000/api/users";

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
        document.getElementById(
            "user-name"
        ).textContent = `${userData.name}`;

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

        if (Array.isArray(data) && data.length > 0) {
            // Referensi ke elemen kontainer di halaman
            const projectContainer =
                document.getElementById("project-container");

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
    try {
        const token = localStorage.getItem("access_token"); // Ambil token dari localStorage

        // Jika token tidak ada, tampilkan error
        if (!token) {
            throw new Error("User is not authenticated");
        }

        const response = await fetch("http://127.0.0.1:8000/api/projects", {
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
        console.log("Respons dari server:", data); // Debug respons server

        // Validasi jika ID proyek tersedia
        if (data && data.project && data.project.idproject) {
            console.log(
                "Redirecting to:",
                `/project/${data.project.idproject}`
            );
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
