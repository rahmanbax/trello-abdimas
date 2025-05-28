<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link href="https://cdn.jsdelivr.net/npm/phosphor-icons@1.4.2/src/css/icons.min.css" rel="stylesheet">

    <link rel="icon" href="{{ asset('assets/images/procodecg-logo2.png') }}" type="image/png">
    @vite('resources/css/app.css')

</head>

<body class="bg-slate-100 flex min-h-screen">
    <div class="m-auto w-[500px] bg-white p-8 flex flex-col gap-6 items-center shadow-md border-gray-100 rounded-3xl">
        <img src="{{ asset('assets/images/procodecg-logo2.png') }}" alt="ProCodeCG Logo" width="180">
        <h2 class="text-2xl text-center font-semibold">Masuk akun</h2>
        <form action="/api/auth/login" method="POST" id="loginForm" class="flex flex-col w-full">
            @csrf
            <div>
                <label class="font-medium" for="email">Email</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="email" name="email" id="email" placeholder="Masukkan email" required>
            </div>
            <div class="mt-4">
                <label class="font-medium" for="password">Password</label>
                <input class="mt-2 block w-full px-4 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md" type="password" name="password" id="password" placeholder="Masukkan password" required>
            </div>
            <button class="bg-blue-600 hover:bg-blue-500 p-2 text-white text-lg w-full mt-6 rounded-md" type="submit">Masuk</button>
        </form>
        <p>Belum mempunyai akun?<a href="/register" class="text-blue-600 p-2 hover:bg-blue-50 rounded-md">Daftar akun</a></p>
    </div>


    <script>
        document.getElementById("loginForm").addEventListener("submit", async function(e) {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // const API_BASE_URL = "https://trelloapp.id/api";
            const API_BASE_URL = "http://127.0.0.1:8000/api";

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token or redirect the user as needed
                localStorage.setItem("access_token", data.access_token);

                // Simpan token di cookie agar dibaca backend
                document.cookie = `token=${data.access_token}; path=/`;

                // Redirect the user to the projects page
                window.location.href = '/project';
            } else {
                alert("Login failed: " + data.error);
            }
        });
    </script>

    <x-loading-overlay />
</body>

</html>