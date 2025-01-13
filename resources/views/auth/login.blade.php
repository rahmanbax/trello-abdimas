<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Sign in to access your account and explore features.">
    <title>Sign In</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com" defer></script>

    <!-- Font Awesome CDN -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">

    <style>
        input:invalid {
            border-color: red;
        }

        #preloader {
            transition: opacity 0.5s ease;
        }
    </style>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col">
    <!-- Preloader -->
    <div id="preloader" class="fixed inset-0 bg-white flex justify-center items-center z-50">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col justify-center items-center min-h-screen">
        <div class="flex bg-white rounded-lg shadow-lg overflow-hidden w-11/12 md:w-3/4 lg:w-2/3">
            <!-- Logo Section -->
            <div class="hidden md:flex flex-col items-center justify-center bg-white-500 text-black w-1/2 p-8">
                <h1 class="text-4xl font-bold mb-4">Welcome Back!</h1>
                <p class="text-sm text-center">
                    Sign in to your account and explore more features.
                </p>
                <img src="{{ asset('assets/gambar.jpg') }}" alt="Welcome Image" class="mt-6 max-w-full rounded-lg">
            </div>

            <!-- Form Section -->
            <div class="w-full md:w-1/2 p-6">
                <h2 class="text-2xl font-bold text-center mb-6">Sign In</h2>
                <img src="{{ asset('assets/images/logo/logo.jpg') }}" alt="Logo"
                    class="w-36 h-auto rounded-lg mx-auto">

                <!-- Sign In Form -->
                <form id="login-form" action="{{ url('api/auth/login') }}" method="POST">
                    @csrf
                    <div class="mb-4 relative">
                        <label for="email" class="block text-gray-700">Email</label>
                        <div class="relative">
                            <input type="email" id="email" name="email" placeholder="Enter your email"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required maxlength="255" aria-label="Email Address">
                            <i
                                class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('email')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 relative">
                        <label for="password" class="block text-gray-700">Password</label>
                        <div class="relative">
                            <input type="password" id="password" name="password" placeholder="Enter your password"
                                class="w-full p-2 border border-gray-300 rounded mt-2 pl-10 focus:ring focus:ring-blue-200"
                                required minlength="8" aria-label="Password">
                            <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                        </div>
                        @error('password')
                            <span style="color: red; font-size: 0.875rem;">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mb-4 flex items-center justify-between">
                        <a href="#" class="text-blue-500 text-sm">Forgot Password?</a>
                    </div>

                    <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Sign
                        In</button>
                </form>

                <!-- Footer -->
                <div class="mt-6 text-center text-sm text-gray-500">
                    Don't have an account? <a href="{{ route('register') }}" class="text-blue-500">Sign Up</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Preloader Script
        window.addEventListener('load', () => {
            const preloader = document.getElementById('preloader');
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    </script>


</body>

</html>
