<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" rel="stylesheet">
    <link rel="icon" href="{{ asset('assets/images/procodecg-icon.png') }}" type="image/png">
    @vite('resources/css/app.css')
</head>

<body class="bg-slate-100 flex min-h-screen">

    <div class="m-auto w-[500px] bg-white p-8 flex flex-col gap-6 items-center shadow-md border-gray-100 rounded-3xl">
        <img src="{{ asset('assets/images/procodecg-logo2.png') }}" alt="ProCodeCG Logo" width="180">
        <h2 class="text-2xl text-center font-semibold">Daftar akun baru</h2>
        <form action="/api/auth/register" method="POST" id="registerForm" class="flex flex-col w-full">
            @csrf
            <div>
                <label class="font-medium" for="name">Nama lengkap</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="text" name="name" id="name" placeholder="Masukkan nama lengkap" required>
            </div>
            <div class="mt-4">
                <label class="font-medium" for="email">Email</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="email" name="email" id="email" placeholder="Masukkan email" required>
            </div>
            <div class="mt-4">
                <label class="font-medium" for="password">Password</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="password" name="password" id="password" placeholder="Masukkan password" required>
            </div>
            <div class="mt-4">
                <label class="font-medium" for="password_confirmation">Konfirmasi password</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="password" name="password_confirmation" id="password_confirmation" placeholder="Masukkan konfirmasi password" required>
            </div>
            <button class="bg-blue-600 hover:bg-blue-500 p-2 text-white text-lg w-full mt-6 rounded-md" type="submit">Daftar</button>
        </form>

        <p>Sudah mempunyai akun?<a href="/login" class="text-blue-600 p-2 hover:bg-blue-50 rounded-md">Masuk</a></p>

    </div>

    <script>
        document.getElementById("registerForm").addEventListener("submit", async function(e) {
            e.preventDefault();

            // const API_BASE_URL = "https://trelloapp.id/api";
            const API_BASE_URL = "http://127.0.0.1:8000/api";

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const password_confirmation = document.getElementById("password_confirmation").value;

            // Cek panjang password
            if (password.length < 8) {
                alert("Password harus terdiri minimal 8 karakter.");
                return;
            }

            if (password !== password_confirmation) {
                alert("Password dan konfirmasi password tidak cocok.");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        password_confirmation
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Pendaftaran berhasil!");
                    window.location.href = '/login'; // Redirect ke halaman login setelah pendaftaran berhasil
                } else {
                    alert("Pendaftaran gagal: " + (data.message || data.error));
                }
            } catch (error) {
                alert("Terjadi kesalahan: " + error.message);
            }
        });
    </script>

    <x-loading-overlay />
</body>

</html>