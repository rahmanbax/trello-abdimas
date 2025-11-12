const API_BASE_URL = "https://trelloapp.id/api";
// const API_BASE_URL = "http://127.0.0.1:8000/api";

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

            // Membuat elemen h2 untuk nama proyek dengan class truncate
            const projectName = document.createElement("h2");
            projectName.classList.add("project-card-title"); // Tambahkan class ini
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

        initProjectCardTooltips();

        // Initialize tooltip untuk project card title
function initProjectCardTooltips() {
    const projectTitles = document.querySelectorAll('.project-card-title');
    
    projectTitles.forEach(titleElement => {
        titleElement.addEventListener('mouseenter', function(e) {
            const projectName = this.textContent.trim();
            
            // Hanya tampilkan tooltip jika text ter-truncate
            if (this.scrollHeight > this.clientHeight) {
                showProjectCardTooltip(e, projectName, this);
            }
        });
        
        titleElement.addEventListener('mouseleave', function() {
            hideProjectCardTooltip();
        });
    });
}

function showProjectCardTooltip(e, text, element) {
    // Remove existing tooltip
    const existingTooltip = document.getElementById('project-card-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Create new tooltip
    const tooltip = document.createElement('div');
    tooltip.id = 'project-card-tooltip';
    tooltip.className = 'bubble-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    // Calculate position after tooltip is rendered
    setTimeout(() => {
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // Center above the title
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;
        
        // Keep within viewport
        if (left < 10) left = 10;
        if (left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        
        // If not enough space above, show below
        if (top < 10) {
            top = rect.bottom + 10;
        }
        
        tooltip.style.position = 'fixed';
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.style.opacity = '1';
        tooltip.style.zIndex = '10000';
        tooltip.style.maxWidth = '300px';
        tooltip.style.whiteSpace = 'normal';
        tooltip.style.wordWrap = 'break-word';
        tooltip.style.lineHeight = '1.5';
    }, 0);
}

function hideProjectCardTooltip() {
    const tooltip = document.getElementById('project-card-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 200);
    }
}

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
