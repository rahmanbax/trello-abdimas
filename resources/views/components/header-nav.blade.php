<header class="bg-white py-4 border-b-2 border-slate-200">
    <div class="mx-20 flex justify-between items-center">
        <a href="/">
            <img src="{{ asset('assets/images/procodecg-logo.png') }}" alt="ProCodeCG Logo" width="140">
        </a>
        <div class="flex gap-4 items-center">

            <div class="relative inline-block">
                <div>
                    <button type="button"
                        class="px-4 py-2 items-center justify-center flex rounded-lg gap-2 bg-white hover:bg-slate-100 font-medium"
                        id="user-button" aria-expanded="false" aria-haspopup="true">
                        <p id="user-name"></p><i class="ph-bold ph-caret-down"></i>
                    </button>
                </div>

                <!-- Dropdown user -->
                <div id="dropdown-user"
                    class="hidden absolute right-0 z-10 mt-3 w-44 origin-top-right bg-white shadow-lg ring-1 ring-black/5 focus:outline-none rounded-md"
                    role="user" aria-orientation="vertical" aria-labelledby="user-button" tabindex="-1">
                    <div class="p-1" role="none">
                        <button 
                            class="font-medium flex gap-2 items-center text-slate-700 text-base px-4 py-2 hover:bg-slate-100 w-full rounded-md"
                            role="menuitem" tabindex="-1" id="dashboard-btn">
                            <i class="ph-bold ph-squares-four"></i>Dashboard
                        </button>
                        <button
                            class="font-medium flex gap-2 items-center text-red-500 text-base px-4 py-2 hover:bg-slate-100 w-full rounded-md"
                            role="menuitem" tabindex="-1" id="logout-btn">
                            <i class="ph-bold ph-sign-out"></i>Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<script>
    document.addEventListener("DOMContentLoaded", async function() {
        const userEndpoint = `${API_BASE_URL}/users`;
        const token = localStorage.getItem("access_token");

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

    });

    // Ambil referensi ke tombol dan dropdown menu
    const userButton = document.getElementById("user-button");
    const dropdownUser = document.getElementById("dropdown-user");

    // Fungsi untuk toggle visibility dari dropdown menu
    userButton.addEventListener("click", function() {
        const isExpanded = userButton.getAttribute("aria-expanded") === "true";

        // Toggle dropdown visibility
        dropdownUser.classList.toggle("hidden", isExpanded);

        // Update atribut aria-expanded
        userButton.setAttribute("aria-expanded", !isExpanded);
    });

    // Klik di luar dropdown menu untuk menutup menu
    document.addEventListener("click", function(event) {
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
        .addEventListener("click", async function() {
            try {
                const token = localStorage.getItem("access_token");

                if (!token) {
                    console.log("User tidak terautentikasi");
                    return;
                }

                const response = await fetch(
                    `${API_BASE_URL}/auth/logout`, {
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

                // Hapus cookie
                document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

                // Redirect ke halaman login
                window.location.href = "/login"; // Ganti dengan route login yang sesuai
            } catch (error) {
                console.error("Terjadi kesalahan saat logout:", error);
            }
        });
    document
        .getElementById("dashboard-btn")
        .addEventListener("click", function() {
            window.location.href = "/my-projects";
        });
</script>